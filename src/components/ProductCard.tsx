
import { Product } from '@/types';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  quantity: number;
  index?: number;
  isNavigationMode?: boolean;
}

const ProductCard = ({ product, quantity, index, isNavigationMode = false }: ProductCardProps) => {
  return (
    <Card className={`overflow-hidden ${isNavigationMode ? 'border-l-4 border-quickcart-500' : ''}`}>
      <div className="flex h-full">
        {isNavigationMode && index !== undefined && (
          <div className="flex items-center justify-center bg-quickcart-500 text-white font-bold p-4 text-2xl min-w-[60px]">
            {index + 1}
          </div>
        )}
        
        <div className="flex-1">
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-semibold text-lg">{product.name}</h3>
                <div className="flex items-center mt-1 text-gray-500 text-sm">
                  <span className="inline-block bg-gray-200 rounded px-2 py-1">SN: {product.serialNumber}</span>
                </div>
                <div className="mt-2">Quantity: {quantity}</div>
                <div className="mt-1 font-medium">Rs{product.price.toFixed(2)}</div>
              </div>
              
              <div className="w-16 h-16 rounded overflow-hidden">
                <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
              </div>
            </div>
            
            {isNavigationMode && (
              <div className="mt-3 flex items-center text-quickcart-700">
                <MapPin className="h-4 w-4 mr-1" />
                <span>
                  Floor {product.location.floor}, 
                  Aisle {product.location.aisle}, 
                  Row {product.location.row}
                </span>
              </div>
            )}
          </CardContent>
        </div>
      </div>
    </Card>
  );
};

export default ProductCard;
