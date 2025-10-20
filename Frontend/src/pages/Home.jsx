import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, ShieldCheck, Truck, Clock, Award } from 'lucide-react';
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
        },
        {
            id: '2',
            name: 'Medicamentos',
            image: categoryMedical,
            description: 'Productos de venta libre',
        },
        {
            id: '3',
            name: 'Belleza',
            image: categoryBeauty,
            description: 'Cuidado personal',
        },
    ];
    const features = [
        {
            icon: ShieldCheck,
            title: 'Productos Certificados',
            description: 'Garantía de calidad y origen',
        },
        {
            icon: Truck,
            title: 'Envío a Domicilio',
            description: 'Recibí en tu casa o retirá en farmacia',
        },
        {
            icon: Clock,
            title: 'Atención 24/7',
            description: 'Compra cuando quieras',
        },
    ];
    return (<div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[600px] bg-gradient-to-r from-primary to-accent overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center opacity-20" style={{ backgroundImage: `url(${heroImage})` }}/>
        <div className="relative container mx-auto px-4 h-full flex items-center">
          <div className="max-w-2xl text-white">
            <h1 className="text-5xl font-bold mb-6">
              Tu Salud y Bienestar, Nuestra Prioridad
            </h1>
            <p className="text-xl mb-8 opacity-90">
              Más de 35 años cuidando de tu familia con productos de calidad y atención personalizada.
            </p>
            <Button size="lg" variant="secondary" onClick={() => navigate('/catalog')} className="text-lg">
              Ver Productos
              <ArrowRight className="ml-2 h-5 w-5"/>
            </Button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (<Card key={index} className="border-none shadow-md">
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center text-center">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                      <feature.icon className="h-8 w-8 text-primary"/>
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </div>
                </CardContent>
              </Card>))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 bg-secondary">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Nuestras Categorías</h2>
            <p className="text-muted-foreground text-lg">
              Encontrá todo lo que necesitás para tu salud y bienestar
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {categories.map((category) => (<Card key={category.id} className="group cursor-pointer hover:shadow-xl transition-shadow duration-200 overflow-hidden" onClick={() => navigate(`/catalog?categoryId=${category.id}`)}>
                <CardContent className="p-0">
                  <div className="aspect-square bg-muted overflow-hidden">
                    <img src={category.image} alt={category.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"/>
                  </div>
                  <div className="p-6">
                    <h3 className="text-2xl font-bold mb-2">{category.name}</h3>
                    <p className="text-muted-foreground">{category.description}</p>
                    <Button variant="link" className="px-0 mt-4">
                      Ver productos
                      <ArrowRight className="ml-2 h-4 w-4"/>
                    </Button>
                  </div>
                </CardContent>
              </Card>))}
          </div>
        </div>
      </section>

      {/* Delivery Section with Image */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <img src={deliveryService} alt="Servicio de entrega" className="rounded-lg shadow-xl"/>
            </div>
            <div className="order-1 lg:order-2">
              <Award className="h-12 w-12 text-primary mb-4"/>
              <h2 className="text-4xl font-bold mb-6">Delivery Confiable</h2>
              <p className="text-muted-foreground text-lg mb-6">
                Entregamos tus medicamentos y productos de salud en la puerta de tu casa con
                total seguridad. Seguimiento en tiempo real de tu pedido.
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center text-muted-foreground">
                  <ShieldCheck className="h-5 w-5 text-primary mr-3"/>
                  Productos verificados y sellados
                </li>
                <li className="flex items-center text-muted-foreground">
                  <Truck className="h-5 w-5 text-primary mr-3"/>
                  Envío gratis en toda la compra
                </li>
                <li className="flex items-center text-muted-foreground">
                  <Clock className="h-5 w-5 text-primary mr-3"/>
                  Entrega en 24-48hs en CABA
                </li>
              </ul>
              <Button onClick={() => navigate('/catalog')} size="lg">
                Hacer un Pedido
                <ArrowRight className="ml-2 h-5 w-5"/>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">¿Necesitás Asesoramiento?</h2>
          <p className="text-xl mb-8 opacity-90">
            Nuestro equipo de profesionales está listo para ayudarte
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg" variant="secondary" onClick={() => navigate('/contact')}>
              Contactar
            </Button>
            <Button size="lg" variant="outline" className="bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary" onClick={() => navigate('/faq')}>
              Ver Preguntas Frecuentes
            </Button>
          </div>
        </div>
      </section>
    </div>);
};
export default Home;
