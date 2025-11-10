import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Elements } from '@stripe/react-stripe-js';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { selectCartItems, selectCartTotal, clear as clearCart } from '@/store/cart/cartSlice';
import { selectIsAuthenticated } from '@/store/auth/authSlice';
import { createOrder, selectLastCreatedOrderId, clearLastCreatedId } from '@/store/orders/ordersSlice';
import { formatPrice } from '@/lib/formatPrice';
import { toast } from 'sonner';
import client from '@/api/client';
import stripePromise from '@/lib/stripe';
import PaymentMethodSelector from '@/components/checkout/PaymentMethodSelector';
import CardPaymentForm from '@/components/checkout/CardPaymentForm';
import { createPaymentIntent, confirmOrderPayment } from '@/api/payments';
import { Loader2 } from 'lucide-react';

// Configuración de moneda
const CURRENCY = 'USD'; // Usar USD para pruebas con Stripe
const SHIPPING_COST = 0; // Envío gratis

const Checkout = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    
    const items = useAppSelector(selectCartItems);
    const totalPrice = useAppSelector(selectCartTotal);
    const isAuthenticated = useAppSelector(selectIsAuthenticated);
    const lastCreatedOrderId = useAppSelector(selectLastCreatedOrderId);
    
    const [loading, setLoading] = useState(false);
    const [clientSecret, setClientSecret] = useState(null);
    const [createdOrderId, setCreatedOrderId] = useState(null);
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

    // Calcular monto total a pagar (única fuente de verdad)
    // Para pruebas con Stripe en USD, dividimos por 1000 (conversión aproximada ARS->USD)
    const payableAmount = CURRENCY === 'USD' 
        ? Math.round((totalPrice + SHIPPING_COST) / 1000 * 100) / 100 // Convertir ARS a USD aprox
        : totalPrice + SHIPPING_COST;

    // Verificar si volvemos de una redirección de Stripe
    useEffect(() => {
        const checkStripeReturn = async () => {
            const clientSecretParam = new URLSearchParams(window.location.search).get('payment_intent_client_secret');
            if (clientSecretParam) {
                console.log('🔄 Detectado retorno de Stripe con clientSecret:', clientSecretParam);
                setLoading(true);
                
                try {
                    const stripe = await stripePromise;
                    const { paymentIntent, error } = await stripe.retrievePaymentIntent(clientSecretParam);
                    
                    console.log('📊 PaymentIntent recuperado:', paymentIntent);
                    
                    if (error) {
                        console.error('❌ Error recuperando PaymentIntent:', error);
                        toast.error('Error al verificar el pago');
                        window.history.replaceState({}, document.title, '/checkout');
                    } else if (paymentIntent.status === 'succeeded') {
                        console.log('✅ Pago completado después de redirección, procesando orden...');
                        toast.success('Pago completado! Creando tu orden...');
                        
                        // Llamar a handlePaymentSuccess que recuperará los datos guardados
                        await handlePaymentSuccess(paymentIntent.id);
                    } else {
                        console.log('⚠️ PaymentIntent en estado:', paymentIntent.status);
                        toast.warning('El pago está pendiente de confirmación');
                        window.history.replaceState({}, document.title, '/checkout');
                    }
                } catch (error) {
                    console.error('❌ Error verificando PaymentIntent:', error);
                    toast.error('Error al procesar el pago');
                    window.history.replaceState({}, document.title, '/checkout');
                } finally {
                    setLoading(false);
                }
            }
        };
        
        checkStripeReturn();
    }, []);

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handlePaymentMethodChange = (method) => {
        setFormData({
            ...formData,
            paymentMethod: method,
        });
        // Reset states when changing payment method
        setClientSecret(null);
        setCreatedOrderId(null);
    };

    // Create Payment Intent when user selects card payment (BEFORE creating order)
    useEffect(() => {
        const initPaymentIntent = async () => {
            if (formData.paymentMethod === 'card' && !clientSecret && items.length > 0) {
                try {
                    // Create a temporary payment intent just with the amount
                    const response = await client.post('/api/v1/payments/create-intent-temp', {
                        amount: payableAmount,
                        currency: CURRENCY.toLowerCase(),
                    });
                    setClientSecret(response.data.clientSecret);
                    toast.success('Formulario de pago listo');
                } catch (error) {
                    console.error('Error creating payment intent:', error);
                    const message = error.response?.data?.message || 'Error al inicializar el pago';
                    toast.error(message);
                }
            }
        };

        initPaymentIntent();
    }, [formData.paymentMethod, payableAmount, items.length, clientSecret]);

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

        // Si es efectivo, crear orden directamente
        if (formData.paymentMethod === 'cash') {
            await createAndFinishOrder();
        }
        
        // Si es tarjeta, el formulario ya está visible, no hacer nada aquí
        // El pago se maneja en CardPaymentForm
    };

    const createAndFinishOrder = async () => {
        setLoading(true);
        try {
            const orderData = {
                fullName: formData.fullName,
                email: formData.email,
                phone: formData.phone,
                deliveryMethod: formData.deliveryMethod.toUpperCase(),
                paymentMethod: formData.paymentMethod.toUpperCase(),
                address: {
                    street: formData.address,
                    city: formData.city,
                    zip: formData.zipCode
                },
                items: items.map((item) => ({
                    productId: item.productId,
                    quantity: item.quantity
                }))
            };
            
            // Usar Redux para crear la orden
            const result = await dispatch(createOrder(orderData)).unwrap();
            
            // Limpiar carrito Redux
            dispatch(clearCart());
            
            toast.success('¡Pedido realizado con éxito!');
            
            // Navegar a /orders/:id usando el ID devuelto
            navigate(`/orders/${result.id}`);
        } catch (error) {
            console.error('Error creating order:', error);
            toast.error(error || 'Error al procesar el pedido');
        } finally {
            setLoading(false);
        }
    };

    const handlePaymentSuccess = async (paymentId) => {
        console.log('✅ handlePaymentSuccess llamado con paymentId:', paymentId);
        
        try {
            // Recuperar datos del formulario guardados (por si hubo redirección)
            const savedFormData = JSON.parse(localStorage.getItem('checkoutFormData') || '{}');
            const orderData = Object.keys(savedFormData).length > 0 ? savedFormData : formData;
            
            console.log('📦 Creando orden con datos:', orderData);

            // 1. Crear la orden usando Redux
            const orderPayload = {
                fullName: orderData.fullName,
                email: orderData.email,
                phone: orderData.phone,
                deliveryMethod: formData.deliveryMethod.toUpperCase(),
                paymentMethod: 'CARD',
                address: {
                    street: orderData.address,
                    city: orderData.city,
                    zip: orderData.zipCode
                },
                items: items.map(item => ({
                    productId: item.productId,
                    quantity: item.quantity
                }))
            };

            console.log('🚀 Creando orden con Redux:', orderPayload);
            const createdOrder = await dispatch(createOrder(orderPayload)).unwrap();
            console.log('📬 Orden creada:', createdOrder);

            // 2. Confirmar el pago asociado a la orden
            console.log(`💳 Confirmando pago para orden ${createdOrder.id}`);
            await client.post(`/api/v1/payments/orders/${createdOrder.id}/pay`, {
                paymentIntentId: paymentId
            });

            // Limpiar datos guardados
            localStorage.removeItem('checkoutFormData');
            localStorage.removeItem('pendingPaymentIntentId');

            // Limpiar carrito Redux
            dispatch(clearCart());
            
            toast.success('¡Pedido procesado exitosamente!');
            console.log('🎉 Navegando a /payment-success con orderId:', createdOrder.id);
            navigate(`/payment-success?orderId=${createdOrder.id}`);
        } catch (error) {
            console.error('❌ Error en handlePaymentSuccess:', error);
            toast.error('Error al procesar la orden');
        }
    };

    const handlePaymentError = (errorMessage) => {
        console.error('❌ handlePaymentError llamado:', errorMessage);
        toast.error(errorMessage || 'Error procesando el pago. Probá nuevamente.');
        // NO limpiar auth state, solo mostrar error
    };

    if (items.length === 0) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold mb-4">Tu carrito está vacío</h2>
                    <Button onClick={() => navigate('/catalog')}>Ver Productos</Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">Finalizar Compra</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2 space-y-6">
            <form onSubmit={handleSubmit}>
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

              {/* Payment Method Selector */}
              <PaymentMethodSelector
                value={formData.paymentMethod}
                onChange={handlePaymentMethodChange}
              />

              {/* Only show submit button for cash payments inside the form */}
              {formData.paymentMethod === 'cash' && (
                <Button type="submit" className="w-full mt-6" size="lg" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Procesando...
                    </>
                  ) : (
                    'Confirmar Pedido'
                  )}
                </Button>
              )}
            </form>

            {/* Card Payment Form - OUTSIDE the form to avoid nesting */}
            {formData.paymentMethod === 'card' && (
              <>
                {!clientSecret ? (
                  <Card className="border-border/50">
                    <CardContent className="py-8">
                      <div className="flex items-center justify-center gap-3 text-muted-foreground">
                        <Loader2 className="h-5 w-5 animate-spin" />
                        <span>Preparando el formulario de pago...</span>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <Elements 
                    stripe={stripePromise} 
                    options={{ clientSecret }}
                    key={clientSecret}
                  >
                    <CardPaymentForm
                      clientSecret={clientSecret}
                      amount={payableAmount}
                      currency={CURRENCY}
                      onSuccess={handlePaymentSuccess}
                      onError={handlePaymentError}
                      formData={formData}
                    />
                  </Elements>
                )}
              </>
            )}
          </div>

          {/* Order Summary */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Resumen del Pedido</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {items.map((item) => (<div key={item.productId} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      {item.name} x{item.quantity}
                    </span>
                    <span>{formatPrice(item.price * item.quantity)}</span>
                  </div>))}
                <div className="border-t pt-4">
                  <div className="flex justify-between mb-2">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>{formatPrice(totalPrice, CURRENCY)}</span>
                  </div>
                  <div className="flex justify-between mb-4">
                    <span className="text-muted-foreground">Envío</span>
                    <span className="text-primary">{SHIPPING_COST === 0 ? 'Gratis' : formatPrice(SHIPPING_COST, CURRENCY)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold">Total</span>
                    <span className="text-2xl font-bold text-primary">{formatPrice(payableAmount, CURRENCY)}</span>
                  </div>
                </div>

                {/* Info message for card payment */}
                {formData.paymentMethod === 'card' && (
                  <p className="text-sm text-muted-foreground text-center mt-2">
                    Completá los datos de la tarjeta arriba para continuar
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
