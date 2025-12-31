import { useEffect, useState } from "react";
import { Filter } from "lucide-react";
import AppLayout from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { useTitle } from "@/hooks/useTitle";
import collectionService from "@/services/collectionService";
import Loader from "@/components/elements/Loader";
import ComicCard from "@/components/ui/ComicCard";

const MyComics = () => {
  useTitle("My Comics");
  const [comics, setComics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  const fetchUserComics = async (status = null) => {
    setLoading(true);
    try {
      const result = await collectionService.getUserComics(status);
      if (result.success) {
        setComics(result.data);
      }
    } catch (error) {
      console.error("Error fetching user comics:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUserComics(filter === "all" ? null : filter);
  }, [filter]);

  if (loading) return <Loader />;

  return (
    <AppLayout activeRoute="comics">
      <div className="flex-1 p-4 lg:p-6 xl:p-10 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-card-foreground">
              My Comics
            </h1>
            <div className="flex items-center gap-3">
              <Filter className="w-5 h-5 text-muted-foreground" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="px-3 py-2 border border-input bg-background rounded-md text-sm"
              >
                <option value="all">All Comics</option>
                <option value="reading">Currently Reading</option>
                <option value="completed">Completed</option>
                <option value="planned">Planned</option>
                <option value="dropped">Dropped</option>
              </select>
            </div>
          </div>

          {comics.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg mb-4">
                No comics in your collection yet
              </p>
              <Button>Search for Comics</Button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
              {comics.map((userComic) => (
                <ComicCard key={userComic.id} userComic={userComic} />
              ))}
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
};

export default MyComics;
