import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import supabase from "@/utils/supabase";

const EditProfileModal = ({ profile, onClose, onSave }) => {
  const [username, setUsername] = useState(profile?.username || "");
  const [fullName, setFullName] = useState(profile?.full_name || "");
  const [website, setWebsite] = useState(profile?.website || "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleSave = async () => {
    try {
      setSaving(true);
      setError("");

      // Validate username
      if (!username.trim()) {
        setError("Username is required");
        return;
      }

      // Check if username is already taken (by someone else)
      const { data: existingUser } = await supabase
        .from("profiles")
        .select("id")
        .eq("username", username.trim())
        .neq("id", profile.id)
        .single();

      if (existingUser) {
        setError("Username is already taken");
        return;
      }

      // Update profile
      const { error: updateError } = await supabase
        .from("profiles")
        .update({
          username: username.trim(),
          full_name: fullName.trim() || null,
          website: website.trim() || null,
        })
        .eq("id", profile.id);

      if (updateError) throw updateError;

      onSave();
    } catch (err) {
      console.error("Error updating profile:", err);
      setError(err.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-card w-full max-w-md rounded-xl shadow-2xl overflow-hidden border border-border">
        <div className="p-4 border-b border-border flex justify-between items-center">
          <h3 className="font-semibold text-lg">Edit Profile</h3>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            disabled={saving}
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">
              Username <span className="text-destructive">*</span>
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="username"
              className="w-full px-3 py-2 border border-input bg-background rounded-md shadow-sm placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-ring focus:border-input transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">
              Full Name
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="John Doe"
              className="w-full px-3 py-2 border border-input bg-background rounded-md shadow-sm placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-ring focus:border-input transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">
              Website
            </label>
            <input
              type="url"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              placeholder="https://example.com"
              className="w-full px-3 py-2 border border-input bg-background rounded-md shadow-sm placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-ring focus:border-input transition-all"
            />
          </div>

          {error && <p className="text-destructive text-sm">{error}</p>}
        </div>

        <div className="p-4 border-t border-border flex gap-3 justify-end">
          <Button variant="outline" onClick={onClose} disabled={saving}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EditProfileModal;
