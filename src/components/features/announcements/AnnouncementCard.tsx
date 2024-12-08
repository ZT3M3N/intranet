import { useState } from "react";
import { MessageCircle, Edit, Trash2, PencilIcon } from "lucide-react";
import { Button } from "@/components/common/Button";
import { Card } from "@/components/common/Card";
import { Avatar } from "@/components/common/Avatar";
import { CommentForm } from "@/components/features/comments/CommentForm";
import { CommentSection } from "@/components/features/comments/CommentSection";
import { MediaPreview } from "./MediaPreview";
import { useComments } from "@/hooks/useComments";
import { Announcement } from "@/types";

interface AnnouncementCardProps {
  announcement: Announcement;
  isAdmin?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
}

export function AnnouncementCard({
  announcement,
  isAdmin = false,
  onEdit,
  onDelete,
}: AnnouncementCardProps) {
  const [showCommentForm, setShowCommentForm] = useState(false);
  const { comments, addComment, editComment, deleteComment } = useComments(
    announcement._id
  );

  return (
    <Card className="mb-4 bg-[#44549c] border-none">
      <Card.Header>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Avatar
              src={announcement.avatar}
              alt={announcement.author}
              fallback={announcement.author[0]}
            />
            <Card.Title>{announcement.author}</Card.Title>
          </div>
          {isAdmin && (
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={onEdit}
                icon={<Edit className="h-4 w-4" />}
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={onDelete}
                icon={<Trash2 className="h-4 w-4" />}
                className="text-red-500 hover:text-red-700"
              />
            </div>
          )}
        </div>
      </Card.Header>

      <Card.Content>
        <p className="text-white mb-4">{announcement.content}</p>
        {announcement.media && announcement.media.length > 0 && (
          <MediaPreview media={announcement.media} />
        )}
      </Card.Content>

      <Card.Footer className="flex flex-col items-start">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowCommentForm(!showCommentForm)}
          className="mb-2"
          icon={<MessageCircle className="mr-2 h-4 w-4" />}
        >
          Comentar
        </Button>

        {showCommentForm && (
          <CommentForm
            onSubmit={addComment}
            onCancel={() => setShowCommentForm(false)}
          />
        )}

        <CommentSection
          comments={comments}
          isAdmin={isAdmin}
          onEdit={editComment}
          onDelete={deleteComment}
        />
      </Card.Footer>
    </Card>
  );
}
