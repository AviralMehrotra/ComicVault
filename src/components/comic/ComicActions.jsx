import { Check, Plus, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getStatusColor } from "@/utils/statusUtils";

/**
 * Comic actions sidebar component
 * Handles adding to collection and status updates
 */
const ComicActions = ({
  isInCollection,
  collectionStatus,
  onAddToCollection,
}) => {
  return (
    <div className="bg-card rounded-xl shadow-sm border border-border p-4 xl:p-6 xl:sticky xl:top-6">
      <h3 className="font-bold text-lg mb-4 text-card-foreground">Actions</h3>
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
              <span
                className="ml-auto px-2 py-0.5 rounded text-xs font-medium capitalize"
                style={getStatusColor(collectionStatus)}
              >
                {collectionStatus}
              </span>
            </Button>
            {collectionStatus !== "reading" && (
              <Button
                className="w-full justify-start text-sm xl:text-base"
                variant="outline"
                onClick={() => onAddToCollection("reading")}
              >
                <BookOpen className="mr-2 h-4 w-4 flex-shrink-0" />
                <span className="truncate">Mark as Reading</span>
              </Button>
            )}
            {collectionStatus !== "completed" && (
              <Button
                className="w-full justify-start text-sm xl:text-base"
                variant="outline"
                onClick={() => onAddToCollection("completed")}
              >
                <Check className="mr-2 h-4 w-4 flex-shrink-0" />
                <span className="truncate">Mark as Completed</span>
              </Button>
            )}
            {collectionStatus !== "planned" && (
              <Button
                className="w-full justify-start text-sm xl:text-base"
                variant="outline"
                onClick={() => onAddToCollection("planned")}
              >
                <Plus className="mr-2 h-4 w-4 flex-shrink-0" />
                <span className="truncate">Mark as Planned</span>
              </Button>
            )}
          </>
        ) : (
          <>
            <Button
              className="w-full justify-start text-sm xl:text-base"
              variant="outline"
              onClick={() => onAddToCollection("planned")}
            >
              <Plus className="mr-2 h-4 w-4 flex-shrink-0" />
              <span className="truncate">Add to Collection</span>
            </Button>
            <Button
              className="w-full justify-start text-sm xl:text-base"
              variant="outline"
              onClick={() => onAddToCollection("completed")}
            >
              <Check className="mr-2 h-4 w-4 flex-shrink-0" />
              <span className="truncate">Mark as Read</span>
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default ComicActions;

