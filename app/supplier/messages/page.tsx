import { InboxList } from "@/components/messaging/inbox-list";

export default function SupplierMessagesPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-ink">メッセージ受信箱</h1>
        <p className="mt-1 text-sm text-mist-600">
          承諾した打診ごとにスレッドが作成されます。日程提案・調整もここで完結します。
        </p>
      </div>
      <InboxList perspective="supplier" threadHrefPrefix="/supplier/messages" />
    </div>
  );
}
