import { Users } from "lucide-react";
import Tooltip from "@/components/ui/Tooltip";

const CharacterCard = ({ character }) => (
  <div className="bg-card border border-border rounded-lg p-3 hover:shadow-md transition-shadow">
    <div className="flex items-center gap-3">
      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center border-2 border-border overflow-hidden">
        {character.image ? (
          <img
            src={character.image}
            alt={character.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <Users className="w-6 h-6 text-primary/60" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <Tooltip content={character.name}>
          <h4 className="font-medium text-sm text-card-foreground truncate cursor-help">
            {character.name}
          </h4>
        </Tooltip>
        {character.real_name ? (
          <Tooltip content={character.real_name}>
            <p className="text-xs text-muted-foreground truncate cursor-help">
              {character.real_name}
            </p>
          </Tooltip>
        ) : character.count ? (
          <p className="text-xs text-muted-foreground">
            {character.count} appearances
          </p>
        ) : null}
      </div>
    </div>
  </div>
);

export default CharacterCard;