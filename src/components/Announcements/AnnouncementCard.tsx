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

  const handleEditComment = (commentId: string, currentComment: string) => {
    setEditingCommentId(commentId);
    setEditedCommentText(currentComment);
  };

  const handleSaveComment = async (commentId: string) => {
    if (onEditComment && announcement._id) {
      await onEditComment(announcement._id, commentId, editedCommentText);
      setEditingCommentId(null);
      setEditedCommentText("");
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (onDeleteComment && announcement._id) {
      await onDeleteComment(announcement._id, commentId);
    }
  };

  return (
    <Card className="mb-4 bg-[#44549c] border-none">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Avatar>
              <AvatarImage
                src={announcement.avatar}
                alt={announcement.author}
              />
              <AvatarFallback>{announcement.author[0]}</AvatarFallback>
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
        {/* Contenido del anuncio */}
        <p className="text-white mb-4">{announcement.content}</p>

        {/* Archivos multimedia */}
        {announcement.media && announcement.media.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            {announcement.media.map((media, index) => (
              <div key={index} className="relative rounded-lg overflow-hidden">
                {media.type.startsWith("image/") ? (
                  <img
                    src={media.url}
                    alt={`Media ${index + 1}`}
                    className="w-full h-48 object-cover rounded-lg"
                    loading="lazy"
                  />
                ) : media.type.startsWith("video/") ? (
                  <video
                    src={media.url}
                    controls
                    className="w-full h-48 object-cover rounded-lg"
                  >
                    Tu navegador no soporta la reproducción de videos.
                  </video>
                ) : (
                  <div className="w-full h-48 flex items-center justify-center bg-gray-100 rounded-lg">
                    <p className="text-gray-500">
                      Archivo no soportado: {media.filename}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
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
        <div className="w-full mt-4 space-y-4">
          {comments.map((comment) => (
            <div
              key={comment._id}
              className="flex items-start space-x-2 bg-white/10 p-3 rounded-lg"
            >
              <Avatar className="h-8 w-8">
                <AvatarFallback>{comment.name[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold">{comment.name}</p>
                    <p className="text-sm text-gray-300">{comment.area}</p>
                  </div>
                  {editingCommentId === comment._id ? (
                    <div className="flex-1 ml-2">
                      <Textarea
                        value={editedCommentText}
                        onChange={(e) => setEditedCommentText(e.target.value)}
                        className="mb-2"
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
                    <>
                      <p>{comment.comment}</p>
                      {isAdmin && (
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
                            onClick={() => handleDeleteComment(comment._id)}
                            className="h-8 w-8 text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardFooter>
    </Card>
  );
}
