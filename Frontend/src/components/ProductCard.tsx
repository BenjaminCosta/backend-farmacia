import { Link } from 'react-router-dom';
import { ShoppingCart, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { formatPrice } from '@/lib/formatPrice';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { cn } from '@/lib/utils';

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  image?: string;
  description?: string;
}

const ProductCard = ({ id, name, price, image, description }: ProductCardProps) => {
  const { addItem } = useCart();
  const { addItem: addToWishlist, isInWishlist, removeItem: removeFromWishlist } = useWishlist();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem({ id, name, price, image });
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isInWishlist(id)) {
      removeFromWishlist(id);
    } else {
      addToWishlist({ id, name, price, image });
    }
  };

  return (
    <Link to={`/product/${id}`}>
      <Card className="group hover:shadow-lg transition-shadow duration-200 h-full">
        <CardContent className="p-0">
          <div className="aspect-square bg-secondary overflow-hidden rounded-t-lg relative">
            {image ? (
              <img
                src={image}
                alt={name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-muted-foreground">Sin imagen</span>
              </div>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 bg-background/80 hover:bg-background"
              onClick={handleToggleWishlist}
            >
              <Heart
                className={cn(
                  'h-5 w-5',
                  isInWishlist(id) ? 'fill-primary text-primary' : 'text-muted-foreground'
                )}
              />
            </Button>
          </div>
          <div className="p-4">
            <h3 className="font-semibold text-foreground mb-1 line-clamp-2">{name}</h3>
            {description && (
              <p className="text-sm text-muted-foreground line-clamp-2 mb-2">{description}</p>
            )}
            <p className="text-lg font-bold text-primary">{formatPrice(price)}</p>
          </div>
        </CardContent>
        <CardFooter className="p-4 pt-0">
          <Button
            onClick={handleAddToCart}
            className="w-full"
            size="sm"
          >
            <ShoppingCart className="mr-2 h-4 w-4" />
            Agregar al Carrito
          </Button>
        </CardFooter>
      </Card>
    </Link>
  );
};

export default ProductCard;
