import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, AlertCircle, Package, RefreshCw, Filter, Pill, ShoppingBag } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ProductCard from '@/components/ProductCard';
import Loader from '@/components/Loader';
import client from '@/api/client';
import { normalizeProducts, normalizeCategories } from '@/lib/adapters';

const Catalog = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
    const [rxFilter, setRxFilter] = useState(searchParams.get('rx') || 'all'); // 🔴 Nuevo: filtro RX
    
    const categoryId = searchParams.get('categoryId');
    const page = parseInt(searchParams.get('page') || '0');
    const size = parseInt(searchParams.get('size') || '12');
    useEffect(() => {
        fetchCategories();
    }, []);
    
    useEffect(() => {
        fetchProducts();
    }, [categoryId, searchQuery, page, size, rxFilter]); // 🔴 Agregar rxFilter a dependencias
    const fetchCategories = async () => {
        try {
            const response = await client.get('/api/v1/categories');
            setCategories(normalizeCategories(response.data));
        }
        catch (error) {
            console.error('Error fetching categories:', error);
        }
    };
    const fetchProducts = async () => {
        setLoading(true);
        setError(null);
        try {
            const params = new URLSearchParams();
            if (categoryId)
                params.append('categoryId', categoryId);
            if (searchQuery)
                params.append('q', searchQuery);
            // 🔴 Agregar filtro RX al backend
            if (rxFilter === 'rx') {
                params.append('rx', 'true');
            } else if (rxFilter === 'otc') {
                params.append('rx', 'false');
            }
            params.append('page', page.toString());
            params.append('size', size.toString());
            
            const response = await client.get(`/api/v1/products?${params.toString()}`);
            setProducts(normalizeProducts(response.data));
        }
        catch (error) {
            console.error('Error fetching products:', error);
            setError({
                title: 'Error al cargar productos',
                message: error.response?.data?.message || 'No se pudo conectar con el servidor. Por favor, intenta nuevamente.',
                code: error.response?.status
            });
            setProducts([]);
        }
        finally {
            setLoading(false);
        }
    };
    const handleSearch = (e) => {
        e.preventDefault();
        const params = new URLSearchParams(searchParams);
        if (searchQuery) {
            params.set('q', searchQuery);
        }
        else {
            params.delete('q');
        }
        params.set('page', '0');
        setSearchParams(params);
    };
    const handleCategoryChange = (value) => {
        const params = new URLSearchParams(searchParams);
        if (value === 'all') {
            params.delete('categoryId');
        }
        else {
            params.set('categoryId', value);
        }
        params.set('page', '0');
        setSearchParams(params);
    };
    
    // 🔴 Nuevo handler para filtro RX
    const handleRxFilterChange = (value) => {
        setRxFilter(value);
        const params = new URLSearchParams(searchParams);
        if (value === 'all') {
            params.delete('rx');
        } else {
            params.set('rx', value);
        }
        params.set('page', '0');
        setSearchParams(params);
    };
    
    return (<div className="min-h-screen bg-gradient-to-b from-background via-background to-secondary/10">
      <div className="container mx-auto px-4 py-10 md:py-12">
        {/* Header */}
        <div className="mb-12 text-center md:text-left">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 bg-gradient-to-r from-primary via-foreground to-primary/70 bg-clip-text text-transparent leading-tight">
            Catálogo de Productos
          </h1>
          <p className="text-muted-foreground text-base md:text-lg max-w-2xl">
            Descubre nuestra amplia selección de productos para tu salud y bienestar
          </p>
        </div>

        {/* Filters */}
        <div className="mb-10 space-y-4 bg-card/80 backdrop-blur-md rounded-2xl border border-border/60 p-6 md:p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5 z-10 pointer-events-none"/>
              <Input type="text" placeholder="Buscar productos por nombre..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-11 h-12 border-border/60 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 bg-background/50"/>
            </div>
            <Button type="submit" size="lg" className="h-12 px-8 font-semibold shadow-md hover:shadow-lg hover:scale-[1.02] transition-all duration-300 whitespace-nowrap">
              <Search className="mr-2 h-4 w-4"/>
              Buscar
            </Button>
          </form>

          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center pt-2">
            <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              <Filter className="h-4 w-4"/>
              Filtrar por:
            </div>
            <Select value={categoryId || 'all'} onValueChange={handleCategoryChange}>
              <SelectTrigger className="w-full sm:w-[260px] h-11 border-border/60 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 bg-background/50 font-medium">
                <SelectValue placeholder="Categoría"/>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all" className="font-semibold">✨ Todas las categorías</SelectItem>
                {categories.map((cat) => (<SelectItem key={cat.id} value={cat.id} className="font-medium">
                    {cat.name}
                  </SelectItem>))}
              </SelectContent>
            </Select>
          </div>
          
          {/* 🔴 NUEVO: Filtro RX/OTC Moderno con Tabs */}
          <div className="pt-4 border-t border-border/40">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                <Pill className="h-4 w-4"/>
                Tipo de Producto:
              </div>
              <Tabs value={rxFilter} onValueChange={handleRxFilterChange} className="w-full sm:w-auto">
                <TabsList className="grid w-full sm:w-auto grid-cols-3 h-11 bg-secondary/50 p-1">
                  <TabsTrigger 
                    value="all" 
                    className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-semibold px-6 transition-all duration-200"
                  >
                    <Package className="mr-2 h-4 w-4" />
                    Todos
                  </TabsTrigger>
                  <TabsTrigger 
                    value="otc" 
                    className="data-[state=active]:bg-green-600 data-[state=active]:text-white font-semibold px-6 transition-all duration-200"
                  >
                    <ShoppingBag className="mr-2 h-4 w-4" />
                    Venta Libre
                  </TabsTrigger>
                  <TabsTrigger 
                    value="rx" 
                    className="data-[state=active]:bg-red-600 data-[state=active]:text-white font-semibold px-6 transition-all duration-200"
                  >
                    <Pill className="mr-2 h-4 w-4" />
                    Bajo Receta
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            
            {/* Info badge según filtro activo */}
            {rxFilter === 'rx' && (
              <div className="mt-3 flex items-center gap-2 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-4 py-2.5">
                <Pill className="h-4 w-4" />
                <span className="font-medium">
                  Mostrando solo medicamentos <strong>bajo receta médica (RX)</strong>. Requieren retiro en farmacia.
                </span>
              </div>
            )}
            {rxFilter === 'otc' && (
              <div className="mt-3 flex items-center gap-2 text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg px-4 py-2.5">
                <ShoppingBag className="h-4 w-4" />
                <span className="font-medium">
                  Mostrando productos de <strong>venta libre (OTC)</strong>. Disponibles para envío a domicilio.
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Error State */}
        {error && (<Alert variant="destructive" className="mb-10 shadow-xl border-2 rounded-xl">
            <AlertCircle className="h-5 w-5"/>
            <AlertTitle className="font-bold text-lg">{error.title}</AlertTitle>
            <AlertDescription className="mt-2 space-y-3">
              <p className="text-sm">{error.message}</p>
              {error.code && (<p className="text-xs opacity-75">Código de error: {error.code}</p>)}
              <Button variant="outline" size="sm" onClick={fetchProducts} className="mt-2 font-semibold hover:scale-105 transition-transform duration-200">
                <RefreshCw className="mr-2 h-4 w-4"/>
                Reintentar
              </Button>
            </AlertDescription>
          </Alert>)}

        {/* Products Grid */}
        {loading ? (<div className="py-24">
            <Loader />
          </div>) : products.length > 0 ? (<>
            <div className="mb-6 flex items-center justify-between px-1">
              <p className="text-sm md:text-base text-muted-foreground font-semibold">
                {products.length} producto{products.length !== 1 ? 's' : ''} encontrado{products.length !== 1 ? 's' : ''}
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
              {products.map((product) => (<ProductCard key={product.id} {...product}/>))}
            </div>
          </>) : !error && (<div className="flex flex-col items-center justify-center py-24 px-4">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-secondary to-secondary/50 flex items-center justify-center mb-6 shadow-xl">
              <Package className="h-12 w-12 text-muted-foreground"/>
            </div>
            <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-3">No se encontraron productos</h3>
            <p className="text-muted-foreground text-center max-w-md mb-8 text-sm md:text-base">
              {searchQuery || categoryId
                ? 'Intenta ajustar tus filtros de búsqueda o explorar otras categorías'
                : 'Actualmente no hay productos disponibles en el catálogo'}
            </p>
            {(searchQuery || categoryId) && (<Button variant="outline" onClick={() => {
                setSearchQuery('');
                setSearchParams({});
              }} className="font-semibold hover:scale-105 transition-transform duration-200">
                Limpiar filtros
              </Button>)}
          </div>)}
      </div>
    </div>);
};
export default Catalog;
