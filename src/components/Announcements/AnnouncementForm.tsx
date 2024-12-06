import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { AnnouncementModel } from "@/models/Announcement";
import { Upload, X } from "lucide-react";

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setSelectedFiles((prev) => [...prev, ...files]);

    // Crear previsualizaciones
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviews((prev) => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    selectedFiles.forEach((file) => {
      formData.append("media", file);
    });

    try {
      await onSubmit(formData);
      onCancel();
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-4 rounded-lg">
      <div>
        <Label htmlFor="author">Autor</Label>
        <Input
          id="author"
          name="author"
          defaultValue={announcement?.author}
          required
        />
      </div>
      <div>
        <Label htmlFor="content">Contenido</Label>
        <Textarea
          id="content"
          name="content"
          defaultValue={announcement?.content}
          required
        />
      </div>
      <div>
        <Label htmlFor="media">Archivos multimedia</Label>
        <div className="mt-2 flex items-center gap-4">
          <Input
            id="media"
            type="file"
            onChange={handleFileChange}
            accept="image/*,video/*"
            multiple
            className="hidden"
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => document.getElementById("media")?.click()}
          >
            <Upload className="mr-2 h-4 w-4" />
            Subir archivos
          </Button>
        </div>

        {/* Previsualizaciones */}
        <div className="mt-4 grid grid-cols-3 gap-4">
          {previews.map((preview, index) => (
            <div key={index} className="relative">
              {selectedFiles[index].type.startsWith("image/") ? (
                <img
                  src={preview}
                  alt={`Preview ${index}`}
                  className="w-full h-32 object-cover rounded-md"
                />
              ) : (
                <video
                  src={preview}
                  className="w-full h-32 object-cover rounded-md"
                  controls
                />
              )}
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute top-1 right-1"
                onClick={() => removeFile(index)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-2">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? (
            <>
              <span className="loading loading-spinner"></span>
              Enviando...
            </>
          ) : (
            "Crear Anuncio"
          )}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancelar
        </Button>
      </div>

      {/* Indicador de estado de conexión */}
      {!navigator.onLine && (
        <div className="text-red-500 text-sm mt-2">
          No hay conexión a internet. Verifica tu conexión.
        </div>
      )}
    </form>
  );
}
