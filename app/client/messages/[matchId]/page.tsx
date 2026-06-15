"use client";

import { useParams } from "next/navigation";
import { ThreadView } from "@/components/messaging/thread-view";

export default function ClientThreadPage() {
  const params = useParams<{ matchId: string }>();
  return (
    <ThreadView
      matchId={params.matchId}
      perspective="client"
      backHref="/client/messages"
    />
  );
}
