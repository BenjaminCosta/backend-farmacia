import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Minus, Plus, ShoppingCart, ArrowLeft, AlertCircle, Pill, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { useAppDispatch } from '@/store/hooks';
import { addItem } from '@/store/cart/cartSlice';
import { formatPrice } from '@/lib/formatPrice';
import Loader from '@/components/Loader';
import { useGetProductQuery, useGetProductImagesQuery } from '@/services/products';
import ProductImageGallery from '@/components/ProductImageGallery';

const ProductDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const [quantity, setQuantity] = useState(1);
    
    // RTK Query para producto e imágenes
    const { data: product, isLoading: loadingProduct } = useGetProductQuery(id);
    const { data: images = [], isLoading: loadingImages } = useGetProductImagesQuery(id);
    
    const loading = loadingProduct;
    const handleAddToCart = () => {
        if (product) {
            dispatch(addItem({
                productId: product.id,
                name: product.name,
                price: product.price,
                quantity: quantity,
            }));
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
          {/* Image Gallery */}
          <div className="sticky top-4 h-fit">
            {loadingImages ? (
              <div className="aspect-square bg-secondary rounded-lg flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            ) : (
              <ProductImageGallery productId={id} images={images} />
            )}
          </div>

          {/* Details */}
          <div>
            <div className="flex items-start justify-between mb-4">
              <h1 className="text-4xl font-bold flex-1">{product.name}</h1>
              {/* 🔴 Badge RX o OTC */}
              {product.requiresPrescription ? (
                <Badge className="bg-gradient-to-r from-red-600 to-red-700 text-white border-2 border-red-400 px-4 py-2 text-base font-bold shadow-lg">
                  <Pill className="mr-2 h-5 w-5" />
                  RECETA
                </Badge>
              ) : (
                <Badge className="bg-gradient-to-r from-green-600 to-green-700 text-white border-2 border-green-400 px-3 py-1.5 text-sm font-semibold">
                  ✓ Venta Libre
                </Badge>
              )}
            </div>
            
            <p className="text-3xl font-bold text-primary mb-6">{formatPrice(product.price)}</p>
            
            {/* 🔴 Alert RX - Información importante */}
            {product.requiresPrescription && (
              <Alert className="mb-6 border-2 border-red-500 bg-red-50">
                <AlertCircle className="h-5 w-5 text-red-600" />
                <AlertTitle className="text-red-900 font-bold text-lg">
                  Medicamento bajo receta médica
                </AlertTitle>
                <AlertDescription className="text-red-800 space-y-2 mt-2">
                  <p className="font-semibold">
                    ⚕️ Este producto requiere prescripción médica válida.
                  </p>
                  <div className="bg-white/60 rounded-md p-3 mt-2 space-y-1 text-sm">
                    <p className="flex items-center gap-2">
                      <Home className="h-4 w-4" />
                      <strong>Solo retiro en farmacia:</strong> No disponible para envío a domicilio
                    </p>
                    <p className="flex items-center gap-2">
                      <Pill className="h-4 w-4" />
                      <strong>Debe presentar receta:</strong> Al momento de retirar el producto
                    </p>
                  </div>
                </AlertDescription>
              </Alert>
            )}

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
              {product.requiresPrescription ? (
                <>
                  <p className="flex items-center gap-2 text-red-700 font-semibold">
                    <Home className="h-4 w-4" />
                    Solo retiro en farmacia (no disponible envío)
                  </p>
                  <p className="flex items-center gap-2">
                    <Pill className="h-4 w-4" />
                    Requiere presentación de receta médica
                  </p>
                  <p>✓ Productos certificados y originales</p>
                </>
              ) : (
                <>
                  <p>✓ Envío a domicilio disponible</p>
                  <p>✓ Retiro en farmacia sin costo</p>
                  <p>✓ Productos certificados y originales</p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>);
};
export default ProductDetail;
