import { InboxList } from "@/components/messaging/inbox-list";

export default function ClientMessagesPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-ink">メッセージ受信箱</h1>
        <p className="mt-1 text-sm text-mist-600">
          承諾された打診ごとにスレッドが作成されます。日程調整もこの中で完結します。
        </p>
      </div>
      <InboxList perspective="client" threadHrefPrefix="/client/messages" />
    </div>
  );
}
