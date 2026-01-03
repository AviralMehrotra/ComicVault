import express from "express";
import cors from "cors";
import axios from "axios";
import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const API_KEY = process.env.COMICVINE_API_KEY;

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:3000",
      "https://comicvault-cyan.vercel.app",
    ],
    credentials: true,
  })
);
app.use(express.json());

// Test endpoint to verify Supabase connection
app.get("/api/test", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("comics")
      .select("count")
      .limit(1);
    if (error) throw error;
    res.json({ success: true, message: "Supabase connected successfully" });
  } catch (error) {
    console.error("Supabase test error:", error);
    res
      .status(500)
      .json({ error: "Supabase connection failed: " + error.message });
  }
});

app.get("/api/search", async (req, res) => {
  try {
    const { query, limit = 10 } = req.query;
    console.log("Search query:", query);

    const response = await axios.get(
      "https://comicvine.gamespot.com/api/search/",
      {
        params: {
          api_key: API_KEY,
          format: "json",
          query: encodeURIComponent(query),
          limit,
          resources: "volume",
        },
      }
    );
    res.json(response.data);
  } catch (error) {
    console.error("Search error:", error.message);
    res.status(500).json({ error: error.message });
  }
});

// Helper function to get or create comic in database
const getOrCreateComic = async (comicData) => {
  try {
    console.log("Processing comic data:", JSON.stringify(comicData, null, 2));

    const { data: existingComic } = await supabase
      .from("comics")
      .select("id")
      .eq("comicvine_id", comicData.id)
      .single();

    if (existingComic) {
      console.log("Found existing comic:", existingComic.id);
      return existingComic.id;
    }

    const comicInsertData = {
      comicvine_id: comicData.id,
      title: comicData.name || comicData.title,
      publisher: comicData.publisher?.name || comicData.publisher,
      start_year: comicData.start_year || comicData.year,
      issue_count: comicData.count_of_issues || comicData.issueCount,
      description: comicData.description || comicData.deck,
      image_url: comicData.image?.medium_url || comicData.image,
      api_detail_url: comicData.api_detail_url,
    };

    console.log(
      "Inserting new comic:",
      JSON.stringify(comicInsertData, null, 2)
    );

    const { data: newComic, error } = await supabase
      .from("comics")
      .insert(comicInsertData)
      .select("id")
      .single();

    if (error) {
      console.error("Database insert error:", error);
      throw error;
    }

    console.log("Created new comic:", newComic.id);
    return newComic.id;
  } catch (error) {
    console.error("getOrCreateComic error:", error);
    throw error;
  }
};

// Add comic to user's collection
app.post("/api/comics/add-to-collection", async (req, res) => {
  try {
    console.log("Add to collection request:", req.body);
    const { comic, status = "planned" } = req.body;
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      console.log("No authorization header");
      return res.status(401).json({ error: "No authorization header" });
    }

    const token = authHeader.replace("Bearer ", "");
    console.log("Token received:", token.substring(0, 20) + "...");

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser(token);

    if (authError || !user) {
      console.log("Auth error:", authError);
      return res.status(401).json({ error: "Invalid token" });
    }

    console.log("User authenticated:", user.id);

    const comicId = await getOrCreateComic(comic);
    console.log("Comic ID obtained:", comicId);

    // Check if comic already exists in user's collection
    const { data: existingUserComic } = await supabase
      .from("user_comics")
      .select("id, status")
      .eq("user_id", user.id)
      .eq("comic_id", comicId)
      .single();

    let result;
    if (existingUserComic) {
      // Update existing entry
      const { data, error } = await supabase
        .from("user_comics")
        .update({ status })
        .eq("id", existingUserComic.id)
        .select()
        .single();

      if (error) {
        console.error("User comics update error:", error);
        throw error;
      }
      result = data;
      console.log("Updated existing collection entry:", data);
    } else {
      // Insert new entry
      const { data, error } = await supabase
        .from("user_comics")
        .insert({
          user_id: user.id,
          comic_id: comicId,
          status,
          added_date: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) {
        console.error("User comics insert error:", error);
        throw error;
      }
      result = data;
      console.log("Created new collection entry:", data);
    }

    console.log("Successfully processed collection:", result);
    res.json({ success: true, data: result });
  } catch (error) {
    console.error("Add to collection error:", error);
    res.status(500).json({ error: error.message });
  }
});

