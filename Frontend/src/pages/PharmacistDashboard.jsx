import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Package, ShoppingCart, TrendingUp, AlertCircle, CheckCircle, Pill, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { formatPrice } from '@/lib/formatPrice';
import Loader from '@/components/Loader';
import client from '@/api/client';
import { toast } from 'sonner';
import { useAppSelector } from '@/store/hooks';
import { selectUser } from '@/store/auth/authSlice';
import { normalizeProducts, normalizeCategories, normalizeOrders } from '@/lib/adapters';
import ProductImageManager from '@/components/ProductImageManager';

const PharmacistDashboard = () => {
    const user = useAppSelector(selectUser);
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [orders, setOrders] = useState([]);
    const [stats, setStats] = useState({
        totalProducts: 0,
        lowStockProducts: 0,
        pendingOrders: 0,
        totalRevenue: 0,
    });
    const [loading, setLoading] = useState(true);
    // Estados para modales de productos
    const [createProductModalOpen, setCreateProductModalOpen] = useState(false);
    const [editProductModalOpen, setEditProductModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [newlyCreatedProductId, setNewlyCreatedProductId] = useState(null);
    // Estados para formularios de productos
    const [productForm, setProductForm] = useState({
        nombre: '',
        descripcion: '',
        precio: '',
        stock: '',
        descuento: '',
        categoryId: '',
        requiresPrescription: false,
    });
    // Estados para modales de categorías
    const [createCategoryModalOpen, setCreateCategoryModalOpen] = useState(false);
    const [editCategoryModalOpen, setEditCategoryModalOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);
    // Estados para formularios de categorías
    const [categoryForm, setCategoryForm] = useState({
        name: '',
        description: '',
    });
    useEffect(() => {
        fetchData();
    }, []);
    const fetchData = async () => {
        setLoading(true);
        try {
            const [productsRes, categoriesRes] = await Promise.all([
                client.get('/api/v1/products'),
                client.get('/api/v1/categories'),
            ]);
            const productsData = normalizeProducts(productsRes.data);
            const categoriesData = normalizeCategories(categoriesRes.data);
            setProducts(productsData);
            setCategories(categoriesData);
            // Solo intentar cargar pedidos si el usuario es ADMIN o PHARMACIST
            let ordersData = [];
            try {
                // Farmacéuticos y admins ven TODAS las órdenes del sistema
                const ordersRes = await client.get('/api/v1/orders/all');
                ordersData = normalizeOrders(ordersRes.data);
                setOrders(ordersData);
                console.log('Órdenes cargadas:', ordersData);
            }
            catch (error) {
                console.log('No se pudieron cargar los pedidos:', error);
                setOrders([]);
            }
            // Calcular estadísticas
            const lowStock = productsData.filter((p) => (p.stock || 0) < 10).length;
            const pending = ordersData.filter((o) => o.status === 'PENDING').length;
            const revenue = ordersData.reduce((sum, o) => sum + (o.total || 0), 0);
            setStats({
                totalProducts: productsData.length,
                lowStockProducts: lowStock,
                pendingOrders: pending,
                totalRevenue: revenue,
            });
        }
        catch (error) {
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
        }
        finally {
            setLoading(false);
        }
    };
    const handleDeleteProduct = async (id) => {
        if (!confirm('¿Estás seguro de eliminar este producto?'))
            return;
        try {
            await client.delete(`/api/v1/products/${id}`);
            setProducts(products.filter((p) => p.id !== id));
            toast.success('Producto eliminado exitosamente');
        }
        catch (error) {
            toast.error('Error al eliminar producto');
        }
    };
    const handleDeleteCategory = async (id) => {
        if (!confirm('¿Estás seguro de eliminar esta categoría?'))
            return;
        try {
            await client.delete(`/api/v1/categories/${id}`);
            setCategories(categories.filter((c) => c.id !== id));
            toast.success('Categoría eliminada exitosamente');
        }
        catch (error) {
            toast.error('Error al eliminar categoría');
        }
    };
    const handleUpdateOrderStatus = async (orderId, newStatus) => {
        try {
            await client.put(`/api/v1/orders/${orderId}/status`, { status: newStatus });
            setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
            toast.success('Estado de pedido actualizado');
        }
        catch (error) {
            toast.error('Error al actualizar estado del pedido');
        }
    };
    
    // 🔴 Nuevo handler para marcar pickup completado (productos RX)
    const handleMarkPickupComplete = async (orderId) => {
        try {
            const response = await client.put(`/api/v1/orders/${orderId}/pickup/complete`);
            const completedOrder = response.data;
            
            // Actualizar la orden localmente
            setOrders(orders.map(o => o.id === orderId ? { ...o, status: 'COMPLETED' } : o));
            
            toast.success(
                completedOrder.requiresPrescription 
                    ? '✅ Entrega RX completada: medicamento entregado al cliente'
                    : '✅ Retiro completado exitosamente'
            );
            
            fetchData(); // Refrescar datos
        } catch (error) {
            console.error('Error al completar pickup:', error);
            toast.error(error.response?.data?.message || 'Error al completar el retiro');
        }
    };
    
    const handleOpenCreateProductModal = () => {
        setProductForm({
            nombre: '',
            descripcion: '',
            precio: '',
            stock: '',
            descuento: '',
            categoryId: '',
            requiresPrescription: false,
        });
        setNewlyCreatedProductId(null);
        setCreateProductModalOpen(true);
    };
    const handleOpenEditProductModal = (product) => {
        setSelectedProduct(product);
        setProductForm({
            nombre: product.name,
            descripcion: '', // Si tienes descripción en el Product, úsala aquí
            precio: product.price.toString(),
            stock: (product.stock || 0).toString(),
            descuento: '0', // Si tienes descuento en el Product, úsalo aquí
            categoryId: product.categoryId || product.category?.id || '',
            requiresPrescription: product.requiresPrescription || false,
        });
        setEditProductModalOpen(true);
    };
    const handleCreateProduct = async (e) => {
        e.preventDefault();
        if (!productForm.nombre || !productForm.precio || !productForm.categoryId) {
            toast.error('Por favor completa todos los campos obligatorios');
            return;
        }
        try {
            const payload = {
                nombre: productForm.nombre,
                descripcion: productForm.descripcion,
                precio: Number(productForm.precio),
                stock: Number(productForm.stock) || 0,
                descuento: Number(productForm.descuento) || 0,
                requiresPrescription: productForm.requiresPrescription,
                category: {
                    id: Number(productForm.categoryId),
                },
            };
            const response = await client.post('/api/v1/products', payload);
            const createdProduct = response.data;
            toast.success('Producto creado exitosamente');
            setNewlyCreatedProductId(createdProduct.id);
            // No cerrar el modal, mostrar gestor de imágenes
            // setCreateProductModalOpen(false);
            // fetchData(); // Recargar datos después de subir imágenes
        }
        catch (error) {
            console.error('Error creating product:', error);
            const errorMessage = error && typeof error === 'object' && 'response' in error
                ? error.response?.data?.message
                : undefined;
            toast.error(errorMessage || 'Error al crear producto');
        }
    };
    const handleUpdateProduct = async (e) => {
        e.preventDefault();
        if (!selectedProduct || !productForm.nombre || !productForm.precio || !productForm.categoryId) {
            toast.error('Por favor completa todos los campos obligatorios');
            return;
        }
        try {
            const payload = {
                nombre: productForm.nombre,
                descripcion: productForm.descripcion,
                precio: Number(productForm.precio),
                stock: Number(productForm.stock) || 0,
                descuento: Number(productForm.descuento) || 0,
                requiresPrescription: productForm.requiresPrescription,
                category: {
                    id: Number(productForm.categoryId),
                },
            };
            await client.put(`/api/v1/products/${selectedProduct.id}`, payload);
            toast.success('Producto actualizado exitosamente');
            setEditProductModalOpen(false);
            setSelectedProduct(null);
            fetchData(); // Recargar datos
        }
        catch (error) {
            console.error('Error updating product:', error);
            const errorMessage = error && typeof error === 'object' && 'response' in error
                ? error.response?.data?.message
                : undefined;
            toast.error(errorMessage || 'Error al actualizar producto');
        }
    };
    // ====== FUNCIONES DE CATEGORÍAS ======
    const handleOpenCreateCategoryModal = () => {
        setCategoryForm({
            name: '',
            description: '',
        });
        setCreateCategoryModalOpen(true);
    };
    const handleOpenEditCategoryModal = (category) => {
        setSelectedCategory(category);
        setCategoryForm({
            name: category.name,
            description: category.description || '',
        });
        setEditCategoryModalOpen(true);
    };
    const handleCreateCategory = async (e) => {
        e.preventDefault();
        if (!categoryForm.name) {
            toast.error('Por favor completa el nombre de la categoría');
            return;
        }
        try {
            const payload = {
                name: categoryForm.name.trim(),
                description: categoryForm.description.trim(),
            };
            await client.post('/api/v1/categories', payload);
            toast.success('Categoría creada exitosamente');
            setCreateCategoryModalOpen(false);
            fetchData(); // Recargar datos
        }
        catch (error) {
            console.error('Error creating category:', error);
            const errorMessage = error && typeof error === 'object' && 'response' in error
                ? error.response?.data?.message
                : undefined;
            toast.error(errorMessage || 'Error al crear categoría');
        }
    };
    const handleUpdateCategory = async (e) => {
        e.preventDefault();
        if (!selectedCategory || !categoryForm.name) {
            toast.error('Por favor completa el nombre de la categoría');
            return;
        }
        try {
            const payload = {
                name: categoryForm.name.trim(),
                description: categoryForm.description.trim(),
            };
            await client.put(`/api/v1/categories/${selectedCategory.id}`, payload);
            toast.success('Categoría actualizada exitosamente');
            setEditCategoryModalOpen(false);
            setSelectedCategory(null);
            fetchData(); // Recargar datos
        }
        catch (error) {
            console.error('Error updating category:', error);
            const errorMessage = error && typeof error === 'object' && 'response' in error
                ? error.response?.data?.message
                : undefined;
            toast.error(errorMessage || 'Error al actualizar categoría');
        }
    };
    const getStatusBadge = (status) => {
        const statusConfig = {
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
    return (<div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Panel de Farmacéutico</h1>
          <p className="text-muted-foreground">
            Bienvenido, {user?.name || user?.email}
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Productos</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground"/>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalProducts}</div>
              <p className="text-xs text-muted-foreground">En catálogo</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Stock Bajo</CardTitle>
              <AlertCircle className="h-4 w-4 text-orange-500"/>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.lowStockProducts}</div>
              <p className="text-xs text-muted-foreground">Menos de 10 unidades</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pedidos Pendientes</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground"/>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pendingOrders}</div>
              <p className="text-xs text-muted-foreground">Requieren atención</p>
            </CardContent>
          </Card>
          
          {/* 🔴 NUEVA: Tarjeta de Pedidos RX */}
          <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-red-900">Pedidos RX</CardTitle>
              <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center">
                <Pill className="h-4 w-4 text-white"/>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-900">
                {orders.filter(o => o.deliveryMethod === 'PICKUP' && o.status !== 'COMPLETED' && o.status !== 'CANCELLED').length}
              </div>
              <p className="text-xs text-red-700 font-medium">Para retiro en farmacia</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ingresos Totales</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-500"/>
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
                <Button onClick={handleOpenCreateProductModal}>
                  <Plus className="mr-2 h-4 w-4"/>
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
                    {products.map((product) => (<TableRow key={product.id}>
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
                            <Button variant="ghost" size="icon" onClick={() => handleOpenEditProductModal(product)}>
                              <Edit className="h-4 w-4"/>
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => handleDeleteProduct(product.id)}>
                              <Trash2 className="h-4 w-4"/>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>))}
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
                <Button onClick={handleOpenCreateCategoryModal}>
                  <Plus className="mr-2 h-4 w-4"/>
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
                    {categories.map((category) => (<TableRow key={category.id}>
                        <TableCell className="font-medium">{category.name}</TableCell>
                        <TableCell>{category.description || '-'}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="icon" onClick={() => handleOpenEditCategoryModal(category)}>
                              <Edit className="h-4 w-4"/>
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => handleDeleteCategory(category.id)}>
                              <Trash2 className="h-4 w-4"/>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>))}
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
                      <TableHead>Método</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders.map((order) => (<TableRow key={order.id} className={order.deliveryMethod === 'PICKUP' ? 'bg-blue-50' : ''}>
                        <TableCell className="font-medium">
                          #{order.id}
                          {/* 🔴 Badge RX si el pedido contiene productos con receta */}
                          {order.requiresPrescription && (
                            <span className="ml-2 px-2 py-0.5 bg-red-600 text-white text-xs font-bold rounded">
                              RX
                            </span>
                          )}
                        </TableCell>
                        <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                        <TableCell>{formatPrice(order.total)}</TableCell>
                        <TableCell>
                          <Badge variant={order.deliveryMethod === 'PICKUP' ? 'default' : 'secondary'}>
                            {order.deliveryMethod === 'PICKUP' ? '🏪 Retiro' : '🚚 Envío'}
                          </Badge>
                        </TableCell>
                        <TableCell>{getStatusBadge(order.status)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            {/* Botón PICKUP para órdenes con método PICKUP */}
                            {order.deliveryMethod === 'PICKUP' && order.status !== 'COMPLETED' && order.status !== 'CANCELLED' && (
                              <Button 
                                variant={order.requiresPrescription ? 'default' : 'outline'}
                                className={order.requiresPrescription ? 'bg-red-600 hover:bg-red-700' : ''}
                                size="sm" 
                                onClick={() => handleMarkPickupComplete(order.id)}
                              >
                                <CheckCircle className="mr-1 h-3 w-3"/>
                                {order.requiresPrescription ? '⚕️ Entregar RX' : 'Entregar'}
                              </Button>
                            )}
                            
                            {/* Botones de flujo normal para otros métodos */}
                            {order.deliveryMethod !== 'PICKUP' && order.status === 'PENDING' && (
                              <Button variant="outline" size="sm" onClick={() => handleUpdateOrderStatus(order.id, 'PROCESSING')}>
                                <CheckCircle className="mr-1 h-3 w-3"/>
                                Procesar
                              </Button>
                            )}
                            {order.deliveryMethod !== 'PICKUP' && order.status === 'PROCESSING' && (
                              <Button variant="outline" size="sm" onClick={() => handleUpdateOrderStatus(order.id, 'COMPLETED')}>
                                <CheckCircle className="mr-1 h-3 w-3"/>
                                Completar
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>))}
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
            .map((product) => (<TableRow key={product.id}>
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
                        </TableRow>))}
                    {products.filter((p) => (p.stock || 0) < 10).length === 0 && (<TableRow>
                        <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                          No hay productos con stock bajo
                        </TableCell>
                      </TableRow>)}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Modal de Crear Producto */}
      <Dialog open={createProductModalOpen} onOpenChange={(open) => {
        setCreateProductModalOpen(open);
        if (!open) {
          setNewlyCreatedProductId(null);
          fetchData(); // Recargar datos al cerrar
        }
      }}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {newlyCreatedProductId ? 'Agregar Imágenes al Producto' : 'Crear Nuevo Producto'}
            </DialogTitle>
            <DialogDescription>
              {newlyCreatedProductId 
                ? 'Sube imágenes para el producto recién creado' 
                : 'Completa los datos del nuevo producto para agregarlo al inventario'}
            </DialogDescription>
          </DialogHeader>

          {!newlyCreatedProductId ? (
            <form onSubmit={handleCreateProduct}>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="create-nombre">Nombre *</Label>
                  <Input id="create-nombre" placeholder="Ej: Ibuprofeno 400mg" value={productForm.nombre} onChange={(e) => setProductForm({ ...productForm, nombre: e.target.value })} required/>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="create-descripcion">Descripción</Label>
                  <Input id="create-descripcion" placeholder="Descripción del producto" value={productForm.descripcion} onChange={(e) => setProductForm({ ...productForm, descripcion: e.target.value })}/>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="create-precio">Precio *</Label>
                  <Input id="create-precio" type="number" step="0.01" min="0" placeholder="0.00" value={productForm.precio} onChange={(e) => setProductForm({ ...productForm, precio: e.target.value })} required/>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="create-stock">Stock</Label>
                  <Input id="create-stock" type="number" min="0" placeholder="0" value={productForm.stock} onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })}/>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="create-descuento">Descuento (%)</Label>
                  <Input id="create-descuento" type="number" step="0.01" min="0" max="100" placeholder="0" value={productForm.descuento} onChange={(e) => setProductForm({ ...productForm, descuento: e.target.value })}/>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="create-category">Categoría *</Label>
                  <Select value={productForm.categoryId} onValueChange={(value) => setProductForm({ ...productForm, categoryId: value })} required>
                    <SelectTrigger id="create-category">
                      <SelectValue placeholder="Selecciona una categoría"/>
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (<SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Selector de Receta */}
                <div className="space-y-3 pt-2">
                  <Label className="text-base font-semibold">Tipo de Venta *</Label>
                  <RadioGroup 
                    value={productForm.requiresPrescription ? "rx" : "otc"}
                    onValueChange={(value) => setProductForm({ ...productForm, requiresPrescription: value === "rx" })}
                    className="grid grid-cols-2 gap-4"
                  >
                    {/* Opción: Venta Libre */}
                    <div className="relative">
                      <RadioGroupItem value="otc" id="create-otc" className="peer sr-only" />
                      <Label
                        htmlFor="create-otc"
                        className="flex flex-col items-center justify-between rounded-xl border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-green-600 peer-data-[state=checked]:bg-green-50 cursor-pointer transition-all hover:scale-105"
                      >
                        <div className="flex items-center gap-3 w-full">
                          <div className="p-2 rounded-lg bg-green-100">
                            <CheckCircle className="h-6 w-6 text-green-600" />
                          </div>
                          <div className="flex-1 text-left">
                            <div className="font-bold text-sm">Venta Libre</div>
                            <div className="text-xs text-muted-foreground mt-1">Sin receta médica</div>
                          </div>
                        </div>
                      </Label>
                    </div>

                    {/* Opción: Requiere Receta */}
                    <div className="relative">
                      <RadioGroupItem value="rx" id="create-rx" className="peer sr-only" />
                      <Label
                        htmlFor="create-rx"
                        className="flex flex-col items-center justify-between rounded-xl border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-red-600 peer-data-[state=checked]:bg-red-50 cursor-pointer transition-all hover:scale-105"
                      >
                        <div className="flex items-center gap-3 w-full">
                          <div className="p-2 rounded-lg bg-red-100">
                            <Pill className="h-6 w-6 text-red-600" />
                          </div>
                          <div className="flex-1 text-left">
                            <div className="font-bold text-sm">Bajo Receta</div>
                            <div className="text-xs text-muted-foreground mt-1">Requiere prescripción</div>
                          </div>
                        </div>
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setCreateProductModalOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit">Crear Producto</Button>
              </DialogFooter>
            </form>
          ) : (
            <div className="py-4">
              <ProductImageManager productId={newlyCreatedProductId} />
              <DialogFooter className="mt-6">
                <Button onClick={() => setCreateProductModalOpen(false)}>
                  Finalizar
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Modal de Editar Producto */}
      <Dialog open={editProductModalOpen} onOpenChange={setEditProductModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar Producto: {selectedProduct?.name}</DialogTitle>
            <DialogDescription>
              Modifica los datos del producto y gestiona sus imágenes
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="info" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="info">Información</TabsTrigger>
              <TabsTrigger value="images">Imágenes</TabsTrigger>
            </TabsList>

            <TabsContent value="info">
              <form onSubmit={handleUpdateProduct}>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-nombre">Nombre *</Label>
                    <Input id="edit-nombre" placeholder="Ej: Ibuprofeno 400mg" value={productForm.nombre} onChange={(e) => setProductForm({ ...productForm, nombre: e.target.value })} required/>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="edit-descripcion">Descripción</Label>
                    <Input id="edit-descripcion" placeholder="Descripción del producto" value={productForm.descripcion} onChange={(e) => setProductForm({ ...productForm, descripcion: e.target.value })}/>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="edit-precio">Precio *</Label>
                    <Input id="edit-precio" type="number" step="0.01" min="0" placeholder="0.00" value={productForm.precio} onChange={(e) => setProductForm({ ...productForm, precio: e.target.value })} required/>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="edit-stock">Stock</Label>
                    <Input id="edit-stock" type="number" min="0" placeholder="0" value={productForm.stock} onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })}/>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="edit-descuento">Descuento (%)</Label>
                    <Input id="edit-descuento" type="number" step="0.01" min="0" max="100" placeholder="0" value={productForm.descuento} onChange={(e) => setProductForm({ ...productForm, descuento: e.target.value })}/>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="edit-category">Categoría *</Label>
                    <Select value={productForm.categoryId} onValueChange={(value) => setProductForm({ ...productForm, categoryId: value })} required>
                      <SelectTrigger id="edit-category">
                        <SelectValue placeholder="Selecciona una categoría"/>
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (<SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Selector de Receta */}
                  <div className="space-y-3 pt-2">
                    <Label className="text-base font-semibold">Tipo de Venta *</Label>
                    <RadioGroup 
                      value={productForm.requiresPrescription ? "rx" : "otc"}
                      onValueChange={(value) => setProductForm({ ...productForm, requiresPrescription: value === "rx" })}
                      className="grid grid-cols-2 gap-4"
                    >
                      {/* Opción: Venta Libre */}
                      <div className="relative">
                        <RadioGroupItem value="otc" id="edit-otc" className="peer sr-only" />
                        <Label
                          htmlFor="edit-otc"
                          className="flex flex-col items-center justify-between rounded-xl border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-green-600 peer-data-[state=checked]:bg-green-50 cursor-pointer transition-all hover:scale-105"
                        >
                          <div className="flex items-center gap-3 w-full">
                            <div className="p-2 rounded-lg bg-green-100">
                              <CheckCircle className="h-6 w-6 text-green-600" />
                            </div>
                            <div className="flex-1 text-left">
                              <div className="font-bold text-sm">Venta Libre</div>
                              <div className="text-xs text-muted-foreground mt-1">Sin receta médica</div>
                            </div>
                          </div>
                        </Label>
                      </div>

                      {/* Opción: Requiere Receta */}
                      <div className="relative">
                        <RadioGroupItem value="rx" id="edit-rx" className="peer sr-only" />
                        <Label
                          htmlFor="edit-rx"
                          className="flex flex-col items-center justify-between rounded-xl border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-red-600 peer-data-[state=checked]:bg-red-50 cursor-pointer transition-all hover:scale-105"
                        >
                          <div className="flex items-center gap-3 w-full">
                            <div className="p-2 rounded-lg bg-red-100">
                              <Pill className="h-6 w-6 text-red-600" />
                            </div>
                            <div className="flex-1 text-left">
                              <div className="font-bold text-sm">Bajo Receta</div>
                              <div className="text-xs text-muted-foreground mt-1">Requiere prescripción</div>
                            </div>
                          </div>
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>
                
                <DialogFooter className="mt-6">
                  <Button type="button" variant="outline" onClick={() => {
                setEditProductModalOpen(false);
                setSelectedProduct(null);
            }}>
                    Cancelar
                  </Button>
                  <Button type="submit">Guardar Cambios</Button>
                </DialogFooter>
              </form>
            </TabsContent>

            <TabsContent value="images">
              {selectedProduct && (
                <div className="py-4">
                  <ProductImageManager productId={selectedProduct.id} />
                </div>
              )}
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      {/* Modal de Crear Categoría */}
      <Dialog open={createCategoryModalOpen} onOpenChange={setCreateCategoryModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Crear Nueva Categoría</DialogTitle>
            <DialogDescription>
              Completa los datos de la nueva categoría para organizaryour productos
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreateCategory}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="create-cat-name">Nombre *</Label>
                <Input id="create-cat-name" placeholder="Ej: Medicamentos" value={categoryForm.name} onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })} required/>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="create-cat-description">Descripción</Label>
                <Input id="create-cat-description" placeholder="Descripción de la categoría" value={categoryForm.description} onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}/>
              </div>
            </div>
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setCreateCategoryModalOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit">Crear Categoría</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Modal de Editar Categoría */}
      <Dialog open={editCategoryModalOpen} onOpenChange={setEditCategoryModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Editar Categoría</DialogTitle>
            <DialogDescription>
              Modifica los datos de la categoría seleccionada
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUpdateCategory}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-cat-name">Nombre *</Label>
                <Input id="edit-cat-name" placeholder="Ej: Medicamentos" value={categoryForm.name} onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })} required/>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-cat-description">Descripción</Label>
                <Input id="edit-cat-description" placeholder="Descripción de la categoría" value={categoryForm.description} onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}/>
              </div>
            </div>
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => {
            setEditCategoryModalOpen(false);
            setSelectedCategory(null);
        }}>
                Cancelar
              </Button>
              <Button type="submit">Guardar Cambios</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>);
};
export default PharmacistDashboard;
