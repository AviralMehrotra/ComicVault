import axios from "axios";

const BASE_URL = "http://localhost:3001/api";
// The base endpoint for comicbooks-api (from npm docs)
const cleanDescription = (desc) => {
  if (!desc) return "No description available";

  // Remove HTML tags and trim whitespace
  const cleaned = desc.replace(/<[^>]+>/g, "").trim();

  // If it's only a dot, dash, or empty string, treat as missing
  if (!cleaned || [".", "..", "...", "-", "N/A"].includes(cleaned)) {
    return "No description available";
  }

  // If it’s too long, shorten it to around 250 chars but keep full sentences
  if (cleaned.length > 250) {
    const cutoff = cleaned.indexOf(".", 200); // stop at nearest sentence after 200 chars
    return cutoff !== -1
      ? cleaned.slice(0, cutoff + 1)
      : cleaned.slice(0, 250) + "...";
  }

  return cleaned;
};

const comicService = {
  searchComics: async (query, limit = 10) => {
    if (!query) {
      return { success: false, error: "Query is empty" };
    }

    try {
      // Example endpoint: /search?q=batman&limit=10
      const response = await axios.get(`${BASE_URL}/search`, {
        params: { query, limit },
      });

      // Data normalization
      const comics =
        response.data?.results?.map((comic) => ({
          id: comic.id,
          apiDetailUrl: comic.api_detail_url,
          title: comic.name || "Untitled",
          description: cleanDescription(comic.deck || comic.description),
          image: comic.image?.medium_url || null,
          publisher: comic.publisher?.name || null,
          year: comic.start_year || null,
          issueCount: comic.count_of_issues || null,
        })) || [];

      return { success: true, data: comics };
    } catch (error) {
      console.error("Comic search error:", error);
      return { success: false, error: error.message };
    }
  },

  getCharacterDetails: async (apiDetailUrl) => {
    try {
      const response = await axios.get(`${BASE_URL}/comic-details`, {
        params: { url: apiDetailUrl },
      });
      const character = response.data?.results;
      return {
        success: true,
        data: {
          id: character.id,
          name: character.name,
          image: character.image?.thumb_url || character.image?.small_url || null,
          real_name: character.real_name,
          description: cleanDescription(character.description || character.deck),
        },
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  getCreatorDetails: async (apiDetailUrl) => {
    try {
      const response = await axios.get(`${BASE_URL}/comic-details`, {
        params: { url: apiDetailUrl },
      });
      const creator = response.data?.results;
      return {
        success: true,
        data: {
          id: creator.id,
          name: creator.name,
          image: creator.image?.thumb_url || creator.image?.small_url || null,
          description: cleanDescription(creator.description || creator.deck),
        },
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  getLocationDetails: async (apiDetailUrl) => {
    try {
      const response = await axios.get(`${BASE_URL}/comic-details`, {
        params: { url: apiDetailUrl },
      });
      const location = response.data?.results;
      return {
        success: true,
        data: {
          id: location.id,
          name: location.name,
          image: location.image?.thumb_url || location.image?.small_url || null,
          description: cleanDescription(location.description || location.deck),
        },
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  getComicDetails: async (apiDetailUrl) => {
    try {
      const response = await axios.get(`${BASE_URL}/comic-details`, {
        params: { url: apiDetailUrl },
      });
      const comic = response.data?.results;

      // Fetch detailed character data (first 8 for performance)
      const characterPromises = comic.characters?.slice(0, 8).map(async (char) => {
        const details = await comicService.getCharacterDetails(char.api_detail_url);
        return details.success ? {
          ...char,
          image: details.data.image,
          real_name: details.data.real_name,
        } : char;
      }) || [];

      // Fetch detailed creator data (first 8 for performance)
      const creatorPromises = comic.people?.slice(0, 8).map(async (person) => {
        const details = await comicService.getCreatorDetails(person.api_detail_url);
        return details.success ? {
          ...person,
          image: details.data.image,
          role: 'Creator',
        } : person;
      }) || [];

      // Fetch detailed location data (first 6 for performance)
      const locationPromises = comic.locations?.slice(0, 6).map(async (loc) => {
        const details = await comicService.getLocationDetails(loc.api_detail_url);
        return details.success ? {
          ...loc,
          image: details.data.image,
        } : loc;
      }) || [];

      // Wait for all detail fetches to complete
      const [detailedCharacters, detailedCreators, detailedLocations] = await Promise.all([
        Promise.all(characterPromises),
        Promise.all(creatorPromises),
        Promise.all(locationPromises),
      ]);

      return {
        success: true,
        data: {
          id: comic.id,
          title: comic.name,
          description: cleanDescription(comic.description),
          image: comic.image?.super_url || comic.image?.original_url || null,
          publisher: comic.publisher?.name || null,
          year: comic.start_year,
          issueCount: comic.count_of_issues,
          deck: cleanDescription(comic.deck),
          firstIssue: comic.first_issue,
          lastIssue: comic.last_issue,
          aliases: comic.aliases,
          // Enhanced data with images
          characters: detailedCharacters,
          creators: detailedCreators,
          teams: [], // Not available in this structure
          locations: detailedLocations,
          objects:
            comic.objects?.map((o) => ({
              id: o.id,
              name: o.name,
              count: o.count,
            })) || [],
        },
      };
    } catch (error) {
      console.error("Comic details error:", error);
      return { success: false, error: error.message };
    }
  },
};

export default comicService;
