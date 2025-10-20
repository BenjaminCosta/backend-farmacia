import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, AlertCircle, Package, RefreshCw, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import ProductCard from '@/components/ProductCard';
import Loader from '@/components/Loader';
import apiClient from '@/lib/axios';
import { normalizeProducts, normalizeCategories } from '@/lib/adapters';
const Catalog = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
    const categoryId = searchParams.get('categoryId');
    const page = parseInt(searchParams.get('page') || '0');
    const size = parseInt(searchParams.get('size') || '12');
    useEffect(() => {
        fetchCategories();
    }, []);
    useEffect(() => {
        fetchProducts();
    }, [categoryId, searchQuery, page, size]);
    const fetchCategories = async () => {
        try {
            const response = await apiClient.get('/categories');
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
            params.append('page', page.toString());
            params.append('size', size.toString());
            const response = await apiClient.get(`/products?${params.toString()}`);
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
    return (<div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-3 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Catálogo de Productos
          </h1>
          <p className="text-muted-foreground text-lg">
            Descubre nuestra amplia selección de productos para tu salud y bienestar
          </p>
        </div>

        {/* Filters */}
        <div className="mb-8 space-y-4 bg-card/50 backdrop-blur-sm rounded-xl border border-border/50 p-6 shadow-sm">
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5 z-10"/>
              <Input type="text" placeholder="Buscar productos por nombre..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-11 h-11 border-border/50 focus:border-primary transition-colors"/>
            </div>
            <Button type="submit" size="lg" className="font-semibold shadow-md hover:shadow-lg transition-all duration-300 whitespace-nowrap">
              <Search className="mr-2 h-4 w-4"/>
              Buscar
            </Button>
          </form>

          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <Filter className="h-4 w-4"/>
              Filtrar por:
            </div>
            <Select value={categoryId || 'all'} onValueChange={handleCategoryChange}>
              <SelectTrigger className="w-full sm:w-[240px] border-border/50 focus:border-primary transition-colors">
                <SelectValue placeholder="Categoría"/>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all" className="font-medium">Todas las categorías</SelectItem>
                {categories.map((cat) => (<SelectItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </SelectItem>))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Error State */}
        {error && (<Alert variant="destructive" className="mb-8 shadow-lg border-2">
            <AlertCircle className="h-5 w-5"/>
            <AlertTitle className="font-bold text-lg">{error.title}</AlertTitle>
            <AlertDescription className="mt-2 space-y-3">
              <p className="text-sm">{error.message}</p>
              {error.code && (<p className="text-xs opacity-75">Código de error: {error.code}</p>)}
              <Button variant="outline" size="sm" onClick={fetchProducts} className="mt-2 font-semibold">
                <RefreshCw className="mr-2 h-4 w-4"/>
                Reintentar
              </Button>
            </AlertDescription>
          </Alert>)}

        {/* Products Grid */}
        {loading ? (<div className="py-20">
            <Loader />
          </div>) : products.length > 0 ? (<>
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm text-muted-foreground font-medium">
                {products.length} producto{products.length !== 1 ? 's' : ''} encontrado{products.length !== 1 ? 's' : ''}
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (<ProductCard key={product.id} {...product}/>))}
            </div>
          </>) : !error && (<div className="flex flex-col items-center justify-center py-20 px-4">
            <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center mb-6 shadow-lg">
              <Package className="h-10 w-10 text-muted-foreground"/>
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-2">No se encontraron productos</h3>
            <p className="text-muted-foreground text-center max-w-md mb-6">
              {searchQuery || categoryId
                ? 'Intenta ajustar tus filtros de búsqueda o explorar otras categorías'
                : 'Actualmente no hay productos disponibles en el catálogo'}
            </p>
            {(searchQuery || categoryId) && (<Button variant="outline" onClick={() => {
                setSearchQuery('');
                setSearchParams({});
              }} className="font-semibold">
                Limpiar filtros
              </Button>)}
          </div>)}
      </div>
    </div>);
};
export default Catalog;
