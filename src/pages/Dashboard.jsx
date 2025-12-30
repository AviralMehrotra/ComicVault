import { LifeBuoy, Settings } from "lucide-react";
import Sidebar, { SidebarItem } from "@/components/layout/Sidebar";
import { useAuth } from "../context/AuthContext";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { RxDashboard } from "react-icons/rx";
import { FiSearch } from "react-icons/fi";
import { BiBookmarkAlt } from "react-icons/bi";
import { MdOutlineForum } from "react-icons/md";
import { useTitle } from "@/hooks/useTitle";
import { useState } from "react";
import SearchOverlay from "@/components/layout/SearchOverlay";
import comicService from "@/services/comicService";
import { Input } from "@/components/ui/input";
import ActivityContainer from "@/components/elements/ActivityContainer";

const Dashboard = () => {
  useTitle("Dashboard");
  const { session, profile, signOut } = useAuth();
  const navigate = useNavigate();
  const [searchOpen, setSearchOpen] = useState(false);

  const handleSearch = async (query) => {
    const result = await comicService.searchComics(query, 10);
    return result;
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar>
        <SidebarItem
          icon={<FiSearch size={20} />}
          text="Search"
          onClick={() => setSearchOpen(true)}
        />
        <hr className="my-3 border-sidebar-border" />
        <SidebarItem icon={<RxDashboard size={20} />} text="Dashboard" active />
        <SidebarItem
          icon={<BiBookmarkAlt size={20} className="py-0" />}
          text="Comics"
          onClick={() => navigate('/comics')}
        />
        <SidebarItem icon={<MdOutlineForum size={20} />} text="Forum" />
        <hr className="my-3 border-sidebar-border" />
        <SidebarItem icon={<Settings size={20} />} text="Settings" />
        <SidebarItem icon={<LifeBuoy size={20} />} text="Help" />
      </Sidebar>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full p-8">
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-card rounded-xl shadow-sm border border-border p-6">
            <h3 className="text-lg font-semibold pb-4 text-card-foreground">
              Activity
            </h3>
            <div className="flex w-full items-center gap-3 mb-6">
              <Input
                type="text"
                placeholder="Post an Activity..."
                className="shadow-sm bg-background border-input focus-visible:ring-ring"
              />
              <button className="bg-primary text-primary-foreground py-2 px-6 rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 font-medium transition-colors">
                Post
              </button>
            </div>
            <div className="">
              <ActivityContainer />
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 space-y-6">
          <div className="bg-card rounded-xl shadow-sm border border-border p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-card-foreground">
                Currently Reading
              </h3>
              <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-foreground"
              >
                View All
              </Button>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
              {[
                {
                  title: "Batman #665",
                  page: "45/120",
                  img: "https://comicvine.gamespot.com/a/uploads/scale_small/3/38919/936717-batman_album_32.jpg",
                },
                {
                  title: "Infinity Gauntlet #1",
                  page: "20/40",
                  img: "https://comicvine.gamespot.com/a/uploads/scale_small/0/4/13959-2727-15632-1-batman-family.jpg",
                },
                {
                  title: "Iron Man #310",
                  page: "80/120",
                  img: "https://comicvine.gamespot.com/a/uploads/scale_small/1/19859/846090-88302_20071006024323_large.jpg",
                },
                {
                  title: "Spider-Man #5",
                  page: "12/30",
                  img: "https://comicvine.gamespot.com/a/uploads/scale_small/11112/111120209/4157021-untold%20legend%20of%20batman%20%231.jpg",
                },
                {
                  title: "X-Men #142",
                  page: "5/25",
                  img: "https://comicvine.gamespot.com/a/uploads/scale_small/3/38919/936717-batman_album_32.jpg",
                },
                {
                  title: "Avengers #200",
                  page: "88/100",
                  img: "https://comicvine.gamespot.com/a/uploads/scale_small/0/4/13959-2727-15632-1-batman-family.jpg",
                },
              ].map((item, i) => (
                <div key={i} className="group cursor-pointer">
                  <div className="aspect-[2/3] w-full mb-2 overflow-hidden rounded-md shadow-sm border border-border">
                    <img
                      src={item.img}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      alt={item.title}
                    />
                  </div>
                  <p className="text-sm font-medium text-card-foreground truncate group-hover:text-primary transition-colors">
                    {item.title}
                  </p>
                  <p className="text-xs text-muted-foreground">{item.page}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <SearchOverlay
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
        onSearch={handleSearch}
      />
    </div>
  );
};

export default Dashboard;
