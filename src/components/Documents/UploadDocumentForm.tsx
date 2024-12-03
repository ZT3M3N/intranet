import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

interface UploadDocumentFormProps {
  onUploadSuccess: () => void;
  onCancel: () => void;
  categories: string[];
}

export function UploadDocumentForm({
  onUploadSuccess,
  onCancel,
  categories,
}: UploadDocumentFormProps) {
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedFile) return;

    setIsUploading(true);
    const formData = new FormData(e.currentTarget);
    formData.append("file", selectedFile);

    // Obtener el usuario del localStorage
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    formData.append("uploadedBy", user.email || "anonymous");

    try {
      const response = await fetch("/api/documents", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Error al subir el documento");

      toast({
        title: "Éxito",
        description: "Documento subido correctamente",
      });
      onUploadSuccess();
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo subir el documento",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="title">Título</Label>
        <Input id="title" name="title" required />
      </div>

      <div>
        <Label htmlFor="description">Descripción</Label>
        <Textarea id="description" name="description" />
      </div>

      <div>
        <Label htmlFor="category">Categoría</Label>
        <select
          id="category"
          name="category"
          className="w-full border rounded-md p-2"
          required
        >
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      <div>
        <Label htmlFor="file">Archivo</Label>
        <Input
          id="file"
          type="file"
          onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
          required
        />
      </div>

      <div className="flex gap-2">
        <Button type="submit" disabled={isUploading}>
          {isUploading ? "Subiendo..." : "Subir documento"}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
      </div>
    </form>
  );
}
