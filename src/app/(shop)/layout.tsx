import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import CartSheet from '@/components/layout/CartSheet';

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main className="min-h-screen pt-28 lg:pt-36">{children}</main>
      <Footer />
      <CartSheet />
    </>
  );
}
