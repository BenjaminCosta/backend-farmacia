import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatPrice } from '@/lib/formatPrice';
import Loader from '@/components/Loader';
import apiClient from '@/lib/axios';

interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  createdAt: string;
  status: string;
  total: number;
  items: OrderItem[];
  shippingAddress?: {
    fullName: string;
    address: string;
    city: string;
    zipCode: string;
    phone: string;
  };
  deliveryMethod: string;
  paymentMethod: string;
}

const OrderDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const fetchOrder = async () => {
    try {
      const response = await apiClient.get(`/orders/${id}`);
      setOrder(response.data);
    } catch (error) {
      console.error('Error fetching order:', error);
      // Mock data for development
      setOrder({
        id: id || '1',
        createdAt: new Date().toISOString(),
        status: 'PENDING',
        total: 450000,
        items: [
          {
            id: '1',
            productId: '1',
            productName: 'Ibuprofeno 400mg',
            quantity: 2,
            price: 250000,
          },
        ],
        shippingAddress: {
          fullName: 'Juan Pérez',
          address: 'Av. Corrientes 1234',
          city: 'CABA',
          zipCode: '1043',
          phone: '11-1234-5678',
        },
        deliveryMethod: 'delivery',
        paymentMethod: 'cash',
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-500';
      case 'PROCESSING':
        return 'bg-blue-500';
      case 'SHIPPED':
        return 'bg-purple-500';
      case 'DELIVERED':
        return 'bg-green-500';
      case 'CANCELLED':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    const statusMap: Record<string, string> = {
      PENDING: 'Pendiente',
      PROCESSING: 'En proceso',
      SHIPPED: 'Enviado',
      DELIVERED: 'Entregado',
      CANCELLED: 'Cancelado',
    };
    return statusMap[status] || status;
  };

  if (loading) {
    return <Loader />;
  }

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <Package className="h-24 w-24 text-muted-foreground mx-auto mb-4" />
        <p className="text-muted-foreground mb-4">Pedido no encontrado</p>
        <Button onClick={() => navigate('/orders')}>Ver Mis Pedidos</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <Button variant="ghost" onClick={() => navigate('/orders')} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver a Pedidos
        </Button>

        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Pedido #{order.id}</h1>
            <p className="text-muted-foreground">
              Realizado el {new Date(order.createdAt).toLocaleDateString('es-AR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
          </div>
          <Badge className={getStatusColor(order.status)}>{getStatusText(order.status)}</Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Items */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Productos</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {order.items.map((item) => (
                  <div key={item.id} className="flex justify-between items-center py-3 border-b last:border-0">
                    <div>
                      <h3 className="font-semibold">{item.productName}</h3>
                      <p className="text-sm text-muted-foreground">Cantidad: {item.quantity}</p>
                    </div>
                    <p className="font-semibold">{formatPrice(item.price * item.quantity)}</p>
                  </div>
                ))}
                <div className="pt-4 flex justify-between items-center">
                  <span className="text-lg font-semibold">Total</span>
                  <span className="text-2xl font-bold text-primary">{formatPrice(order.total)}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Details */}
          <div className="space-y-6">
            {/* Delivery Info */}
            {order.shippingAddress && (
              <Card>
                <CardHeader>
                  <CardTitle>Información de Entrega</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <p className="font-semibold">{order.shippingAddress.fullName}</p>
                  <p className="text-muted-foreground">{order.shippingAddress.address}</p>
                  <p className="text-muted-foreground">
                    {order.shippingAddress.city}, CP {order.shippingAddress.zipCode}
                  </p>
                  <p className="text-muted-foreground">{order.shippingAddress.phone}</p>
                </CardContent>
              </Card>
            )}

            {/* Payment & Delivery */}
            <Card>
              <CardHeader>
                <CardTitle>Detalles</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div>
                  <p className="text-muted-foreground mb-1">Método de entrega</p>
                  <p className="font-semibold">
                    {order.deliveryMethod === 'delivery' ? 'Envío a domicilio' : 'Retiro en farmacia'}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1">Método de pago</p>
                  <p className="font-semibold">
                    {order.paymentMethod === 'cash' ? 'Efectivo' : 'Tarjeta'}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
