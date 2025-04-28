
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import ShoppingListForm from '@/components/ShoppingListForm';
import { useShoppingList } from '@/contexts/ShoppingListContext';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Save, Navigation, ArrowLeft } from 'lucide-react';

const CreateListPage = () => {
  const navigate = useNavigate();
  const { currentList, setCurrentList, createList, saveCurrentList } = useShoppingList();
  const [listName, setListName] = useState('');

  // Initialize list name from current list
  useEffect(() => {
    if (currentList) {
      setListName(currentList.name);
    } else {
      setListName('New Shopping List');
      createList('New Shopping List');
    }
  }, [currentList, createList]);

  // Update list name when input changes
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setListName(e.target.value);
    if (currentList) {
      setCurrentList({
        ...currentList,
        name: e.target.value,
      });
    }
  };

  const handleSave = () => {
    saveCurrentList();
    navigate('/');
  };

  const handleNavigate = () => {
    saveCurrentList();
    navigate('/navigation');
  };

  const canNavigate = currentList?.items.length && currentList.items.length > 0;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center mb-6">
        <Button variant="ghost" onClick={() => navigate('/')} className="mr-2">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <h1 className="text-2xl font-bold flex-1">Create Shopping List</h1>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
        <Label htmlFor="listName" className="block text-sm font-medium mb-2">List Name</Label>
        <Input
          id="listName"
          value={listName}
          onChange={handleNameChange}
          className="mb-4"
        />

        <div className="flex space-x-4">
          <Button onClick={handleSave} className="flex-1">
            <Save className="mr-2 h-4 w-4" />
            Save List
          </Button>
          <Button 
            onClick={handleNavigate} 
            className="flex-1"
            disabled={!canNavigate}
            variant={canNavigate ? "default" : "outline"}
          >
            <Navigation className="mr-2 h-4 w-4" />
            View Navigation
          </Button>
        </div>
      </div>

      <ShoppingListForm />
    </div>
  );
};

export default CreateListPage;
