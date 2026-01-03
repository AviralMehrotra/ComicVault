import { useState, useRef } from "react";
import { createPortal } from "react-dom";

const Tooltip = ({ children, content }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const triggerRef = useRef(null);

  const handleMouseEnter = () => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setPosition({
        top: rect.top - 8, // Offset above the element
        left: rect.left + rect.width / 2,
      });
      setIsVisible(true);
    }
  };

  return (
    <div
      className="relative inline-block w-full"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={() => setIsVisible(false)}
      ref={triggerRef}
    >
      {children}
      {isVisible &&
        createPortal(
          <div
            className="fixed px-3 py-2 bg-gray-900 text-white text-sm rounded-lg shadow-lg z-[9999] whitespace-nowrap max-w-xs pointer-events-none transform -translate-x-1/2 -translate-y-full"
            style={{ top: position.top, left: position.left }}
          >
            <div className="max-w-full overflow-hidden text-ellipsis">
              {content}
            </div>
            {/* Arrow */}
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
          </div>,
          document.body
        )}
    </div>
  );
};

export default Tooltip;
