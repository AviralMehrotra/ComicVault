import { Calendar, Hash, BookOpen, Star } from "lucide-react";
import StatCard from "@/components/ui/StatCard";
import Rating from "@/components/ui/Rating";
import { getStatusColor, formatStatus } from "@/utils/statusUtils";

/**
 * Comic header component with image, title, stats, and rating
 */
const ComicHeader = ({ comic, isInCollection, collectionStatus }) => {
  return (
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
          <p className="text-muted-foreground text-lg mb-6">{comic.publisher}</p>

          {isInCollection && (
            <div className="flex flex-wrap gap-2 mb-6">
              <span
                className="px-3 py-1 rounded-full text-sm font-medium capitalize"
                style={getStatusColor(collectionStatus)}
              >
                {formatStatus(collectionStatus)}
              </span>
            </div>
          )}

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 text-sm">
            <StatCard icon={Calendar} label="Start" value={comic.year} />
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
            <p className="font-medium mb-2 text-card-foreground">My Rating</p>
            <div className="flex items-center gap-3">
              <Rating
                initialRating={0}
                onRate={(r) => console.log("Rated:", r)}
              />
              <span className="text-sm text-muted-foreground">Click to rate</span>
            </div>
          </div>

          <div>
            <p className="font-medium mb-3 text-card-foreground">
              Average Rating:{" "}
              <span className="text-chart-4 font-bold text-lg">4.5</span>
              <span className="text-muted-foreground text-sm ml-1">
                / 5 (1,234 users)
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComicHeader;

