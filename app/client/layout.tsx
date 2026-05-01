import { Header } from "@/components/shared/header";
import { MOCK_CLIENT } from "@/lib/auth/mock-user";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header variant="client" userLabel={MOCK_CLIENT.name} />
      <main className="flex-1 container-page py-8">{children}</main>
    </div>
  );
}
