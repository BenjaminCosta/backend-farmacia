import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { formatPrice } from '@/lib/formatPrice';
import { useAppDispatch } from '@/store/hooks';
import { addItem } from '@/store/cart/cartSlice';
import { useWishlist } from '@/context/WishlistContext';
import { cn } from '@/lib/utils';
import client from '@/api/client';

const ProductCard = ({ id, name, price, image, description }) => {
    const dispatch = useAppDispatch();
    const { addItem: addToWishlist, isInWishlist, removeItem: removeFromWishlist } = useWishlist();
    const [primaryImage, setPrimaryImage] = useState(null);
    const [imageLoading, setImageLoading] = useState(true);

    useEffect(() => {
        const fetchPrimaryImage = async () => {
            try {
                setImageLoading(true);
                const response = await client.get(`/api/v1/products/${id}/images`);
                const images = response.data;
                const primary = images.find(img => img.isPrimary) || images[0];
                setPrimaryImage(primary);
            } catch (error) {
                console.error('Error cargando imagen:', error);
            } finally {
                setImageLoading(false);
            }
        };

        fetchPrimaryImage();
    }, [id]);

    const getImageUrl = (imageId, width = null) => {
        const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:4002';
        return width ? `${baseUrl}/images/${imageId}?w=${width}` : `${baseUrl}/images/${imageId}`;
    };
    
    const handleAddToCart = (e) => {
        e.preventDefault();
        dispatch(addItem({ productId: id, name, price, quantity: 1 }));
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
      <Card className="group hover:shadow-2xl hover:shadow-primary/20 transition-all duration-300 h-full border-border/60 hover:border-primary/60 hover:-translate-y-2 overflow-hidden bg-card/95 backdrop-blur-sm">
        <CardContent className="p-0">
          <div className="aspect-square bg-gradient-to-br from-secondary/80 to-secondary/40 overflow-hidden relative">
            {imageLoading ? (
              <div className="w-full h-full flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            ) : primaryImage ? (
              <img 
                src={getImageUrl(primaryImage.id, 320)} 
                srcSet={`
                  ${getImageUrl(primaryImage.id, 320)} 320w,
                  ${getImageUrl(primaryImage.id, 800)} 800w
                `}
                sizes="(max-width: 640px) 100vw, 320px"
                alt={name} 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                loading="lazy"
              />
            ) : image ? (
              <img 
                src={image} 
                alt={name} 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-muted-foreground font-medium text-sm">Sin imagen</span>
              </div>
            )}
            
            {/* Overlay gradient on hover */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-black/0 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"/>
            
            {/* Wishlist button */}
            <Button variant="ghost" size="icon" className={cn("absolute top-3 right-3 backdrop-blur-md transition-all duration-300 shadow-lg hover:scale-110", isInWishlist(id)
                ? 'bg-primary/90 hover:bg-primary text-primary-foreground'
                : 'bg-background/90 hover:bg-background/100')} onClick={handleToggleWishlist}>
              <Heart className={cn('h-5 w-5 transition-transform duration-300', isInWishlist(id)
                ? 'fill-current scale-110'
                : 'group-hover:scale-110')}/>
            </Button>
          </div>
          
          <div className="p-5 md:p-6 space-y-3">
            <h3 className="font-bold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors duration-300 text-base md:text-lg leading-snug">
              {name}
            </h3>
            {description && (<p className="text-xs md:text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                {description}
              </p>)}
            <div className="flex items-baseline gap-2 pt-1">
              <p className="text-2xl md:text-3xl font-bold text-primary tracking-tight">
                {formatPrice(price)}
              </p>
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="p-5 md:p-6 pt-0">
          <Button onClick={handleAddToCart} className="w-full font-semibold shadow-md hover:shadow-lg hover:scale-[1.02] transition-all duration-300 group/btn h-11" size="default">
            <ShoppingCart className="mr-2 h-4 w-4 group-hover/btn:scale-110 transition-transform duration-300"/>
            Agregar al Carrito
          </Button>
        </CardFooter>
      </Card>
    </Link>);
};
export default ProductCard;
