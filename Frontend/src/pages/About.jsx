import { Card, CardContent } from '@/components/ui/card';
import { Heart, Award, Users, Clock } from 'lucide-react';
import aboutTeam from '@/assets/about-team.jpg';
import storeFront from '@/assets/store-front.jpg';
const About = () => {
    const values = [
        {
            icon: Heart,
            title: 'Compromiso con la Salud',
            description: 'Priorizamos el bienestar de nuestros clientes en cada producto y servicio.',
        },
        {
            icon: Award,
            title: 'Calidad Garantizada',
            description: 'Solo trabajamos con productos certificados y de origen confiable.',
        },
        {
            icon: Users,
            title: 'Atención Personalizada',
            description: 'Nuestro equipo de profesionales está siempre disponible para asesorarte.',
        },
        {
            icon: Clock,
            title: 'Más de 35 Años',
            description: 'Experiencia cuidando la salud de miles de familias argentinas.',
        },
    ];
    return (<div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative h-[400px] bg-primary overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center opacity-30" style={{ backgroundImage: `url(${aboutTeam})` }}/>
        <div className="relative container mx-auto px-4 h-full flex items-center">
          <div className="max-w-2xl text-primary-foreground">
            <h1 className="text-5xl font-bold mb-4">Sobre Nosotros</h1>
            <p className="text-xl opacity-90">
              Más de tres décadas cuidando la salud de tu familia
            </p>
          </div>
        </div>
      </section>

      {/* History Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6">Nuestra Historia</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  Fundada en 1985 por la familia Russo, nuestra farmacia nació con la misión de
                  brindar acceso a medicamentos de calidad y un servicio personalizado a la
                  comunidad de Buenos Aires.
                </p>
                <p>
                  Durante más de 35 años, hemos sido testigos del crecimiento de generaciones
                  enteras, acompañándolas en cada etapa de sus vidas con productos y servicios que
                  se adaptan a sus necesidades.
                </p>
                <p>
                  Hoy, continuamos con el mismo compromiso de siempre, pero con la tecnología como
                  aliada, ofreciendo nuestros servicios también online para estar más cerca tuyo.
                </p>
              </div>
            </div>
            <div className="rounded-lg overflow-hidden shadow-lg">
              <img src={storeFront} alt="Farmacia Russo" className="w-full h-full object-cover"/>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-secondary">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Nuestros Valores</h2>
            <p className="text-muted-foreground text-lg">
              Los principios que guían nuestro trabajo diario
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (<Card key={index} className="text-center">
                <CardContent className="pt-6">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <value.icon className="h-8 w-8 text-primary"/>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
                  <p className="text-muted-foreground">{value.description}</p>
                </CardContent>
              </Card>))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Nuestro Equipo</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Contamos con un equipo de farmacéuticos y profesionales de la salud altamente
              capacitados, comprometidos con tu bienestar.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <Card>
              <CardContent className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                  <div>
                    <div className="text-4xl font-bold text-primary mb-2">35+</div>
                    <p className="text-muted-foreground">Años de Experiencia</p>
                  </div>
                  <div>
                    <div className="text-4xl font-bold text-primary mb-2">15</div>
                    <p className="text-muted-foreground">Profesionales Certificados</p>
                  </div>
                  <div>
                    <div className="text-4xl font-bold text-primary mb-2">50k+</div>
                    <p className="text-muted-foreground">Clientes Satisfechos</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>);
};
export default About;
