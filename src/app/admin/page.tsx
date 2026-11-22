import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { canManageUsers, getAllowedScopes, getCurrentUser } from "@/lib/auth";
import { readDatabase, toSafeUser } from "@/lib/db";
import { AdminDashboardClient } from "@/components/admin/AdminDashboardClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Panel Administrador",
  description:
    "Panel de administración de IngeULA para gestión de usuarios, roles, publicaciones, flujogramas, PDFs y videos.",
};

export default async function AdminPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/admin/login");
  }

  const db = readDatabase();
  const allowedScopes = getAllowedScopes(user);
  const allowedSet = new Set(allowedScopes);

  const posts = db.posts
    .filter((p) => allowedSet.has(p.scope))
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

  const resources = db.resources
    .filter((r) => allowedSet.has(r.scope))
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

  const videos = db.videos
    .filter((v) => allowedSet.has(v.scope))
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

  const users = canManageUsers(user) ? db.users.map(toSafeUser) : [];

  return (
    <AdminDashboardClient
      currentUser={user}
      allowedScopes={allowedScopes}
      initialPosts={posts}
      initialResources={resources}
      initialVideos={videos}
      initialUsers={users}
    />
  );
}
