
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useShoppingList } from '@/contexts/ShoppingListContext';
import { ShoppingCart, Plus, ListChecks, Edit, Trash2, Map } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const HomePage = () => {
  const { user } = useAuth();
  const { lists, createList, deleteList, setCurrentList } = useShoppingList();
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newListName, setNewListName] = useState('');
  const [deleteConfirmation, setDeleteConfirmation] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleCreateList = () => {
    if (newListName.trim()) {
      createList(newListName);
      setNewListName('');
      setShowCreateDialog(false);
      navigate('/create-list');
    }
  };

  const handleEditList = (listId: string) => {
    const listToEdit = lists.find(list => list.id === listId);
    if (listToEdit) {
      setCurrentList(listToEdit);
      navigate('/create-list');
    }
  };

  const handleViewNavigation = (listId: string) => {
    const listToView = lists.find(list => list.id === listId);
    if (listToView) {
      setCurrentList(listToView);
      navigate('/navigation');
    }
  };

  const confirmDeleteList = (listId: string) => {
    setDeleteConfirmation(listId);
  };

  const handleDeleteList = () => {
    if (deleteConfirmation) {
      deleteList(deleteConfirmation);
      setDeleteConfirmation(null);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Welcome to QuickCart</h1>
        <p className="text-lg text-gray-600 mb-6">
          Navigate supermarkets efficiently with text-based navigation for your shopping lists
        </p>
        
        {user ? (
          <Button onClick={() => setShowCreateDialog(true)} className="px-6 py-6">
            <Plus className="mr-2 h-5 w-5" />
            Create New Shopping List
          </Button>
        ) : (
          <Link to="/login">
            <Button className="px-6 py-6">
              Sign in to get started
            </Button>
          </Link>
        )}
      </div>

      {user && (
        <div className="mt-10">
          <h2 className="text-2xl font-semibold mb-4 flex items-center">
            <ListChecks className="mr-2" />
            Your Shopping Lists
          </h2>
          
          {lists.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center text-gray-500">
                <ShoppingCart className="mx-auto h-12 w-12 text-gray-400 mb-3" />
                <p>You don't have any shopping lists yet.</p>
                <Button onClick={() => setShowCreateDialog(true)} variant="outline" className="mt-4">
                  <Plus className="mr-2 h-4 w-4" />
                  Create Your First List
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {lists.map((list) => (
                <Card key={list.id} className="overflow-hidden">
                  <CardContent className="p-0">
                    <div className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-lg">{list.name}</h3>
                          <p className="text-sm text-gray-500">
                            {list.items.length} {list.items.length === 1 ? 'item' : 'items'}
                          </p>
                        </div>
                        <div className="flex space-x-1">
                          <Button variant="ghost" size="sm" onClick={() => handleEditList(list.id)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleViewNavigation(list.id)}>
                            <Map className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => confirmDeleteList(list.id)}>
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="mt-2 text-sm">
                        <p className="text-gray-500">
                          Updated: {new Date(list.updatedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 p-3 border-t flex justify-between items-center">
                      <span className="text-sm text-gray-500">
                        Created: {new Date(list.createdAt).toLocaleDateString()}
                      </span>
                      <Button size="sm" onClick={() => handleViewNavigation(list.id)}>
                        View Navigation
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Create List Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Shopping List</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="listName">List Name</Label>
            <Input
              id="listName"
              value={newListName}
              onChange={(e) => setNewListName(e.target.value)}
              placeholder="e.g., Weekly Groceries"
              autoFocus
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateDialog(false)}>Cancel</Button>
            <Button onClick={handleCreateList}>Create List</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteConfirmation} onOpenChange={() => setDeleteConfirmation(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Shopping List</DialogTitle>
          </DialogHeader>
          <p>Are you sure you want to delete this shopping list? This action cannot be undone.</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirmation(null)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDeleteList}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default HomePage;
