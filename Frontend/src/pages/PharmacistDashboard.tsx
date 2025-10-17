import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Package, Users, ShoppingCart, TrendingUp, AlertCircle, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { formatPrice } from '@/lib/formatPrice';
import Loader from '@/components/Loader';
import apiClient from '@/lib/axios';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';
import { normalizeProducts, normalizeCategories, normalizeOrders } from '@/lib/adapters';

interface Product {
  id: string;
  name: string;
  price: number;
  stock?: number;
  categoryId?: string;
  category?: {
    id: string;
    name: string;
  };
}

interface Category {
  id: string;
  name: string;
  description?: string;
}

interface Order {
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

interface DashboardStats {
  totalProducts: number;
  lowStockProducts: number;
  pendingOrders: number;
  totalRevenue: number;
}

const PharmacistDashboard = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    lowStockProducts: 0,
    pendingOrders: 0,
    totalRevenue: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [productsRes, categoriesRes] = await Promise.all([
        apiClient.get('/products'),
        apiClient.get('/categories'),
      ]);

      const productsData = normalizeProducts(productsRes.data);
      const categoriesData = normalizeCategories(categoriesRes.data);

      setProducts(productsData);
      setCategories(categoriesData);
      
      // Solo intentar cargar pedidos si el usuario es ADMIN o PHARMACIST
      let ordersData: Order[] = [];
      try {
        const ordersRes = await apiClient.get('/orders');
        ordersData = normalizeOrders(ordersRes.data);
        setOrders(ordersData);
      } catch (error) {
        console.log('No se pudieron cargar los pedidos:', error);
        setOrders([]);
      }

      // Calcular estadísticas
      const lowStock = productsData.filter((p: Product) => (p.stock || 0) < 10).length;
      const pending = ordersData.filter((o: Order) => o.status === 'PENDING').length;
      const revenue = ordersData.reduce((sum: number, o: Order) => sum + (o.total || 0), 0);

      setStats({
        totalProducts: productsData.length,
        lowStockProducts: lowStock,
        pendingOrders: pending,
        totalRevenue: revenue,
      });
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Error al cargar los datos');
      
