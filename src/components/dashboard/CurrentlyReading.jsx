import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import collectionService from "@/services/collectionService";
import { encodeComicId } from "@/utils/comicUtils";

/**
 * Currently Reading section component
 * TODO: Replace mock data with real user data
 */
const CurrentlyReading = () => {
  const [readingComics, setReadingComics] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCurrentlyReading = async () => {
      try {
        const result = await collectionService.getCurrentlyReading();
        if (result.success) {
          setReadingComics(result.data);
        }
      } catch (error) {
        console.error("Error fetching currently reading comics:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentlyReading();
  }, []);

  const handleComicClick = (comic) => {
    // Handle both structure types (direct comic object or nested in userComic)
    const comicData = comic.comics || comic;
    const apiDetailUrl = comicData.api_detail_url;
    const comicvineId = comicData.comicvine_id;

    const encodedId = encodeComicId(
      apiDetailUrl ||
        `https://comicvine.gamespot.com/api/volume/4050-${comicvineId}/`
    );
    navigate(`/comic/${encodedId}`);
  };

  if (loading) {
    return (
      <div className="bg-card rounded-xl shadow-sm border border-border p-6 h-full min-h-[200px] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-xl shadow-sm border border-border p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-card-foreground">
          Currently Reading
        </h3>
        <Button
          variant="ghost"
          size="sm"
          className="text-muted-foreground hover:text-foreground"
          onClick={() => navigate("/comics")}
        >
          View All
        </Button>
      </div>

      {readingComics.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <p>No comics currently being read.</p>
          <Button
            variant="link"
            className="mt-2"
            onClick={() => navigate("/comics")}
          >
            Go to My Comics
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-3 sm:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
          {readingComics.map((item, i) => {
            // Handle potentially different data structures
            const comic = item.comics || item;
            const progress = item.progress || "";

            return (
              <div
                key={item.id || i}
                className="group cursor-pointer"
                onClick={() => handleComicClick(item)}
              >
                <div className="aspect-[2/3] w-full mb-2 overflow-hidden rounded-md shadow-sm border border-border bg-muted">
                  {comic.image_url ? (
                    <img
                      src={comic.image_url}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      alt={comic.title}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">
                      No Image
                    </div>
                  )}
                </div>
                <p className="text-sm font-medium text-card-foreground truncate group-hover:text-primary transition-colors">
                  {comic.title}
                </p>
                {progress && (
                  <p className="text-xs text-muted-foreground">{progress}</p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CurrentlyReading;
