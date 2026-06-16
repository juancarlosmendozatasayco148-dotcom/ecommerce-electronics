import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Correo electrónico inválido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
});

export const registerSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  email: z.string().email('Correo electrónico inválido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Las contraseñas no coinciden',
  path: ['confirmPassword'],
});

export const productSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  description: z.string().min(10, 'La descripción debe tener al menos 10 caracteres'),
  price: z.number().positive('El precio debe ser positivo'),
  comparePrice: z.number().positive().optional(),
  categoryId: z.string().min(1, 'Selecciona una categoría'),
  brand: z.string().min(1, 'La marca es requerida'),
  stock: z.number().int().nonnegative('El stock no puede ser negativo'),
  specs: z.record(z.string(), z.string()),
  featured: z.boolean(),
});

export const addressSchema = z.object({
  fullName: z.string().min(2, 'El nombre completo es requerido'),
  phone: z.string().min(9, 'Teléfono inválido'),
  street: z.string().min(5, 'La dirección debe tener al menos 5 caracteres'),
  city: z.string().min(2, 'La ciudad es requerida'),
  state: z.string().min(2, 'El departamento es requerido'),
  zipCode: z.string().min(5, 'Código postal inválido'),
  country: z.string(),
  reference: z.string().optional(),
});

export const reviewSchema = z.object({
  rating: z.number().int().min(1).max(5),
  title: z.string().min(2, 'El título debe tener al menos 2 caracteres'),
  comment: z.string().min(10, 'El comentario debe tener al menos 10 caracteres'),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type ProductInput = z.infer<typeof productSchema>;
export type AddressInput = z.infer<typeof addressSchema>;
export type ReviewInput = z.infer<typeof reviewSchema>;
