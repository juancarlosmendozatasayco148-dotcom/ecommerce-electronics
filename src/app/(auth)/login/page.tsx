'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { loginSchema, type LoginInput } from '@/lib/validations';
import { toast } from 'sonner';

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<LoginInput>({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (data: LoginInput) => {
    setLoading(true);
    try {
      const { signIn } = await import('@/lib/firebase/auth');
      await signIn(data.email, data.password);
      toast.success('Inicio de sesión exitoso');
      router.push('/');
    } catch {
      toast.error('Correo o contraseña incorrectos');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    try {
      const { signInWithGoogle } = await import('@/lib/firebase/auth');
      await signInWithGoogle();
      toast.success('Inicio de sesión exitoso');
      router.push('/');
    } catch {
      toast.error('Error al iniciar con Google');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#121212] px-4">
      <Card className="w-full max-w-md border-zinc-800">
        <CardHeader className="text-center">
          <Link href="/" className="inline-flex items-center gap-2 mb-4 justify-center">
            <Zap className="h-6 w-6 text-[#9fab26]" />
            <span className="text-xl text-white" style={{ fontFamily: 'var(--font-dm-serif), serif' }}>TechStore</span>
          </Link>
          <CardTitle className="text-2xl text-zinc-100">Iniciar sesión</CardTitle>
          <CardDescription className="text-zinc-500">Ingresa a tu cuenta para continuar</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input id="email" type="email" label="Correo electrónico" placeholder="tu@email.com" error={errors.email?.message} {...register('email')} />
            <div className="relative">
              <Input id="password" type={showPassword ? 'text' : 'password'} label="Contraseña" placeholder="••••••••" error={errors.password?.message} {...register('password')} />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-[38px] text-zinc-500 hover:text-zinc-300">
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            <Button type="submit" className="w-full h-12" disabled={loading}>
              {loading ? 'Ingresando...' : 'Iniciar sesión'}
            </Button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-zinc-800" /></div>
            <div className="relative flex justify-center text-xs uppercase"><span className="bg-[#171717] px-2 text-zinc-500">O continúa con</span></div>
          </div>

          <Button variant="outline" className="w-full h-12 border-zinc-700 text-zinc-300 hover:text-white hover:bg-zinc-800" onClick={handleGoogle}>
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
            Google
          </Button>

          <p className="text-center text-sm text-zinc-500 mt-6">
            ¿No tienes cuenta?{' '}
            <Link href="/register" className="text-[#9fab26] hover:text-[#8a9a1e] font-medium">Regístrate</Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
