import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, Navigate } from "react-router-dom";
import {
  User,
  Mail,
  Calendar,
  Edit3,
  Check,
  X,
  Lock,
  BookOpen,
  Heart,
  Tv,
  Eye,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import userService from "../services/userService";
import LoadingSpinner from "../components/common/LoadingSpinner";

// ── Validation schemas ────────────────────────────
const profileSchema = z.object({
  username: z.string().min(3, "Minimum 3 characters"),
  avatar: z.string().url("Must be a valid URL").or(z.literal("")).optional(),
});

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, "Required"),
    newPassword: z.string().min(6, "Minimum 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

// ── Stat card config ──────────────────────────────
const STAT_CARDS = [
  { key: "WATCHING", label: "Watching", icon: Tv, color: "blue" },
  { key: "COMPLETED", label: "Completed", icon: Check, color: "green" },
  { key: "PLANNING", label: "Planning", icon: Eye, color: "purple" },
  { key: "ON_HOLD", label: "On Hold", icon: BookOpen, color: "yellow" },
  { key: "DROPPED", label: "Dropped", icon: X, color: "red" },
  { key: "favorites", label: "Favorites", icon: Heart, color: "pink" },
];

const colorMap = {
  blue: "bg-blue-500/10   border-blue-500/20   text-blue-400",
  green: "bg-green-500/10  border-green-500/20  text-green-400",
  purple: "bg-purple-500/10 border-purple-500/20 text-purple-400",
  yellow: "bg-yellow-500/10 border-yellow-500/20 text-yellow-400",
  red: "bg-red-500/10    border-red-500/20    text-red-400",
  pink: "bg-pink-500/10   border-pink-500/20   text-pink-400",
};

export default function ProfilePage() {
  const { user, setUser, logout } = useAuth();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("profile"); // 'profile' | 'password'
  const [avatarPreview, setAvatarPreview] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // Fetch full profile with stats
  const { data, isLoading } = useQuery({
    queryKey: ["profile"],
    queryFn: userService.getProfile,
  });

  const profile = data?.data;

  // ── Profile form ──────────────────────────────
  const profileForm = useForm({
    resolver: zodResolver(profileSchema),
    values: {
      username: profile?.username || "",
      avatar: profile?.avatar || "",
    },
  });

  const updateProfileMutation = useMutation({
    mutationFn: userService.updateProfile,
    onSuccess: (data) => {
      // Update AuthContext so navbar updates immediately
      setUser((prev) => ({ ...prev, ...data.data }));
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      setSuccessMsg("Profile updated!");
      setTimeout(() => setSuccessMsg(""), 3000);
    },
    onError: (err) => {
      setErrorMsg(err.response?.data?.message || "Update failed");
      setTimeout(() => setErrorMsg(""), 3000);
    },
  });

  // ── Password form ─────────────────────────────
  const passwordForm = useForm({
    resolver: zodResolver(passwordSchema),
  });

  const updatePasswordMutation = useMutation({
    mutationFn: userService.updatePassword,
    onSuccess: () => {
      passwordForm.reset();
      setSuccessMsg("Password updated!");
      setTimeout(() => setSuccessMsg(""), 3000);
    },
    onError: (err) => {
      setErrorMsg(err.response?.data?.message || "Password update failed");
      setTimeout(() => setErrorMsg(""), 3000);
    },
  });

  // Redirect if not logged in
  if (!user) return <Navigate to="/login" replace />;
  if (isLoading) return <LoadingSpinner fullScreen />;

  // Auto-generate avatar from username using UI Avatars
  const avatarUrl =
    profile?.avatar ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(profile?.username || "U")}&background=f97316&color=fff&size=128`;

  // Stats values
  const stats = profile?.watchlistStats || {};
  const totalWatched = Object.values(stats).reduce((a, b) => a + b, 0);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* ── Profile Header ──────────────────────── */}
      <div
        className="rounded-2xl border border-white/5 p-6 mb-6 relative overflow-hidden"
        style={{ backgroundColor: "var(--color-surface-2)" }}
      >
        {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 to-transparent pointer-events-none" />

        <div className="relative flex flex-col sm:flex-row items-start sm:items-center gap-5">
          {/* Avatar */}
          <div className="relative flex-shrink-0">
            <img
              src={avatarUrl}
              alt={profile?.username}
              className="w-20 h-20 rounded-2xl object-cover border-2 border-orange-500/30"
            />
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-[#1a1a1a]" />
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-black text-white mb-1">
              {profile?.username}
            </h1>
            <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <Mail className="w-3.5 h-3.5" />
                {profile?.email}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                Joined{" "}
                {new Date(profile?.createdAt).toLocaleDateString("en-US", {
                  month: "long",
                  year: "numeric",
                })}
              </span>
              {profile?.googleId && (
                <span className="text-xs bg-blue-500/10 border border-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full">
                  Google Account
                </span>
              )}
            </div>
          </div>

          {/* Quick stats */}
          <div className="text-right flex-shrink-0">
            <p className="text-2xl font-black text-orange-500">
              {totalWatched}
            </p>
            <p className="text-xs text-gray-500">Total in Watchlist</p>
          </div>
        </div>
      </div>

      {/* ── Stats Grid ──────────────────────────── */}
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 mb-6">
        {STAT_CARDS.map((stat) => {
          const value =
            stat.key === "favorites"
              ? profile?._count?.favorites || 0
              : stats[stat.key] || 0;

          return (
            <div
              key={stat.key}
              className={`rounded-xl p-3 border flex flex-col items-center gap-1.5 text-center ${colorMap[stat.color]}`}
            >
              <stat.icon className="w-4 h-4" />
              <p className="text-lg font-bold text-white">{value}</p>
              <p className="text-xs opacity-70">{stat.label}</p>
            </div>
          );
        })}
      </div>

      {/* ── Edit Tabs ───────────────────────────── */}
      <div
        className="rounded-2xl border border-white/5 overflow-hidden"
        style={{ backgroundColor: "var(--color-surface-2)" }}
      >
        {/* Tab headers */}
        <div className="flex border-b border-white/5">
          {[
            { id: "profile", label: "Edit Profile", icon: Edit3 },
            { id: "password", label: "Change Password", icon: Lock },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setSuccessMsg("");
                setErrorMsg("");
              }}
              className={`flex items-center gap-2 px-5 py-3.5 text-sm font-medium transition-colors border-b-2 ${
                activeTab === tab.id
                  ? "border-orange-500 text-white"
                  : "border-transparent text-gray-500 hover:text-gray-300"
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Feedback messages */}
        <div className="px-6 pt-4">
          {successMsg && (
            <div className="bg-green-500/10 border border-green-500/30 text-green-400 text-sm px-4 py-2.5 rounded-lg flex items-center gap-2">
              <Check className="w-4 h-4" /> {successMsg}
            </div>
          )}
          {errorMsg && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-2.5 rounded-lg flex items-center gap-2">
              <X className="w-4 h-4" /> {errorMsg}
            </div>
          )}
        </div>

        {/* ── Profile Tab ─────────────────────── */}
        {activeTab === "profile" && (
          <form
            onSubmit={profileForm.handleSubmit((d) =>
              updateProfileMutation.mutate(d),
            )}
            className="p-6 space-y-5"
          >
            {/* Username */}
            <div>
              <label className="block text-sm text-gray-400 mb-1.5">
                Username
              </label>
              <input
                {...profileForm.register("username")}
                className="w-full px-4 py-2.5 rounded-lg text-sm outline-none"
                style={{
                  backgroundColor: "var(--color-surface-3)",
                  border: `1px solid ${profileForm.formState.errors.username ? "#ef4444" : "var(--color-border)"}`,
                  color: "var(--color-text)",
                }}
              />
              {profileForm.formState.errors.username && (
                <p className="text-red-400 text-xs mt-1">
                  {profileForm.formState.errors.username.message}
                </p>
              )}
            </div>

            {/* Avatar URL */}
            <div>
              <label className="block text-sm text-gray-400 mb-1.5">
                Avatar URL
                <span className="text-gray-600 ml-1">
                  (optional — paste any image URL)
                </span>
              </label>
              <div className="flex gap-3">
                <input
                  {...profileForm.register("avatar")}
                  placeholder="https://example.com/avatar.jpg"
                  onChange={(e) => {
                    profileForm.setValue("avatar", e.target.value);
                    setAvatarPreview(e.target.value);
                  }}
                  className="flex-1 px-4 py-2.5 rounded-lg text-sm outline-none"
                  style={{
                    backgroundColor: "var(--color-surface-3)",
                    border: "1px solid var(--color-border)",
                    color: "var(--color-text)",
                  }}
                />
                {/* Live preview */}
                {avatarPreview && (
                  <img
                    src={avatarPreview}
                    alt="preview"
                    className="w-10 h-10 rounded-lg object-cover border border-white/10 flex-shrink-0"
                    onError={(e) => (e.target.style.display = "none")}
                  />
                )}
              </div>
              {profileForm.formState.errors.avatar && (
                <p className="text-red-400 text-xs mt-1">
                  {profileForm.formState.errors.avatar.message}
                </p>
              )}
              <p className="text-gray-600 text-xs mt-1">
                Leave empty to use auto-generated avatar
              </p>
            </div>

            <button
              type="submit"
              disabled={updateProfileMutation.isPending}
              className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white font-semibold px-5 py-2.5 rounded-lg transition-colors"
            >
              {updateProfileMutation.isPending ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Check className="w-4 h-4" /> Save Changes
                </>
              )}
            </button>
          </form>
        )}

        {/* ── Password Tab ─────────────────────── */}
        {activeTab === "password" &&
          (profile?.googleId && !profile?.password ? (
            // Google-only accounts can't change password
            <div className="p-6 text-center text-gray-500">
              <Lock className="w-8 h-8 mx-auto mb-3 opacity-30" />
              <p className="text-sm">
                You signed in with Google — password change is not available.
              </p>
            </div>
          ) : (
            <form
              onSubmit={passwordForm.handleSubmit((d) =>
                updatePasswordMutation.mutate(d),
              )}
              className="p-6 space-y-5"
            >
              {[
                { name: "currentPassword", label: "Current Password" },
                { name: "newPassword", label: "New Password" },
                { name: "confirmPassword", label: "Confirm Password" },
              ].map((field) => (
                <div key={field.name}>
                  <label className="block text-sm text-gray-400 mb-1.5">
                    {field.label}
                  </label>
                  <input
                    {...passwordForm.register(field.name)}
                    type="password"
                    placeholder="••••••••"
                    className="w-full px-4 py-2.5 rounded-lg text-sm outline-none"
                    style={{
                      backgroundColor: "var(--color-surface-3)",
                      border: `1px solid ${passwordForm.formState.errors[field.name] ? "#ef4444" : "var(--color-border)"}`,
                      color: "var(--color-text)",
                    }}
                  />
                  {passwordForm.formState.errors[field.name] && (
                    <p className="text-red-400 text-xs mt-1">
                      {passwordForm.formState.errors[field.name].message}
                    </p>
                  )}
                </div>
              ))}

              <button
                type="submit"
                disabled={updatePasswordMutation.isPending}
                className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white font-semibold px-5 py-2.5 rounded-lg transition-colors"
              >
                {updatePasswordMutation.isPending ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Lock className="w-4 h-4" /> Update Password
                  </>
                )}
              </button>
            </form>
          ))}
      </div>

      {/* ── Quick Links ─────────────────────────── */}
      <div className="flex flex-wrap gap-3 mt-6">
        <Link
          to="/watchlist"
          className="flex items-center gap-2 text-sm text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 px-4 py-2 rounded-lg transition-colors"
        >
          <Tv className="w-4 h-4" /> My Watchlist
        </Link>
        <button
          onClick={logout}
          className="flex items-center gap-2 text-sm text-red-400 hover:text-red-300 bg-red-500/10 hover:bg-red-500/20 px-4 py-2 rounded-lg transition-colors border border-red-500/20"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
}
