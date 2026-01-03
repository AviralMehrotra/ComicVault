import { ChevronFirst, ChevronLast, MoreVerticalIcon } from "lucide-react";
import logo from "/assets/ComicVault.png";
import fullLogo from "/assets/ComicVaultLogo.png";
import { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

const SidebarContext = createContext();

export default function Sidebar({ children }) {
  const [expanded, setExpanded] = useState(true);
  const { profile, session, signOut } = useAuth();

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setExpanded(false);
      } else {
        setExpanded(true);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogout = async () => {
    await signOut();
    navigate("/signin");
  };
  return (
    <>
      <aside className="h-screen sticky top-0 z-50">
        <nav className="h-full flex flex-col bg-white border-r shadow-sm">
          <div className="p-4 pb-2 flex justify-between items-center">
            <img
              src={fullLogo}
              className={`overflow-hidden transition-all ${
                expanded ? "w-32" : "w-0"
              }`}
            />
            <button
              onClick={() => setExpanded((curr) => !curr)}
              className="p-1.5 rounded-lg bg-gray-50 hover:bg-gray-100"
            >
              {expanded ? <ChevronFirst /> : <ChevronLast />}
            </button>
          </div>

          <SidebarContext.Provider value={{ expanded }}>
            <ul className="flex-1 px-3 space-y-1">{children}</ul>
          </SidebarContext.Provider>

          <div className="border-t border-sidebar-border flex p-3 items-center justify-center bg-sidebar">
            <Avatar className="h-9 w-9 border border-sidebar-border">
              <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
              <AvatarFallback>User</AvatarFallback>
            </Avatar>
            <div
              className={`flex justify-between items-center overflow-hidden transition-all ${
                expanded ? "w-52 ml-3" : "w-0"
              } `}
            >
              <div className="leading-4">
                {profile ? (
                  <>
                    <h4 className="font-semibold text-sm text-sidebar-foreground">
                      {profile.username}
                    </h4>
                    <span className="text-xs text-sidebar-foreground/70">
                      {session.user.email}
                    </span>
                  </>
                ) : (
                  <p className="text-xs text-sidebar-foreground/70">
                    Loading...
                  </p>
                )}
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="p-1.5 rounded-md hover:bg-sidebar-accent text-sidebar-foreground transition-colors">
                    <MoreVerticalIcon size={18} />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem>My Account</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="text-destructive focus:text-destructive"
                  >
                    LogOut
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </nav>
      </aside>
    </>
  );
}

export function SidebarItem({ icon, text, active, alert, onClick }) {
  const { expanded } = useContext(SidebarContext);
  return (
    <li
      className={`relative flex items-center py-2.5 px-3 font-medium rounded-md cursor-pointer transition-all group ${
        active
          ? "bg-sidebar-accent text-sidebar-primary"
          : "hover:bg-sidebar-accent/50 text-sidebar-foreground/80 hover:text-sidebar-foreground"
      }`}
      onClick={onClick}
    >
      <span
        className={`${
          active
            ? "text-sidebar-primary"
            : "text-sidebar-foreground/70 group-hover:text-sidebar-foreground"
        }`}
      >
        {icon}
      </span>
      <span
        className={`overflow-hidden transition-all whitespace-nowrap ${
          expanded ? "w-52 ml-3" : "w-0"
        }`}
      >
        {text}
      </span>
      {alert && (
        <div
          className={`absolute right-2 w-2 h-2 rounded-full bg-primary ${
            expanded ? "" : "top-2"
          }`}
        ></div>
      )}

      {!expanded && (
        <div
          className={`absolute left-full rounded-md px-2 py-1 ml-6 bg-popover text-popover-foreground text-sm invisible opacity-20 -translate-x-3 transition-all group-hover:visible group-hover:opacity-100 group-hover:translate-x-0 shadow-md border border-border z-50`}
        >
          {text}
        </div>
      )}
    </li>
  );
}
