import React from "react";
import { Heart, MessageCircle } from "lucide-react";

const ActivityContainer = () => {
  const activities = [
    {
      id: 1,
      user: "ErR0rC0dE141",
      action: "Read pages 20-40 of",
      comic: "The Infinity Gauntlet #1",
      image:
        "https://comicvine.gamespot.com/a/uploads/scale_medium/0/4/13959-2727-15632-1-batman-family.jpg",
      time: "4 hours ago",
    },
    {
      id: 2,
      user: "ErR0rC0dE141",
      action: "Read pages 02-13 of",
      comic: "Batman #665",
      image:
        "https://comicvine.gamespot.com/a/uploads/scale_medium/3/38919/936717-batman_album_32.jpg",
      time: "1 day ago",
    },
    {
      id: 3,
      user: "ErR0rC0dE141",
      action: "Has Finished Reading",
      comic: "The Amazing Spider-Man #5",
      image:
        "https://comicvine.gamespot.com/a/uploads/scale_medium/11112/111120209/4157021-untold%20legend%20of%20batman%20%231.jpg",
      time: "2 days ago",
    },
    {
      id: 4,
      user: "ErR0rC0dE141",
      action: "Read pages 46-80 of",
      comic: "Iron Man #310",
      image:
        "https://comicvine.gamespot.com/a/uploads/scale_medium/1/19859/846090-88302_20071006024323_large.jpg",
      time: "4 days ago",
    },
    {
      id: 5,
      user: "ErR0rC0dE141",
      action: "Read pages 46-80 of",
      comic: "Iron Man #310",
      image:
        "https://comicvine.gamespot.com/a/uploads/scale_medium/1/19859/846090-88302_20071006024323_large.jpg",
      time: "4 days ago",
    },
    {
      id: 6,
      user: "ErR0rC0dE141",
      action: "Read pages 46-80 of",
      comic: "Iron Man #310",
      image:
        "https://comicvine.gamespot.com/a/uploads/scale_medium/1/19859/846090-88302_20071006024323_large.jpg",
      time: "4 days ago",
    },
  ];

  return (
    <div className="space-y-4">
      {activities.map((activity) => (
        <div
          key={activity.id}
          className="bg-white rounded-lg shadow-sm border p-2 relative"
        >
          <div className="flex gap-3">
            <img
              src={activity.image}
              alt={activity.comic}
              className="w-16 h-auto object-contain rounded max-md:hidden"
            />
            <div className="flex-1">
              <div className="text-sm">
                <div className="text-red-500 font-medium">{activity.user}</div>
                <span className="text-gray-700">{activity.action}</span>
                <span className="text-red-500 ml-1">{activity.comic}</span>
              </div>
            </div>
          </div>
          <div className="absolute top-2 right-2 flex gap-2">
            <button className="p-1 hover:bg-gray-100 rounded">
              <Heart size={16} className="text-gray-400" />
            </button>
            <button className="p-1 hover:bg-gray-100 rounded">
              <MessageCircle size={16} className="text-gray-400" />
            </button>
          </div>
          <div className="absolute bottom-2 right-2 text-xs text-gray-500 text-right mt-2">
            {activity.time}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ActivityContainer;
