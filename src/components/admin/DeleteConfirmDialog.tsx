import { 
    DialogContent, 
    DialogHeader, 
    DialogTitle, 
    DialogFooter 
  } from '@/components/ui/dialog';
  import { Button } from '@/components/ui/button';
  import { Product } from '@/types';
  
  interface DeleteConfirmDialogProps {
    product: Product | null;
    onConfirm: () => void;
    onCancel: () => void;
  }
  
  const DeleteConfirmDialog = ({ product, onConfirm, onCancel }: DeleteConfirmDialogProps) => {
    if (!product) return null;
    
    return (
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Product</DialogTitle>
        </DialogHeader>
        <p>
          Are you sure you want to delete {product.name}? This action cannot be undone.
        </p>
        <DialogFooter>
          <Button variant="outline" onClick={onCancel} type="button">Cancel</Button>
          <Button variant="destructive" onClick={onConfirm} type="button">Delete</Button>
        </DialogFooter>
      </DialogContent>
    );
  };
  
  export default DeleteConfirmDialog;