"use server";
import StreamView from "@/components/StreamView";
import { authOptions } from "@/lib/auth-options";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function StreamViewServer() {
  const session = await getServerSession(authOptions);
  const creatorId = session?.user.id as string;

  if (!creatorId) {
    redirect("/api/auth/signin");
  }

  return <StreamView creatorId={creatorId} />;
}

// Optional: Explicitly set displayName for debugging
StreamViewServer.displayName = "StreamViewServer";
