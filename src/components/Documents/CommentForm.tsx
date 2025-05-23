// src/components/Announcements/CommentForm.tsx
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface CommentFormProps {
  announcementId: string;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}

export function CommentForm({ announcementId, onSubmit }: CommentFormProps) {
  return (
    <form onSubmit={onSubmit} className="w-full space-y-2">
      <div className="grid grid-cols-2 gap-2">
        <div className="space-y-1">
          <Label htmlFor={`name-${announcementId}`}>Nombre</Label>
          <Input id={`name-${announcementId}`} name="name" required />
        </div>
        <div className="space-y-1">
          <Label htmlFor={`area-${announcementId}`}>Área</Label>
          <Input id={`area-${announcementId}`} name="area" required />
        </div>
      </div>
      <div className="space-y-1">
        <Label htmlFor={`comment-${announcementId}`}>Comentario</Label>
        <Textarea
          id={`comment-${announcementId}`}
          name="comment"
          required
        />
      </div>
      <Button type="submit">Enviar comentario</Button>
    </form>
  );
}