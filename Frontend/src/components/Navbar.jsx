import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, LogOut, LayoutDashboard, Package, Heart } from 'lucide-react';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { selectUser, selectIsAuthenticated, logout } from '@/store/auth/authSlice';
import { selectCartItemsCount } from '@/store/cart/cartSlice';
import { selectWishlistItems } from '@/store/wishlist/wishlistSlice';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger, } from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';

const Navbar = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    
    const isAuthenticated = useAppSelector(selectIsAuthenticated);
    const user = useAppSelector(selectUser);
    const totalItems = useAppSelector(selectCartItemsCount);
    const wishlistItems = useAppSelector(selectWishlistItems);
    
    const isAdmin = user?.role === 'ADMIN';
    const isPharmacist = user?.role === 'PHARMACIST';

    const handleLogout = () => {
        dispatch(logout());
        navigate('/');
    };
    return (<nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border/40 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-11 h-11 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg group-hover:scale-105 transition-all duration-300">
              <span className="text-primary-foreground font-bold text-xl">FR</span>
            </div>
            <span className="text-xl font-bold text-foreground group-hover:text-primary transition-colors duration-300">Farmacia Russo</span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="relative text-foreground font-semibold hover:text-primary transition-colors duration-300 group">
              <span>Inicio</span>
              <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300 ease-out"></span>
            </Link>
            <Link to="/catalog" className="relative text-foreground font-semibold hover:text-primary transition-colors duration-300 group">
              <span>Productos</span>
              <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300 ease-out"></span>
            </Link>
            <Link to="/about" className="relative text-foreground font-semibold hover:text-primary transition-colors duration-300 group">
              <span>Sobre Nosotros</span>
              <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300 ease-out"></span>
            </Link>
            <Link to="/contact" className="relative text-foreground font-semibold hover:text-primary transition-colors duration-300 group">
              <span>Contacto</span>
              <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300 ease-out"></span>
            </Link>
            {isAuthenticated && (<Link to="/orders" className="relative text-foreground font-semibold hover:text-primary transition-colors duration-300 group">
                <span>Mis Pedidos</span>
                <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300 ease-out"></span>
              </Link>)}
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-1">
            {/* Wishlist */}
            <Button variant="ghost" size="icon" className="relative" onClick={() => navigate('/wishlist')}>
              <Heart className="h-5 w-5"/>
              {wishlistItems.length > 0 && (<Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
                  {wishlistItems.length}
                </Badge>)}
            </Button>

            {/* Cart */}
            <Button variant="ghost" size="icon" className="relative hover:scale-110 transition-all duration-300" onClick={() => navigate('/cart')}>
              <ShoppingCart className="h-5 w-5 transition-transform duration-300"/>
              {totalItems > 0 && (<Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs border-0 shadow-md animate-in fade-in zoom-in duration-300">
                  {totalItems}
                </Badge>)}
            </Button>

            {/* User Menu */}
            {isAuthenticated ? (<DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="hover:bg-primary hover:scale-110 transition-all duration-300">
                    <User className="h-5 w-5 transition-transform duration-300"/>
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
                      <DropdownMenuItem onClick={() => navigate(isAdmin ? '/admin' : '/pharmacist')} className="cursor-pointer hover:bg-primary/10">
                        <LayoutDashboard className="mr-2 h-4 w-4"/>
                        {isAdmin ? 'Panel Admin' : 'Panel Farmacéutico'}
                      </DropdownMenuItem>
                    </>)}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="cursor-pointer hover:bg-destructive/10 text-destructive">
                    <LogOut className="mr-2 h-4 w-4"/>
                    Cerrar Sesión
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>) : (<Button onClick={() => navigate('/login')} className="font-semibold shadow-md hover:shadow-lg transition-all duration-300">
                Ingresar
              </Button>)}
          </div>
        </div>
      </div>
    </nav>);
};
export default Navbar;
