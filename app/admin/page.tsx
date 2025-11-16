import { getServerSession } from "next-auth/next";
import { authOptions } from "@/auth";
import { redirect } from "next/navigation";
import ClientPage from "../client-page";

export default async function AdminPage() {
  const session = await getServerSession(authOptions);

  redirect('/admin/products');
}