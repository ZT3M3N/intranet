// src/hooks/useAnnouncements.ts
import { useState, useEffect } from "react";
import { AnnouncementModel } from "@/models/Announcement";
import { useToast } from "@/hooks/use-toast";

export function useAnnouncements() {
  const [announcements, setAnnouncements] = useState<AnnouncementModel[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchAnnouncements = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/announcements");
      if (!response.ok) {
        throw new Error("Error al cargar los anuncios");
      }
      const data = await response.json();
      setAnnouncements(data);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Error desconocido");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const addAnnouncement = async (formData: FormData) => {
    console.log("useAnnouncements: Starting request");

    try {
      const response = await fetch("/api/announcements", {
        method: "POST",
        body: formData,
      });

      console.log("useAnnouncements: Response status:", response.status);

      if (!response.ok) {
        const errorData = await response.json();
        console.error("useAnnouncements: Error response:", errorData);
        throw new Error(errorData.error || "Error al crear el anuncio");
      }

      const data = await response.json();
      console.log("useAnnouncements: Success response:", data);

      return data;
    } catch (error) {
      console.error("useAnnouncements: Error:", error);
      throw error;
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

  const deleteAnnouncement = async (id: string) => {
    try {
      const response = await fetch(`/api/announcements/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Error al eliminar el anuncio");
      }

      setAnnouncements((prev) =>
        prev.filter((announcement) => announcement._id !== id)
      );
    } catch (error) {
      console.error("Error deleting announcement:", error);
      throw error;
    }
  };

  const updateAnnouncement = async (id: string, formData: FormData) => {
    try {
      const response = await fetch(`/api/announcements/${id}`, {
        method: "PUT",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Error al actualizar el anuncio");
      }

      const updatedAnnouncement = await response.json();
      setAnnouncements((prev) =>
        prev.map((announcement) =>
          announcement._id === id ? updatedAnnouncement : announcement
        )
      );
      return updatedAnnouncement;
    } catch (error) {
      console.error("Error updating announcement:", error);
      throw error;
    }
  };

  const updateComment = async (
    announcementId: string,
    commentId: string,
    comment: string
  ) => {
    try {
      const response = await fetch(
        `/api/announcements/${announcementId}/comments/${commentId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ comment }),
        }
      );

      if (!response.ok) {
        throw new Error("Error al actualizar el comentario");
      }

      const updatedAnnouncement = await response.json();
      setAnnouncements((prev) =>
        prev.map((announcement) =>
          announcement._id === announcementId
            ? updatedAnnouncement
            : announcement
        )
      );
    } catch (error) {
      console.error("Error updating comment:", error);
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
      setAnnouncements((prev) =>
        prev.map((announcement) =>
          announcement._id === announcementId
            ? updatedAnnouncement
            : announcement
        )
      );
    } catch (error) {
      console.error("Error deleting comment:", error);
      throw error;
    }
  };

  return {
    announcements,
    isLoading,
    error,
    setAnnouncements,
    addAnnouncement,
    updateAnnouncement,
    deleteAnnouncement,
    addComment,
    updateComment,
    deleteComment,
    refetchAnnouncements: fetchAnnouncements,
  };
}
