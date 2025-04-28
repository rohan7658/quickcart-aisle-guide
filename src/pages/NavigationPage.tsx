
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useShoppingList } from '@/contexts/ShoppingListContext';
import { ShoppingListItem } from '@/types';
import ProductCard from '@/components/ProductCard';
import { ArrowLeft, Edit, Map } from 'lucide-react';

const NavigationPage = () => {
  const navigate = useNavigate();
  const { currentList, optimizeRoute } = useShoppingList();
  const [optimizedItems, setOptimizedItems] = useState<ShoppingListItem[]>([]);

  useEffect(() => {
    if (!currentList) {
      navigate('/');
      return;
    }

    setOptimizedItems(optimizeRoute());
  }, [currentList, navigate, optimizeRoute]);

  if (!currentList) {
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center mb-6">
        <Button variant="ghost" onClick={() => navigate('/')} className="mr-2">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <h1 className="text-2xl font-bold flex-1">{currentList.name}: Navigation</h1>
        <Button variant="outline" onClick={() => navigate('/create-list')}>
          <Edit className="h-4 w-4 mr-2" />
          Edit List
        </Button>
      </div>

      <Card className="bg-quickcart-50 border-quickcart-200 p-4 mb-6">
        <div className="flex items-start">
          <Map className="h-6 w-6 text-quickcart-600 mr-3 mt-1" />
          <div>
            <h2 className="font-semibold text-quickcart-800">Optimized Shopping Route</h2>
            <p className="text-quickcart-700">
              Follow this route to efficiently navigate through the store. 
              Items are sorted by location for the shortest path.
            </p>
          </div>
        </div>
      </Card>

      <div className="space-y-4">
        {optimizedItems.map((item, index) => (
          <ProductCard
            key={item.product.id}
            product={item.product}
            quantity={item.quantity}
            index={index}
            isNavigationMode={true}
          />
        ))}
      </div>

      {optimizedItems.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No items in your shopping list. Add some items to see the navigation route.
        </div>
      )}
    </div>
  );
};

export default NavigationPage;
