import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from '@/components/ui/dialog';
import { useToast } from "@/hooks/use-toast";
import { Product } from '@/types';
import { ProductService } from '@/services/ProductService';

interface ProductFormProps {
  currentProduct: Product | null;
  onClose: () => void;
  onProductSaved: (product: Product) => void;
}

const ProductForm = ({ currentProduct, onClose, onProductSaved }: ProductFormProps) => {
  const { toast } = useToast();
  
  const [name, setName] = useState('');
  const [serialNumber, setSerialNumber] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [image, setImage] = useState('/placeholder.svg');
  const [floor, setFloor] = useState('');
  const [aisle, setAisle] = useState('');
  const [row, setRow] = useState('');
  const [category, setCategory] = useState('');

  useEffect(() => {
    if (currentProduct) {
      setName(currentProduct.name);
      setSerialNumber(currentProduct.serialNumber);
      setPrice(currentProduct.price.toString());
      setQuantity(currentProduct.quantity.toString());
      setImage(currentProduct.image || '/placeholder.svg');
      setFloor(currentProduct.location.floor.toString());
      setAisle(currentProduct.location.aisle.toString());
      setRow(currentProduct.location.row.toString());
      setCategory(currentProduct.category);
    } else {
      // Reset form for new product
      setName('');
      setSerialNumber('');
      setPrice('');
      setQuantity('');
      setImage('/placeholder.svg');
      setFloor('');
      setAisle('');
      setRow('');
      setCategory('');
    }
  }, [currentProduct]);

  const validateForm = () => {
    if (!name || !serialNumber || !price || !quantity || !floor || !aisle || !row || !category) {
      toast({
        title: "Validation Error",
        description: "All fields are required",
        variant: "destructive",
      });
      return false;
    }
    return true;
  };

  const handleSaveProduct = async () => {
    if (!validateForm()) return;

    try {
      // Convert string values to appropriate types before sending to API
      const productData = {
        name,
        serialNumber,
        price: parseFloat(price),
        quantity: parseInt(quantity, 10),
        image: image || '/placeholder.svg',
        location: {
          floor: parseInt(floor, 10),
          aisle: parseInt(aisle, 10),
          row: parseInt(row, 10),
        },
        category,
      };

      let savedProduct;
      
      if (currentProduct) {
        await ProductService.updateProduct(currentProduct.id, productData);
        savedProduct = { 
          ...currentProduct, 
          ...productData
        };
        
        toast({
          title: "Success",
          description: `${name} has been updated.`,
        });
      } else {
        const newProductId = await ProductService.createProduct(productData);
        savedProduct = { 
          id: newProductId, 
          ...productData
        };
        
        toast({
          title: "Success",
          description: `${name} has been added.`,
        });
      }

      onProductSaved(savedProduct);
      onClose();
    } catch (error) {
      console.error('Error saving product:', error);
      toast({
        title: "Error",
        description: `Failed to save product: ${(error as Error).message}`,
        variant: "destructive",
      });
    }
  };

  return (
    <DialogContent className="max-w-md">
      <DialogHeader>
        <DialogTitle>
          {currentProduct ? `Edit ${currentProduct.name}` : 'Add New Product'}
        </DialogTitle>
      </DialogHeader>
      
      <div className="grid grid-cols-2 gap-4 py-4">
        <div className="col-span-2">
          <Label htmlFor="name">Product Name</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., Milk"
          />
        </div>
        
        <div>
          <Label htmlFor="serialNumber">Serial Number</Label>
          <Input
            id="serialNumber"
            value={serialNumber}
            onChange={(e) => setSerialNumber(e.target.value)}
            placeholder="e.g., P123"
          />
        </div>
        
        <div>
          <Label htmlFor="category">Category</Label>
          <Input
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="e.g., Dairy"
          />
        </div>
        
        <div>
          <Label htmlFor="price">Price (Rs)</Label>
          <Input
            id="price"
            type="number"
            step="0.01"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="e.g., 2.99"
          />
        </div>
        
        <div>
          <Label htmlFor="quantity">Quantity in Stock</Label>
          <Input
            id="quantity"
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            placeholder="e.g., 100"
          />
        </div>
        
        <div className="col-span-2">
          <Label htmlFor="image">Image URL</Label>
          <Input
            id="image"
            value={image}
            onChange={(e) => setImage(e.target.value)}
            placeholder="/placeholder.svg"
          />
        </div>
        
        <div className="col-span-2">
          <h3 className="font-medium mb-2">Location</h3>
          <div className="grid grid-cols-3 gap-2">
            <div>
              <Label htmlFor="floor">Floor</Label>
              <Input
                id="floor"
                type="number"
                value={floor}
                onChange={(e) => setFloor(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="aisle">Aisle</Label>
              <Input
                id="aisle"
                type="number"
                value={aisle}
                onChange={(e) => setAisle(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="row">Row</Label>
              <Input
                id="row"
                type="number"
                value={row}
                onChange={(e) => setRow(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>
      
      <DialogFooter>
        <Button variant="outline" onClick={onClose} type="button">Cancel</Button>
        <Button onClick={handleSaveProduct} type="button">Save</Button>
      </DialogFooter>
    </DialogContent>
  );
};

export default ProductForm;
