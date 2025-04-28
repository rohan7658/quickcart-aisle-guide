import { collection, doc, getDoc, getDocs, setDoc, addDoc, updateDoc, deleteDoc, query, where } from 'firebase/firestore';
import { db } from '@/config/firebase';
import { Product } from '@/types';

export const ProductService = {
  getAllProducts: async (): Promise<Product[]> => {
    try {
      const querySnapshot = await getDocs(collection(db, 'products'));
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
    } catch (error) {
      console.error("Error getting products:", error);
      throw error;
    }
  },

  getProductById: async (id: string): Promise<Product | null> => {
    try {
      const docRef = doc(db, 'products', id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as Product;
      } else {
        return null;
      }
    } catch (error) {
      console.error("Error getting product:", error);
      throw error;
    }
  },

  createProduct: async (product: Omit<Product, 'id'>): Promise<string> => {
    try {
      // Ensure all required fields are present with correct types
      const validatedProduct = {
        name: product.name || '',
        serialNumber: product.serialNumber || '',
        price: typeof product.price === 'number' ? product.price : parseFloat(String(product.price)),
        quantity: typeof product.quantity === 'number' ? product.quantity : parseInt(String(product.quantity)),
        image: product.image || '/placeholder.svg',
        location: {
          floor: typeof product.location.floor === 'number' ? product.location.floor : parseInt(String(product.location.floor)),
          aisle: typeof product.location.aisle === 'number' ? product.location.aisle : parseInt(String(product.location.aisle)),
          row: typeof product.location.row === 'number' ? product.location.row : parseInt(String(product.location.row)),
        },
        category: product.category || '',
      };
      
      const newProductRef = await addDoc(collection(db, 'products'), validatedProduct);
      return newProductRef.id;
    } catch (error) {
      console.error("Error creating product:", error);
      throw error;
    }
  },
  
  updateProduct: async (id: string, product: Partial<Product>): Promise<void> => {
    try {
      // Convert string values to numbers for numerical fields if they exist
      const updates: Partial<Product> = { ...product };
      
      if (typeof updates.price === 'string') {
        updates.price = Number(updates.price);
      }
      
      if (typeof updates.quantity === 'string') {
        updates.quantity = Number(updates.quantity);
      }
      
      if (updates.location) {
        const location = { ...updates.location };
        if (typeof location.floor === 'string') location.floor = Number(location.floor);
        if (typeof location.aisle === 'string') location.aisle = Number(location.aisle);
        if (typeof location.row === 'string') location.row = Number(location.row);
        updates.location = location;
      }
      
      await updateDoc(doc(db, 'products', id), updates);
    } catch (error) {
      console.error("Error updating product:", error);
      throw error;
    }
  },

  deleteProduct: async (id: string): Promise<void> => {
    try {
      await deleteDoc(doc(db, 'products', id));
    } catch (error) {
      console.error("Error deleting product:", error);
      throw error;
    }
  },

  searchProducts: async (query: string): Promise<Product[]> => {
    try {
      // In Firestore, we can't easily do partial text search without additional services
      // For now, we'll fetch all and filter client-side
      // In production, you'd use Algolia, Elasticsearch, or Cloud Firestore's array-contains
      const products = await ProductService.getAllProducts();
      const lowerCaseQuery = query.toLowerCase();
      
      return products.filter(product => 
        product.name.toLowerCase().includes(lowerCaseQuery) ||
        product.serialNumber.toLowerCase().includes(lowerCaseQuery) ||
        product.category.toLowerCase().includes(lowerCaseQuery)
      );
    } catch (error) {
      console.error("Error searching products:", error);
      throw error;
    }
  }
};
