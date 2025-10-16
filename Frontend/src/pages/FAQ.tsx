import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { MessageCircle } from 'lucide-react';

const FAQ = () => {
  const navigate = useNavigate();

  const faqs = [
    {
      category: 'Pedidos y Compras',
      questions: [
        {
          q: '¿Cómo realizo un pedido?',
          a: 'Para realizar un pedido, navegá por nuestro catálogo, agregá los productos al carrito y seguí el proceso de checkout. Necesitás tener una cuenta para finalizar la compra.',
        },
        {
          q: '¿Puedo modificar o cancelar mi pedido?',
          a: 'Podés modificar o cancelar tu pedido dentro de las 2 horas posteriores a haberlo realizado. Contactanos lo antes posible para asistirte.',
        },
        {
          q: '¿Qué métodos de pago aceptan?',
          a: 'Aceptamos tarjetas de débito y crédito, y efectivo contra entrega. Todos los pagos con tarjeta son procesados de forma segura.',
        },
      ],
    },
    {
      category: 'Envíos y Entregas',
      questions: [
        {
          q: '¿Cuánto tarda el envío?',
          a: 'Los envíos dentro de CABA llegan en 24-48hs. Para el interior del país, el tiempo de entrega es de 3-7 días hábiles dependiendo la zona.',
        },
        {
          q: '¿Tienen envío gratis?',
          a: 'Sí, todos nuestros envíos son sin costo adicional para el cliente.',
        },
        {
          q: '¿Puedo retirar mi pedido en la farmacia?',
          a: 'Sí, podés elegir la opción de retiro en farmacia al momento del checkout. Te avisaremos cuando tu pedido esté listo para retirar.',
        },
        {
          q: '¿Cómo rastréo mi pedido?',
          a: 'Podés ver el estado de tu pedido en la sección "Mis Pedidos" de tu cuenta. Te enviaremos notificaciones por email sobre cada actualización.',
        },
      ],
    },
    {
      category: 'Productos y Recetas',
      questions: [
        {
          q: '¿Necesito receta médica?',
          a: 'Algunos medicamentos requieren receta médica. Durante el checkout, te indicaremos si necesitás enviar una receta para completar tu pedido.',
        },
        {
          q: '¿Cómo envío mi receta?',
          a: 'Podés enviarnos tu receta por email a recetas@farmaciarusso.com.ar o subirla durante el proceso de compra. Aceptamos recetas digitales y fotografías claras.',
        },
        {
          q: '¿Qué hago si un producto está agotado?',
          a: 'Si un producto está agotado, podés solicitar que te notifiquemos cuando vuelva a estar disponible o contactarnos para buscar alternativas.',
        },
        {
          q: '¿Los productos son originales?',
          a: 'Sí, todos nuestros productos son originales y certificados. Trabajamos directamente con laboratorios y distribuidores autorizados.',
        },
      ],
    },
    {
      category: 'Devoluciones y Cambios',
      questions: [
        {
          q: '¿Puedo devolver un producto?',
          a: 'Por motivos de seguridad e higiene, no aceptamos devoluciones de medicamentos. Sin embargo, si recibiste un producto defectuoso o incorrecto, contactanos inmediatamente.',
        },
        {
          q: '¿Qué hago si recibo un producto dañado?',
          a: 'Si recibiste un producto dañado, contactanos dentro de las 48hs con fotos del producto y empaque. Lo reemplazaremos sin costo.',
        },
        {
          q: '¿Cuál es la política de reembolsos?',
          a: 'Los reembolsos se procesan en casos de error en el pedido o productos defectuosos. El dinero se acredita en 5-10 días hábiles según tu método de pago.',
        },
      ],
    },
    {
      category: 'Cuenta y Seguridad',
      questions: [
        {
          q: '¿Es seguro comprar online?',
          a: 'Sí, utilizamos cifrado SSL y medidas de seguridad estándar de la industria para proteger tu información personal y de pago.',
        },
        {
          q: '¿Cómo recupero mi contraseña?',
          a: 'En la página de login, hacé click en "Olvidé mi contraseña" y seguí las instrucciones. Recibirás un email para restablecer tu contraseña.',
        },
        {
          q: '¿Puedo cambiar mi información personal?',
          a: 'Sí, podés actualizar tu información en la sección "Mi Perfil" de tu cuenta.',
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Preguntas Frecuentes</h1>
          <p className="text-muted-foreground text-lg">
            Encontrá respuestas a las preguntas más comunes
          </p>
        </div>

        <div className="space-y-8">
          {faqs.map((category, index) => (
            <div key={index}>
              <h2 className="text-2xl font-bold mb-4">{category.category}</h2>
              <Card>
                <CardContent className="p-0">
                  <Accordion type="single" collapsible className="w-full">
                    {category.questions.map((item, qIndex) => (
                      <AccordionItem key={qIndex} value={`item-${index}-${qIndex}`}>
                        <AccordionTrigger className="px-6 hover:no-underline">
                          {item.q}
                        </AccordionTrigger>
                        <AccordionContent className="px-6 text-muted-foreground">
                          {item.a}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>

        <Card className="mt-12">
          <CardContent className="p-8 text-center">
            <MessageCircle className="h-12 w-12 text-primary mx-auto mb-4" />
            <h3 className="text-2xl font-bold mb-2">¿No encontraste lo que buscabas?</h3>
            <p className="text-muted-foreground mb-6">
              Nuestro equipo está listo para ayudarte
            </p>
            <Button onClick={() => navigate('/contact')} size="lg">
              Contactanos
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FAQ;
