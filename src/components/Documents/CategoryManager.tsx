import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Plus, X, List, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface Category {
  _id: string;
  name: string;
}

interface CategoryManagerProps {
  categories: Category[];
  onCategoriesChange: (categories: Category[]) => void;
}

export function CategoryManager({
  categories,
  onCategoriesChange,
}: CategoryManagerProps) {
  const [showForm, setShowForm] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(
    null
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategory.trim()) return;

    try {
      const response = await fetch("/api/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: newCategory.trim() }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Error al crear categoría");
      }

      onCategoriesChange([...categories, data]);
      setNewCategory("");
      setShowForm(false);
      toast({
        title: "Éxito",
        description: "Categoría creada correctamente",
      });
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Error al crear categoría",
        variant: "destructive",
      });
    }
  };

  const handleDeleteCategory = async (category: Category) => {
    try {
      const response = await fetch(`/api/categories/${category._id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 400) {
          toast({
            title: "No se puede eliminar la categoría",
            description: data.error,
            variant: "destructive",
            duration: 5000,
          });
        } else {
          throw new Error(data.error || "Error al eliminar categoría");
        }
        return;
      }

      onCategoriesChange(categories.filter((c) => c._id !== category._id));
      toast({
        title: "Éxito",
        description: "Categoría eliminada correctamente",
      });
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Error al eliminar categoría",
        variant: "destructive",
      });
    } finally {
      setCategoryToDelete(null);
    }
  };

  return (
    <div className="mb-4">
      <div className="flex gap-2">
        {!showForm ? (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Nueva Categoría
          </Button>
        ) : (
          <form onSubmit={handleSubmit} className="flex items-center gap-2">
            <Input
              type="text"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              placeholder="Nombre de la categoría"
              className="max-w-xs"
            />
            <Button type="submit" size="sm">
              Guardar
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => {
                setShowForm(false);
                setNewCategory("");
              }}
            >
              <X className="h-4 w-4" />
            </Button>
          </form>
        )}

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <List className="h-4 w-4" />
              Ver Categorías
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Categorías Existentes</DialogTitle>
            </DialogHeader>
            <div className="max-h-[60vh] overflow-y-auto">
              {categories.length === 0 ? (
                <p className="text-center text-gray-500 py-4">
                  No hay categorías creadas
                </p>
              ) : (
                <div className="grid gap-2">
                  {categories.map((category) => (
                    <div
                      key={category._id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors"
                    >
                      <span className="font-medium">{category.name}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setCategoryToDelete(category)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <AlertDialog
        open={!!categoryToDelete}
        onOpenChange={(open) => !open && setCategoryToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción eliminará la categoría &quot;{categoryToDelete?.name}
              &quot;. Esta acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() =>
                categoryToDelete && handleDeleteCategory(categoryToDelete)
              }
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
