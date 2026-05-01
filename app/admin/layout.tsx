import { Header } from "@/components/shared/header";
import { MOCK_ADMIN } from "@/lib/auth/mock-user";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-navy-50/30">
      <Header variant="admin" userLabel={`${MOCK_ADMIN.name} (${MOCK_ADMIN.role})`} />
      <main className="flex-1 container-page py-8">{children}</main>
    </div>
  );
}
