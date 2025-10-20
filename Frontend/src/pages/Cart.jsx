import { useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/lib/formatPrice';
const Cart = () => {
    const navigate = useNavigate();
    const { items, removeItem, updateQuantity, totalPrice, totalItems } = useCart();
    if (items.length === 0) {
        return (<div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <ShoppingBag className="h-24 w-24 text-muted-foreground mx-auto mb-4"/>
          <h2 className="text-2xl font-bold mb-2">Tu carrito está vacío</h2>
          <p className="text-muted-foreground mb-6">Agregá productos para comenzar tu compra</p>
          <Button onClick={() => navigate('/catalog')}>
            Ver Productos
          </Button>
        </div>
      </div>);
    }
    return (<div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">Carrito de Compras</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (<Card key={item.id}>
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    {/* Image */}
                    <div className="w-24 h-24 bg-secondary rounded-lg overflow-hidden flex-shrink-0">
                      {item.image ? (<img src={item.image} alt={item.name} className="w-full h-full object-cover"/>) : (<div className="w-full h-full flex items-center justify-center">
                          <span className="text-xs text-muted-foreground">Sin imagen</span>
                        </div>)}
                    </div>

                    {/* Details */}
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-2">{item.name}</h3>
                      <p className="text-primary font-bold mb-4">{formatPrice(item.price)}</p>

                      <div className="flex items-center justify-between">
                        {/* Quantity Controls */}
                        <div className="flex items-center space-x-3">
                          <Button variant="outline" size="icon" onClick={() => updateQuantity(item.id, item.quantity - 1)}>
                            <Minus className="h-4 w-4"/>
                          </Button>
                          <span className="font-semibold w-8 text-center">{item.quantity}</span>
                          <Button variant="outline" size="icon" onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                            <Plus className="h-4 w-4"/>
                          </Button>
                        </div>

                        {/* Remove Button */}
                        <Button variant="ghost" size="icon" onClick={() => removeItem(item.id)} className="text-destructive">
                          <Trash2 className="h-4 w-4"/>
                        </Button>
                      </div>
                    </div>

                    {/* Subtotal */}
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground mb-1">Subtotal</p>
                      <p className="text-lg font-bold">{formatPrice(item.price * item.quantity)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>))}
          </div>

          {/* Order Summary */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Resumen del Pedido</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Productos ({totalItems})</span>
                  <span className="font-semibold">{formatPrice(totalPrice)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Envío</span>
                  <span className="font-semibold text-primary">Gratis</span>
                </div>
                <div className="border-t pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold">Total</span>
                    <span className="text-2xl font-bold text-primary">{formatPrice(totalPrice)}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col gap-3">
                <Button onClick={() => navigate('/checkout')} className="w-full" size="lg">
                  Continuar con la Compra
                </Button>
                <Button onClick={() => navigate('/catalog')} variant="outline" className="w-full">
                  Seguir Comprando
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>);
};
export default Cart;
