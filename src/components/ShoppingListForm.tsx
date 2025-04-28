import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { useShoppingList } from '@/contexts/ShoppingListContext';
import { Product } from '@/types';
import { Plus, Search, X } from 'lucide-react';
import ProductCard from './ProductCard';

const ShoppingListForm = () => {
  const [productName, setProductName] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [suggestions, setSuggestions] = useState<Product[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const suggestionRef = useRef<HTMLDivElement>(null);

  const { 
    currentList, 
    addItemToCurrentList, 
    removeItemFromCurrentList, 
    suggestProducts
  } = useShoppingList();

  useEffect(() => {
    const searchProducts = async () => {
      if (productName.trim().length > 0) {
        setIsSearching(true);
        try {
          const results = await suggestProducts(productName);
          setSuggestions(results);
          setShowSuggestions(results.length > 0);
        } catch (error) {
          console.error("Error searching products:", error);
        } finally {
          setIsSearching(false);
        }
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    };
    
    const debounceTimeout = setTimeout(searchProducts, 300);
    return () => clearTimeout(debounceTimeout);
  }, [productName, suggestProducts]);

  // Close suggestions dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (suggestionRef.current && !suggestionRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleAddItem = (product: Product) => {
    if (quantity > 0) {
      addItemToCurrentList(product, quantity);
      setProductName('');
      setQuantity(1);
      setShowSuggestions(false);
    }
  };

  const handleSelectSuggestion = (product: Product) => {
    setProductName(product.name);
    setShowSuggestions(false);
  };

  // ... keep existing code (the rest of the component)
  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Add Items</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <label htmlFor="product" className="block text-sm font-medium mb-2">Product</label>
            <div className="relative">
              <Input
                id="product"
                type="text"
                placeholder="Search for products..."
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                className="w-full"
              />
              {isSearching ? (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4">
                  <div className="animate-spin h-4 w-4 border-2 border-quickcart-500 rounded-full border-t-transparent"></div>
                </div>
              ) : (
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              )}
            </div>
            
            {showSuggestions && suggestions.length > 0 && (
              <div 
                ref={suggestionRef}
                className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md border overflow-hidden"
              >
                {suggestions.map((product) => (
                  <div
                    key={product.id}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex justify-between items-center"
                    onClick={() => handleSelectSuggestion(product)}
                  >
                    <div>
                      <div>{product.name}</div>
                      <div className="text-sm text-gray-500">Rs {product.price.toFixed(2)}</div>
                    </div>
                    <Button 
                      size="sm" 
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddItem(product);
                      }}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div>
            <label htmlFor="quantity" className="block text-sm font-medium mb-2">Quantity</label>
            <Input
              id="quantity"
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
              className="w-full"
            />
          </div>
          
          <div className="flex items-end">
            <Button 
              onClick={() => {
                const selectedProduct = suggestions.find(p => p.name === productName);
                if (selectedProduct) {
                  handleAddItem(selectedProduct);
                }
              }}
              disabled={!productName || !suggestions.some(p => p.name === productName)}
              className="w-full"
            >
              Add to List
            </Button>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-xl font-semibold mb-4">
          Current Items ({currentList?.items.length || 0})
        </h2>
        
        {currentList?.items.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            Your shopping list is empty. Add some items!
          </div>
        ) : (
          <div className="space-y-4">
            {currentList?.items.map((item) => (
              <div key={item.product.id} className="relative">
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-2 text-gray-500 hover:text-red-500 z-10"
                  onClick={() => removeItemFromCurrentList(item.product.id)}
                >
                  <X className="h-4 w-4" />
                </Button>
                <ProductCard product={item.product} quantity={item.quantity} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ShoppingListForm;
