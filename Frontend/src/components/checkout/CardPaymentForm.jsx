import { useState } from 'react';
import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Lock, CreditCard } from 'lucide-react';
import { formatPrice } from '@/lib/formatPrice';

const CardPaymentForm = ({ clientSecret, amount, currency, onSuccess, onError, formData }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!stripe || !elements) {
            console.warn('⚠️ Stripe o Elements no están listos');
            return;
        }

        setProcessing(true);
        console.log('🔄 Iniciando confirmación de pago...');

        try {
            console.log(' Llamando a stripe.confirmPayment con:', {
                elements,
                redirect: 'if_required',
                confirmParams: {}
            });

            const { error, paymentIntent } = await stripe.confirmPayment({
                elements,
                redirect: 'if_required',
                confirmParams: {}
            });

            console.log('📊 Resultado de confirmPayment:', { error, paymentIntent });

            if (error) {
                console.error('❌ Error de Stripe:', error);
                onError(error.message);
            } else if (paymentIntent) {
                console.log('✅ PaymentIntent recibido, status:', paymentIntent.status);
                
                if (paymentIntent.status === 'succeeded') {
                    console.log('🎉 Pago exitoso! ID:', paymentIntent.id);
                    onSuccess(paymentIntent.id);
                } else if (paymentIntent.status === 'requires_action') {
                    console.log('⚠️ Se requiere acción adicional (3D Secure, etc.)');
                    onError('Se requiere verificación adicional. Por favor, intenta nuevamente.');
                } else {
                    console.log('❓ Estado inesperado del pago:', paymentIntent.status);
                    onError('El pago no se pudo completar. Estado: ' + paymentIntent.status);
                }
            } else {
                console.error('❌ No se recibió error ni paymentIntent');
                onError('Respuesta inesperada del servidor de pagos');
            }
        } catch (err) {
            console.error('❌ Error en handleSubmit:', err);
            onError(err.message || 'Error al procesar el pago');
        } finally {
            setProcessing(false);
            console.log('✅ Procesamiento finalizado');
        }
    };  return (
    <Card className="border-border/50 shadow-lg">
      <CardHeader className="space-y-1">
        <CardTitle className="text-xl flex items-center gap-2">
          <CreditCard className="h-5 w-5 text-primary" />
          Datos de la Tarjeta
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Todos los datos se procesan de forma segura con Stripe
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <PaymentElement />
          </div>

          <p className="text-xs text-muted-foreground text-center">
            💳 Tarjeta de prueba: 4242 4242 4242 4242 | Cualquier fecha futura | Cualquier CVC
          </p>

          <Alert className="border-blue-200 bg-blue-50 dark:bg-blue-950/20">
            <Lock className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-sm text-blue-900 dark:text-blue-100">
              Tu información está protegida con encriptación de nivel bancario
            </AlertDescription>
          </Alert>

          <Button
            type="submit"
            disabled={!stripe || processing}
            className="w-full h-11 font-semibold shadow-md hover:shadow-lg transition-all duration-300"
            size="lg"
          >
            {processing ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Procesando pago...
              </>
            ) : (
              <>
                <Lock className="mr-2 h-5 w-5" />
                Pagar {formatPrice(amount, currency)}
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default CardPaymentForm;
