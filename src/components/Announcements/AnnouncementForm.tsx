import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { AnnouncementModel } from "@/models/Announcement";

interface AnnouncementFormProps {
  announcement?: Partial<AnnouncementModel>;
  onSubmit: (data: Partial<AnnouncementModel>) => void;
  onCancel: () => void;
}

export function AnnouncementForm({ announcement, onSubmit, onCancel }: AnnouncementFormProps) {
  const [formData, setFormData] = useState({
    author: announcement?.author || "",
    content: announcement?.content || "",
    avatar: announcement?.avatar || "/placeholder.svg",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="author">Autor</Label>
        <Input
          id="author"
          value={formData.author}
          onChange={(e) => setFormData({ ...formData, author: e.target.value })}
          required
        />
      </div>
      <div>
        <Label htmlFor="content">Contenido</Label>
        <Textarea
          id="content"
          value={formData.content}
          onChange={(e) => setFormData({ ...formData, content: e.target.value })}
          required
        />
      </div>
      <div className="flex gap-2">
        <Button type="submit">
          {announcement ? "Actualizar" : "Crear"} Anuncio
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
      </div>
    </form>
  );
}