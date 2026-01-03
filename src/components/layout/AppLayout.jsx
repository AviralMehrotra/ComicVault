import { useState } from "react";
import { LifeBuoy, Settings, User } from "lucide-react";
import Sidebar, { SidebarItem } from "./Sidebar";
import SearchOverlay from "./SearchOverlay";
import { RxDashboard } from "react-icons/rx";
import { FiSearch } from "react-icons/fi";
import { BiBookmarkAlt } from "react-icons/bi";
import { MdOutlineForum } from "react-icons/md";
import { useNavigate, useLocation } from "react-router-dom";
import comicService from "@/services/comicService";

/**
 * Reusable layout component with Sidebar and SearchOverlay
 * Used across Dashboard, MyComics, and ComicDetails pages
 */
const AppLayout = ({ children, activeRoute = "dashboard" }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchOpen, setSearchOpen] = useState(false);

  const handleSearch = async (query) => {
    const result = await comicService.searchComics(query, 10);
    return result;
  };

  const getActiveRoute = () => {
    if (location.pathname === "/") return "dashboard";
    if (location.pathname === "/comics") return "comics";
    if (location.pathname === "/account") return "account";
    return activeRoute;
  };

  const currentRoute = getActiveRoute();

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar>
        <SidebarItem
          icon={<FiSearch size={20} />}
          text="Search"
          onClick={() => setSearchOpen(true)}
        />
        <hr className="my-3 border-sidebar-border" />
        <SidebarItem
          icon={<RxDashboard size={20} />}
          text="Dashboard"
          active={currentRoute === "dashboard"}
          onClick={() => navigate("/")}
        />
        <SidebarItem
          icon={<BiBookmarkAlt size={20} className="py-0" />}
          text="Comics"
          active={currentRoute === "comics"}
          onClick={() => navigate("/comics")}
        />
        <SidebarItem icon={<MdOutlineForum size={20} />} text="Forum" />
        <hr className="my-3 border-sidebar-border" />
        <SidebarItem
          icon={<User size={20} />}
          text="My Account"
          active={currentRoute === "account"}
          onClick={() => navigate("/account")}
        />
        <SidebarItem icon={<Settings size={20} />} text="Settings" />
        <SidebarItem icon={<LifeBuoy size={20} />} text="Help" />
      </Sidebar>

      <SearchOverlay
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
        onSearch={handleSearch}
      />

      {children}
    </div>
  );
};

export default AppLayout;
