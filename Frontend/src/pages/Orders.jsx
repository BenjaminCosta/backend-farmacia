import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatPrice } from '@/lib/formatPrice';
import Loader from '@/components/Loader';
import apiClient from '@/lib/axios';
const Orders = () => {
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        fetchOrders();
    }, []);
    const fetchOrders = async () => {
        try {
            const response = await apiClient.get('/orders');
            const ordersData = response.data || [];
            // Mapear la respuesta del backend al formato esperado por el frontend
            const mappedOrders = ordersData.map((order) => ({
                id: order.id,
                createdAt: order.createdAt,
                status: order.status,
                total: order.total,
                itemCount: order.items?.length || 0,
            }));
            setOrders(mappedOrders);
        }
        catch (error) {
            console.error('Error fetching orders:', error);
            setOrders([]);
        }
        finally {
            setLoading(false);
        }
    };
    const getStatusColor = (status) => {
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
    const getStatusText = (status) => {
        const statusMap = {
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
    return (<div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">Mis Pedidos</h1>

        {orders.length === 0 ? (<div className="text-center py-12">
            <Package className="h-24 w-24 text-muted-foreground mx-auto mb-4"/>
            <h2 className="text-2xl font-bold mb-2">No tenés pedidos aún</h2>
            <p className="text-muted-foreground mb-6">Empezá a comprar para ver tus pedidos aquí</p>
            <Button onClick={() => navigate('/catalog')}>Ver Productos</Button>
          </div>) : (<div className="space-y-4">
            {orders.map((order) => (<Card key={order.id} className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate(`/orders/${order.id}`)}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">Pedido #{order.id}</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        {new Date(order.createdAt).toLocaleDateString('es-AR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                })}
                      </p>
                    </div>
                    <Badge className={getStatusColor(order.status)}>
                      {getStatusText(order.status)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-muted-foreground">
                        {order.itemCount} {order.itemCount === 1 ? 'producto' : 'productos'}
                      </p>
                    </div>
                    <p className="text-xl font-bold text-primary">{formatPrice(order.total)}</p>
                  </div>
                </CardContent>
              </Card>))}
          </div>)}
      </div>
    </div>);
};
export default Orders;
