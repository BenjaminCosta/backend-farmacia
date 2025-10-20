import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Phone, Mail, MapPin, Clock, Send, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import contactSupport from '@/assets/contact-support.jpg';
const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
    });
    const [loading, setLoading] = useState(false);
    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        // Simulate sending message
        setTimeout(() => {
            toast.success('Mensaje enviado correctamente. Te responderemos pronto.');
            setFormData({
                name: '',
                email: '',
                phone: '',
                subject: '',
                message: '',
            });
            setLoading(false);
        }, 1000);
    };
    const contactInfo = [
        {
            icon: Phone,
            title: 'Teléfono',
            content: '(011) 4567-8900',
            link: 'tel:+541145678900',
        },
        {
            icon: Mail,
            title: 'Email',
            content: 'info@farmaciarusso.com.ar',
            link: 'mailto:info@farmaciarusso.com.ar',
        },
        {
            icon: MapPin,
            title: 'Dirección',
            content: 'Av. Corrientes 1234, C1043 CABA',
            link: 'https://maps.google.com',
        },
        {
            icon: Clock,
            title: 'Horarios',
            content: 'Lun - Vie: 8:00 - 22:00 | Sáb: 9:00 - 20:00',
        },
    ];
    return (<div className="min-h-screen bg-gradient-to-b from-background via-secondary/10 to-background">
      {/* Hero Section */}
      <section className="relative h-[400px] bg-gradient-to-r from-accent to-accent/80 overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center opacity-15" style={{ backgroundImage: `url(${contactSupport})` }}/>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-primary/20"/>
        <div className="relative container mx-auto px-4 h-full flex items-center">
          <div className="max-w-3xl">
            <h1 className="text-5xl md:text-6xl font-bold mb-4 text-primary-foreground animate-in fade-in slide-in-from-bottom-4 duration-700">
              Contactanos
            </h1>
            <p className="text-xl md:text-2xl text-primary-foreground/90 leading-relaxed animate-in fade-in slide-in-from-bottom-5 duration-700 delay-150">
              Estamos aquí para ayudarte. Respondemos todas tus consultas en menos de 24 horas.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
            {/* Contact Form - Takes 2 columns */}
            <div className="lg:col-span-2">
              <Card className="shadow-xl border-border/50 hover:shadow-2xl transition-shadow duration-300">
                <CardHeader className="space-y-2 pb-6">
                  <CardTitle className="text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                    Envíanos un Mensaje
                  </CardTitle>
                  <CardDescription className="text-base">
                    Completa el formulario y nos pondremos en contacto contigo lo antes posible.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-base font-semibold">
                        Nombre Completo <span className="text-destructive">*</span>
                      </Label>
                      <Input id="name" name="name" value={formData.name} onChange={handleInputChange} placeholder="Ej: Juan Pérez" className="h-11 border-border/50 focus:border-primary transition-colors" required/>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-base font-semibold">
                          Email <span className="text-destructive">*</span>
                        </Label>
                        <Input id="email" name="email" type="email" value={formData.email} onChange={handleInputChange} placeholder="tu@email.com" className="h-11 border-border/50 focus:border-primary transition-colors" required/>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone" className="text-base font-semibold">
                          Teléfono
                        </Label>
                        <Input id="phone" name="phone" type="tel" value={formData.phone} onChange={handleInputChange} placeholder="(011) 1234-5678" className="h-11 border-border/50 focus:border-primary transition-colors"/>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="subject" className="text-base font-semibold">
                        Asunto <span className="text-destructive">*</span>
                      </Label>
                      <Input id="subject" name="subject" value={formData.subject} onChange={handleInputChange} placeholder="¿En qué podemos ayudarte?" className="h-11 border-border/50 focus:border-primary transition-colors" required/>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="message" className="text-base font-semibold">
                        Mensaje <span className="text-destructive">*</span>
                      </Label>
                      <Textarea id="message" name="message" value={formData.message} onChange={handleInputChange} placeholder="Escribe tu mensaje aquí..." rows={6} className="resize-none border-border/50 focus:border-primary transition-colors" required/>
                    </div>
                    
                    <Button type="submit" size="lg" className="w-full md:w-auto font-semibold shadow-lg hover:shadow-xl transition-all duration-300 px-8" disabled={loading}>
                      {loading ? (
                        <>
                          <CheckCircle2 className="mr-2 h-5 w-5 animate-spin"/>
                          Enviando...
                        </>
                      ) : (
                        <>
                          <Send className="mr-2 h-5 w-5"/>
                          Enviar Mensaje
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Contact Info - Takes 1 column */}
            <div className="space-y-6">
              <div>
                <h2 className="text-3xl font-bold mb-3 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                  Información de Contacto
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  ¿Tenés alguna pregunta? No dudes en contactarnos. Nuestro equipo estará encantado de ayudarte.
                </p>
              </div>

              <div className="space-y-4">
                {contactInfo.map((info, index) => (<Card key={index} className="group hover:shadow-lg hover:border-primary/30 transition-all duration-300 hover:-translate-y-1">
                    <CardContent className="p-5">
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md group-hover:shadow-lg group-hover:scale-110 transition-all duration-300">
                          <info.icon className="h-6 w-6 text-primary-foreground"/>
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold mb-1 text-base">{info.title}</h3>
                          {info.link ? (<a href={info.link} className="text-muted-foreground hover:text-primary transition-colors text-sm font-medium inline-flex items-center gap-1 group/link" target={info.link.startsWith('http') ? '_blank' : undefined} rel={info.link.startsWith('http') ? 'noopener noreferrer' : undefined}>
                              <span className="group-hover/link:underline">{info.content}</span>
                            </a>) : (<p className="text-muted-foreground text-sm font-medium">{info.content}</p>)}
                        </div>
                      </div>
                    </CardContent>
                  </Card>))}
              </div>

              {/* Map placeholder */}
              <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardContent className="p-0">
                  <div className="aspect-video bg-gradient-to-br from-secondary to-secondary/50 flex items-center justify-center relative group cursor-pointer">
                    <div className="absolute inset-0 bg-primary/5 group-hover:bg-primary/10 transition-colors duration-300"/>
                    <div className="relative text-center space-y-2 p-4">
                      <MapPin className="h-12 w-12 text-primary mx-auto group-hover:scale-110 transition-transform duration-300"/>
                      <p className="font-semibold text-foreground">Nuestra Ubicación</p>
                      <p className="text-sm text-muted-foreground">Av. Corrientes 1234, CABA</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>);
};
export default Contact;
