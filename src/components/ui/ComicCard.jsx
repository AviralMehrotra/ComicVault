import { getStatusColor } from "@/utils/statusUtils";
import { encodeComicId } from "@/utils/comicUtils";
import { useNavigate } from "react-router-dom";

/**
 * Reusable comic card component
 * Used in MyComics page and can be used elsewhere
 */
const ComicCard = ({ userComic }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    const encodedId = encodeComicId(
      userComic.comics.api_detail_url ||
        `https://comicvine.gamespot.com/api/volume/4050-${userComic.comics.comicvine_id}/`
    );
    navigate(`/comic/${encodedId}`);
  };

  return (
    <div className="group cursor-pointer" onClick={handleClick}>
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
          <span
            className="px-2 py-1 rounded-full text-xs font-medium"
            style={getStatusColor(userComic.status)}
          >
            {userComic.status}
          </span>
        </div>
      </div>
      <h3 className="font-medium text-card-foreground truncate group-hover:text-primary transition-colors">
        {userComic.comics.title}
      </h3>
      <p className="text-sm text-muted-foreground truncate">
        {userComic.comics.publisher || "NA"} •{" "}
        {userComic.comics.start_year || "NA"}
      </p>
      {userComic.personal_rating && (
        <div className="flex items-center mt-1">
          <span className="text-chart-4 text-sm">
            ★ {userComic.personal_rating}/5
          </span>
        </div>
      )}
    </div>
  );
};

export default ComicCard;

