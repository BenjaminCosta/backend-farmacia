import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import ProductCard from '@/components/ProductCard';
import Loader from '@/components/Loader';
import apiClient from '@/lib/axios';
import { normalizeProducts, normalizeCategories } from '@/lib/adapters';

interface Product {
  id: string;
  name: string;
  price: number;
  image?: string;
  description?: string;
}

interface Category {
  id: string;
  name: string;
}

const Catalog = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
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
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (categoryId) params.append('categoryId', categoryId);
      if (searchQuery) params.append('q', searchQuery);
      params.append('page', page.toString());
      params.append('size', size.toString());

      const response = await apiClient.get(`/products?${params.toString()}`);
      setProducts(normalizeProducts(response.data));
    } catch (error) {
      console.error('Error fetching products:', error);
      // Mock data for development
      setProducts([
        {
          id: '1',
          name: 'Ibuprofeno 400mg',
          price: 250000,
          description: 'Analgésico y antiinflamatorio',
        },
        {
          id: '2',
          name: 'Vitamina C 1000mg',
          price: 180000,
          description: 'Suplemento vitamínico',
        },
        {
          id: '3',
          name: 'Protector Solar FPS 50',
          price: 350000,
          description: 'Protección solar completa',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams);
    if (searchQuery) {
      params.set('q', searchQuery);
    } else {
      params.delete('q');
    }
    params.set('page', '0');
    setSearchParams(params);
  };

  const handleCategoryChange = (value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value === 'all') {
      params.delete('categoryId');
    } else {
      params.set('categoryId', value);
    }
    params.set('page', '0');
    setSearchParams(params);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">Catálogo de Productos</h1>

        {/* Filters */}
        <div className="mb-8 space-y-4">
          <form onSubmit={handleSearch} className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                type="text"
                placeholder="Buscar productos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button type="submit">Buscar</Button>
          </form>

          <div className="flex gap-4">
            <Select value={categoryId || 'all'} onValueChange={handleCategoryChange}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Categoría" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las categorías</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Products Grid */}
        {loading ? (
          <Loader />
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">No se encontraron productos</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Catalog;
