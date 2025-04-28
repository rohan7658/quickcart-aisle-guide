import React, { createContext, useContext, useState, useEffect } from 'react';
import { collection, doc, getDocs, setDoc, deleteDoc, query, where, onSnapshot, updateDoc } from 'firebase/firestore';
import { ShoppingList, ShoppingListItem, Product } from '@/types';
import { useToast } from "@/hooks/use-toast";
import { useAuth } from './AuthContext';
import { db } from '@/config/firebase';
import { ProductService } from '@/services/ProductService';

interface ShoppingListContextType {
  lists: ShoppingList[];
  currentList: ShoppingList | null;
  createList: (name: string) => void;
  updateList: (list: ShoppingList) => void;
  deleteList: (id: string) => void;
  setCurrentList: (list: ShoppingList | null) => void;
  addItemToCurrentList: (product: Product, quantity: number) => void;
  removeItemFromCurrentList: (productId: string) => void;
  updateItemQuantity: (productId: string, quantity: number) => void;
  optimizeRoute: () => ShoppingListItem[];
  saveCurrentList: () => void;
  suggestProducts: (query: string) => Promise<Product[]>;
}

const ShoppingListContext = createContext<ShoppingListContextType | undefined>(undefined);

export const ShoppingListProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lists, setLists] = useState<ShoppingList[]>([]);
  const [currentList, setCurrentList] = useState<ShoppingList | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  // Load lists from Firestore when user changes
  useEffect(() => {
    if (!user) {
      setLists([]);
      setCurrentList(null);
      return;
    }

    const q = query(collection(db, 'shoppingLists'), where('userId', '==', user.id));
    
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const fetchedLists: ShoppingList[] = querySnapshot.docs.map(doc => {
        const data = doc.data() as Omit<ShoppingList, 'id'>;
        return { id: doc.id, ...data };
      });
      setLists(fetchedLists);
    }, (error) => {
      console.error("Error loading shopping lists:", error);
      toast({
        title: "Error",
        description: "Failed to load your shopping lists.",
        variant: "destructive",
      });
    });

    return () => unsubscribe();
  }, [user, toast]);

  const [creatingList, setCreatingList] = useState(false);

  const createList = async (name: string) => {
    if (!user || creatingList) return;
  
    setCreatingList(true); // Prevent multiple creations
  
    const newList: ShoppingList = {
      id: doc(collection(db, 'shoppingLists')).id,
      name,
      userId: user.id,
      items: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  
    try {
      await setDoc(doc(db, 'shoppingLists', newList.id), newList);
      setCurrentList(newList);
  
      toast({
        title: "List Created",
        description: `Shopping list "${name}" has been created.`,
      });
    } catch (error) {
      console.error("Error creating list:", error);
      toast({
        title: "Error",
        description: "Failed to create shopping list.",
        variant: "destructive",
      });
    } finally {
      setCreatingList(false); // Allow new creations after the process completes
    }
  };
  

  const updateList = (updatedList: ShoppingList) => {
    const listWithUpdatedTimestamp = { 
      ...updatedList, 
      updatedAt: new Date().toISOString() 
    };
    
    updateDoc(doc(db, 'shoppingLists', updatedList.id), listWithUpdatedTimestamp)
      .then(() => {
        if (currentList?.id === updatedList.id) {
          setCurrentList(listWithUpdatedTimestamp);
        }
        
        toast({
          title: "List Updated",
          description: `Shopping list "${updatedList.name}" has been updated.`,
        });
      })
      .catch(error => {
        console.error("Error updating list:", error);
        toast({
          title: "Error",
          description: "Failed to update shopping list.",
          variant: "destructive",
        });
      });
  };

  const deleteList = (id: string) => {
    const listToDelete = lists.find(list => list.id === id);
    
    deleteDoc(doc(db, 'shoppingLists', id))
      .then(() => {
        if (currentList?.id === id) {
          setCurrentList(null);
        }
        
        toast({
          title: "List Deleted",
          description: listToDelete ? `Shopping list "${listToDelete.name}" has been deleted.` : "Shopping list has been deleted.",
        });
      })
      .catch(error => {
        console.error("Error deleting list:", error);
        toast({
          title: "Error",
          description: "Failed to delete shopping list.",
          variant: "destructive",
        });
      });
  };

  // The rest of the functions remain similar but work with the currentList state
  // which will now be synced with Firebase

  const addItemToCurrentList = (product: Product, quantity: number) => {
    if (!currentList) return;
    
    const updatedList = {...currentList};
    const existingItemIndex = updatedList.items.findIndex(item => item.product.id === product.id);
    
    if (existingItemIndex >= 0) {
      // Update quantity if product already exists in list
      updatedList.items[existingItemIndex] = {
        ...updatedList.items[existingItemIndex],
        quantity: updatedList.items[existingItemIndex].quantity + quantity
      };
    } else {
      // Add new item to list
      updatedList.items = [...updatedList.items, { product, quantity }];
    }
    
    updatedList.updatedAt = new Date().toISOString();
    setCurrentList(updatedList);
    
    toast({
      title: "Item Added",
      description: `${product.name} added to your shopping list.`,
    });
  };

  const removeItemFromCurrentList = (productId: string) => {
    if (!currentList) return;
    
    const updatedList = {
      ...currentList,
      items: currentList.items.filter(item => item.product.id !== productId),
      updatedAt: new Date().toISOString()
    };
    
    setCurrentList(updatedList);
  };

  const updateItemQuantity = (productId: string, quantity: number) => {
    if (!currentList) return;
    
    const updatedList = {
      ...currentList,
      items: currentList.items.map(item => 
        item.product.id === productId 
          ? { ...item, quantity } 
          : item
      ),
      updatedAt: new Date().toISOString()
    };
    
    setCurrentList(updatedList);
  };

  const optimizeRoute = (): ShoppingListItem[] => {
    if (!currentList) return [];
    
    // Simple optimization algorithm: sort items by floor, then aisle, then row
    const optimizedItems = [...currentList.items].sort((a, b) => {
      // Compare floors
      if (a.product.location.floor !== b.product.location.floor) {
        return a.product.location.floor - b.product.location.floor;
      }
      
      // If floors are equal, compare aisles
      if (a.product.location.aisle !== b.product.location.aisle) {
        return a.product.location.aisle - b.product.location.aisle;
      }
      
      // If floors and aisles are equal, compare rows
      return a.product.location.row - b.product.location.row;
    });
    
    toast({
      title: "Route Optimized",
      description: "Your shopping route has been optimized for efficiency.",
    });
    
    return optimizedItems;
  };

  const saveCurrentList = () => {
    if (!currentList) return;
    
    updateDoc(doc(db, 'shoppingLists', currentList.id), {
      ...currentList,
      updatedAt: new Date().toISOString()
    })
    .then(() => {
      toast({
        title: "List Saved",
        description: `Shopping list "${currentList.name}" has been saved.`,
      });
    })
    .catch(error => {
      console.error("Error saving list:", error);
      toast({
        title: "Error",
        description: "Failed to save shopping list.",
        variant: "destructive",
      });
    });
  };

  const suggestProducts = async (query: string): Promise<Product[]> => {
    if (!query || query.trim() === '') return [];
    
    try {
      const searchResults = await ProductService.searchProducts(query);
      return searchResults.slice(0, 5); // Return up to 5 suggestions
    } catch (error) {
      console.error("Error suggesting products:", error);
      toast({
        title: "Error",
        description: "Failed to search for products.",
        variant: "destructive",
      });
      return [];
    }
  };

  return (
    <ShoppingListContext.Provider
      value={{
        lists,
        currentList,
        createList,
        updateList,
        deleteList,
        setCurrentList,
        addItemToCurrentList,
        removeItemFromCurrentList,
        updateItemQuantity,
        optimizeRoute,
        saveCurrentList,
        suggestProducts,
      }}
    >
      {children}
    </ShoppingListContext.Provider>
  );
};

export const useShoppingList = () => {
  const context = useContext(ShoppingListContext);
  if (context === undefined) {
    throw new Error('useShoppingList must be used within a ShoppingListProvider');
  }
  return context;
};