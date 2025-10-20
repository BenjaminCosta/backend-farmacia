import { Card, CardContent } from '@/components/ui/card';
import { Heart, Award, Users, Clock, Target, Shield, Sparkles } from 'lucide-react';
import aboutTeam from '@/assets/about-team.jpg';
import storeFront from '@/assets/store-front.jpg';
const About = () => {
    const values = [
        {
            icon: Heart,
            title: 'Compromiso con la Salud',
            description: 'Priorizamos el bienestar de nuestros clientes en cada producto y servicio.',
            color: 'from-red-500 to-pink-500',
        },
        {
            icon: Award,
            title: 'Calidad Garantizada',
            description: 'Solo trabajamos con productos certificados y de origen confiable.',
            color: 'from-yellow-500 to-orange-500',
        },
        {
            icon: Users,
            title: 'Atención Personalizada',
            description: 'Nuestro equipo de profesionales está siempre disponible para asesorarte.',
            color: 'from-blue-500 to-cyan-500',
        },
        {
            icon: Clock,
            title: 'Más de 35 Años',
            description: 'Experiencia cuidando la salud de miles de familias argentinas.',
            color: 'from-purple-500 to-indigo-500',
        },
    ];

    const stats = [
        { icon: Target, value: '35+', label: 'Años de Experiencia' },
        { icon: Users, value: '15', label: 'Profesionales Certificados' },
        { icon: Heart, value: '50k+', label: 'Clientes Satisfechos' },
        { icon: Award, value: '100%', label: 'Productos Certificados' },
    ];
    return (<div className="min-h-screen bg-gradient-to-b from-background via-secondary/10 to-background">
      {/* Hero Section */}
      <section className="relative h-[450px] md:h-[500px] bg-gradient-to-r from-primary via-primary to-primary/90 overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center opacity-20" style={{ backgroundImage: `url(${aboutTeam})` }}/>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/20 to-primary/40"/>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.1),transparent)]"/>
        <div className="relative container mx-auto px-4 h-full flex items-center">
          <div className="max-w-3xl">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-primary-foreground animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100 leading-tight">
              Sobre Nosotros
            </h1>
            <p className="text-xl md:text-2xl text-primary-foreground/95 leading-relaxed animate-in fade-in slide-in-from-bottom-5 duration-700 delay-200">
              Más de tres décadas cuidando la salud de tu familia con dedicación, profesionalismo y calidez humana.
            </p>
          </div>
        </div>
      </section>

      {/* History Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="order-2 lg:order-1">
              <div className="inline-block bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-semibold mb-4">
                Nuestra Historia
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                Una Tradición Familiar de Confianza
              </h2>
              <div className="space-y-5 text-muted-foreground text-lg leading-relaxed">
                <p className="border-l-4 border-primary pl-4">
                  Fundada en 1985 por la familia Russo, nuestra farmacia nació con la misión de
                  brindar acceso a medicamentos de calidad y un servicio personalizado a la
                  comunidad de Buenos Aires.
                </p>
                <p>
                  Durante más de 35 años, hemos sido testigos del crecimiento de generaciones
                  enteras, acompañándolas en cada etapa de sus vidas con productos y servicios que
                  se adaptan a sus necesidades específicas.
                </p>
                <p>
                  Hoy, continuamos con el mismo compromiso de siempre, pero con la tecnología como
                  aliada, ofreciendo nuestros servicios también online para estar más cerca tuyo
                  cuando más nos necesites.
                </p>
              </div>
            </div>
            <div className="order-1 lg:order-2 rounded-2xl overflow-hidden shadow-2xl group">
              <img src={storeFront} alt="Farmacia Russo" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"/>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-gradient-to-b from-secondary/50 to-secondary/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-block bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-semibold mb-4">
              Nuestros Valores
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              Los Principios que nos Guían
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Cada decisión que tomamos está fundamentada en estos pilares esenciales
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (<Card key={index} className="group hover:shadow-2xl hover:shadow-primary/10 transition-all duration-300 hover:-translate-y-2 border-border/50 hover:border-primary/30 overflow-hidden">
                <CardContent className="pt-8 pb-6 px-6 text-center relative">
                  <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${value.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}/>
                  <div className={`w-20 h-20 bg-gradient-to-br ${value.color} rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300`}>
                    <value.icon className="h-10 w-10 text-white"/>
                  </div>
                  <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors duration-300">
                    {value.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {value.description}
                  </p>
                </CardContent>
              </Card>))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-block bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-semibold mb-4">
              Nuestro Equipo
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              Profesionales Comprometidos
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Contamos con un equipo de farmacéuticos y profesionales de la salud altamente
              capacitados, comprometidos con tu bienestar.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {stats.map((stat, index) => (<Card key={index} className="group hover:shadow-xl hover:border-primary/30 transition-all duration-300 hover:-translate-y-1">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary/80 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300">
                    <stat.icon className="h-8 w-8 text-primary-foreground"/>
                  </div>
                  <div className="text-5xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent mb-2">
                    {stat.value}
                  </div>
                  <p className="text-muted-foreground font-medium">{stat.label}</p>
                </CardContent>
              </Card>))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-primary to-primary/90">
        <div className="container mx-auto px-4 text-center">
          <Shield className="h-16 w-16 text-primary-foreground/80 mx-auto mb-6"/>
          <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
            Tu Salud, Nuestra Prioridad
          </h2>
          <p className="text-primary-foreground/90 text-lg max-w-2xl mx-auto">
            Seguimos trabajando cada día para brindarte el mejor servicio y los productos de más alta calidad.
          </p>
        </div>
      </section>
    </div>);
};
export default About;
