import { useState } from 'react';
import { MessageCircle, X, Mail, Phone, MapPin, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const FloatingChatButton = () => {
  const [isOpen, setIsOpen] = useState(false);

  const faqs = [
    {
      question: "¿Cómo puedo rastrear mi pedido?",
      answer: "Podés ver el estado de tu pedido en tiempo real desde 'Mis Pedidos'. Recibirás notificaciones en cada etapa del proceso."
    },
    {
      question: "¿Aceptan recetas electrónicas?",
      answer: "Sí, aceptamos recetas electrónicas. Al retirar productos bajo receta, presentá tu DNI y la receta digital o física."
    },
    {
      question: "¿Cuáles son los métodos de pago?",
      answer: "Aceptamos tarjetas de crédito/débito y efectivo al retirar. Los pagos online son procesados de forma segura."
    },
    {
      question: "¿Cuánto tarda el envío?",
      answer: "Los envíos a domicilio tardan entre 3-5 días hábiles. El retiro en farmacia está disponible inmediatamente después de confirmar tu pedido."
    },
    {
      question: "¿Qué hago si un producto está agotado?",
      answer: "Podés contactarnos y te avisaremos cuando vuelva a estar disponible. También podemos buscar alternativas similares."
    }
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Botón flotante */}
      {!isOpen && (
        <div className="relative">
          <Button
            onClick={() => setIsOpen(true)}
            className="h-16 w-16 rounded-full bg-gradient-to-r from-primary to-primary/80 hover:scale-110 transition-all duration-300 shadow-2xl hover:shadow-primary/50 border-2 border-white"
          >
            <MessageCircle className="h-7 w-7 animate-pulse" />
          </Button>
          
          {/* Tooltip */}
          <div className="absolute bottom-full right-0 mb-2 animate-bounce">
            <div className="bg-gray-900 text-white px-3 py-1.5 rounded-lg text-sm whitespace-nowrap shadow-lg">
              ¿Necesitás ayuda?
              <div className="absolute top-full right-4 -mt-1 border-4 border-transparent border-t-gray-900" />
            </div>
          </div>
        </div>
      )}

      {/* Modal de Chat */}
      {isOpen && (
        <Card className="w-[380px] shadow-2xl animate-in slide-in-from-bottom-5 duration-300 border-2 border-primary/20">
          <CardHeader className="bg-gradient-to-r from-primary to-primary/80 text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
            <div className="relative flex justify-between items-start">
              <div>
                <CardTitle className="text-xl font-bold">💬 Asistencia</CardTitle>
                <p className="text-sm text-white/90 mt-1">Estamos aquí para ayudarte</p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                className="text-white hover:bg-white/20 rounded-full h-8 w-8"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          </CardHeader>

          <CardContent className="p-6 space-y-6 max-h-[500px] overflow-y-auto">
            {/* Información de Contacto */}
            <div className="space-y-4">
              <h3 className="font-bold text-lg text-foreground mb-3">📞 Contacto</h3>
              
              <div className="flex items-center gap-3 p-3 bg-secondary/50 rounded-lg hover:bg-secondary transition-colors">
                <div className="p-2 bg-primary/10 rounded-full">
                  <Phone className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-medium">Teléfono</p>
                  <p className="text-sm font-semibold">+54 11 4567-8900</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-secondary/50 rounded-lg hover:bg-secondary transition-colors">
                <div className="p-2 bg-primary/10 rounded-full">
                  <Mail className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-medium">Email</p>
                  <p className="text-sm font-semibold">contacto@farmacia.com</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-secondary/50 rounded-lg hover:bg-secondary transition-colors">
                <div className="p-2 bg-primary/10 rounded-full">
                  <MapPin className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-medium">Dirección</p>
                  <p className="text-sm font-semibold">Av. Corrientes 1234, CABA</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-secondary/50 rounded-lg hover:bg-secondary transition-colors">
                <div className="p-2 bg-primary/10 rounded-full">
                  <Clock className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-medium">Horario</p>
                  <p className="text-sm font-semibold">Lun-Vie: 8:00-20:00 | Sáb: 9:00-14:00</p>
                </div>
              </div>
            </div>

            {/* FAQs */}
            <div className="space-y-3">
              <h3 className="font-bold text-lg text-foreground">❓ Preguntas Frecuentes</h3>
              <Accordion type="single" collapsible className="space-y-2">
                {faqs.map((faq, idx) => (
                  <AccordionItem key={idx} value={`item-${idx}`} className="border rounded-lg px-4">
                    <AccordionTrigger className="text-sm font-semibold hover:text-primary">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-sm text-muted-foreground">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default FloatingChatButton;
