import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle2, Package, Mail, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('orderId');
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    // Ocultar confetti después de 3 segundos
    const timer = setTimeout(() => setShowConfetti(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-gray-900 dark:via-green-950 dark:to-gray-900 flex items-center justify-center p-4">
      {/* Confetti Animation */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          {[...Array(50)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full"
              initial={{
                x: Math.random() * window.innerWidth,
                y: -20,
                opacity: 1,
              }}
              animate={{
                y: window.innerHeight + 20,
                opacity: 0,
              }}
              transition={{
                duration: Math.random() * 2 + 2,
                delay: Math.random() * 0.5,
                ease: 'linear',
              }}
            />
          ))}
        </div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-2xl"
      >
        <Card className="border-0 shadow-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl">
          <CardContent className="p-8 md:p-12 text-center space-y-8">
            {/* Success Icon with Animation */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                type: 'spring',
                stiffness: 260,
                damping: 20,
                delay: 0.2,
              }}
              className="flex justify-center"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-green-500/20 rounded-full blur-xl animate-pulse" />
                <CheckCircle2 className="w-24 h-24 text-green-500 relative" strokeWidth={1.5} />
              </div>
            </motion.div>

            {/* Success Message */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="space-y-3"
            >
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                ¡Pago Exitoso!
              </h1>
              <p className="text-xl text-muted-foreground">
                Tu pedido ha sido procesado correctamente
              </p>
            </motion.div>

            {/* Order Info */}
            {orderId && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 rounded-xl p-6 border border-green-200 dark:border-green-800"
              >
                <p className="text-sm text-muted-foreground mb-2">Número de orden</p>
                <p className="text-2xl font-bold text-green-700 dark:text-green-400">
                  #{orderId}
                </p>
              </motion.div>
            )}

            {/* Info Cards */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="grid md:grid-cols-2 gap-4 pt-4"
            >
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
                <Package className="w-8 h-8 text-blue-600 dark:text-blue-400 mb-3 mx-auto" />
                <h3 className="font-semibold mb-2 text-blue-900 dark:text-blue-100">
                  En Proceso
                </h3>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  Estamos preparando tu pedido
                </p>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950 rounded-xl p-6 border border-purple-200 dark:border-purple-800">
                <Mail className="w-8 h-8 text-purple-600 dark:text-purple-400 mb-3 mx-auto" />
                <h3 className="font-semibold mb-2 text-purple-900 dark:text-purple-100">
                  Te Avisaremos
                </h3>
                <p className="text-sm text-purple-700 dark:text-purple-300">
                  Recibirás un email cuando llegue
                </p>
              </div>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="flex flex-col sm:flex-row gap-4 pt-6"
            >
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
            </motion.div>

            {/* Thank You Message */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
              className="text-sm text-muted-foreground pt-4"
            >
              Gracias por tu compra. ¡Esperamos que disfrutes tus productos! 💚
            </motion.p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default PaymentSuccess;
