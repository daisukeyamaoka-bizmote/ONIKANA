"use client";

import { useParams } from "next/navigation";
import { ThreadView } from "@/components/messaging/thread-view";

export default function SupplierThreadPage() {
  const params = useParams<{ matchId: string }>();
  return (
    <ThreadView
      matchId={params.matchId}
      perspective="supplier"
      backHref="/supplier/messages"
      detailHref={`/supplier/offers/${params.matchId}`}
    />
  );
}
