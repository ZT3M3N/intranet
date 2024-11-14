// src/components/Announcements/AnnouncementCard.tsx
import { MessageCircle } from "lucide-react";
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

interface AnnouncementCardProps {
  announcement: Announcement;
  showCommentForm: boolean;
  comments: Comment[];
  onToggleComment: () => void;
  onCommentSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}

export function AnnouncementCard({
  announcement,
  showCommentForm,
  comments,
  onToggleComment,
  onCommentSubmit,
}: AnnouncementCardProps) {
  return (
    <Card className="mb-4">
      <CardHeader>
        <div className="flex items-center space-x-2">
          <Avatar>
            <AvatarImage src={announcement.avatar} alt={announcement.author} />
            <AvatarFallback>{announcement.author}</AvatarFallback>
          </Avatar>
          <CardTitle>{announcement.author}</CardTitle>
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
            {comments.map((comment, index) => (
              <div key={index} className="bg-accent/10 p-2 rounded-md mb-2">
                <p className="font-medium">
                  {comment.name} - {comment.area}
                </p>
                <p>{comment.comment}</p>
              </div>
            ))}
          </div>
        )}
      </CardFooter>
    </Card>
  );
}