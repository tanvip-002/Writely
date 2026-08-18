"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { User, Lock, Save, CheckCircle2, Globe, MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

interface SettingsFormProps {
  initialUser: {
    displayName: string;
    username: string;
    email: string;
    bio: string;
    location: string;
    website: string;
    writerType: string;
    genres: string[];
  };
  availableGenres: { id: string; name: string; slug: string }[];
}

export function SettingsForm({ initialUser, availableGenres }: SettingsFormProps) {
  const router = useRouter();

  // Profile Form State
  const [displayName, setDisplayName] = useState(initialUser.displayName);
  const [bio, setBio] = useState(initialUser.bio);
  const [location, setLocation] = useState(initialUser.location);
  const [website, setWebsite] = useState(initialUser.website);
  const [writerType, setWriterType] = useState(initialUser.writerType);
  const [selectedGenres, setSelectedGenres] = useState<string[]>(initialUser.genres);

  // Security Form State
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [savingProfile, setSavingProfile] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);

  const [savingPass, setSavingPass] = useState(false);
  const [passSuccess, setPassSuccess] = useState(false);
  const [passError, setPassError] = useState<string | null>(null);

  const toggleGenre = (genreName: string) => {
    if (selectedGenres.includes(genreName)) {
      setSelectedGenres(selectedGenres.filter((g) => g !== genreName));
    } else {
      if (selectedGenres.length < 5) {
        setSelectedGenres([...selectedGenres, genreName]);
      }
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    setProfileError(null);
    setProfileSuccess(false);

    try {
      const res = await fetch("/api/auth/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          displayName: displayName.trim(),
          bio: bio.trim() || null,
          location: location.trim() || null,
          website: website.trim() || null,
          writerType: writerType.trim() || null,
          genres: selectedGenres,
        }),
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error?.message || "Failed to update profile");
      }

      setProfileSuccess(true);
      setTimeout(() => setProfileSuccess(false), 3000);
      router.refresh();
    } catch (err: unknown) {
      setProfileError((err as Error).message);
    } finally {
      setSavingProfile(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingPass(true);
    setPassError(null);
    setPassSuccess(false);

    try {
      const res = await fetch("/api/auth/password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error?.message || "Failed to update password");
      }

      setPassSuccess(true);
      setCurrentPassword("");
      setNewPassword("");
      setTimeout(() => setPassSuccess(false), 3000);
    } catch (err: unknown) {
      setPassError((err as Error).message);
    } finally {
      setSavingPass(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Profile Section */}
      <form onSubmit={handleUpdateProfile} className="p-6 sm:p-8 rounded-2xl border border-border/60 bg-card space-y-6 shadow-xs">
        <div className="flex items-center justify-between border-b border-border/40 pb-4">
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-primary" />
            <h2 className="font-serif text-xl font-bold">Public Writer Profile</h2>
          </div>
          {profileSuccess && (
            <span className="flex items-center gap-1.5 text-xs text-emerald-600 font-semibold animate-in fade-in">
              <CheckCircle2 className="w-4 h-4" />
              Saved successfully
            </span>
          )}
        </div>

        {profileError && (
          <div className="p-3 text-xs bg-destructive/10 text-destructive rounded-lg border border-destructive/20 font-medium">
            {profileError}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">Display Name</label>
            <Input
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="text-xs sm:text-sm"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">Writer Tagline / Type</label>
            <Input
              placeholder="e.g. Novelist, Poet, Essayist"
              value={writerType}
              onChange={(e) => setWriterType(e.target.value)}
              className="text-xs sm:text-sm"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">Location</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="e.g. Edinburgh, Scotland"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="pl-9 text-xs sm:text-sm"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">Website or Portfolio</label>
            <div className="relative">
              <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="https://mywebsite.com"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                className="pl-9 text-xs sm:text-sm"
              />
            </div>
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-foreground">Bio</label>
          <Textarea
            placeholder="Share a brief overview of your background, themes, and current projects..."
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={4}
            className="text-xs sm:text-sm leading-relaxed"
          />
          <span className="text-[11px] text-muted-foreground block text-right font-mono">
            {bio.length}/500
          </span>
        </div>

        {/* Favorite Genres Selection */}
        <div className="space-y-2 pt-2 border-t border-border/40">
          <label className="text-xs font-semibold text-foreground">
            Genres of Interest (Select up to 5)
          </label>
          <div className="flex flex-wrap gap-2">
            {availableGenres.map((g) => {
              const selected = selectedGenres.includes(g.name);
              return (
                <button
                  type="button"
                  key={g.id}
                  onClick={() => toggleGenre(g.name)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                    selected
                      ? "bg-primary text-primary-foreground font-semibold shadow-2xs"
                      : "bg-secondary text-secondary-foreground hover:bg-muted"
                  }`}
                >
                  {g.name}
                </button>
              );
            })}
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <Button
            type="submit"
            disabled={savingProfile}
            className="rounded-full px-6 font-semibold gap-1.5 shadow-xs"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{savingProfile ? "Saving..." : "Save Profile"}</span>
          </Button>
        </div>
      </form>

      {/* Security Section */}
      <form onSubmit={handleUpdatePassword} className="p-6 sm:p-8 rounded-2xl border border-border/60 bg-card space-y-6 shadow-xs">
        <div className="flex items-center justify-between border-b border-border/40 pb-4">
          <div className="flex items-center gap-2">
            <Lock className="w-5 h-5 text-primary" />
            <h2 className="font-serif text-xl font-bold">Security & Password</h2>
          </div>
          {passSuccess && (
            <span className="flex items-center gap-1.5 text-xs text-emerald-600 font-semibold animate-in fade-in">
              <CheckCircle2 className="w-4 h-4" />
              Password updated
            </span>
          )}
        </div>

        {passError && (
          <div className="p-3 text-xs bg-destructive/10 text-destructive rounded-lg border border-destructive/20 font-medium">
            {passError}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">Current Password</label>
            <Input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="text-xs sm:text-sm"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">New Password</label>
            <Input
              type="password"
              placeholder="At least 8 characters"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="text-xs sm:text-sm"
              required
            />
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <Button
            type="submit"
            disabled={savingPass || !currentPassword || newPassword.length < 8}
            variant="outline"
            className="rounded-full px-6 font-semibold"
          >
            <span>{savingPass ? "Updating..." : "Update Password"}</span>
          </Button>
        </div>
      </form>
    </div>
  );
}
