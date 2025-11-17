import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle2, Package, Mail, ArrowRight, Truck, Home } from 'lucide-react';
import { toast } from 'sonner';
import OrderTimeline from '@/components/OrderTimeline';
import { useGetOrderQuery } from '@/services/orders';

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('orderId');
  
  const { data: order, isLoading: loading, error } = useGetOrderQuery(orderId, {
    skip: !orderId
  });
  
  useEffect(() => {
    if (error) {
      console.error('Error cargando orden:', error);
      toast.error('Error al cargar los detalles del pedido');
    }
  }, [error]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-gray-900 dark:via-green-950 dark:to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <Card className="border-0 shadow-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl">
          <CardContent className="p-8 md:p-12 text-center space-y-8">
            {/* Success Icon */}
            <div className="flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 bg-green-500/20 rounded-full blur-xl" />
                <CheckCircle2 className="w-24 h-24 text-green-500 relative" strokeWidth={1.5} />
              </div>
            </div>

            {/* Success Message */}
            <div className="space-y-3">
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                ¡Pago Exitoso!
              </h1>
              <p className="text-xl text-muted-foreground">
                Tu pedido ha sido procesado correctamente
              </p>
            </div>

            {/* Order Info */}
            {orderId && (
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 rounded-xl p-6 border border-green-200 dark:border-green-800">
                <p className="text-sm text-muted-foreground mb-2">Número de orden</p>
                <p className="text-2xl font-bold text-green-700 dark:text-green-400">
                  #{orderId}
                </p>
              </div>
            )}

            {/* Info Cards - Mostrar según método de entrega */}
            {!loading && order && (
              <div className="space-y-6 pt-4">
                {/* Timeline del pedido */}
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                  <h3 className="font-semibold mb-4 text-gray-900 dark:text-gray-100 flex items-center gap-2">
                    {order.deliveryMethod === 'DELIVERY' ? (
                      <>
                        <Truck className="w-5 h-5 text-blue-600" />
                        Seguimiento de tu Envío
                      </>
                    ) : (
                      <>
                        <Home className="w-5 h-5 text-green-600" />
                        Estado de tu Pedido
                      </>
                    )}
                  </h3>
                  <OrderTimeline status={order.status} deliveryMethod={order.deliveryMethod} />
                </div>

                {/* Info Cards Grid */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
                    <Package className="w-8 h-8 text-blue-600 dark:text-blue-400 mb-3 mx-auto" />
                    <h3 className="font-semibold mb-2 text-blue-900 dark:text-blue-100">
                      {order.deliveryMethod === 'DELIVERY' ? 'Envío a Domicilio' : 'Retiro en Farmacia'}
                    </h3>
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                      {order.deliveryMethod === 'DELIVERY' 
                        ? 'Lo recibirás en tu domicilio' 
                        : 'Retirá en la farmacia cuando esté listo'}
                    </p>
                  </div>

                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950 rounded-xl p-6 border border-purple-200 dark:border-purple-800">
                    <Mail className="w-8 h-8 text-purple-600 dark:text-purple-400 mb-3 mx-auto" />
                    <h3 className="font-semibold mb-2 text-purple-900 dark:text-purple-100">
                      Te Avisaremos
                    </h3>
                    <p className="text-sm text-purple-700 dark:text-purple-300">
                      {order.deliveryMethod === 'DELIVERY'
                        ? 'Recibirás un email cuando salga para entrega'
                        : 'Te avisaremos cuando esté listo para retirar'}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <Button
                onClick={() => navigate('/orders')}
                size="lg"
                className="flex-1 h-12 text-base font-semibold shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
              >
                Ver Mis Pedidos
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>

              <Button
                onClick={() => navigate('/catalog')}
                variant="outline"
                size="lg"
                className="flex-1 h-12 text-base font-semibold border-2 hover:bg-green-50 dark:hover:bg-green-950"
              >
                Seguir Comprando
              </Button>
            </div>

            {/* Thank You Message */}
            <p className="text-sm text-muted-foreground pt-4">
              Gracias por tu compra. ¡Esperamos que disfrutes tus productos! 💚
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PaymentSuccess;
