import { X } from "lucide-react";
import { Button } from "./button";
import CharacterCard from "./CharacterCard";
import CreatorCard from "./CreatorCard";

const ViewAllModal = ({ isOpen, onClose, title, items, type }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-xl shadow-lg border border-border max-w-4xl w-full max-h-[80vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-bold text-card-foreground">{title}</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="p-6 overflow-y-auto max-h-[calc(80vh-120px)]">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {items.map((item) => (
              type === 'characters' ? (
                <CharacterCard key={item.id} character={item} />
              ) : (
                <CreatorCard key={item.id} creator={item} />
              )
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewAllModal;