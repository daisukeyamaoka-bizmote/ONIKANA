"use client";

import type { Message } from "@/types";
import { cn } from "@/lib/utils";

function fmt(iso: string) {
  const d = new Date(iso);
  return `${d.getMonth() + 1}/${d.getDate()} ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

interface BubbleProps {
  message: Message;
  perspective: "client" | "supplier";
}

export function MessageBubble({ message, perspective }: BubbleProps) {
  if (message.type === "system") {
    return (
      <div className="my-3 text-center">
        <span className="inline-block rounded-full bg-mist-100 px-3 py-1 text-xs text-mist-700">
          {message.body}
        </span>
      </div>
    );
  }

  const isOwn =
    (perspective === "client" && message.senderType === "client") ||
    (perspective === "supplier" && message.senderType === "supplier");

  return (
    <div className={cn("flex flex-col", isOwn ? "items-end" : "items-start")}>
      {!isOwn && message.senderName && (
        <p className="mb-1 text-xs text-mist-500">{message.senderName}</p>
      )}
      <div
        className={cn(
          "max-w-[80%] rounded-2xl px-4 py-2 text-sm whitespace-pre-wrap leading-relaxed",
          isOwn
            ? "bg-oni-blue text-paper rounded-br-sm"
            : "bg-fuku-sand-100 text-ink rounded-bl-sm",
        )}
      >
        {message.body}
      </div>
      <p className="mt-1 text-xs text-mist-500">{fmt(message.createdAt)}</p>
    </div>
  );
}
