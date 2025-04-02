import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Send, X } from "lucide-react";
import { Media } from "@/types";
import TiptapEditor from "../Editor/TiptapEditor";

interface AnnouncementFormProps {
  announcement?: {
    _id?: string;
    author?: string;
    content?: string;
    media?: Media[];
  };
  onSubmit: (formData: FormData) => Promise<void>;
  onCancel?: () => void;
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
  const [existingMedia, setExistingMedia] = useState<Media[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [mediaToRemove, setMediaToRemove] = useState<string[]>([]);
  const [content, setContent] = useState(announcement?.content || "");

  useEffect(() => {
    if (announcement?.media?.length) {
      setExistingMedia(announcement.media);
    }
  }, [announcement]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;

    const files = Array.from(e.target.files);
    setSelectedFiles(files);

    // Crear previews
    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setPreviews((prev) => {
      prev.forEach((url) => URL.revokeObjectURL(url));
      return newPreviews;
    });
  };

  const removeExistingMedia = (fileId: string) => {
    setExistingMedia(
      existingMedia.filter((media) => media.fileId.toString() !== fileId)
    );
    setMediaToRemove([...mediaToRemove, fileId]);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    try {
      const formData = new FormData();

      // Agregar el autor
      const authorInput =
        e.currentTarget.querySelector<HTMLInputElement>('[name="author"]');
      if (authorInput?.value) formData.append("author", authorInput.value);

      // Agregar el contenido del editor
      formData.append("content", content);

      // Si estamos editando, añadir el ID del anuncio
      if (announcement?._id) {
        formData.append("id", announcement._id);
      }

      // Agregar archivos nuevos
      selectedFiles.forEach((file) => {
        formData.append("media", file);
      });

      // Agregar IDs de archivos a eliminar
      if (mediaToRemove.length > 0) {
        formData.append("mediaToRemove", JSON.stringify(mediaToRemove));
      }

      // Mantener archivos existentes que no se eliminan
      if (existingMedia.length > 0) {
        const keptMedia = existingMedia
          .filter((media) => !mediaToRemove.includes(media.fileId.toString()))
          .map((media) => media.fileId);

        if (keptMedia.length > 0) {
          formData.append("existingMedia", JSON.stringify(keptMedia));
        }
      }

      await onSubmit(formData);

      // Limpiar el formulario
      setSelectedFiles([]);
      setPreviews([]);
      setMediaToRemove([]);
      setContent("");
      e.currentTarget.reset();
    } catch (error) {
      console.error("Error en el envío del formulario:", error);
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
        <TiptapEditor content={content} onChange={setContent} />
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

      {/* Mostrar medios existentes */}
      {existingMedia.length > 0 && (
        <div>
          <Label>Archivos existentes</Label>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {existingMedia.map((media) => (
              <div key={media.fileId.toString()} className="relative">
                {media.type.startsWith("image/") ? (
                  <img
                    src={media.url}
                    alt={media.filename}
                    className="w-full h-32 object-cover rounded"
                  />
                ) : (
                  <video
                    src={media.url}
                    className="w-full h-32 object-cover rounded"
                    controls
                  />
                )}
                <button
                  type="button"
                  className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full"
                  onClick={() => removeExistingMedia(media.fileId.toString())}
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Mostrar previews de nuevos archivos */}
      {previews.length > 0 && (
        <div>
          <Label>Nuevos archivos</Label>
          <div className="grid grid-cols-2 gap-2 mt-2">
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
              {announcement?._id ? "Actualizar" : "Publicar"}
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
