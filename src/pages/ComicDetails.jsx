import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  LifeBuoy,
  Settings,
  Star,
  Plus,
  Check,
  BookOpen,
  Users,
  MapPin,
  Calendar,
  Hash,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import comicService from "@/services/comicService";
import { useTitle } from "@/hooks/useTitle";
import { decodeComicId } from "@/utils/comicUtils";
import Sidebar, { SidebarItem } from "@/components/layout/Sidebar";
import { FiSearch } from "react-icons/fi";
import { RxDashboard } from "react-icons/rx";
import { MdOutlineForum } from "react-icons/md";
import SearchOverlay from "@/components/layout/SearchOverlay";
import { BiBookmarkAlt } from "react-icons/bi";
import Rating from "@/components/ui/Rating";
import Loader, { WithFadeIn } from "@/components/elements/Loader";
import CharacterCard from "@/components/ui/CharacterCard";
import CreatorCard from "@/components/ui/CreatorCard";
import StatCard from "@/components/ui/StatCard";
import SectionHeader from "@/components/ui/SectionHeader";
import ViewAllModal from "@/components/ui/ViewAllModal";
import IssuesGrid from "@/components/ui/IssuesGrid";
import collectionService from "@/services/collectionService";
import EmptyState from "@/components/ui/EmptyState";

const ComicDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [comic, setComic] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchOpen, setSearchOpen] = useState(false);
  const [viewAllModal, setViewAllModal] = useState({
    isOpen: false,
    type: "",
    items: [],
    title: "",
  });
  const [readIssues, setReadIssues] = useState([]);
  const [isInCollection, setIsInCollection] = useState(false);
  const [collectionStatus, setCollectionStatus] = useState(null);

  useTitle(comic?.title || "Comic Details");

  const handleSearch = async (query) => {
    const result = await comicService.searchComics(query, 10);
    return result;
  };

  const openViewAllModal = (type, items, title) => {
    setViewAllModal({ isOpen: true, type, items, title });
  };

  const closeViewAllModal = () => {
    setViewAllModal({ isOpen: false, type: "", items: [], title: "" });
  };

  const handleAddToCollection = async (status = "planned") => {
    try {
      console.log('Comic data being sent:', comic);
      const result = await collectionService.addToCollection(comic, status);
      if (result.success) {
        setIsInCollection(true);
        setCollectionStatus(status);
      } else {
        console.error('Collection service error:', result.error);
      }
    } catch (error) {
      console.error("Error adding to collection:", error);
    }
  };

  const checkCollectionStatus = async (comicId) => {
    try {
      const result = await collectionService.checkCollectionStatus(comicId);
      if (result.success) {
        setIsInCollection(result.data.inCollection);
        setCollectionStatus(result.data.status);
      }
    } catch (error) {
      console.error('Error checking collection status:', error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'reading': return 'bg-status-reading text-white';
      case 'completed': return 'bg-status-completed text-white';
      case 'planned': return 'bg-status-planned text-white';
      case 'dropped': return 'bg-status-dropped text-white';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  useEffect(() => {
    const fetchComic = async () => {
      try {
        const apiUrl = decodeComicId(id);
        if (!apiUrl) {
          setLoading(false);
          return;
        }

        const result = await comicService.getComicDetails(apiUrl);
        if (result.success) {
          setComic(result.data);
          // Check if comic is in collection
          await checkCollectionStatus(result.data.id);
        }
      } catch (error) {
        console.error("Error decoding comic ID:", error);
      }
      setLoading(false);
    };

    fetchComic();
  }, [id]);

  if (loading) return <Loader />;
  if (!comic) return <div className="p-8">Comic not found</div>;

  return (
    <WithFadeIn isLoading={loading}>
      <div className="flex min-h-screen bg-background">
        <Sidebar>
          <SidebarItem
            icon={<FiSearch size={20} />}
            text="Search"
            onClick={() => setSearchOpen(true)}
          />
          <hr className="my-3 border-sidebar-border" />
          <SidebarItem
            icon={<RxDashboard size={20} />}
            text="Dashboard"
            onClick={() => navigate("/")}
          />
          <SidebarItem
            icon={<BiBookmarkAlt size={20} className="py-0" />}
            text="Comics"
            onClick={() => navigate("/comics")}
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
            <Button
              variant="ghost"
              onClick={() => navigate(-1)}
              className="mb-6 hover:bg-muted"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 xl:gap-8">
              {/* Main Content */}
              <div className="xl:col-span-8 space-y-6">
                <div className="bg-card rounded-xl shadow-sm border border-border p-6 lg:p-8">
                  <div className="flex flex-col md:flex-row gap-8">
                    {comic.image && (
                      <div className="flex-shrink-0 mx-auto md:mx-0">
                        <img
                          src={comic.image}
                          alt={comic.title}
                          className="w-56 h-auto rounded-lg shadow-lg border border-border/50"
                        />
                      </div>
                    )}

                    <div className="flex-1">
                      <h1 className="text-3xl md:text-4xl font-bold mb-2 text-card-foreground">
                        {comic.title}
                      </h1>
                      <p className="text-muted-foreground text-lg mb-6">
                        {comic.publisher}
                      </p>

                      <div className="flex flex-wrap gap-2 mb-6">
                        <span className="bg-status-completed/20 text-status-completed px-3 py-1 rounded-full text-sm font-medium border border-status-completed/30">
                          READ
                        </span>
                        <span className="bg-status-reading/20 text-status-reading px-3 py-1 rounded-full text-sm font-medium border border-status-reading/30">
                          CURRENTLY READING
                        </span>
                        <span className="bg-muted text-muted-foreground px-2 py-1 rounded-full text-sm flex items-center">
                          <Check className="w-3 h-3 mr-1" /> Verified
                        </span>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 text-sm">
                        <StatCard
                          icon={Calendar}
                          label="Start"
                          value={comic.year}
                        />
                        <StatCard
                          icon={Hash}
                          label="Issues"
                          value={comic.issueCount || "N/A"}
                        />
                        <StatCard
                          icon={BookOpen}
                          label="Status"
                          value={comic.status || "Ongoing"}
                        />
                        <StatCard icon={Star} label="Rating" value="4.5/5" />
                      </div>

                      <div className="mb-6">
                        <p className="font-medium mb-2 text-card-foreground">
                          My Rating
                        </p>
                        <div className="flex items-center gap-3">
                          <Rating
                            initialRating={0}
                            onRate={(r) => console.log("Rated:", r)}
                          />
                          <span className="text-sm text-muted-foreground">
                            Click to rate
                          </span>
                        </div>
                      </div>

                      <div className="">
                        <p className="font-medium mb-3 text-card-foreground">
                          Average Rating:{" "}
                          <span className="text-chart-4 font-bold text-lg">
                            4.5
                          </span>
                          <span className="text-muted-foreground text-sm ml-1">
                            / 5 (1,234 users)
                          </span>
                        </p>
                        {/* Issue progress bar or similar visualization could go here */}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Details & Tags Section */}
                <div className="bg-card rounded-xl shadow-sm border border-border p-6 lg:p-8">
                  <h3 className="font-bold text-xl mb-6 text-card-foreground">
                    Details & Tags
                  </h3>
                  <div className="space-y-8">
                    <div>
                      <h4 className="font-semibold mb-3 text-card-foreground flex items-center gap-2">
                        <BookOpen className="w-4 h-4 text-primary" />{" "}
                        Description
                      </h4>
                      <p className="text-muted-foreground leading-relaxed">
                        {comic.description ||
                          comic.deck ||
                          "No description available."}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      {/* Characters */}
                      <div>
                        <SectionHeader
                          icon={Users}
                          title="Characters"
                          count={comic.characters?.length || 0}
                        />
                        {comic.characters && comic.characters.length > 0 ? (
                          <>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              {comic.characters.slice(0, 6).map((character) => (
                                <CharacterCard
                                  key={character.id}
                                  character={character}
                                />
                              ))}
                            </div>
                            {comic.characters?.length > 6 && (
                              <Button
                                variant="outline"
                                size="sm"
                                className="mt-3 w-full"
                                onClick={() =>
                                  openViewAllModal(
                                    "characters",
                                    comic.characters,
                                    `All Characters (${comic.characters.length})`
                                  )
                                }
                              >
                                View All {comic.characters.length} Characters
                              </Button>
                            )}
                          </>
                        ) : (
                          <EmptyState
                            icon={Users}
                            message="No characters listed"
                          />
                        )}
                      </div>

                      {/* Creators */}
                      <div>
                        <SectionHeader
                          icon={BookOpen}
                          title="Creators"
                          count={comic.creators?.length || 0}
                        />
                        {comic.creators && comic.creators.length > 0 ? (
                          <>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              {comic.creators.slice(0, 6).map((creator) => (
                                <CreatorCard
                                  key={creator.id}
                                  creator={creator}
                                />
                              ))}
                            </div>
                            {comic.creators?.length > 6 && (
                              <Button
                                variant="outline"
                                size="sm"
                                className="mt-3 w-full"
                                onClick={() =>
                                  openViewAllModal(
                                    "creators",
                                    comic.creators,
                                    `All Creators (${comic.creators.length})`
                                  )
                                }
                              >
                                View All {comic.creators.length} Creators
                              </Button>
                            )}
                          </>
                        ) : (
                          <EmptyState
                            icon={BookOpen}
                            message="No creators listed"
                          />
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-1 gap-8 border-t border-border pt-6">
                      {/* Locations */}
                      <div>
                        <SectionHeader
                          icon={MapPin}
                          title="Locations"
                          count={comic.locations?.length || 0}
                        />
                        {comic.locations && comic.locations.length > 0 ? (
                          <>
                            <div className="flex flex-wrap gap-2">
                              {comic.locations.slice(0, 8).map((loc) => (
                                <span
                                  key={loc.id}
                                  className="px-3 py-2 bg-muted text-muted-foreground rounded-lg text-sm font-medium border border-border hover:bg-muted/80 transition-colors"
                                >
                                  {loc.name}
                                </span>
                              ))}
                            </div>
                            {comic.locations?.length > 8 && (
                              <Button
                                variant="outline"
                                size="sm"
                                className="mt-3 w-full"
                              >
                                View All {comic.locations.length} Locations
                              </Button>
                            )}
                          </>
                        ) : (
                          <EmptyState
                            icon={MapPin}
                            message="No locations listed"
                          />
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Issues Grid */}
                <IssuesGrid
                  totalIssues={comic.issueCount || 130}
                  readIssues={readIssues}
                />

                {/* Community Reviews - Placeholder for now as we don't have backend for this yet */}
                <div className="bg-card rounded-xl shadow-sm border border-border p-6 lg:p-8">
                  <h3 className="font-bold text-xl mb-6 text-card-foreground">
                    Community Reviews
                  </h3>
                  <div className="text-center py-8 text-muted-foreground">
                    <p>Reviews coming soon!</p>
                  </div>
                </div>
              </div>

              {/* Actions Sidebar */}
              <div className="xl:col-span-4">
                <div className="bg-card rounded-xl shadow-sm border border-border p-4 xl:p-6 xl:sticky xl:top-6">
                  <h3 className="font-bold text-lg mb-4 text-card-foreground">
                    Actions
                  </h3>
                  <div className="space-y-3">
                    {isInCollection ? (
                      <>
                        <Button
                          className="w-full justify-start text-sm xl:text-base bg-muted/80 hover:bg-muted border-border"
                          variant="outline"
                          disabled
                        >
                          <Check className="mr-2 h-4 w-4 flex-shrink-0" />
                          <span className="truncate">In Collection</span>
                          <span className={`ml-auto px-2 py-0.5 rounded text-xs font-medium capitalize ${getStatusColor(collectionStatus)}`}>
                            {collectionStatus}
                          </span>
                        </Button>
                        <Button
                          className="w-full justify-start text-sm xl:text-base"
                          variant="outline"
                          onClick={() => handleAddToCollection("reading")}
                        >
                          <BookOpen className="mr-2 h-4 w-4 flex-shrink-0" />
                          <span className="truncate">Mark as Reading</span>
                        </Button>
                        <Button
                          className="w-full justify-start text-sm xl:text-base"
                          variant="outline"
                          onClick={() => handleAddToCollection("completed")}
                        >
                          <Check className="mr-2 h-4 w-4 flex-shrink-0" />
                          <span className="truncate">Mark as Completed</span>
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button
                          className="w-full justify-start text-sm xl:text-base"
                          variant="outline"
                          onClick={() => handleAddToCollection("planned")}
                        >
                          <Plus className="mr-2 h-4 w-4 flex-shrink-0" />
                          <span className="truncate">Add to Collection</span>
                        </Button>
                        <Button
                          className="w-full justify-start text-sm xl:text-base"
                          variant="outline"
                          onClick={() => handleAddToCollection("completed")}
                        >
                          <Check className="mr-2 h-4 w-4 flex-shrink-0" />
                          <span className="truncate">Mark as Read</span>
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <ViewAllModal
          isOpen={viewAllModal.isOpen}
          onClose={closeViewAllModal}
          title={viewAllModal.title}
          items={viewAllModal.items}
          type={viewAllModal.type}
        />
      </div>
    </WithFadeIn>
  );
};

export default ComicDetails;
