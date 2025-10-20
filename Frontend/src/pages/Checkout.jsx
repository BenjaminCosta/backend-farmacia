import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { formatPrice } from '@/lib/formatPrice';
import { toast } from 'sonner';
import apiClient from '@/lib/axios';
const Checkout = () => {
    const navigate = useNavigate();
    const { items, totalPrice, clearCart } = useCart();
    const { isAuthenticated } = useAuth();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        zipCode: '',
        deliveryMethod: 'delivery',
        paymentMethod: 'cash',
    });
    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isAuthenticated) {
            toast.error('Debes iniciar sesión para finalizar la compra');
            navigate('/login');
            return;
        }
        if (items.length === 0) {
            toast.error('El carrito está vacío');
            return;
        }
        setLoading(true);
        try {
            const orderData = {
                items: items.map((item) => ({
                    productId: item.id,
                    quantity: item.quantity,
                    price: item.price,
                })),
                shippingAddress: {
                    fullName: formData.fullName,
                    address: formData.address,
                    city: formData.city,
                    zipCode: formData.zipCode,
                    phone: formData.phone,
                },
                deliveryMethod: formData.deliveryMethod,
                paymentMethod: formData.paymentMethod,
            };
            const response = await apiClient.post('/orders', orderData);
            clearCart();
            toast.success('¡Pedido realizado con éxito!');
            navigate(`/orders/${response.data.id}`);
        }
        catch (error) {
            console.error('Error creating order:', error);
            toast.error(error.response?.data?.message || 'Error al procesar el pedido');
        }
        finally {
            setLoading(false);
        }
    };
    if (items.length === 0) {
        return (<div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Tu carrito está vacío</h2>
          <Button onClick={() => navigate('/catalog')}>Ver Productos</Button>
        </div>
      </div>);
    }
    return (<div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">Finalizar Compra</h1>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Contact Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Información de Contacto</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="fullName">Nombre Completo *</Label>
                    <Input id="fullName" name="fullName" value={formData.fullName} onChange={handleInputChange} required/>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="email">Email *</Label>
                      <Input id="email" name="email" type="email" value={formData.email} onChange={handleInputChange} required/>
                    </div>
                    <div>
                      <Label htmlFor="phone">Teléfono *</Label>
                      <Input id="phone" name="phone" type="tel" value={formData.phone} onChange={handleInputChange} required/>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Delivery Method */}
              <Card>
                <CardHeader>
                  <CardTitle>Método de Entrega</CardTitle>
                </CardHeader>
                <CardContent>
                  <RadioGroup value={formData.deliveryMethod} onValueChange={(value) => setFormData({ ...formData, deliveryMethod: value })}>
                    <div className="flex items-center space-x-2 mb-3">
                      <RadioGroupItem value="delivery" id="delivery"/>
                      <Label htmlFor="delivery" className="cursor-pointer">
                        Envío a domicilio (Gratis)
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="pickup" id="pickup"/>
                      <Label htmlFor="pickup" className="cursor-pointer">
                        Retiro en farmacia
                      </Label>
                    </div>
                  </RadioGroup>

                  {formData.deliveryMethod === 'delivery' && (<div className="mt-6 space-y-4">
                      <div>
                        <Label htmlFor="address">Dirección *</Label>
                        <Input id="address" name="address" value={formData.address} onChange={handleInputChange} required/>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="city">Ciudad *</Label>
                          <Input id="city" name="city" value={formData.city} onChange={handleInputChange} required/>
                        </div>
                        <div>
                          <Label htmlFor="zipCode">Código Postal *</Label>
                          <Input id="zipCode" name="zipCode" value={formData.zipCode} onChange={handleInputChange} required/>
                        </div>
                      </div>
                    </div>)}
                </CardContent>
              </Card>

              {/* Payment Method */}
              <Card>
                <CardHeader>
                  <CardTitle>Método de Pago</CardTitle>
                </CardHeader>
                <CardContent>
                  <RadioGroup value={formData.paymentMethod} onValueChange={(value) => setFormData({ ...formData, paymentMethod: value })}>
                    <div className="flex items-center space-x-2 mb-3">
                      <RadioGroupItem value="cash" id="cash"/>
                      <Label htmlFor="cash" className="cursor-pointer">
                        Efectivo (Pago contra entrega)
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="card" id="card"/>
                      <Label htmlFor="card" className="cursor-pointer">
                        Tarjeta de débito/crédito
                      </Label>
                    </div>
                  </RadioGroup>
                </CardContent>
              </Card>
            </div>

            {/* Order Summary */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Resumen del Pedido</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {items.map((item) => (<div key={item.id} className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        {item.name} x{item.quantity}
                      </span>
                      <span>{formatPrice(item.price * item.quantity)}</span>
                    </div>))}
                  <div className="border-t pt-4">
                    <div className="flex justify-between mb-2">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span>{formatPrice(totalPrice)}</span>
                    </div>
                    <div className="flex justify-between mb-4">
                      <span className="text-muted-foreground">Envío</span>
                      <span className="text-primary">Gratis</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-semibold">Total</span>
                      <span className="text-2xl font-bold text-primary">{formatPrice(totalPrice)}</span>
                    </div>
                  </div>
                  <Button type="submit" className="w-full" size="lg" disabled={loading}>
                    {loading ? 'Procesando...' : 'Confirmar Pedido'}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </div>);
};
export default Checkout;
