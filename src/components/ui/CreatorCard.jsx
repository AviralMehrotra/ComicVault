import { BookOpen } from "lucide-react";
import Tooltip from "@/components/ui/Tooltip";

const CreatorCard = ({ creator }) => (
  <div className="bg-card border border-border rounded-lg p-3 hover:shadow-md transition-shadow">
    <div className="flex items-center gap-3">
      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center border-2 border-border overflow-hidden">
        {creator.image ? (
          <img
            src={creator.image}
            alt={creator.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <BookOpen className="w-6 h-6 text-primary/60" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <Tooltip content={creator.name}>
          <h4 className="font-medium text-sm text-card-foreground truncate cursor-help">
            {creator.name}
          </h4>
        </Tooltip>
        <p className="text-xs text-muted-foreground">
          {creator.count ? `${creator.count} issues` : creator.role || 'Creator'}
        </p>
      </div>
    </div>
  </div>
);

export default CreatorCard;