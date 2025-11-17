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
import { toast } from 'sonner';
import { useAppSelector } from '@/store/hooks';
import { selectUser } from '@/store/auth/authSlice';
import ProductImageManager from '@/components/ProductImageManager';
import { 
    useGetProductsQuery, 
    useCreateProductMutation, 
    useUpdateProductMutation, 
    useDeleteProductMutation 
} from '@/services/products';
import { 
    useGetCategoriesQuery, 
    useCreateCategoryMutation, 
    useUpdateCategoryMutation, 
    useDeleteCategoryMutation 
} from '@/services/categories';
import { 
    useGetAllOrdersQuery, 
    useUpdateOrderStatusMutation, 
    useMarkPickupCompleteMutation 
} from '@/services/orders';

const PharmacistDashboard = () => {
    const user = useAppSelector(selectUser);
    
    // RTK Query hooks
    const { data: products = [], isLoading: productsLoading } = useGetProductsQuery();
    const { data: categories = [], isLoading: categoriesLoading } = useGetCategoriesQuery();
    const { data: orders = [], isLoading: ordersLoading } = useGetAllOrdersQuery();
    
    const [deleteProduct] = useDeleteProductMutation();
    const [deleteCategory] = useDeleteCategoryMutation();
    const [updateOrderStatus] = useUpdateOrderStatusMutation();
    const [markPickupComplete] = useMarkPickupCompleteMutation();
    const [createProduct] = useCreateProductMutation();
    const [updateProduct] = useUpdateProductMutation();
    const [createCategory] = useCreateCategoryMutation();
    const [updateCategory] = useUpdateCategoryMutation();
    
    const loading = productsLoading || categoriesLoading || ordersLoading;
    
    // Calcular estadísticas
    const stats = {
        totalProducts: products.length,
        lowStockProducts: products.filter((p) => (p.stock || 0) < 10).length,
        pendingOrders: orders.filter((o) => o.status === 'PENDING').length,
        totalRevenue: orders.reduce((sum, o) => sum + (o.total || 0), 0),
    };
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
    
    // Handlers con RTK Query mutations
    const handleDeleteProduct = async (id) => {
        if (!confirm('¿Estás seguro de eliminar este producto?'))
            return;
        try {
            await deleteProduct(id).unwrap();
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
            await deleteCategory(id).unwrap();
            toast.success('Categoría eliminada exitosamente');
        }
        catch (error) {
            toast.error('Error al eliminar categoría');
        }
    };
    
    const handleUpdateOrderStatus = async (orderId, newStatus) => {
        try {
            await updateOrderStatus({ orderId, status: newStatus }).unwrap();
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
            const completedOrder = await markPickupComplete(orderId).unwrap();
            
            toast.success(
                completedOrder.requiresPrescription 
                    ? '✅ Entrega RX completada: medicamento entregado al cliente'
                    : '✅ Retiro completado exitosamente'
            );
        } catch (error) {
            console.error('Error al completar pickup:', error);
            toast.error(error.data?.message || 'Error al completar el retiro');
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
            const createdProduct = await createProduct(payload).unwrap();
            toast.success('Producto creado exitosamente');
            setNewlyCreatedProductId(createdProduct.id);
            // No cerrar el modal, mostrar gestor de imágenes
        }
        catch (error) {
            console.error('Error creating product:', error);
            toast.error(error.data?.message || 'Error al crear producto');
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
            await updateProduct({ id: selectedProduct.id, ...payload }).unwrap();
            toast.success('Producto actualizado exitosamente');
            setEditProductModalOpen(false);
            setSelectedProduct(null);
        }
        catch (error) {
            console.error('Error updating product:', error);
            toast.error(error.data?.message || 'Error al actualizar producto');
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
            await createCategory(payload).unwrap();
            toast.success('Categoría creada exitosamente');
            setCreateCategoryModalOpen(false);
        }
        catch (error) {
            console.error('Error creating category:', error);
            toast.error(error.data?.message || 'Error al crear categoría');
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
            await updateCategory({ id: selectedCategory.id, ...payload }).unwrap();
            toast.success('Categoría actualizada exitosamente');
            setEditCategoryModalOpen(false);
            setSelectedCategory(null);
        }
        catch (error) {
            console.error('Error updating category:', error);
            toast.error(error.data?.message || 'Error al actualizar categoría');
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
    return (<div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header Mejorado */}
        <div className="mb-8 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-emerald-500/10 rounded-2xl blur-3xl -z-10" />
          <div className="bg-white/80 backdrop-blur-sm border-2 border-primary/20 rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-4 bg-gradient-to-br from-primary to-emerald-600 rounded-2xl shadow-lg">
                  <Pill className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-emerald-600 bg-clip-text text-transparent">
                    Panel de Farmacéutico
                  </h1>
                  <p className="text-muted-foreground mt-1 font-medium">
                    👋 Bienvenido, {user?.name || user?.email}
                  </p>
                </div>
              </div>
              <div className="hidden md:flex items-center gap-3">
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Última actualización</p>
                  <p className="text-sm font-semibold">{new Date().toLocaleDateString('es-AR')}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards - Diseño Moderno */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5 mb-8">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 hover:shadow-lg transition-all duration-300 hover:scale-105">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-semibold text-blue-900">Total Productos</CardTitle>
              <div className="p-2 bg-blue-600 rounded-xl shadow-md">
                <Package className="h-5 w-5 text-white"/>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-900">{stats.totalProducts}</div>
              <p className="text-xs text-blue-700 font-medium mt-1">En catálogo</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200 hover:shadow-lg transition-all duration-300 hover:scale-105">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-semibold text-orange-900">Stock Bajo</CardTitle>
              <div className="p-2 bg-orange-600 rounded-xl shadow-md">
                <AlertCircle className="h-5 w-5 text-white"/>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-900">{stats.lowStockProducts}</div>
              <p className="text-xs text-orange-700 font-medium mt-1">Menos de 10 unidades</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 hover:shadow-lg transition-all duration-300 hover:scale-105">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-semibold text-purple-900">Pedidos Pendientes</CardTitle>
              <div className="p-2 bg-purple-600 rounded-xl shadow-md">
                <ShoppingCart className="h-5 w-5 text-white"/>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-900">{stats.pendingOrders}</div>
              <p className="text-xs text-purple-700 font-medium mt-1">Requieren atención</p>
            </CardContent>
          </Card>
          
          {/* Tarjeta de Pedidos RX */}
          <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-300 hover:shadow-lg transition-all duration-300 hover:scale-105">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-semibold text-red-900">Pedidos RX</CardTitle>
              <div className="p-2 bg-red-600 rounded-xl shadow-md">
                <Pill className="h-5 w-5 text-white"/>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-900">
                {orders.filter(o => o.deliveryMethod === 'PICKUP' && o.status !== 'COMPLETED' && o.status !== 'CANCELLED').length}
              </div>
              <p className="text-xs text-red-700 font-medium mt-1">Para retiro en farmacia</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 hover:shadow-lg transition-all duration-300 hover:scale-105">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-semibold text-green-900">Ingresos Totales</CardTitle>
              <div className="p-2 bg-green-600 rounded-xl shadow-md">
                <TrendingUp className="h-5 w-5 text-white"/>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-900">{formatPrice(stats.totalRevenue)}</div>
              <p className="text-xs text-green-700 font-medium mt-1">Ventas totales</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs - Diseño Mejorado */}
        <Tabs defaultValue="products" className="space-y-4">
          <TabsList className="bg-gradient-to-r from-primary/10 to-primary/5 border-2 border-primary/20 p-1">
            <TabsTrigger value="products" className="data-[state=active]:bg-white data-[state=active]:shadow-md">
              <Package className="mr-2 h-4 w-4"/>
              Productos
            </TabsTrigger>
            <TabsTrigger value="categories" className="data-[state=active]:bg-white data-[state=active]:shadow-md">
              <TrendingUp className="mr-2 h-4 w-4"/>
              Categorías
            </TabsTrigger>
            <TabsTrigger value="orders" className="data-[state=active]:bg-white data-[state=active]:shadow-md">
              <ShoppingCart className="mr-2 h-4 w-4"/>
              Pedidos
            </TabsTrigger>
            <TabsTrigger value="stock" className="data-[state=active]:bg-white data-[state=active]:shadow-md">
              <AlertCircle className="mr-2 h-4 w-4"/>
              Stock Bajo
            </TabsTrigger>
          </TabsList>

          {/* Products Tab */}
          <TabsContent value="products">
            <Card className="border-2 shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between bg-gradient-to-r from-blue-50 to-blue-100 border-b-2 border-blue-200">
                <div>
                  <CardTitle className="text-2xl font-bold text-blue-900 flex items-center gap-2">
                    <Package className="h-6 w-6" />
                    Gestión de Productos
                  </CardTitle>
                  <CardDescription className="text-blue-700 font-medium">
                    Administra el inventario de la farmacia
                  </CardDescription>
                </div>
                <Button 
                  onClick={handleOpenCreateProductModal}
                  className="bg-gradient-to-r from-primary to-emerald-600 hover:from-primary/90 hover:to-emerald-700 shadow-md hover:shadow-lg transition-all"
                >
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
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => handleOpenEditProductModal(product)}
                              className="hover:bg-blue-100 hover:text-blue-600 transition-colors"
                            >
                              <Edit className="h-4 w-4"/>
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => handleDeleteProduct(product.id)}
                              className="hover:bg-red-100 hover:text-red-600 transition-colors"
                            >
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
            <Card className="border-2 shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between bg-gradient-to-r from-purple-50 to-purple-100 border-b-2 border-purple-200">
                <div>
                  <CardTitle className="text-2xl font-bold text-purple-900 flex items-center gap-2">
                    <TrendingUp className="h-6 w-6" />
                    Gestión de Categorías
                  </CardTitle>
                  <CardDescription className="text-purple-700 font-medium">
                    Organiza los productos por categorías
                  </CardDescription>
                </div>
                <Button 
                  onClick={handleOpenCreateCategoryModal}
                  className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 shadow-md hover:shadow-lg transition-all"
                >
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
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => handleOpenEditCategoryModal(category)}
                              className="hover:bg-purple-100 hover:text-purple-600 transition-colors"
                            >
                              <Edit className="h-4 w-4"/>
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => handleDeleteCategory(category.id)}
                              className="hover:bg-red-100 hover:text-red-600 transition-colors"
                            >
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
            <Card className="border-2 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-green-50 to-green-100 border-b-2 border-green-200">
                <CardTitle className="text-2xl font-bold text-green-900 flex items-center gap-2">
                  <ShoppingCart className="h-6 w-6" />
                  Gestión de Pedidos
                </CardTitle>
                <CardDescription className="text-green-700 font-medium">
                  Administra los pedidos de clientes
                </CardDescription>
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
                            {/* Botones según estado del pedido */}
                            
                            {/* PENDING o CONFIRMED: Mostrar botón para procesar */}
                            {(order.status === 'PENDING' || order.status === 'CONFIRMED') && (
                              <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => handleUpdateOrderStatus(order.id, 'PROCESSING')}
                                className="bg-blue-50 hover:bg-blue-100 border-blue-200 hover:text-blue-800"
                              >
                                <Package className="mr-1 h-3 w-3"/>
                                Procesar
                              </Button>
                            )}
                            
                            {/* PROCESSING: Mostrar botones según método de entrega */}
                            {order.status === 'PROCESSING' && (
                              <>
                                {order.deliveryMethod === 'PICKUP' ? (
                                  <Button 
                                    variant={order.requiresPrescription ? 'default' : 'outline'}
                                    className={order.requiresPrescription ? 'bg-red-600 hover:bg-red-700 text-white' : 'bg-green-50 hover:bg-green-100 border-green-200'}
                                    size="sm" 
                                    onClick={() => handleMarkPickupComplete(order.id)}
                                  >
                                    <CheckCircle className="mr-1 h-3 w-3"/>
                                    {order.requiresPrescription ? '⚕️ Entregar RX' : '✓ Entregar'}
                                  </Button>
                                ) : order.deliveryMethod === 'DELIVERY' ? (
                                  <Button 
                                    variant="outline" 
                                    size="sm" 
                                    onClick={() => handleUpdateOrderStatus(order.id, 'COMPLETED')}
                                    className="bg-green-50 hover:bg-green-100 border-green-200"
                                  >
                                    <CheckCircle className="mr-1 h-3 w-3"/>
                                    Marcar Enviado
                                  </Button>
                                ) : (
                                  <Button 
                                    variant="outline" 
                                    size="sm" 
                                    onClick={() => handleUpdateOrderStatus(order.id, 'COMPLETED')}
                                    className="bg-green-50 hover:bg-green-100 border-green-200  hover:text-green-800"
                                  >
                                    <CheckCircle className="mr-1 h-3 w-3"/>
                                    Completar
                                  </Button>
                                )}
                              </>
                            )}

                            {order.status === 'COMPLETED' && (
                              <Badge variant="secondary" className="bg-green-100 hover:text-green-800">
                                ✓ Completado
                              </Badge>
                            )}

                            {order.status === 'CANCELLED' && (
                              <Badge variant="destructive">
                                ✗ Cancelado
                              </Badge>
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
            <Card className="border-2 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-orange-50 to-orange-100 border-b-2 border-orange-200">
                <CardTitle className="text-2xl font-bold text-orange-900 flex items-center gap-2">
                  <AlertCircle className="h-6 w-6" />
                  Productos con Stock Bajo
                </CardTitle>
                <CardDescription className="text-orange-700 font-medium">
                  Productos que requieren reabastecimiento (menos de 10 unidades)
                </CardDescription>
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
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleOpenEditProductModal(product)}
                              className="bg-orange-50 hover:bg-orange-100 border-orange-200 text-orange-700 hover:text-orange-800 font-semibold"
                            >
                              <Package className="mr-1 h-3 w-3"/>
                              Editar Stock
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
