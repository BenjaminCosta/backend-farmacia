import { Link } from 'react-router-dom';
import { ShoppingCart, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { formatPrice } from '@/lib/formatPrice';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { cn } from '@/lib/utils';
const ProductCard = ({ id, name, price, image, description }) => {
    const { addItem } = useCart();
    const { addItem: addToWishlist, isInWishlist, removeItem: removeFromWishlist } = useWishlist();
    const handleAddToCart = (e) => {
        e.preventDefault();
        addItem({ id, name, price, image });
    };
    const handleToggleWishlist = (e) => {
        e.preventDefault();
        if (isInWishlist(id)) {
            removeFromWishlist(id);
        }
        else {
            addToWishlist({ id, name, price, image });
        }
    };
    return (<Link to={`/product/${id}`} className="block h-full">
      <Card className="group hover:shadow-2xl hover:shadow-primary/10 transition-all duration-300 h-full border-border/50 hover:border-primary/50 hover:-translate-y-1 overflow-hidden">
        <CardContent className="p-0">
          <div className="aspect-square bg-gradient-to-br from-secondary to-secondary/50 overflow-hidden relative">
            {image ? (<img src={image} alt={name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"/>) : (<div className="w-full h-full flex items-center justify-center">
                <span className="text-muted-foreground font-medium">Sin imagen</span>
              </div>)}
            
            {/* Overlay gradient on hover */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"/>
            
            {/* Wishlist button */}
            <Button variant="ghost" size="icon" className={cn("absolute top-3 right-3 backdrop-blur-md transition-all duration-300 shadow-lg", isInWishlist(id)
                ? 'bg-primary/90 hover:bg-primary text-primary-foreground'
                : 'bg-background/90 hover:bg-background/100')} onClick={handleToggleWishlist}>
              <Heart className={cn('h-5 w-5 transition-transform duration-300', isInWishlist(id)
                ? 'fill-current scale-110'
                : 'group-hover:scale-110')}/>
            </Button>
          </div>
          
          <div className="p-5 space-y-3">
            <h3 className="font-bold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors duration-300 text-base leading-snug">
              {name}
            </h3>
            {description && (<p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                {description}
              </p>)}
            <div className="flex items-baseline gap-2">
              <p className="text-2xl font-bold text-primary tracking-tight">
                {formatPrice(price)}
              </p>
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="p-5 pt-0">
          <Button onClick={handleAddToCart} className="w-full font-semibold shadow-md hover:shadow-lg transition-all duration-300 group/btn" size="default">
            <ShoppingCart className="mr-2 h-4 w-4 group-hover/btn:scale-110 transition-transform duration-300"/>
            Agregar al Carrito
          </Button>
        </CardFooter>
      </Card>
    </Link>);
};
export default ProductCard;
