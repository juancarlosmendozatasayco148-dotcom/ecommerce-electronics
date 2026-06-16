'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, ShoppingCart, User, Menu, X, ChevronDown, Zap,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useCartStore } from '@/store/cartStore';
import CartBadge from '@/components/layout/CartBadge';
import { useCurrencyStore } from '@/store/currencyStore';
import { useCategories } from '@/hooks/useProducts';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { logout } from '@/lib/firebase/auth';
import { cn, getInitials } from '@/lib/utils';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const pathname = usePathname();
  const { user, userData, isAdmin, loading } = useAuth();
  const { getItemCount, openCart } = useCartStore();
  const { categories, loading: categoriesLoading } = useCategories();
  const { currency, setCurrency } = useCurrencyStore();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const cartCount = getItemCount();

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
        scrolled
          ? 'bg-[#121212]/95 backdrop-blur-lg shadow-[0_1px_0_rgba(255,255,255,0.06)]'
          : 'bg-transparent'
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-4">

          <button
            className="lg:hidden p-2 text-zinc-400 hover:text-white transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>

          <Link href="/" className="flex items-center gap-2 shrink-0 group">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-300">
              <Zap className={cn(
                'h-6 w-6 transition-colors duration-300',
                scrolled ? 'text-[#9fab26]' : 'text-white'
              )} />
            </div>
            <span className={cn(
              'text-xl tracking-tight transition-colors duration-300',
              scrolled ? 'text-white' : 'text-white'
            )} style={{ fontFamily: 'var(--font-dm-serif), serif' }}>
              TechStore
            </span>
          </Link>

          <div className="hidden md:flex flex-1 max-w-md mx-4 lg:mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
              <Input
                type="text"
                placeholder="Buscar productos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={cn(
                  'pl-10 pr-4 h-10 rounded-full border-0 w-full transition-all duration-300',
                  scrolled
                    ? 'bg-zinc-800/80 text-zinc-100 placeholder:text-zinc-500 focus:ring-1 focus:ring-[#9fab26]/50'
                    : 'bg-white/10 text-white placeholder:text-zinc-400 focus:ring-1 focus:ring-white/30 backdrop-blur-sm'
                )}
              />
            </div>
          </div>

          <div className="flex items-center gap-1 sm:gap-2">

            {!user && (
              <Link
                href="/login"
                className={cn(
                  'hidden sm:flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300',
                  scrolled
                    ? 'text-zinc-300 hover:text-white hover:bg-zinc-800'
                    : 'text-zinc-200 hover:text-white hover:bg-white/10'
                )}
              >
                <User className="h-4 w-4" />
                <span>Ingresar</span>
              </Link>
            )}

            {loading ? (
              <div className="w-9 h-9 rounded-full bg-zinc-800 animate-pulse" />
            ) : user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 p-1 rounded-full hover:bg-zinc-800 transition-colors">
                    <Avatar className="h-8 w-8 ring-2 ring-[#9fab26]/50">
                      {(userData?.photoURL || user?.photoURL) && (
                        <AvatarImage src={userData?.photoURL || user?.photoURL || undefined} alt={userData?.name || ''} />
                      )}
                      <AvatarFallback className="bg-zinc-700 text-zinc-300 text-xs">
                        {getInitials(userData?.name || user.email || 'U')}
                      </AvatarFallback>
                    </Avatar>
                    <ChevronDown className="h-3 w-3 text-zinc-500 hidden sm:block" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 bg-[#171717] border-zinc-800 text-zinc-200">
                  <DropdownMenuLabel>
                    <div className="flex flex-col w-full min-w-0">
                      <span className="font-medium truncate">{userData?.name || 'Usuario'}</span>
                      <span className="text-xs text-zinc-500 font-normal truncate">{user.email}</span>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-zinc-800" />
                  <DropdownMenuItem asChild className="hover:bg-zinc-800 focus:bg-zinc-800">
                    <Link href="/account">Mi Cuenta</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="hover:bg-zinc-800 focus:bg-zinc-800">
                    <Link href="/account/orders">Mis Pedidos</Link>
                  </DropdownMenuItem>
                  {isAdmin && (
                    <>
                      <DropdownMenuSeparator className="bg-zinc-800" />
                      <DropdownMenuItem asChild className="hover:bg-zinc-800 focus:bg-zinc-800">
                        <Link href="/admin">Panel Admin</Link>
                      </DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuSeparator className="bg-zinc-800" />
                  <DropdownMenuItem onClick={() => logout()} className="hover:bg-zinc-800 focus:bg-zinc-800">
                    Cerrar Sesión
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : null}

            <button
              onClick={openCart}
              className={cn(
                'relative p-2 rounded-lg transition-all duration-300',
                scrolled
                  ? 'text-zinc-300 hover:text-[#9fab26] hover:bg-zinc-800'
                  : 'text-zinc-200 hover:text-white hover:bg-white/10'
              )}
            >
              <ShoppingCart className="h-5 w-5" />
              <CartBadge />
            </button>
          </div>
        </div>

        <div className="md:hidden pb-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
            <Input
              type="text"
              placeholder="Buscar productos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={cn(
                'pl-10 pr-4 h-10 rounded-full w-full border-0 transition-all duration-300',
                scrolled
                  ? 'bg-zinc-800/80 text-zinc-100 placeholder:text-zinc-500'
                  : 'bg-white/10 text-white placeholder:text-zinc-400 backdrop-blur-sm'
              )}
            />
          </div>
        </div>
      </div>

      <nav className={cn(
        'hidden lg:block border-t transition-all duration-300',
        categoriesLoading && 'opacity-0',
        scrolled ? 'border-zinc-800/50' : 'border-white/10'
      )}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ul className="flex items-center gap-1 h-11">
            <li>
              <Link
                href="/products"
                className={cn(
                  'px-4 py-1.5 text-sm font-medium rounded-lg transition-all duration-200',
                  pathname === '/products'
                    ? 'text-[#9fab26] bg-[#9fab26]/10'
                    : scrolled
                      ? 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'
                      : 'text-zinc-300 hover:text-white hover:bg-white/10'
                )}
              >
                Todos
              </Link>
            </li>
            {categories.slice(0, 8).map((cat) => (
              <li key={cat.id}>
                <Link
                  href={`/products?category=${cat.id}`}
                  className={cn(
                    'px-4 py-1.5 text-sm font-medium rounded-lg transition-all duration-200',
                    scrolled
                      ? 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'
                      : 'text-zinc-300 hover:text-white hover:bg-white/10'
                  )}
                >
                  {cat.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden border-t border-zinc-800 bg-[#121212] overflow-hidden"
          >
            <div className="px-4 py-4 space-y-1">
              <Link
                href="/products"
                className="block px-4 py-3 text-sm font-medium rounded-lg text-zinc-300 hover:text-white hover:bg-zinc-800/50"
                onClick={() => setMobileMenuOpen(false)}
              >
                Todos los productos
              </Link>
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/products?category=${cat.id}`}
                  className="block px-4 py-3 text-sm font-medium rounded-lg text-zinc-300 hover:text-white hover:bg-zinc-800/50"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {cat.name}
                </Link>
              ))}
              <div className="pt-2 border-t border-zinc-800 mt-2">
                <Link
                  href={user ? "/account" : "/login"}
                  className="flex items-center gap-2 px-4 py-3 text-sm font-medium rounded-lg text-zinc-300 hover:text-white hover:bg-zinc-800/50"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <User className="h-4 w-4" />
                  {user ? 'Mi Cuenta' : 'Ingresar'}
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
