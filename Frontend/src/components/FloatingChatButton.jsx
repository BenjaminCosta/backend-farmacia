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
        <div className="group relative">
          {/* Glow effect sutil */}
          <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl group-hover:bg-primary/30 transition-all duration-300" />
          
          <Button
            onClick={() => setIsOpen(true)}
            className="relative h-14 w-14 rounded-full bg-gradient-to-br from-primary via-primary to-primary/90 hover:from-primary hover:via-primary/95 hover:to-primary/80 hover:scale-105 active:scale-95 transition-all duration-200 shadow-lg hover:shadow-xl border border-primary/20"
          >
            <MessageCircle className="h-6 w-6 text-white" strokeWidth={2} />
          </Button>
          
          {/* Tooltip mejorado */}
          <div className="absolute bottom-full right-0 mb-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
            <div className="bg-gray-900/95 backdrop-blur-sm text-white px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap shadow-xl">
              ¿Necesitás ayuda?
              <div className="absolute top-full right-6 -mt-1 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900/95" />
            </div>
          </div>
        </div>
      )}

      {/* Modal de Chat */}
      {isOpen && (
        <Card className="w-[400px] shadow-2xl border border-gray-200 dark:border-gray-700 animate-in slide-in-from-bottom-4 fade-in duration-200">
          <CardHeader className="bg-gradient-to-br from-primary/95 via-primary to-primary/90 text-white relative overflow-hidden border-b border-primary/20">
            <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.05)_50%,transparent_75%,transparent_100%)] bg-[length:250%_250%]" />
            <div className="relative flex justify-between items-start">
              <div className="space-y-1">
                <CardTitle className="text-xl font-bold flex items-center gap-2">
                  <MessageCircle className="h-5 w-5" strokeWidth={2.5} />
                  Asistencia
                </CardTitle>
                <p className="text-sm text-white/90 font-normal">Estamos aquí para ayudarte</p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                className="text-white/90 hover:text-white hover:bg-white/15 rounded-full h-8 w-8 transition-colors"
              >
                <X className="h-4 w-4" strokeWidth={2.5} />
              </Button>
            </div>
          </CardHeader>

          <CardContent className="p-5 space-y-5 max-h-[520px] overflow-y-auto bg-gradient-to-b from-white to-gray-50/50 dark:from-gray-950 dark:to-gray-900">
            {/* Información de Contacto */}
            <div className="space-y-3">
              <h3 className="font-semibold text-base text-foreground flex items-center gap-2">
                <Phone className="h-4 w-4 text-primary" />
                Contacto Directo
              </h3>
              
              <div className="grid gap-2.5">
                <div className="flex items-center gap-3 p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-primary/40 hover:shadow-sm transition-all duration-200 group">
                  <div className="flex-shrink-0 w-9 h-9 bg-blue-50 dark:bg-blue-950 rounded-lg flex items-center justify-center group-hover:bg-blue-100 dark:group-hover:bg-blue-900 transition-colors">
                    <Phone className="h-4 w-4 text-blue-600 dark:text-blue-400" strokeWidth={2} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-muted-foreground font-medium">Teléfono</p>
                    <p className="text-sm font-semibold text-foreground">+54 11 4567-8900</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-primary/40 hover:shadow-sm transition-all duration-200 group">
                  <div className="flex-shrink-0 w-9 h-9 bg-purple-50 dark:bg-purple-950 rounded-lg flex items-center justify-center group-hover:bg-purple-100 dark:group-hover:bg-purple-900 transition-colors">
                    <Mail className="h-4 w-4 text-purple-600 dark:text-purple-400" strokeWidth={2} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-muted-foreground font-medium">Email</p>
                    <p className="text-sm font-semibold text-foreground truncate">contacto@farmacia.com</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-primary/40 hover:shadow-sm transition-all duration-200 group">
                  <div className="flex-shrink-0 w-9 h-9 bg-red-50 dark:bg-red-950 rounded-lg flex items-center justify-center group-hover:bg-red-100 dark:group-hover:bg-red-900 transition-colors">
                    <MapPin className="h-4 w-4 text-red-600 dark:text-red-400" strokeWidth={2} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-muted-foreground font-medium">Dirección</p>
                    <p className="text-sm font-semibold text-foreground">Av. Corrientes 1234, CABA</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-primary/40 hover:shadow-sm transition-all duration-200 group">
                  <div className="flex-shrink-0 w-9 h-9 bg-green-50 dark:bg-green-950 rounded-lg flex items-center justify-center group-hover:bg-green-100 dark:group-hover:bg-green-900 transition-colors">
                    <Clock className="h-4 w-4 text-green-600 dark:text-green-400" strokeWidth={2} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-muted-foreground font-medium">Horario</p>
                    <p className="text-sm font-semibold text-foreground">Lun-Vie: 8-20h | Sáb: 9-14h</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Divisor sutil */}
            <div className="h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-700 to-transparent" />

            {/* FAQs */}
            <div className="space-y-3">
              <h3 className="font-semibold text-base text-foreground flex items-center gap-2">
                <svg className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Preguntas Frecuentes
              </h3>
              <Accordion type="single" collapsible className="space-y-2">
                {faqs.map((faq, idx) => (
                  <AccordionItem 
                    key={idx} 
                    value={`item-${idx}`} 
                    className="border border-gray-200 dark:border-gray-700 rounded-lg px-4 bg-white dark:bg-gray-800 hover:border-primary/40 transition-colors data-[state=open]:border-primary/60"
                  >
                    <AccordionTrigger className="text-sm font-medium hover:text-primary transition-colors hover:no-underline py-3">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-sm text-muted-foreground leading-relaxed pb-3">
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
