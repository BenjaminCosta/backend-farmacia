import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Heart } from 'lucide-react';
const Footer = () => {
    return (<footer className="bg-gradient-to-b from-secondary to-secondary/80 border-t border-border/40 mt-auto backdrop-blur-sm">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3 group">
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:scale-105 transition-all duration-300">
                <span className="text-primary-foreground font-bold text-xl">FR</span>
              </div>
              <span className="text-xl font-bold text-foreground">Farmacia Russo</span>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Tu farmacia de confianza desde 1985. Cuidando tu salud y bienestar con dedicación y profesionalismo.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-foreground mb-5 text-base tracking-tight">Enlaces Rápidos</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="text-muted-foreground hover:text-primary text-sm transition-all duration-300 hover:translate-x-1 inline-block font-medium">
                  → Inicio
                </Link>
              </li>
              <li>
                <Link to="/catalog" className="text-muted-foreground hover:text-primary text-sm transition-all duration-300 hover:translate-x-1 inline-block font-medium">
                  → Productos
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-muted-foreground hover:text-primary text-sm transition-all duration-300 hover:translate-x-1 inline-block font-medium">
                  → Sobre Nosotros
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-muted-foreground hover:text-primary text-sm transition-all duration-300 hover:translate-x-1 inline-block font-medium">
                  → Contacto
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-muted-foreground hover:text-primary text-sm transition-all duration-300 hover:translate-x-1 inline-block font-medium">
                  → Preguntas Frecuentes
                </Link>
              </li>
            </ul>
          </div>

          {/* Info */}
          <div>
            <h3 className="font-bold text-foreground mb-5 text-base tracking-tight">Información</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/privacy" className="text-muted-foreground hover:text-primary text-sm transition-all duration-300 hover:translate-x-1 inline-block font-medium">
                  → Políticas de Privacidad
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-muted-foreground hover:text-primary text-sm transition-all duration-300 hover:translate-x-1 inline-block font-medium">
                  → Preguntas Frecuentes
                </Link>
              </li>
              <li>
                <Link to="/orders" className="text-muted-foreground hover:text-primary text-sm transition-all duration-300 hover:translate-x-1 inline-block font-medium">
                  → Mis Pedidos
                </Link>
              </li>
              <li>
                <Link to="/wishlist" className="text-muted-foreground hover:text-primary text-sm transition-all duration-300 hover:translate-x-1 inline-block font-medium">
                  → Favoritos
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-bold text-foreground mb-5 text-base tracking-tight">Contacto</h3>
            <ul className="space-y-4">
              <li className="group">
                <a href="tel:01145678900" className="flex items-center text-muted-foreground hover:text-primary text-sm transition-all duration-300 group-hover:translate-x-1">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center mr-3 group-hover:bg-primary/20 transition-colors duration-300">
                    <Phone className="h-4 w-4 text-primary"/>
                  </div>
                  <span className="font-medium">(011) 4567-8900</span>
                </a>
              </li>
              <li className="group">
                <a href="mailto:info@farmaciarusso.com.ar" className="flex items-center text-muted-foreground hover:text-primary text-sm transition-all duration-300 group-hover:translate-x-1">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center mr-3 group-hover:bg-primary/20 transition-colors duration-300">
                    <Mail className="h-4 w-4 text-primary"/>
                  </div>
                  <span className="font-medium">info@farmaciarusso.com.ar</span>
                </a>
              </li>
              <li className="group">
                <div className="flex items-start text-muted-foreground text-sm">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center mr-3 mt-0.5 group-hover:bg-primary/20 transition-colors duration-300">
                    <MapPin className="h-4 w-4 text-primary"/>
                  </div>
                  <span className="font-medium">Av. Corrientes 1234, CABA</span>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border/50 mt-10 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-muted-foreground text-sm font-medium">
              © {new Date().getFullYear()} Farmacia Russo. Todos los derechos reservados.
            </p>
            <p className="text-muted-foreground text-sm flex items-center gap-1">
              Hecho con <Heart className="h-4 w-4 text-red-500 fill-red-500 animate-pulse"/> para tu salud
            </p>
          </div>
        </div>
      </div>
    </footer>);
};
export default Footer;
