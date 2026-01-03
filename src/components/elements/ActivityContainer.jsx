import React, { useEffect, useState } from "react";
import { Heart, MessageCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import collectionService from "@/services/collectionService";
import { useAuth } from "@/context/AuthContext";
import { encodeComicId } from "@/utils/comicUtils";

const ActivityContainer = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const { profile } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        // Since we don't have a dedicated activity endpoint, we'll derive it from
        // the user's latest updated comics
        const result = await collectionService.getUserComics();

        if (result.success) {
          // Sort by updated_at desc
          const sortedComics = result.data.sort((a, b) => {
            return new Date(b.updated_at) - new Date(a.updated_at);
          });

          // Take top 5 and map to activity format
          const derivedActivities = sortedComics
            .slice(0, 5)
            .map((userComic) => {
              return {
                id: userComic.id,
                user: profile?.username || "You",
                action: getActionText(userComic),
                comic: userComic.comics.title,
                image: userComic.comics.image_url,
                time: getTimeAgo(userComic.updated_at),
                comicId: userComic.comic_id,
                apiDetailUrl: userComic.comics.api_detail_url,
                comicvineId: userComic.comics.comicvine_id,
              };
            });

          setActivities(derivedActivities);
        }
      } catch (error) {
        console.error("Error fetching activities:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, [profile]);

  const getActionText = (userComic) => {
    const { status, progress, issues_read, total_issues } = userComic;

    // Try to be more specific if data allows
    if (status === "reading") {
      if (progress) return `Read ${progress} of`;
      if (issues_read && total_issues)
        return `Read ${issues_read}/${total_issues} issues of`;
      return "Started reading";
    }

    switch (status) {
      case "completed":
        return "Has Finished Reading";
      case "dropped":
        return "Dropped";
      case "planned":
        return "Plan to read";
      default:
        return "Updated";
    }
  };

  const getTimeAgo = (dateString) => {
    if (!dateString) return "Recently";

    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);

    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " years ago";

    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " months ago";

    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " days ago";

    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " hours ago";

    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " minutes ago";

    return "Just now";
  };

  const handleComicClick = (activity) => {
    const encodedId = encodeComicId(
      activity.apiDetailUrl ||
        `https://comicvine.gamespot.com/api/volume/4050-${activity.comicvineId}/`
    );
    navigate(`/comic/${encodedId}`);
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-white rounded-lg shadow-sm border p-4 animate-pulse flex gap-3"
          >
            <div className="w-16 h-24 bg-gray-200 rounded"></div>
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (activities.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground bg-white rounded-lg border border-dashed">
        <p>No recent activity.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {activities.map((activity) => (
        <div
          key={activity.id}
          className="bg-white rounded-lg shadow-sm border p-2 relative"
        >
          <div className="flex gap-3">
            <div
              className="w-16 h-24 flex-shrink-0 overflow-hidden rounded border border-gray-100 cursor-pointer"
              onClick={() => handleComicClick(activity)}
            >
              {activity.image ? (
                <img
                  src={activity.image}
                  alt={activity.comic}
                  className="w-full h-full object-cover transition-transform hover:scale-105"
                />
              ) : (
                <div className="w-full h-full bg-gray-100 flex items-center justify-center text-xs text-gray-400">
                  No Img
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0 pr-16">
              <div className="text-sm">
                <span className="text-chart-5 font-medium">
                  {activity.user.charAt(0).toUpperCase() + activity.user.slice(1)}
                </span>
                <span className="text-gray-600 mx-1">{activity.action}</span>
                <span
                  className="font-medium text-chart-1 truncate block sm:inline cursor-pointer hover:underline"
                  onClick={() => handleComicClick(activity)}
                >
                  {activity.comic}
                </span>
              </div>
              <div className="text-xs text-gray-400 mt-1">{activity.time}</div>
            </div>
          </div>

          {/* Action buttons - kept for UI consistency but non-functional for now */}
          <div className="absolute top-2 right-2 flex gap-1">
            <button
              className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
              title="Like"
            >
              <Heart size={14} className="text-gray-400 hover:text-red-500" />
            </button>
            <button
              className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
              title="Comment"
            >
              <MessageCircle
                size={14}
                className="text-gray-400 hover:text-blue-500"
              />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ActivityContainer;
