// src/components/Announcements/AnnouncementCard.tsx
import { useState } from "react";
import { MessageCircle, Edit, Trash2, PencilIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Announcement, Comment } from "@/types";
import { CommentForm } from "@/components/Documents/CommentForm";
import { Textarea } from "@/components/ui/textarea";

interface AnnouncementCardProps {
  announcement: Announcement;
  showCommentForm: boolean;
  comments: Comment[];
  onToggleComment: () => void;
  onCommentSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onEditComment?: (
    announcementId: string,
    commentId: string,
    newComment: string
  ) => void;
  onDeleteComment?: (announcementId: string, commentId: string) => void;
  isAdmin?: boolean;
}

export function AnnouncementCard({
  announcement,
  showCommentForm,
  comments,
  onToggleComment,
  onCommentSubmit,
  onEdit,
  onDelete,
  onEditComment,
  onDeleteComment,
  isAdmin = false,
}: AnnouncementCardProps) {
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editedCommentText, setEditedCommentText] = useState("");

  // Corregir la función handleEditComment
  const handleEditComment = (commentId: string, currentComment: string) => {
    setEditingCommentId(commentId);
    setEditedCommentText(currentComment);
  };

  // Corregir la función handleSaveComment
  const handleSaveComment = async (commentId: string) => {
    if (onEditComment && announcement._id) {
      await onEditComment(announcement._id, commentId, editedCommentText);
      setEditingCommentId(null);
      setEditedCommentText("");
    }
  };

  return (
    <Card className="mb-4">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Avatar>
              <AvatarImage
                src={announcement.avatar}
                alt={announcement.author}
              />
              <AvatarFallback>{announcement.author}</AvatarFallback>
            </Avatar>
            <CardTitle>{announcement.author}</CardTitle>
          </div>
          {isAdmin && (
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={onEdit}
                className="h-8 w-8"
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={onDelete}
                className="h-8 w-8 text-red-500 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <p>{announcement.content}</p>
      </CardContent>
      <CardFooter className="flex flex-col items-start">
        <Button
          variant="outline"
          size="sm"
          onClick={onToggleComment}
          className="mb-2"
        >
          <MessageCircle className="mr-2 h-4 w-4" />
          Comentar
        </Button>
        {showCommentForm && (
          <CommentForm
            announcementId={announcement.id}
            onSubmit={onCommentSubmit}
          />
        )}
        {comments.length > 0 && (
          <div className="mt-4 w-full">
            <h3 className="font-semibold mb-2">Comentarios:</h3>
            {comments.map((comment) => (
              <div
                key={comment._id}
                className="bg-accent/10 p-2 rounded-md mb-2"
              >
                <div className="flex justify-between items-start">
                  <div className="w-full">
                    <p className="font-medium">
                      {comment.name} - {comment.area}
                    </p>
                    {editingCommentId === comment._id ? (
                      <div className="mt-2 space-y-2">
                        <Textarea
                          value={editedCommentText}
                          onChange={(e) => setEditedCommentText(e.target.value)}
                          className="min-h-[60px]"
                        />
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => handleSaveComment(comment._id)}
                          >
                            Guardar
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setEditingCommentId(null)}
                          >
                            Cancelar
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <p>{comment.comment}</p>
                    )}
                  </div>
                  {isAdmin && !editingCommentId && (
                    <div className="flex gap-2 ml-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() =>
                          handleEditComment(comment._id, comment.comment)
                        }
                        className="h-8 w-8"
                      >
                        <PencilIcon className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() =>
                          onDeleteComment?.(announcement._id, comment._id)
                        }
                        className="h-8 w-8 text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardFooter>
    </Card>
  );
}
