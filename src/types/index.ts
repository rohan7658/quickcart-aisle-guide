
export interface User {
  id: string;
  email: string;
  name: string;
  isAdmin: boolean;
}

export interface Product {
  id: string;
  name: string;
  serialNumber: string;
  quantity: number;
  price: number;
  image: string;
  location: {
    floor: number;
    aisle: number;
    row: number;
  };
  category: string;
}

export interface ShoppingListItem {
  product: Product;
  quantity: number;
}

export interface ShoppingList {
  id: string;
  name: string;
  userId: string;
  items: ShoppingListItem[];
  createdAt: string;
  updatedAt: string;
}
