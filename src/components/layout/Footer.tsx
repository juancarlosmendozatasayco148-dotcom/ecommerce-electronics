'use client';

import Link from 'next/link';
import { Zap, Mail, Phone, MapPin, ArrowRight, Building2, Sparkles } from 'lucide-react';

const footerLinks = {
  shop: [
    { label: 'Todos los productos', href: '/products' },
    { label: 'Ofertas', href: '/products?sortBy=price_asc' },
    { label: 'Novedades', href: '/products?sortBy=newest' },
    { label: 'Más vendidos', href: '/products?sortBy=rating' },
  ],
  support: [
    { label: 'Centro de ayuda', href: '#' },
    { label: 'Envíos y entregas', href: '#' },
    { label: 'Devoluciones', href: '#' },
    { label: 'Garantía', href: '#' },
    { label: 'Términos y condiciones', href: '#' },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-[#121212] text-zinc-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="py-16 sm:py-20 border-b border-zinc-800/50">
          <div className="max-w-2xl">
            <h2 className="text-3xl sm:text-4xl text-white leading-tight" style={{ fontFamily: 'var(--font-dm-serif), serif' }}>
              Es hora de trabajar juntos,
              <br />
              <span className="text-[#9fab26]">agendemos una reunión virtual</span>
            </h2>
            <div className="flex flex-col sm:flex-row gap-4 mt-10">
              <Link
                href="/contacto"
                className="group inline-flex items-center gap-3 px-6 py-4 bg-zinc-800/50 hover:bg-zinc-800 rounded-xl transition-all duration-300"
              >
                <Building2 className="h-6 w-6 text-[#9fab26]" />
                <div className="text-left">
                  <span className="block text-white font-medium text-sm">Soy una empresa</span>
                  <span className="block text-xs text-zinc-500">Quiero una cotización</span>
                </div>
                <ArrowRight className="h-5 w-5 text-zinc-600 group-hover:text-[#9fab26] transition-colors ml-4" />
              </Link>
              <Link
                href="/contacto"
                className="group inline-flex items-center gap-3 px-6 py-4 bg-zinc-800/50 hover:bg-zinc-800 rounded-xl transition-all duration-300"
              >
                <Sparkles className="h-6 w-6 text-[#f4ed0b]" />
                <div className="text-left">
                  <span className="block text-white font-medium text-sm">Tengo un proyecto</span>
                  <span className="block text-xs text-zinc-500">Hablemos de tu idea</span>
                </div>
                <ArrowRight className="h-5 w-5 text-zinc-600 group-hover:text-[#9fab26] transition-colors ml-4" />
              </Link>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 py-12 lg:py-16">
          <div className="lg:col-span-2 space-y-5">
            <Link href="/" className="flex items-center gap-2 group">
              <Zap className="h-6 w-6 text-[#9fab26]" />
              <span className="text-xl text-white" style={{ fontFamily: 'var(--font-dm-serif), serif' }}>
                TechStore
              </span>
            </Link>
            <p className="text-sm text-zinc-500 leading-relaxed max-w-xs">
              Tu tienda de tecnología de confianza. Los mejores productos electrónicos al mejor precio del Perú.
            </p>
            <div className="flex flex-wrap gap-2">
              <div className="px-3 py-1.5 bg-zinc-800/50 rounded-md text-[11px] text-zinc-400 font-semibold tracking-wide">YAPE</div>
              <div className="px-3 py-1.5 bg-zinc-800/50 rounded-md text-[11px] text-zinc-400 font-semibold tracking-wide">VISA</div>
              <div className="px-3 py-1.5 bg-zinc-800/50 rounded-md text-[11px] text-zinc-400 font-semibold tracking-wide">MASTERCARD</div>
              <div className="px-3 py-1.5 bg-zinc-800/50 rounded-md text-[11px] text-zinc-400 font-semibold tracking-wide">BCP</div>
            </div>
            <div className="space-y-2 text-sm">
              <a href="mailto:contacto@techstore.pe" className="flex items-center gap-2 text-zinc-500 hover:text-[#9fab26] transition-colors">
                <Mail className="h-4 w-4" /> contacto@techstore.pe
              </a>
              <a href="tel:+51999888777" className="flex items-center gap-2 text-zinc-500 hover:text-[#9fab26] transition-colors">
                <Phone className="h-4 w-4" /> +51 999 888 777
              </a>
              <span className="flex items-center gap-2 text-zinc-500">
                <MapPin className="h-4 w-4" /> Av. Tecnología 123, Lima
              </span>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-5 text-sm tracking-wide uppercase">Tienda</h4>
            <ul className="space-y-3">
              {footerLinks.shop.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm text-zinc-500 hover:text-[#9fab26] transition-colors duration-200">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-5 text-sm tracking-wide uppercase">Ayuda</h4>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm text-zinc-500 hover:text-[#9fab26] transition-colors duration-200">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-5 text-sm tracking-wide uppercase">Síguenos</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-sm text-zinc-500 hover:text-[#9fab26] transition-colors">Facebook</a></li>
              <li><a href="#" className="text-sm text-zinc-500 hover:text-[#9fab26] transition-colors">Instagram</a></li>
              <li><a href="#" className="text-sm text-zinc-500 hover:text-[#9fab26] transition-colors">LinkedIn</a></li>
              <li><a href="#" className="text-sm text-zinc-500 hover:text-[#9fab26] transition-colors">TikTok</a></li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-zinc-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-zinc-600">
            &copy; {new Date().getFullYear()} TechStore. Todos los derechos reservados.
          </p>
          <div className="flex gap-6 text-sm text-zinc-600">
            <Link href="#" className="hover:text-[#9fab26] transition-colors">Privacidad</Link>
            <Link href="#" className="hover:text-[#9fab26] transition-colors">Términos</Link>
            <Link href="#" className="hover:text-[#9fab26] transition-colors">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