// Check if comic is in user's collection
app.get("/api/comics/:comicvine_id/collection-status", async (req, res) => {
  try {
    const { comicvine_id } = req.params;
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ error: "No authorization header" });
    }

    const token = authHeader.replace("Bearer ", "");
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return res.status(401).json({ error: "Invalid token" });
    }

    const { data, error } = await supabase
      .from("user_comics")
      .select(
        `
        id, 
        status, 
        personal_rating,
        comics!inner(comicvine_id)
      `
      )
      .eq("user_id", user.id)
      .eq("comics.comicvine_id", comicvine_id)
      .single();

    if (error && error.code !== "PGRST116") {
      // PGRST116 = no rows returned
      throw error;
    }

    res.json({
      success: true,
      inCollection: !!data,
      status: data?.status || null,
      rating: data?.personal_rating || null,
    });
  } catch (error) {
    console.error("Check collection status error:", error);
    res.status(500).json({ error: error.message });
  }
});
app.get("/api/user/comics", async (req, res) => {
  try {
    const { status } = req.query;
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ error: "No authorization header" });
    }

    const token = authHeader.replace("Bearer ", "");
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return res.status(401).json({ error: "Invalid token" });
    }

    let query = supabase
      .from("user_comics")
      .select(
        `
        *,
        comics (
          id,
          comicvine_id,
          title,
          publisher,
          start_year,
          issue_count,
          image_url
        )
      `
      )
      .eq("user_id", user.id);

    if (status) {
      query = query.eq("status", status);
    }

    const { data, error } = await query.order("added_date", {
      ascending: false,
    });

    if (error) throw error;

    // Fetch all read issues for this user to calculate progress efficiently
    const { data: readIssues, error: issuesError } = await supabase
      .from("user_issues")
      .select("comic_id")
      .eq("user_id", user.id)
      .eq("is_read", true);

    if (issuesError) throw issuesError;

    // Create a map of comic_id -> count
    const readCounts = {};
    readIssues.forEach((issue) => {
      readCounts[issue.comic_id] = (readCounts[issue.comic_id] || 0) + 1;
    });

    // Enrich data with progress
    const enrichedData = data.map((item) => ({
      ...item,
      issues_read: readCounts[item.comics.id] || 0,
      total_issues: item.comics.issue_count || 0,
    }));

    res.json({ success: true, data: enrichedData });
  } catch (error) {
    console.error("Get user comics error:", error);
    res.status(500).json({ error: error.message });
  }
});

// Update comic status
app.put("/api/comics/:id/status", async (req, res) => {
  try {
    const { id } = req.params;
    const { status, rating } = req.body;
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ error: "No authorization header" });
    }

    const token = authHeader.replace("Bearer ", "");
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return res.status(401).json({ error: "Invalid token" });
    }

    const updateData = { status, updated_at: new Date().toISOString() };
    if (rating) updateData.personal_rating = rating;
    if (status === "reading" && !updateData.started_reading_date) {
      updateData.started_reading_date = new Date().toISOString();
    }
    if (status === "completed") {
      updateData.completed_date = new Date().toISOString();
    }

    const { data, error } = await supabase
      .from("user_comics")
      .update(updateData)
      .eq("id", id)
      .eq("user_id", user.id)
      .select()
      .single();

    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    console.error("Update comic status error:", error);
    res.status(500).json({ error: error.message });
  }
});

