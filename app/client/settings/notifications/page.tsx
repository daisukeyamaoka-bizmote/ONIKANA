import Link from "next/link";
import { NotificationsSection } from "@/components/shared/notifications-section";

export default function ClientNotificationsSettingsPage() {
  return (
    <div className="max-w-3xl">
      <SettingsTabs current="notifications" />
      <NotificationsSection perspective="client" />
    </div>
  );
}

function SettingsTabs({ current }: { current: "integrations" | "notifications" }) {
  const tabs = [
    { id: "integrations", label: "外部サービス連携", href: "/client/settings/integrations" },
    { id: "notifications", label: "通知設定", href: "/client/settings/notifications" },
  ];
  return (
    <div className="mb-6 flex gap-1 border-b border-mist-200">
      {tabs.map((t) => (
        <Link
          key={t.id}
          href={t.href}
          className={`-mb-px border-b-2 px-3 py-2 text-sm ${current === t.id ? "border-ink font-semibold text-ink" : "border-transparent text-mist-600 hover:text-ink"}`}
        >
          {t.label}
        </Link>
      ))}
    </div>
  );
}
