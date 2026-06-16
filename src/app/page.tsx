'use client';

import Link from 'next/link';
import { ArrowRight, Truck, Shield, Smartphone, Award, Monitor, SmartphoneIcon, Headphones, Watch, Sparkles, TrendingUp, Star, Package, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import ProductGrid from '@/components/product/ProductGrid';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import CartSheet from '@/components/layout/CartSheet';
import { useFeaturedProducts } from '@/hooks/useProducts';
import { motion } from 'framer-motion';

const features = [
  { icon: Truck, title: 'Envío gratis', description: 'En compras mayores a S/200' },
  { icon: Shield, title: 'Compra segura', description: 'Datos protegidos con SSL' },
  { icon: Smartphone, title: 'Paga con Yape', description: 'También tarjetas y transferencias' },
  { icon: Award, title: '1 año de garantía', description: 'En todos nuestros productos' },
];

const categories = [
  { name: 'Laptops', slug: 'laptops', icon: Monitor },
  { name: 'Smartphones', slug: 'smartphones', icon: SmartphoneIcon },
  { name: 'Audífonos', slug: 'audifonos', icon: Headphones },
  { name: 'Tablets', slug: 'tablets', icon: SmartphoneIcon },
  { name: 'Smartwatches', slug: 'smartwatches', icon: Watch },
  { name: 'Accesorios', slug: 'accesorios', icon: Package },
];

function FadeIn({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.6, delay }}
    >
      {children}
    </motion.div>
  );
}