// Mark issue as read/unread
app.post("/api/issues/:comic_id/:issue_number/toggle", async (req, res) => {
  try {
    const { comic_id, issue_number } = req.params;
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ error: "No authorization header" });
    }

    const token = authHeader.replace("Bearer ", "");
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return res.status(401).json({ error: "Invalid token" });
    }

    // Check if issue exists
    const { data: existingIssue } = await supabase
      .from("user_issues")
      .select("*")
      .eq("user_id", user.id)
      .eq("comic_id", comic_id)
      .eq("issue_number", issue_number)
      .single();

    let result;
    if (existingIssue) {
      // Toggle existing issue
      const { data, error } = await supabase
        .from("user_issues")
        .update({
          is_read: !existingIssue.is_read,
          read_date: !existingIssue.is_read ? new Date().toISOString() : null,
        })
        .eq("id", existingIssue.id)
        .select()
        .single();

      if (error) throw error;
      result = data;
    } else {
      // Create new issue as read
      const { data, error } = await supabase
        .from("user_issues")
        .insert({
          user_id: user.id,
          comic_id: comic_id,
          issue_number: parseInt(issue_number),
          is_read: true,
          read_date: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;
      result = data;
    }

    // Update parent user_comics updated_at
    await supabase
      .from("user_comics")
      .update({ updated_at: new Date().toISOString() })
      .eq("user_id", user.id)
      .eq("comic_id", comic_id);

    res.json({ success: true, data: result });
  } catch (error) {
    console.error("Toggle issue error:", error);
    res.status(500).json({ error: error.message });
  }
});

// Get reading progress for a comic
app.get("/api/issues/:comic_id/progress", async (req, res) => {
  try {
    const { comic_id } = req.params;
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ error: "No authorization header" });
    }

    const token = authHeader.replace("Bearer ", "");
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return res.status(401).json({ error: "Invalid token" });
    }

    const { data, error } = await supabase
      .from("user_issues")
      .select("issue_number, is_read, read_date")
      .eq("user_id", user.id)
      .eq("comic_id", comic_id)
      .eq("is_read", true)
      .order("issue_number");

    if (error) throw error;

    const readIssues = data.map((issue) => issue.issue_number);
    res.json({
      success: true,
      data: { readIssues, totalRead: readIssues.length },
    });
  } catch (error) {
    console.error("Get progress error:", error);
    res.status(500).json({ error: error.message });
  }
});

// Get currently reading comics with progress
app.get("/api/user/currently-reading", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ error: "No authorization header" });
    }

    const token = authHeader.replace("Bearer ", "");
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return res.status(401).json({ error: "Invalid token" });
    }

    // Get comics with reading status
    const { data: readingComics, error } = await supabase
      .from("user_comics")
      .select(
        `
        id,
        comics (
          id,
          comicvine_id,
          title,
          publisher,
          start_year,
          issue_count,
          image_url
        )
      `
      )
      .eq("user_id", user.id)
      .eq("status", "reading")
      .order("added_date", { ascending: false });

    if (error) throw error;

    // Get progress for each comic
    const comicsWithProgress = await Promise.all(
      readingComics.map(async (userComic) => {
        const { data: progressData } = await supabase
          .from("user_issues")
          .select("issue_number")
          .eq("user_id", user.id)
          .eq("comic_id", userComic.comics.id)
          .eq("is_read", true);

        const readCount = progressData?.length || 0;
        const totalCount = userComic.comics.issue_count || 0;

        return {
          ...userComic.comics,
          readCount,
          totalCount,
          progress: totalCount > 0 ? `${readCount}/${totalCount}` : "0/0",
        };
      })
    );

    res.json({ success: true, data: comicsWithProgress });
  } catch (error) {
    console.error("Get currently reading error:", error);
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/comic-details", async (req, res) => {
  try {
    const { url } = req.query;
    const response = await axios.get(url, {
      params: {
        api_key: API_KEY,
        format: "json",
      },
    });
    res.json(response.data);
  } catch (error) {
    console.error("Comic details error:", error.message);
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Backend proxy running on http://localhost:${PORT}`);
});
