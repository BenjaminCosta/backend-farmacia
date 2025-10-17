// Adaptadores para normalizar datos del backend

export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
  stock?: number;
  categoryId?: string;
  category?: {
    id: string;
    name: string;
  };
}

export interface Category {
  id: string;
  name: string;
  description?: string;
}

export interface Order {
  id: string;
  userId: string;
  status: string;
  total: number;
  createdAt: string;
  items?: Array<{
    productName: string;
    quantity: number;
    price: number;
  }>;
}

/**
 * Normaliza un producto del backend al formato esperado por el frontend
 * Maneja tanto campos en español como en inglés
 */
export const normalizeProduct = (p: any): Product => ({
  id: p.id?.toString() || '',
  name: p.name ?? p.nombre ?? '',
  description: p.description ?? p.descripcion ?? p.desc ?? '',
  price: Number(p.price ?? p.precio ?? 0),
  imageUrl: p.imageUrl ?? p.image ?? p.imagen ?? null,
  stock: Number(p.stock ?? p.existencia ?? 0),
  categoryId: p.categoryId ?? p.categoriaId ?? p.categoria?.id ?? null,
  category: p.category ?? p.categoria ? {
    id: (p.category?.id ?? p.categoria?.id)?.toString(),
    name: p.category?.name ?? p.categoria?.nombre ?? p.categoria?.name ?? '',
  } : undefined,
});

/**
 * Normaliza una categoría del backend al formato esperado por el frontend
 */
export const normalizeCategory = (c: any): Category => ({
  id: c.id?.toString() || '',
  name: c.name ?? c.nombre ?? '',
  description: c.description ?? c.descripcion ?? c.desc ?? '',
});

/**
 * Normaliza un pedido del backend al formato esperado por el frontend
 */
export const normalizeOrder = (o: any): Order => ({
  id: o.id?.toString() || '',
  userId: o.userId ?? o.usuarioId ?? o.user_id ?? '',
  status: o.status ?? o.estado ?? 'PENDING',
  total: Number(o.total ?? o.totalAmount ?? o.monto_total ?? 0),
  createdAt: o.createdAt ?? o.fechaCreacion ?? o.created_at ?? new Date().toISOString(),
  items: o.items ?? o.productos ?? o.orderItems ?? [],
});

/**
 * Normaliza un array de productos
 */
export const normalizeProducts = (data: any): Product[] => {
  const items = Array.isArray(data) ? data : data.content ?? data.items ?? data.data ?? [];
  return items.map(normalizeProduct);
};

/**
 * Normaliza un array de categorías
 */
export const normalizeCategories = (data: any): Category[] => {
  const items = Array.isArray(data) ? data : data.content ?? data.items ?? data.data ?? [];
  return items.map(normalizeCategory);
};

/**
 * Normaliza un array de pedidos
 */
export const normalizeOrders = (data: any): Order[] => {
  const items = Array.isArray(data) ? data : data.content ?? data.items ?? data.data ?? [];
  return items.map(normalizeOrder);
};
