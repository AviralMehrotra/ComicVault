import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, BookOpen, Users, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import comicService from "@/services/comicService";
import { useTitle } from "@/hooks/useTitle";
import { decodeComicId } from "@/utils/comicUtils";
import AppLayout from "@/components/layout/AppLayout";
import Loader, { WithFadeIn } from "@/components/elements/Loader";
import CharacterCard from "@/components/ui/CharacterCard";
import CreatorCard from "@/components/ui/CreatorCard";
import SectionHeader from "@/components/ui/SectionHeader";
import ViewAllModal from "@/components/ui/ViewAllModal";
import IssuesGrid from "@/components/ui/IssuesGrid";
import collectionService from "@/services/collectionService";
import EmptyState from "@/components/ui/EmptyState";
import ComicHeader from "@/components/comic/ComicHeader";
import ComicActions from "@/components/comic/ComicActions";

const ComicDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [comic, setComic] = useState(null);
  const [loading, setLoading] = useState(true);
  const [viewAllModal, setViewAllModal] = useState({
    isOpen: false,
    type: "",
    items: [],
    title: "",
  });
  const [readIssues, setReadIssues] = useState([]);
  const [isInCollection, setIsInCollection] = useState(false);
  const [collectionStatus, setCollectionStatus] = useState(null);
  const [databaseComicId, setDatabaseComicId] = useState(null); // Database comic_id from comics table
  const [userComicId, setUserComicId] = useState(null); // user_comics.id for status updates

  useTitle(comic?.title || "Comic Details");

  const openViewAllModal = (type, items, title) => {
    setViewAllModal({ isOpen: true, type, items, title });
  };

  const closeViewAllModal = () => {
    setViewAllModal({ isOpen: false, type: "", items: [], title: "" });
  };

  const fetchReadingProgress = async () => {
    if (databaseComicId) {
      try {
        const result = await collectionService.getReadingProgress(
          databaseComicId
        );
        if (result.success) {
          setReadIssues(result.data.readIssues || []);
        }
      } catch (error) {
        console.error("Error fetching reading progress:", error);
      }
    }
  };

  const handleIssueClick = async (comicId, issueNumber) => {
    try {
      const result = await collectionService.toggleIssueRead(
        comicId,
        issueNumber
      );
      if (result.success) {
        // Refresh reading progress after toggling
        await fetchReadingProgress();
      } else {
        console.error("Error toggling issue:", result.error);
      }
    } catch (error) {
      console.error("Error toggling issue:", error);
    }
  };

  const handleAddToCollection = async (status = "planned") => {
    try {
      console.log("Comic data being sent:", comic);
      let result;
      let newDatabaseComicId = databaseComicId;
      let newUserComicId = userComicId;

      if (isInCollection) {
        // Update existing status - use user_comics.id
        result = await collectionService.updateComicStatus(userComicId, status);
        if (result.success && result.data) {
          newUserComicId = result.data.id;
          // Ensure we have the comic_id
          if (result.data.comic_id) {
            newDatabaseComicId = result.data.comic_id;
          } else {
            // Preserve existing databaseComicId if not in response
            newDatabaseComicId = databaseComicId || newDatabaseComicId;
          }
        }
      } else {
        // Add to collection
        result = await collectionService.addToCollection(comic, status);
        if (result.success && result.data) {
          // Store the database comic_id and user_comics.id from response
          newDatabaseComicId = result.data.comic_id;
          newUserComicId = result.data.id;
        }
      }

      if (result.success) {
        setIsInCollection(true);
        setCollectionStatus(status);
        setDatabaseComicId(newDatabaseComicId);
        setUserComicId(newUserComicId);

        // If marking as completed, mark all issues as read
        if (status === "completed" && comic.issueCount && newDatabaseComicId) {
          // Mark all issues as read
          for (let i = 1; i <= comic.issueCount; i++) {
            await collectionService.toggleIssueRead(newDatabaseComicId, i);
          }
          // Refresh reading progress
          await fetchReadingProgress();
        }
      } else {
        console.error("Collection service error:", result.error);
      }
    } catch (error) {
      console.error("Error adding to collection:", error);
    }
  };

  const checkCollectionStatus = async (comicvineId) => {
    try {
      const result = await collectionService.checkCollectionStatus(comicvineId);
      if (result.success) {
        setIsInCollection(result.data.inCollection);
        setCollectionStatus(result.data.status);

        // If in collection, we need to get the database comic_id
        if (result.data.inCollection) {
          // Fetch user comics to get the comic_id
          const userComicsResult = await collectionService.getUserComics();
          if (userComicsResult.success) {
            const userComic = userComicsResult.data.find(
              (uc) => uc.comics?.comicvine_id === parseInt(comicvineId)
            );
            if (userComic) {
              const dbComicId = userComic.comics.id;
              const ucId = userComic.id;
              setDatabaseComicId(dbComicId);
              setUserComicId(ucId);
              // Fetch reading progress now that we have the comic_id
              const progressResult = await collectionService.getReadingProgress(
                dbComicId
              );
              if (progressResult.success) {
                setReadIssues(progressResult.data.readIssues || []);
              }
            }
          }
        }
      }
    } catch (error) {
      console.error("Error checking collection status:", error);
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
          // Check if comic is in collection (this will also fetch comic_id if in collection)
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
      <AppLayout>
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
                <ComicHeader
                  comic={comic}
                  isInCollection={isInCollection}
                  collectionStatus={collectionStatus}
                />

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
                  onIssueClick={handleIssueClick}
                  comicId={databaseComicId}
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
                <ComicActions
                  isInCollection={isInCollection}
                  collectionStatus={collectionStatus}
                  onAddToCollection={handleAddToCollection}
                />
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
      </AppLayout>
    </WithFadeIn>
  );
};

export default ComicDetails;
