// src/hooks/useAnnouncements.ts
import { useState, useEffect } from "react";
import { AnnouncementModel } from "@/models/Announcement";
import { AnnouncementService } from "@/services/announcementService";

export function useAnnouncements() {
  const [announcements, setAnnouncements] = useState<AnnouncementModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      const response = await fetch("/api/announcements");
      if (!response.ok) throw new Error("Error fetching announcements");
      const data = await response.json();
      setAnnouncements(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  const addAnnouncement = async (
    announcement: Omit<
      AnnouncementModel,
      "_id" | "comments" | "createdAt" | "updatedAt"
    >
  ) => {
    try {
      const response = await fetch("/api/announcements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(announcement),
      });
      if (!response.ok) throw new Error("Error creating announcement");
      await fetchAnnouncements();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    }
  };

  const addComment = async (
    announcementId: string,
    comment: { name: string; area: string; comment: string }
  ) => {
    try {
      const response = await fetch(
        `/api/announcements/${announcementId}/comments`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(comment),
        }
      );
      if (!response.ok) throw new Error("Error adding comment");
      await fetchAnnouncements();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    }
  };

  const updateAnnouncement = async (
    id: string,
    update: Partial<AnnouncementModel>
  ) => {
    try {
      const response = await fetch(`/api/announcements/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(update),
      });
      if (!response.ok) throw new Error("Error updating announcement");
      await fetchAnnouncements();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      throw err;
    }
  };

  const deleteAnnouncement = async (id: string) => {
    try {
      const response = await fetch(`/api/announcements/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Error deleting announcement");
      await fetchAnnouncements();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      throw err;
    }
  };

  const updateComment = async (
    announcementId: string,
    commentId: string,
    newComment: string
  ) => {
    try {
      const response = await fetch(
        `/api/announcements/${announcementId}/comments/${commentId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ comment: newComment }),
        }
      );

      if (!response.ok) {
        throw new Error("Error al actualizar el comentario");
      }

      const updatedAnnouncement = await response.json();
      setAnnouncements((prevAnnouncements) =>
        prevAnnouncements.map((announcement) =>
          announcement._id === announcementId
            ? updatedAnnouncement
            : announcement
        )
      );
    } catch (error) {
      console.error("Error en updateComment:", error);
      throw error;
    }
  };

  const deleteComment = async (announcementId: string, commentId: string) => {
    try {
      const response = await fetch(
        `/api/announcements/${announcementId}/comments/${commentId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Error al eliminar el comentario");
      }

      const updatedAnnouncement = await response.json();
      setAnnouncements((prevAnnouncements) =>
        prevAnnouncements.map((announcement) =>
          announcement._id === announcementId
            ? updatedAnnouncement
            : announcement
        )
      );
    } catch (error) {
      console.error("Error en deleteComment:", error);
      throw error;
    }
  };

  return {
    announcements,
    loading,
    error,
    addAnnouncement,
    updateAnnouncement,
    deleteAnnouncement,
    addComment,
    updateComment,
    deleteComment,
  };
}
