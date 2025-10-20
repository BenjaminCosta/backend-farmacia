import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Minus, Plus, ShoppingCart, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/lib/formatPrice';
import Loader from '@/components/Loader';
import apiClient from '@/lib/axios';
const ProductDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addItem } = useCart();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    useEffect(() => {
        fetchProduct();
    }, [id]);
    const fetchProduct = async () => {
        try {
            const response = await apiClient.get(`/products/${id}`);
            setProduct(response.data);
        }
        catch (error) {
            console.error('Error fetching product:', error);
            // Mock data for development
            setProduct({
                id: id || '1',
                name: 'Ibuprofeno 400mg',
                price: 250000,
                description: 'Analgésico y antiinflamatorio de acción rápida. Alivia el dolor y reduce la fiebre.',
                stock: 50,
            });
        }
        finally {
            setLoading(false);
        }
    };
    const handleAddToCart = () => {
        if (product) {
            addItem({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
            }, quantity);
            navigate('/cart');
        }
    };
    const incrementQuantity = () => {
        setQuantity((prev) => prev + 1);
    };
    const decrementQuantity = () => {
        setQuantity((prev) => Math.max(1, prev - 1));
    };
    if (loading) {
        return <Loader />;
    }
    if (!product) {
        return (<div className="container mx-auto px-4 py-8 text-center">
        <p className="text-muted-foreground">Producto no encontrado</p>
        <Button onClick={() => navigate('/catalog')} className="mt-4">
          Volver al Catálogo
        </Button>
      </div>);
    }
    return (<div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4"/>
          Volver
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image */}
          <div className="aspect-square bg-secondary rounded-lg overflow-hidden">
            {product.image ? (<img src={product.image} alt={product.name} className="w-full h-full object-cover"/>) : (<div className="w-full h-full flex items-center justify-center">
                <span className="text-muted-foreground">Sin imagen disponible</span>
              </div>)}
          </div>

          {/* Details */}
          <div>
            <h1 className="text-4xl font-bold mb-4">{product.name}</h1>
            <p className="text-3xl font-bold text-primary mb-6">{formatPrice(product.price)}</p>

            {product.description && (<div className="mb-6">
                <h2 className="text-xl font-semibold mb-2">Descripción</h2>
                <p className="text-muted-foreground">{product.description}</p>
              </div>)}

            {product.stock !== undefined && (<p className="text-muted-foreground mb-6">Stock disponible: {product.stock} unidades</p>)}

            <Card className="mb-6">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="font-semibold">Cantidad:</span>
                  <div className="flex items-center space-x-4">
                    <Button variant="outline" size="icon" onClick={decrementQuantity} disabled={quantity <= 1}>
                      <Minus className="h-4 w-4"/>
                    </Button>
                    <span className="text-xl font-bold w-12 text-center">{quantity}</span>
                    <Button variant="outline" size="icon" onClick={incrementQuantity} disabled={product.stock !== undefined && quantity >= product.stock}>
                      <Plus className="h-4 w-4"/>
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <span className="font-semibold">Subtotal:</span>
                  <span className="text-2xl font-bold text-primary">
                    {formatPrice(product.price * quantity)}
                  </span>
                </div>

                <Button onClick={handleAddToCart} className="w-full" size="lg">
                  <ShoppingCart className="mr-2 h-5 w-5"/>
                  Agregar al Carrito
                </Button>
              </CardContent>
            </Card>

            <div className="text-sm text-muted-foreground space-y-2">
              <p>✓ Envío a domicilio disponible</p>
              <p>✓ Retiro en farmacia sin costo</p>
              <p>✓ Productos certificados y originales</p>
            </div>
          </div>
        </div>
      </div>
    </div>);
};
export default ProductDetail;
