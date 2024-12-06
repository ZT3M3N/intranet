import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { AnnouncementModel } from "@/models/Announcement";
import { Upload, X, Loader2, Send } from "lucide-react";

interface AnnouncementFormProps {
  announcement?: Partial<AnnouncementModel>;
  onSubmit: (data: FormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function AnnouncementForm({
  announcement,
  onSubmit,
  onCancel,
  isLoading,
}: AnnouncementFormProps) {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) {
      console.log("No files selected");
      return;
    }

    const files = Array.from(e.target.files);
    console.log(
      "Files selected:",
      files.map((f) => ({
        name: f.name,
        type: f.type,
        size: f.size,
      }))
    );

    setSelectedFiles(files);

    // Crear previews
    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setPreviews((prev) => {
      prev.forEach((url) => URL.revokeObjectURL(url));
      return newPreviews;
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    try {
      const formData = new FormData();

      // Agregar campos básicos
      const authorInput =
        e.currentTarget.querySelector<HTMLInputElement>('[name="author"]');
      const contentInput =
        e.currentTarget.querySelector<HTMLTextAreaElement>('[name="content"]');

      if (authorInput?.value) formData.append("author", authorInput.value);
      if (contentInput?.value) formData.append("content", contentInput.value);

      // Agregar archivos
      console.log("Selected files before submit:", selectedFiles);
      selectedFiles.forEach((file, index) => {
        console.log(`Adding file ${index} to FormData:`, {
          name: file.name,
          type: file.type,
          size: file.size,
        });
        formData.append("media", file);
      });

      // Log del contenido final del FormData
      console.log("FormData contents:");
      for (let [key, value] of formData.entries()) {
        if (value instanceof File) {
          console.log(key, "File:", {
            name: value.name,
            type: value.type,
            size: value.size,
          });
        } else {
          console.log(key, value);
        }
      }

      await onSubmit(formData);

      // Limpiar el formulario
      setSelectedFiles([]);
      setPreviews([]);
      e.currentTarget.reset();
    } catch (error) {
      console.error("Error in form submission:", error);
      setError(
        error instanceof Error ? error.message : "Error al crear el anuncio"
      );
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-4 rounded-lg">
      <div className="space-y-2">
        <Label htmlFor="author">Autor</Label>
        <Input
          id="author"
          name="author"
          defaultValue={announcement?.author}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="content">Contenido</Label>
        <Textarea
          id="content"
          name="content"
          defaultValue={announcement?.content}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="media">Archivos multimedia</Label>
        <Input
          id="media"
          name="media"
          type="file"
          accept="image/*,video/*"
          multiple
          onChange={handleFileChange}
          className="cursor-pointer"
        />
      </div>

      {/* Mostrar previews */}
      {previews.length > 0 && (
        <div className="grid grid-cols-2 gap-2">
          {previews.map((preview, index) => (
            <div key={index} className="relative">
              <img
                src={preview}
                alt={`Preview ${index + 1}`}
                className="w-full h-32 object-cover rounded"
              />
              <button
                type="button"
                className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full"
                onClick={() => {
                  setSelectedFiles((prev) =>
                    prev.filter((_, i) => i !== index)
                  );
                  setPreviews((prev) => prev.filter((_, i) => i !== index));
                }}
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div className="flex justify-end space-x-2">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
        )}
        <Button type="submit" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Enviando...
            </>
          ) : (
            <>
              <Send className="mr-2 h-4 w-4" />
              {announcement ? "Actualizar" : "Publicar"}
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
