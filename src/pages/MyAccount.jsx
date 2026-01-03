import supabase from "@/utils/supabase";
import {
  Settings,
  User,
  BookOpen,
  Library,
  Clock,
  CheckCircle,
  Camera,
} from "lucide-react";
import AppLayout from "@/components/layout/AppLayout";
import { useAuth } from "@/context/AuthContext";
import collectionService from "@/services/collectionService";
import ActivityGraph from "@/components/profile/ActivityGraph";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import StatCard from "@/components/ui/StatCard";
import Loader from "@/components/elements/Loader";
import { useTitle } from "@/hooks/useTitle";
import { useEffect, useState } from "react";

const MyAccount = () => {
  useTitle("My Account");
  const { profile, signOut } = useAuth();
  const [stats, setStats] = useState({
    total: 0,
    reading: 0,
    completed: 0,
    planned: 0,
  });
  const [activityDates, setActivityDates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const uploadAvatar = async (event) => {
    try {
      setUploading(true);

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error("You must select an image to upload.");
      }

      const file = event.target.files[0];
      const fileExt = file.name.split(".").pop();
      const fileName = `${profile.id}-${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const {
        data: { publicUrl },
      } = supabase.storage.from("avatars").getPublicUrl(filePath);

      const { error: updateError } = await supabase
        .from("profiles")
        .update({ avatar_url: publicUrl })
        .eq("id", profile.id);

      if (updateError) {
        throw updateError;
      }

      // Reload to show new avatar
      window.location.reload();
    } catch (error) {
      console.error("Error uploading avatar:", error);
      alert("Error uploading avatar!");
    } finally {
      setUploading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await collectionService.getUserComics();
        if (result.success) {
          const comics = result.data;

          // Calculate stats
          const newStats = {
            total: comics.length,
            reading: comics.filter((c) => c.status === "reading").length,
            completed: comics.filter((c) => c.status === "completed").length,
            planned: comics.filter((c) => c.status === "planned").length,
          };
          setStats(newStats);

          // Extract dates for graph
          const dates = comics.map((c) => c.updated_at).filter((date) => date); // Filter out nulls
          setActivityDates(dates);
        }
      } catch (error) {
        console.error("Error fetching account data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <Loader />;

  return (
    <AppLayout activeRoute="account">
      <div className="flex-1 p-4 lg:p-6 xl:p-10 overflow-y-auto">
        <div className="max-w-5xl mx-auto space-y-8">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 bg-card p-6 rounded-xl border border-border shadow-sm">
            <div className="flex items-center gap-6">
              <div className="relative group">
                <Avatar className="w-24 h-24 border-4 border-background shadow-md">
                  <AvatarImage src={profile?.avatar_url} />
                  <AvatarFallback className="text-2xl bg-primary/10 text-primary">
                    {profile?.username?.charAt(0).toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
                <label
                  htmlFor="avatar-upload"
                  className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                >
                  <Camera className="w-8 h-8 text-white" />
                </label>
                <input
                  type="file"
                  id="avatar-upload"
                  accept="image/*"
                  className="hidden"
                  onChange={uploadAvatar}
                  disabled={uploading}
                />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-card-foreground">
                  {profile?.username || "User"}
                </h1>
                <p className="text-muted-foreground">
                  Joined{" "}
                  {new Date(
                    profile?.created_at || Date.now()
                  ).toLocaleDateString()}
                </p>
                <div className="flex gap-2 mt-3">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                    Pro Member
                  </span>
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" size="sm" className="gap-2">
                <Settings className="w-4 h-4" />
                Settings
              </Button>
              <Button variant="destructive" size="sm" onClick={signOut}>
                Sign Out
              </Button>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard
              label="Total Comics"
              value={stats.total}
              icon={Library}
              className="bg-card"
            />
            <StatCard
              label="Reading"
              value={stats.reading}
              icon={BookOpen}
              className="bg-card"
            />
            <StatCard
              label="Completed"
              value={stats.completed}
              icon={CheckCircle}
              className="bg-card"
            />
            <StatCard
              label="Plan to Read"
              value={stats.planned}
              icon={Clock}
              className="bg-card"
            />
          </div>

          {/* Activity Graph */}
          <div className="bg-card p-6 rounded-xl border border-border shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-card-foreground">
                Reading Activity
              </h2>
              <select className="text-sm bg-background border border-input rounded-md px-2 py-1">
                <option>Last Year</option>
              </select>
            </div>
            <ActivityGraph data={activityDates} />
          </div>

          {/* Settings Placeholder (Future Friends Feature) */}
          <div className="bg-card p-6 rounded-xl border border-border shadow-sm">
            <h2 className="text-lg font-semibold text-card-foreground mb-4">
              Privacy Settings
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                <div>
                  <h3 className="font-medium text-foreground">
                    Profile Visibility
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Control who can see your profile and reading history
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-muted-foreground">
                    Public
                  </span>
                  {/* Toggle Switch Placeholder */}
                  <div className="w-10 h-6 bg-primary rounded-full relative cursor-pointer">
                    <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default MyAccount;
