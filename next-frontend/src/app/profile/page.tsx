"use client";

import { UserProfile } from "@/components/user-profile";
import { useAuth } from "@/hooks/use-auth";
import { redirect } from "next/navigation";

export default function ProfilePage() {
  const { user, loading } = useAuth();

  if (!loading && !user) {
    redirect("/");
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <UserProfile />
    </div>
  );
}