import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/auth";

export default async function RootPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/login');
  }

  // If authenticated, redirect to the admin welcome page
  redirect('/admin');
}
