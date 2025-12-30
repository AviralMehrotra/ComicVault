import { useEffect, useState } from "react";
import { LifeBuoy, Settings, Filter } from "lucide-react";
import Sidebar, { SidebarItem } from "@/components/layout/Sidebar";
import { Button } from "@/components/ui/button";
import { RxDashboard } from "react-icons/rx";
import { FiSearch } from "react-icons/fi";
import { BiBookmarkAlt } from "react-icons/bi";
import { MdOutlineForum } from "react-icons/md";
import { useTitle } from "@/hooks/useTitle";
import SearchOverlay from "@/components/layout/SearchOverlay";
import comicService from "@/services/comicService";
import collectionService from "@/services/collectionService";
import Loader from "@/components/elements/Loader";
import { useNavigate } from "react-router-dom";
import { encodeComicId } from "@/utils/comicUtils";

const MyComics = () => {
  useTitle("My Comics");
  const navigate = useNavigate();
  const [searchOpen, setSearchOpen] = useState(false);
  const [comics, setComics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  const handleSearch = async (query) => {
    const result = await comicService.searchComics(query, 10);
    return result;
  };

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

  const getStatusColor = (status) => {
    switch (status) {
      case 'reading': return 'bg-status-reading text-white';
      case 'completed': return 'bg-status-completed text-white';
      case 'planned': return 'bg-status-planned text-white';
      case 'dropped': return 'bg-status-dropped text-white';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const handleComicClick = (comic) => {
    const encodedId = encodeComicId(comic.comics.api_detail_url || `https://comicvine.gamespot.com/api/volume/4050-${comic.comics.comicvine_id}/`);
    navigate(`/comic/${encodedId}`);
  };

  if (loading) return <Loader />;

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar>
        <SidebarItem
          icon={<FiSearch size={20} />}
          text="Search"
          onClick={() => setSearchOpen(true)}
        />
        <hr className="my-3 border-sidebar-border" />
        <SidebarItem icon={<RxDashboard size={20} />} text="Dashboard" />
        <SidebarItem
          icon={<BiBookmarkAlt size={20} className="py-0" />}
          text="Comics"
          active
        />
        <SidebarItem icon={<MdOutlineForum size={20} />} text="Forum" />
        <hr className="my-3 border-sidebar-border" />
        <SidebarItem icon={<Settings size={20} />} text="Settings" />
        <SidebarItem icon={<LifeBuoy size={20} />} text="Help" />
      </Sidebar>

      <SearchOverlay
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
        onSearch={handleSearch}
      />

      <div className="flex-1 p-4 lg:p-6 xl:p-10 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-card-foreground">My Comics</h1>
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
              <Button onClick={() => setSearchOpen(true)}>
                Search for Comics
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
              {comics.map((userComic) => (
                <div
                  key={userComic.id}
                  className="group cursor-pointer"
                  onClick={() => handleComicClick(userComic)}
                >
                  <div className="aspect-[2/3] w-full mb-3 overflow-hidden rounded-lg shadow-sm border border-border relative">
                    {userComic.comics.image_url ? (
                      <img
                        src={userComic.comics.image_url}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        alt={userComic.comics.title}
                      />
                    ) : (
                      <div className="w-full h-full bg-muted flex items-center justify-center">
                        <span className="text-muted-foreground text-sm">No Image</span>
                      </div>
                    )}
                    <div className="absolute top-2 right-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(userComic.status)}`}>
                        {userComic.status}
                      </span>
                    </div>
                  </div>
                  <h3 className="font-medium text-card-foreground truncate group-hover:text-primary transition-colors">
                    {userComic.comics.title}
                  </h3>
                  <p className="text-sm text-muted-foreground truncate">
                    {userComic.comics.publisher} • {userComic.comics.start_year}
                  </p>
                  {userComic.personal_rating && (
                    <div className="flex items-center mt-1">
                      <span className="text-chart-4 text-sm">★ {userComic.personal_rating}/5</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyComics;