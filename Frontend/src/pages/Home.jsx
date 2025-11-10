import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, ShieldCheck, Truck, Clock, Award, Star, Package, Sparkles } from 'lucide-react';
import heroImage from '@/assets/hero-pharmacy.jpg';
import categoryWellness from '@/assets/category-wellness.jpg';
import categoryMedical from '@/assets/category-medical.jpg';
import categoryBeauty from '@/assets/category-beauty.jpg';
import deliveryService from '@/assets/delivery-service.jpg';
const Home = () => {
    const navigate = useNavigate();
    const categories = [
        {
            id: '1',
            name: 'Bienestar',
            image: categoryWellness,
            description: 'Vitaminas y suplementos',
            gradient: 'from-green-500 to-emerald-500',
        },
        {
            id: '2',
            name: 'Medicamentos',
            image: categoryMedical,
            description: 'Productos de venta libre',
            gradient: 'from-blue-500 to-cyan-500',
        },
        {
            id: '3',
            name: 'Belleza',
            image: categoryBeauty,
            description: 'Cuidado personal',
            gradient: 'from-pink-500 to-rose-500',
        },
    ];
    const features = [
        {
            icon: ShieldCheck,
            title: 'Productos Certificados',
            description: 'Garantía de calidad y origen verificado',
            gradient: 'from-blue-500 to-cyan-500',
        },
        {
            icon: Truck,
            title: 'Envío a Domicilio',
            description: 'Recibí en tu casa o retirá en farmacia',
            gradient: 'from-purple-500 to-indigo-500',
        },
        {
            icon: Clock,
            title: 'Atención 24/7',
            description: 'Compra cuando quieras, donde quieras',
            gradient: 'from-orange-500 to-amber-500',
        },
    ];
    return (<div className="min-h-screen bg-gradient-to-b from-background via-secondary/10 to-background">
      {/* Hero Section */}
      <section className="relative h-[700px] md:h-[750px] bg-gradient-to-br from-primary via-primary to-primary/90 overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center opacity-25" style={{ backgroundImage: `url(${heroImage})` }}/>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-accent/30 to-primary/20"/>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(255,255,255,0.1),transparent)]"/>
        
    
        
        <div className="relative container mx-auto px-4 h-full flex items-center">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-primary-foreground/10 backdrop-blur-sm px-5 py-2.5 rounded-full mb-6 animate-in fade-in slide-in-from-bottom-3 duration-700">
              <span className="text-primary-foreground text-sm font-semibold">Más de 35 años de experiencia</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 text-primary-foreground animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100 leading-tight">
              Tu Salud y Bienestar, Nuestra Prioridad
            </h1>
            
            <p className="text-xl md:text-2xl mb-10 text-primary-foreground/95 leading-relaxed animate-in fade-in slide-in-from-bottom-5 duration-700 delay-200">
              Cuidando de tu familia con productos de calidad, atención personalizada y el compromiso de siempre.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-300">
              <Button size="lg" variant="secondary" onClick={() => navigate('/catalog')} className="text-lg font-semibold shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105 px-8">
                Explorar Productos
                <ArrowRight className="ml-2 h-5 w-5"/>
              </Button>
              <Button size="lg" variant="outline" onClick={() => navigate('/about')} className="text-lg font-semibold bg-transparent border-2 border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary shadow-xl">
                Sobre Nosotros
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-background relative">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (<Card key={index} className="group border-border/50 shadow-lg hover:shadow-2xl hover:shadow-primary/10 transition-all duration-300 hover:-translate-y-2 hover:border-primary/30">
                <CardContent className="pt-8 pb-6">
                  <div className="flex flex-col items-center text-center">
                    <div className={`w-20 h-20 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300`}>
                      <feature.icon className="h-10 w-10 text-white"/>
                    </div>
                    <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors duration-300">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                  </div>
                </CardContent>
              </Card>))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-20 bg-gradient-to-b from-secondary/30 to-secondary/10">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-block bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-semibold mb-4">
              Nuestros Productos
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              Categorías Destacadas
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Encontrá todo lo que necesitás para tu salud y bienestar en un solo lugar
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {categories.map((category) => (<Card key={category.id} className="group cursor-pointer hover:shadow-2xl hover:shadow-primary/10 transition-all duration-300 overflow-hidden border-border/50 hover:border-primary/30 hover:-translate-y-2" onClick={() => navigate(`/catalog?categoryId=${category.id}`)}>
                <CardContent className="p-0 relative">
                  <div className="aspect-square bg-muted overflow-hidden relative">
                    <img src={category.image} alt={category.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"/>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"/>
                    <div className={`absolute top-4 right-4 w-12 h-12 bg-gradient-to-br ${category.gradient} rounded-xl flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:scale-110`}>
                      <Package className="h-6 w-6 text-white"/>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-2xl font-bold mb-2 group-hover:text-primary transition-colors duration-300">
                      {category.name}
                    </h3>
                    <p className="text-muted-foreground mb-4">{category.description}</p>
                    <Button variant="link" className="px-0 group/btn font-semibold">
                      Ver productos
                      <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform duration-300"/>
                    </Button>
                  </div>
                </CardContent>
              </Card>))}
          </div>
        </div>
      </section>

      {/* Delivery Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="order-2 lg:order-1 rounded-2xl overflow-hidden shadow-2xl group">
              <img src={deliveryService} alt="Servicio de entrega" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"/>
            </div>
            <div className="order-1 lg:order-2">
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-6">
                <Sparkles className="h-4 w-4"/>
                <span className="text-sm font-semibold">Servicio Premium</span>
              </div>
              
              <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                Delivery Confiable y Rápido
              </h2>
              
              <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
                Entregamos tus medicamentos y productos de salud en la puerta de tu casa con
                total seguridad. Seguimiento en tiempo real de tu pedido.
              </p>
              
              <ul className="space-y-4 mb-10">
                <li className="flex items-start gap-4 group/item">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md group-hover/item:shadow-lg group-hover/item:scale-110 transition-all duration-300">
                    <ShieldCheck className="h-5 w-5 text-white"/>
                  </div>
                  <div>
                    <h4 className="font-bold text-foreground mb-1">Productos verificados y sellados</h4>
                    <p className="text-sm text-muted-foreground">Garantía total de autenticidad</p>
                  </div>
                </li>
                <li className="flex items-start gap-4 group/item">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md group-hover/item:shadow-lg group-hover/item:scale-110 transition-all duration-300">
                    <Truck className="h-5 w-5 text-white"/>
                  </div>
                  <div>
                    <h4 className="font-bold text-foreground mb-1">Envío gratis en toda la compra</h4>
                    <p className="text-sm text-muted-foreground">Sin costos adicionales</p>
                  </div>
                </li>
                <li className="flex items-start gap-4 group/item">
                  <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-amber-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md group-hover/item:shadow-lg group-hover/item:scale-110 transition-all duration-300">
                    <Clock className="h-5 w-5 text-white"/>
                  </div>
                  <div>
                    <h4 className="font-bold text-foreground mb-1">Entrega en 24-48hs en CABA</h4>
                    <p className="text-sm text-muted-foreground">Rapidez garantizada</p>
                  </div>
                </li>
              </ul>
              
              <Button onClick={() => navigate('/catalog')} size="lg" className="font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 px-8">
                Hacer un Pedido
                <ArrowRight className="ml-2 h-5 w-5"/>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary via-primary to-primary/90 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent)]"/>
        <div className="absolute top-10 right-20 w-32 h-32 bg-primary-foreground/5 rounded-full blur-3xl"/>
        <div className="absolute bottom-10 left-20 w-40 h-40 bg-primary-foreground/5 rounded-full blur-3xl"/>
        
        <div className="container mx-auto px-4 text-center relative">
          <Award className="h-16 w-16 text-primary-foreground/80 mx-auto mb-6"/>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-primary-foreground">
            ¿Necesitás Asesoramiento?
          </h2>
          <p className="text-xl md:text-2xl mb-10 text-primary-foreground/95 max-w-2xl mx-auto leading-relaxed">
            Nuestro equipo de profesionales farmacéuticos está listo para ayudarte
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" onClick={() => navigate('/contact')} className="font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 px-8">
              Contactar Ahora
              <ArrowRight className="ml-2 h-5 w-5"/>
            </Button>
            <Button size="lg" variant="outline" className="font-semibold bg-transparent border-2 border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary shadow-xl" onClick={() => navigate('/faq')}>
              Preguntas Frecuentes
            </Button>
          </div>
        </div>
      </section>
    </div>);
};
export default Home;
