import { useNavigate } from 'react-router-dom';
import { Heart, ShoppingCart, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useWishlist } from '@/context/WishlistContext';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/lib/formatPrice';
const Wishlist = () => {
    const navigate = useNavigate();
    const { items, removeItem } = useWishlist();
    const { addItem } = useCart();
    const handleAddToCart = (item) => {
        addItem(item);
    };
    if (items.length === 0) {
        return (<div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Heart className="h-24 w-24 text-muted-foreground mx-auto mb-4"/>
          <h2 className="text-2xl font-bold mb-2">Tu lista de favoritos está vacía</h2>
          <p className="text-muted-foreground mb-6">
            Guardá productos para verlos más tarde
          </p>
          <Button onClick={() => navigate('/catalog')}>Ver Productos</Button>
        </div>
      </div>);
    }
    return (<div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">Mis Favoritos</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {items.map((item) => (<Card key={item.id} className="group hover:shadow-lg transition-shadow">
              <CardContent className="p-4">
                {/* Image */}
                <div className="aspect-square bg-secondary rounded-lg overflow-hidden mb-4">
                  {item.image ? (<img src={item.image} alt={item.name} className="w-full h-full object-cover"/>) : (<div className="w-full h-full flex items-center justify-center">
                      <span className="text-muted-foreground text-sm">Sin imagen</span>
                    </div>)}
                </div>

                {/* Details */}
                <h3 className="font-semibold mb-2 line-clamp-2">{item.name}</h3>
                <p className="text-lg font-bold text-primary mb-4">
                  {formatPrice(item.price)}
                </p>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button onClick={() => handleAddToCart(item)} className="flex-1" size="sm">
                    <ShoppingCart className="mr-2 h-4 w-4"/>
                    Agregar
                  </Button>
                  <Button onClick={() => removeItem(item.id)} variant="outline" size="sm" className="text-destructive hover:bg-destructive hover:text-destructive-foreground">
                    <Trash2 className="h-4 w-4"/>
                  </Button>
                </div>
              </CardContent>
            </Card>))}
        </div>
      </div>
    </div>);
};
export default Wishlist;