export default function Home() {
  const { products, loading } = useFeaturedProducts();

  return (
    <>
      <Header />
      <main>

        <section className="relative bg-[#121212] overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#9fab26]/5 via-transparent to-[#121212]" />
          <div className="absolute top-1/2 right-0 w-[600px] h-[600px] rounded-full bg-[#9fab26]/3 blur-[120px]" />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 sm:pt-28 lg:pt-36 pb-20 sm:pb-24 lg:pb-32">
            <div className="max-w-3xl">
              <FadeIn>
                <h1 className="text-4xl sm:text-5xl lg:text-7xl text-white leading-[1.08] tracking-tight" style={{ fontFamily: 'var(--font-dm-serif), serif' }}>
                  Tecnología que{' '}
                  <span className="text-[#9fab26]">transforma</span>
                  {' '}tu mundo
                </h1>
              </FadeIn>
              <FadeIn delay={0.15}>
                <p className="mt-6 text-lg text-zinc-400 max-w-xl leading-relaxed">
                  Descubre los mejores productos electrónicos con precios inigualables.
                  Envío rápido, pago con Yape y garantía de 1 año en todos tus productos.
                </p>
              </FadeIn>
              <FadeIn delay={0.3}>
                <div className="mt-10 flex flex-col sm:flex-row gap-3">
                  <Button size="lg" asChild className="text-base px-8 h-13 shadow-lg shadow-[#9fab26]/20">
                    <Link href="/products">
                      Explorar productos <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" asChild className="text-base px-8 h-13 border-zinc-700 text-zinc-300 hover:text-white hover:border-zinc-500">
                    <Link href="/products?sortBy=price_asc">Ver ofertas</Link>
                  </Button>
                </div>
              </FadeIn>
              <FadeIn delay={0.45}>
                <div className="mt-12 flex flex-wrap gap-x-10 gap-y-3">
                  <div>
                    <p className="text-3xl font-bold text-white" style={{ fontFamily: 'var(--font-dm-serif), serif' }}>120+</p>
                    <p className="text-sm text-zinc-500 mt-1">Productos disponibles</p>
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-white" style={{ fontFamily: 'var(--font-dm-serif), serif' }}>5000+</p>
                    <p className="text-sm text-zinc-500 mt-1">Clientes satisfechos</p>
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-white" style={{ fontFamily: 'var(--font-dm-serif), serif' }}>99%</p>
                    <p className="text-sm text-zinc-500 mt-1">Satisfacción</p>
                  </div>
                </div>
              </FadeIn>
            </div>
          </div>
        </section>

        <section className="py-16 sm:py-20 bg-[#fafbfc] dark:bg-[#121212]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <FadeIn>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                {features.map((feature) => (
                  <div
                    key={feature.title}
                    className="bg-white dark:bg-[#171717] rounded-2xl p-5 sm:p-6 border border-zinc-200 dark:border-zinc-800 hover:border-[#9fab26]/30 transition-all duration-300"
                  >
                    <div className="w-11 h-11 rounded-xl bg-[#9fab26]/10 dark:bg-[#9fab26]/10 flex items-center justify-center mb-4">
                      <feature.icon className="h-5 w-5 text-[#9fab26]" />
                    </div>
                    <h3 className="font-semibold text-[#292525] dark:text-zinc-100 text-sm sm:text-base">{feature.title}</h3>
                    <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-500 mt-1">{feature.description}</p>
                  </div>
                ))}
              </div>
            </FadeIn>
          </div>
        </section>

        <section className="py-16 sm:py-20 bg-[#fafbfc] dark:bg-[#121212]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <FadeIn>
              <div className="flex items-center justify-between mb-8 sm:mb-10">
                <div>
                  <h2 className="text-2xl sm:text-3xl text-[#292525] dark:text-white" style={{ fontFamily: 'var(--font-dm-serif), serif' }}>
                    Categorías
                  </h2>
                  <p className="text-zinc-500 mt-1 text-sm sm:text-base">Encuentra lo que buscas</p>
                </div>
                <Button variant="outline" asChild className="hidden sm:flex border-zinc-300 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400">
                  <Link href="/products">Ver todo <ArrowRight className="ml-1 h-4 w-4" /></Link>
                </Button>
              </div>
            </FadeIn>

            <FadeIn delay={0.1}>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {categories.map((cat) => (
                  <Link key={cat.slug} href={`/products?category=${cat.slug}`}>
                    <Card className="group border border-zinc-200 dark:border-zinc-800 rounded-2xl hover:border-[#9fab26]/40 transition-all duration-300 bg-white dark:bg-[#171717] hover:shadow-lg hover:shadow-[#9fab26]/5">
                      <div className="p-6 sm:p-8 text-center">
                        <div className="w-12 h-12 mx-auto bg-zinc-100 dark:bg-zinc-800 rounded-xl flex items-center justify-center mb-3 group-hover:bg-[#9fab26]/10 transition-colors duration-300">
                          <cat.icon className="h-6 w-6 text-zinc-600 dark:text-zinc-400 group-hover:text-[#9fab26] transition-colors duration-300" />
                        </div>
                        <h3 className="font-medium text-[#292525] dark:text-zinc-200 text-sm">{cat.name}</h3>
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>
            </FadeIn>
          </div>
        </section>

        <section className="py-16 sm:py-20 bg-white dark:bg-[#171717]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <FadeIn>
              <div className="flex items-center justify-between mb-8 sm:mb-10">
                <div>
                  <h2 className="text-2xl sm:text-3xl text-[#292525] dark:text-white" style={{ fontFamily: 'var(--font-dm-serif), serif' }}>
                    Productos destacados
                  </h2>
                  <p className="text-zinc-500 mt-1 text-sm sm:text-base">Lo más vendido de la semana</p>
                </div>
                <Button variant="outline" asChild className="hidden sm:flex border-zinc-300 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400">
                  <Link href="/products">Ver todo <ArrowRight className="ml-2 h-4 w-4" /></Link>
                </Button>
              </div>
            </FadeIn>
            <ProductGrid products={products} loading={loading} />
            <FadeIn>
              <div className="mt-8 text-center sm:hidden">
                <Button asChild>
                  <Link href="/products">Ver todos los productos <ArrowRight className="ml-2 h-4 w-4" /></Link>
                </Button>
              </div>
            </FadeIn>
          </div>
        </section>

        <section className="py-16 sm:py-20 bg-[#fafbfc] dark:bg-[#121212]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <FadeIn>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                {[
                  { value: '1000+', label: 'Productos disponibles', icon: Package },
                  { value: '99.9%', label: 'Clientes satisfechos', icon: Star },
                  { value: '24/7', label: 'Soporte al cliente', icon: TrendingUp },
                  { value: '48h', label: 'Entrega rápida', icon: Zap },
                ].map((stat) => (
                  <div key={stat.label} className="p-6 rounded-2xl bg-white dark:bg-[#171717] border border-zinc-200 dark:border-zinc-800">
                    <div className="w-10 h-10 mx-auto rounded-lg bg-[#9fab26]/10 flex items-center justify-center mb-4">
                      <stat.icon className="h-5 w-5 text-[#9fab26]" />
                    </div>
                    <p className="text-3xl font-bold text-[#292525] dark:text-white" style={{ fontFamily: 'var(--font-dm-serif), serif' }}>{stat.value}</p>
                    <p className="text-sm text-zinc-500 mt-1">{stat.label}</p>
                  </div>
                ))}
              </div>
            </FadeIn>
          </div>
        </section>

      </main>
      <Footer />
      <CartSheet />
    </>
  );
}
