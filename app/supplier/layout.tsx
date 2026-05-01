import { Header } from "@/components/shared/header";
import { MOCK_SUPPLIER } from "@/lib/auth/mock-user";

export default function SupplierLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header variant="supplier" userLabel={MOCK_SUPPLIER.name} />
      <main className="flex-1 container-page py-8">{children}</main>
    </div>
  );
}