      // Mock data para desarrollo
      setProducts([
        { id: '1', name: 'Ibuprofeno 400mg', price: 250000, stock: 50 },
        { id: '2', name: 'Vitamina C 1000mg', price: 180000, stock: 5 },
        { id: '3', name: 'Paracetamol 500mg', price: 150000, stock: 30 },
      ]);
      setCategories([
        { id: '1', name: 'Medicamentos', description: 'Productos farmacéuticos' },
        { id: '2', name: 'Bienestar', description: 'Vitaminas y suplementos' },
      ]);
      setOrders([
        { id: '1', userId: '1', status: 'PENDING', total: 500000, createdAt: '2025-10-17' },
        { id: '2', userId: '2', status: 'COMPLETED', total: 300000, createdAt: '2025-10-16' },
      ]);
      setStats({
        totalProducts: 3,
        lowStockProducts: 1,
        pendingOrders: 1,
        totalRevenue: 800000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar este producto?')) return;

    try {
      await apiClient.delete(`/products/${id}`);
      setProducts(products.filter((p) => p.id !== id));
      toast.success('Producto eliminado exitosamente');
    } catch (error) {
      toast.error('Error al eliminar producto');
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar esta categoría?')) return;

    try {
      await apiClient.delete(`/categories/${id}`);
      setCategories(categories.filter((c) => c.id !== id));
      toast.success('Categoría eliminada exitosamente');
    } catch (error) {
      toast.error('Error al eliminar categoría');
    }
  };

  const handleUpdateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      await apiClient.put(`/orders/${orderId}/status`, { status: newStatus });
      setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
      toast.success('Estado de pedido actualizado');
    } catch (error) {
      toast.error('Error al actualizar estado del pedido');
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { variant: 'default' | 'secondary' | 'destructive' | 'outline', label: string }> = {
      PENDING: { variant: 'outline', label: 'Pendiente' },
      PROCESSING: { variant: 'secondary', label: 'En Proceso' },
      COMPLETED: { variant: 'default', label: 'Completado' },
      CANCELLED: { variant: 'destructive', label: 'Cancelado' },
    };

    const config = statusConfig[status] || statusConfig.PENDING;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Panel de Farmacéutico</h1>
          <p className="text-muted-foreground">
            Bienvenido, {user?.name || user?.email}
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Productos</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalProducts}</div>
              <p className="text-xs text-muted-foreground">En catálogo</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Stock Bajo</CardTitle>
              <AlertCircle className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.lowStockProducts}</div>
              <p className="text-xs text-muted-foreground">Menos de 10 unidades</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pedidos Pendientes</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pendingOrders}</div>
              <p className="text-xs text-muted-foreground">Requieren atención</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ingresos Totales</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatPrice(stats.totalRevenue)}</div>
              <p className="text-xs text-muted-foreground">Ventas totales</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="products" className="space-y-4">
          <TabsList>
            <TabsTrigger value="products">Productos</TabsTrigger>
            <TabsTrigger value="categories">Categorías</TabsTrigger>
            <TabsTrigger value="orders">Pedidos</TabsTrigger>
            <TabsTrigger value="stock">Stock Bajo</TabsTrigger>
          </TabsList>

          {/* Products Tab */}
          <TabsContent value="products">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Gestión de Productos</CardTitle>
                  <CardDescription>Administra el inventario de la farmacia</CardDescription>
                </div>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Nuevo Producto
                </Button>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nombre</TableHead>
                      <TableHead>Categoría</TableHead>
                      <TableHead>Precio</TableHead>
                      <TableHead>Stock</TableHead>
                      <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {products.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell className="font-medium">{product.name}</TableCell>
                        <TableCell>{product.category?.name || '-'}</TableCell>
                        <TableCell>{formatPrice(product.price)}</TableCell>
                        <TableCell>
                          <span className={`${(product.stock || 0) < 10 ? 'text-orange-500 font-semibold' : ''}`}>
                            {product.stock || 0}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="icon">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteProduct(product.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Categories Tab */}
          <TabsContent value="categories">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Gestión de Categorías</CardTitle>
                  <CardDescription>Organiza los productos por categorías</CardDescription>
                </div>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Nueva Categoría
                </Button>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nombre</TableHead>
                      <TableHead>Descripción</TableHead>
                      <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {categories.map((category) => (
                      <TableRow key={category.id}>
                        <TableCell className="font-medium">{category.name}</TableCell>
                        <TableCell>{category.description || '-'}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="icon">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteCategory(category.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders">
            <Card>
              <CardHeader>
                <CardTitle>Gestión de Pedidos</CardTitle>
                <CardDescription>Administra los pedidos de clientes</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID Pedido</TableHead>
                      <TableHead>Fecha</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium">#{order.id}</TableCell>
                        <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                        <TableCell>{formatPrice(order.total)}</TableCell>
                        <TableCell>{getStatusBadge(order.status)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            {order.status === 'PENDING' && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleUpdateOrderStatus(order.id, 'PROCESSING')}
                              >
                                <CheckCircle className="mr-1 h-3 w-3" />
                                Procesar
                              </Button>
                            )}
                            {order.status === 'PROCESSING' && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleUpdateOrderStatus(order.id, 'COMPLETED')}
                              >
                                <CheckCircle className="mr-1 h-3 w-3" />
                                Completar
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Low Stock Tab */}
          <TabsContent value="stock">
            <Card>
              <CardHeader>
                <CardTitle>Productos con Stock Bajo</CardTitle>
                <CardDescription>Productos que requieren reabastecimiento (menos de 10 unidades)</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nombre</TableHead>
                      <TableHead>Categoría</TableHead>
                      <TableHead>Stock Actual</TableHead>
                      <TableHead>Precio</TableHead>
                      <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {products
                      .filter((p) => (p.stock || 0) < 10)
                      .map((product) => (
                        <TableRow key={product.id}>
                          <TableCell className="font-medium">{product.name}</TableCell>
                          <TableCell>{product.category?.name || '-'}</TableCell>
                          <TableCell>
                            <span className="text-orange-500 font-semibold">
                              {product.stock || 0} unidades
                            </span>
                          </TableCell>
                          <TableCell>{formatPrice(product.price)}</TableCell>
                          <TableCell className="text-right">
                            <Button variant="outline" size="sm">
                              Reabastecer
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    {products.filter((p) => (p.stock || 0) < 10).length === 0 && (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                          No hay productos con stock bajo
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default PharmacistDashboard;
