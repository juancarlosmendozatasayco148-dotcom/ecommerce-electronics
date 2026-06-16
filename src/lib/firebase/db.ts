import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
  increment,
  DocumentSnapshot,
} from 'firebase/firestore';
import { db } from './config';
import type { Product, Category, Order, Review, ProductFilters, PaginatedResponse, CartItem } from '@/types';

const PRODUCTS_PER_PAGE = 12;

function productFromDoc(doc: DocumentSnapshot) {
  return { id: doc.id, ...doc.data() } as Product;
}

function orderFromDoc(doc: DocumentSnapshot) {
  return { id: doc.id, ...doc.data() } as Order;
}

function reviewFromDoc(doc: DocumentSnapshot) {
  return { id: doc.id, ...doc.data() } as Review;
}

export async function getProducts(filters?: ProductFilters): Promise<PaginatedResponse<Product>> {
  const page = filters?.page || 1;
  const limitCount = filters?.limit || PRODUCTS_PER_PAGE;
  let items: Product[] = [];
  let total = 0;

  const constraints: any[] = [];
  if (filters?.category) constraints.push(where('categoryId', '==', filters.category));
  if (filters?.brand) constraints.push(where('brand', '==', filters.brand));
  if (filters?.minPrice !== undefined) constraints.push(where('price', '>=', filters.minPrice));
  if (filters?.maxPrice !== undefined) constraints.push(where('price', '<=', filters.maxPrice));

  if (constraints.length === 0) {
    let sortField = 'createdAt';
    let sortDir: 'asc' | 'desc' = 'desc';
    if (filters?.sortBy === 'price_asc') { sortField = 'price'; sortDir = 'asc'; }
    else if (filters?.sortBy === 'price_desc') { sortField = 'price'; sortDir = 'desc'; }
    else if (filters?.sortBy === 'name') { sortField = 'name'; sortDir = 'asc'; }
    else if (filters?.sortBy === 'rating') { sortField = 'rating'; sortDir = 'desc'; }

    constraints.push(orderBy(sortField, sortDir));
  }

  constraints.push(limit(limitCount));

  const q = query(collection(db, 'products'), ...constraints);
  const snapshot = await getDocs(q);
  items = snapshot.docs.map(productFromDoc);

  const totalSnapshot = await getDocs(collection(db, 'products'));
  total = totalSnapshot.size;

  return { items, total, page, limit: limitCount, totalPages: Math.ceil(total / limitCount) };
}

export async function getProduct(id: string): Promise<Product | null> {
  const docRef = doc(db, 'products', id);
  const docSnap = await getDoc(docRef);
  if (!docSnap.exists()) return null;
  return productFromDoc(docSnap);
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const q = query(collection(db, 'products'), where('slug', '==', slug), limit(1));
  const snapshot = await getDocs(q);
  if (snapshot.empty) return null;
  return productFromDoc(snapshot.docs[0]);
}

export async function getFeaturedProducts(): Promise<Product[]> {
  try {
    const q = query(collection(db, 'products'), where('featured', '==', true), orderBy('createdAt', 'desc'), limit(8));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(productFromDoc);
  } catch {
    const q = query(collection(db, 'products'), where('featured', '==', true), limit(8));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(productFromDoc);
  }
}

export async function createProduct(data: any) {
  const docRef = await addDoc(collection(db, 'products'), {
    ...data,
    rating: 0,
    reviewCount: 0,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function updateProduct(id: string, data: any) {
  await updateDoc(doc(db, 'products', id), {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteProduct(id: string) {
  await deleteDoc(doc(db, 'products', id));
}

export async function getCategories(): Promise<Category[]> {
  const snapshot = await getDocs(collection(db, 'categories'));
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Category));
}

export async function createOrder(orderData: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>) {
  const docRef = await addDoc(collection(db, 'orders'), {
    ...orderData,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function getUserOrders(userId: string): Promise<Order[]> {
  try {
    const q = query(
      collection(db, 'orders'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(orderFromDoc);
  } catch {
    const q = query(collection(db, 'orders'), where('userId', '==', userId));
    const snapshot = await getDocs(q);
    const orders = snapshot.docs.map(orderFromDoc);
    return orders.sort((a, b) => {
      const aTime = (a.createdAt as any)?.toMillis?.() || 0;
      const bTime = (b.createdAt as any)?.toMillis?.() || 0;
      return bTime - aTime;
    });
  }
}

export async function getOrder(id: string): Promise<Order | null> {
  const docRef = doc(db, 'orders', id);
  const docSnap = await getDoc(docRef);
  if (!docSnap.exists()) return null;
  return orderFromDoc(docSnap);
}

export async function updateOrderStatus(id: string, status: Order['status']) {
  await updateDoc(doc(db, 'orders', id), { status, updatedAt: serverTimestamp() });
}

export async function updatePaymentStatus(id: string, status: Order['paymentStatus'], paymentId?: string) {
  const data: any = { paymentStatus: status, updatedAt: serverTimestamp() };
  if (paymentId) data.paymentId = paymentId;
  await updateDoc(doc(db, 'orders', id), data);
}

export async function updatePaymentProof(id: string, proof: string) {
  await updateDoc(doc(db, 'orders', id), { paymentProof: proof, updatedAt: serverTimestamp() });
}

export async function getReviews(productId: string): Promise<Review[]> {
  try {
    const q = query(
      collection(db, 'reviews'),
      where('productId', '==', productId),
      orderBy('createdAt', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(reviewFromDoc);
  } catch {
    const q = query(collection(db, 'reviews'), where('productId', '==', productId));
    const snapshot = await getDocs(q);
    const reviews = snapshot.docs.map(reviewFromDoc);
    return reviews.sort((a, b) => {
      const aTime = (a.createdAt as any)?.toMillis?.() || 0;
      const bTime = (b.createdAt as any)?.toMillis?.() || 0;
      return bTime - aTime;
    });
  }
}

export async function createReview(data: Omit<Review, 'id' | 'createdAt'>) {
  const docRef = await addDoc(collection(db, 'reviews'), {
    ...data,
    createdAt: serverTimestamp(),
  });
  const productRef = doc(db, 'products', data.productId);
  const productSnap = await getDoc(productRef);
  const productData = productSnap.data();
  const oldCount = productData?.reviewCount || 0;
  const oldRating = productData?.rating || 0;
  const newCount = oldCount + 1;
  const newRating = ((oldRating * oldCount) + data.rating) / newCount;
  await updateDoc(productRef, {
    reviewCount: newCount,
    rating: Math.round(newRating * 10) / 10,
  });
  return docRef.id;
}

export async function getAllOrders(): Promise<Order[]> {
  try {
    const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(orderFromDoc);
  } catch {
    const snapshot = await getDocs(collection(db, 'orders'));
    const orders = snapshot.docs.map(orderFromDoc);
    return orders.sort((a, b) => {
      const aTime = (a.createdAt as any)?.toMillis?.() || 0;
      const bTime = (b.createdAt as any)?.toMillis?.() || 0;
      return bTime - aTime;
    });
  }
}

export async function getAllProducts(): Promise<Product[]> {
  try {
    const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(productFromDoc);
  } catch {
    const snapshot = await getDocs(collection(db, 'products'));
    return snapshot.docs.map(productFromDoc);
  }
}
