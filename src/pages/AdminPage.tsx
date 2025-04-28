import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog } from '@/components/ui/dialog';
import { Product } from '@/types';
import { Plus } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { ProductService } from '@/services/ProductService';
import ProductTable from '@/components/admin/ProductTable';
import ProductForm from '@/components/admin/ProductForm';
import DeleteConfirmDialog from '@/components/admin/DeleteConfirmDialog';

const AdminPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const fetchedProducts = await ProductService.getAllProducts();
        setProducts(fetchedProducts);
      } catch (error) {
        console.error('Failed to fetch products:', error);
        toast({
          title: "Error",
          description: "Failed to load products.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [toast]);

  const handleAddNewClick = () => {
    setCurrentProduct(null);
    setIsDialogOpen(true);
  };

  const handleEditClick = (product: Product) => {
    setCurrentProduct(product);
    setIsDialogOpen(true);
  };

  const handleDeleteClick = (product: Product) => {
    setCurrentProduct(product);
    setIsDeleteDialogOpen(true);
  };

  const handleProductSaved = (product: Product) => {
    if (currentProduct) {
      // Update existing product
      setProducts(products.map(p => p.id === product.id ? product : p));
    } else {
      // Add new product
      setProducts([...products, product]);
    }
  };

  const handleDeleteProduct = async () => {
    if (currentProduct) {
      try {
        await ProductService.deleteProduct(currentProduct.id);
        
        setProducts(products.filter(p => p.id !== currentProduct.id));
        
        toast({
          title: "Product Deleted",
          description: `${currentProduct.name} has been removed.`,
        });
        
        setIsDeleteDialogOpen(false);
        setCurrentProduct(null);
      } catch (error) {
        console.error('Error deleting product:', error);
        toast({
          title: "Error",
          description: "Failed to delete product.",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      <div className="flex justify-between items-center mb-6">
        <div className="w-64">
          <Input
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button onClick={handleAddNewClick} type="button">
          <Plus className="mr-2 h-4 w-4" />
          Add New Product
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Product Management</CardTitle>
        </CardHeader>
        <CardContent>
          <ProductTable 
            products={products}
            isLoading={isLoading}
            searchTerm={searchTerm}
            onEditClick={handleEditClick}
            onDeleteClick={handleDeleteClick}
          />
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <ProductForm 
          currentProduct={currentProduct}
          onClose={() => setIsDialogOpen(false)}
          onProductSaved={handleProductSaved}
        />
      </Dialog>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DeleteConfirmDialog 
          product={currentProduct}
          onConfirm={handleDeleteProduct}
          onCancel={() => setIsDeleteDialogOpen(false)}
        />
      </Dialog>
    </div>
  );
};

export default AdminPage;
