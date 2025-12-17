import { BottomNav } from '@/components/navigation/bottom-nav';
import { Header } from '@/components/navigation/header';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="pb-20 pt-2 px-4 max-w-lg mx-auto">{children}</main>
      <BottomNav />
    </div>
  );
}
