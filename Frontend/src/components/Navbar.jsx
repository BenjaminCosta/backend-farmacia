import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, LogOut, LayoutDashboard, Package, Heart } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger, } from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
const Navbar = () => {
    const { isAuthenticated, isAdmin, isPharmacist, user, logout } = useAuth();
    const { totalItems } = useCart();
    const { items: wishlistItems } = useWishlist();
    const navigate = useNavigate();
    const handleLogout = () => {
        logout();
        navigate('/');
    };
    return (<nav className="sticky top-0 z-50 bg-background border-b border-border shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-xl">FR</span>
            </div>
            <span className="text-xl font-bold text-foreground">Farmacia Russo</span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-foreground hover:text-primary transition-colors">
              Inicio
            </Link>
            <Link to="/catalog" className="text-foreground hover:text-primary transition-colors">
              Productos
            </Link>
            <Link to="/about" className="text-foreground hover:text-primary transition-colors">
              Sobre Nosotros
            </Link>
            <Link to="/contact" className="text-foreground hover:text-primary transition-colors">
              Contacto
            </Link>
            {isAuthenticated && (<Link to="/orders" className="text-foreground hover:text-primary transition-colors">
                Mis Pedidos
              </Link>)}
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-2">
            {/* Wishlist */}
            <Button variant="ghost" size="icon" className="relative" onClick={() => navigate('/wishlist')}>
              <Heart className="h-5 w-5"/>
              {wishlistItems.length > 0 && (<Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
                  {wishlistItems.length}
                </Badge>)}
            </Button>

            {/* Cart */}
            <Button variant="ghost" size="icon" className="relative" onClick={() => navigate('/cart')}>
              <ShoppingCart className="h-5 w-5"/>
              {totalItems > 0 && (<Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
                  {totalItems}
                </Badge>)}
            </Button>

            {/* User Menu */}
            {isAuthenticated ? (<DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <User className="h-5 w-5"/>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-2 py-1.5 text-sm font-medium">{user?.email}</div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate('/profile')}>
                    <User className="mr-2 h-4 w-4"/>
                    Mi Perfil
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/orders')}>
                    <Package className="mr-2 h-4 w-4"/>
                    Mis Pedidos
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/wishlist')}>
                    <Heart className="mr-2 h-4 w-4"/>
                    Favoritos
                  </DropdownMenuItem>
                  {(isAdmin || isPharmacist) && (<>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => navigate(isAdmin ? '/admin' : '/pharmacist')}>
                        <LayoutDashboard className="mr-2 h-4 w-4"/>
                        {isAdmin ? 'Panel Admin' : 'Panel Farmacéutico'}
                      </DropdownMenuItem>
                    </>)}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4"/>
                    Cerrar Sesión
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>) : (<Button onClick={() => navigate('/login')}>Ingresar</Button>)}
          </div>
        </div>
      </div>
    </nav>);
};
export default Navbar;
