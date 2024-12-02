"use client";

import { useState } from "react";
import { useAnnouncements } from "@/hooks/useAnnouncements";
import { menuItems } from "@/data/menuItemsAdmin";
import { documents } from "@/data/documents";
import { Sidebar } from "@/components/Navigation/Sidebar";
import { MobileMenu } from "@/components/Navigation/MobileMenu";
import { DocumentList } from "@/components/Documents/DocumentList";
import { AnnouncementCard } from "@/components/Announcements/AnnouncementCard";
import { AnnouncementForm } from "@/components/Announcements/AnnouncementForm";
import { DashboardContent } from "@/components/Dashboard/DashboardContent";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { AnnouncementModel } from "@/models/Announcement";

export default function AdminDashboardPage() {
  const [activeSection, setActiveSection] = useState("dashboard");
  const [open, setOpen] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] =
    useState<AnnouncementModel | null>(null);
  const [showAnnouncementForm, setShowAnnouncementForm] = useState(false);
  const { toast } = useToast();

  const {
    announcements,
    loading,
    error,
    addAnnouncement,
    updateAnnouncement,
    deleteAnnouncement,
    addComment,
    updateComment,
    deleteComment,
  } = useAnnouncements();

  const [commentForms, setCommentForms] = useState<{ [key: string]: boolean }>(
    {}
  );

  const handleMenuClick = (section: string) => {
    setActiveSection(section);
    setOpen(false);
  };

  const toggleCommentForm = (announcementId: string) => {
    setCommentForms((prev) => ({
      ...prev,
      [announcementId]: !prev[announcementId],
    }));
  };

  const handleCommentSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
    announcementId: string
  ) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const comment = {
      name: formData.get("name") as string,
      area: formData.get("area") as string,
      comment: formData.get("comment") as string,
    };

    await addComment(announcementId, comment);
    toggleCommentForm(announcementId);
  };

  const handleCreateAnnouncement = async (data: Partial<AnnouncementModel>) => {
    try {
      await addAnnouncement(data);
      setShowAnnouncementForm(false);
      toast({
        title: "Éxito",
        description: "Anuncio creado correctamente",
      });
    } catch (error) {
      console.log(error);
      toast({
        title: "Error",
        description: "No se pudo crear el anuncio",
        variant: "destructive",
      });
    }
  };

  const handleUpdateAnnouncement = async (data: Partial<AnnouncementModel>) => {
    if (!editingAnnouncement?._id) return;

    try {
      await updateAnnouncement(editingAnnouncement._id.toString(), data);
      setEditingAnnouncement(null);
      toast({
        title: "Éxito",
        description: "Anuncio actualizado correctamente",
      });
    } catch (error) {
      console.log(error);
      toast({
        title: "Error",
        description: "No se pudo actualizar el anuncio",
        variant: "destructive",
      });
    }
  };

  const handleDeleteAnnouncement = async (id: string) => {
    if (confirm("¿Estás seguro de que deseas eliminar este anuncio?")) {
      try {
        await deleteAnnouncement(id);
        toast({
          title: "Éxito",
          description: "Anuncio eliminado correctamente",
        });
      } catch (error) {
        console.log(error);
        toast({
          title: "Error",
          description: "No se pudo eliminar el anuncio",
          variant: "destructive",
        });
      }
    }
  };

  const handleUpdateComment = async (
    announcementId: string,
    commentId: string,
    newComment: string
  ) => {
    try {
      await updateComment(announcementId, commentId, newComment);
      toast({
        title: "Éxito",
        description: "Comentario actualizado correctamente",
      });
    } catch (error) {
      console.log(error);
      toast({
        title: "Error",
        description: "No se pudo actualizar el comentario",
        variant: "destructive",
      });
    }
  };

  const handleDeleteComment = async (
    announcementId: string,
    commentId: string
  ) => {
    if (confirm("¿Estás seguro de que deseas eliminar este comentario?")) {
      try {
        await deleteComment(announcementId, commentId);
        toast({
          title: "Éxito",
          description: "Comentario eliminado correctamente",
        });
      } catch (error) {
        console.log(error);
        toast({
          title: "Error",
          description: "No se pudo eliminar el comentario",
          variant: "destructive",
        });
      }
    }
  };

  const renderContent = () => {
    switch (activeSection) {
      case "documents":
        return <DocumentList documents={documents} />;
      case "announcements":
        return (
          <div className="space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Comunicados</h2>
              <Button onClick={() => setShowAnnouncementForm(true)}>
                Nuevo Comunicado
              </Button>
            </div>

            {showAnnouncementForm && (
              <AnnouncementForm
                onSubmit={handleCreateAnnouncement}
                onCancel={() => setShowAnnouncementForm(false)}
              />
            )}

            {editingAnnouncement && (
              <AnnouncementForm
                announcement={editingAnnouncement}
                onSubmit={handleUpdateAnnouncement}
                onCancel={() => setEditingAnnouncement(null)}
              />
            )}

            {loading ? (
              <p>Cargando comunicados...</p>
            ) : error ? (
              <p className="text-red-500">Error: {error}</p>
            ) : (
              announcements.map((announcement) => (
                <AnnouncementCard
                  key={announcement._id?.toString()}
                  announcement={announcement}
                  showCommentForm={
                    commentForms[announcement._id?.toString() || ""]
                  }
                  comments={announcement.comments}
                  onToggleComment={() =>
                    toggleCommentForm(announcement._id?.toString() || "")
                  }
                  onCommentSubmit={(e) =>
                    handleCommentSubmit(e, announcement._id?.toString() || "")
                  }
                  onEdit={() => setEditingAnnouncement(announcement)}
                  onDelete={() =>
                    handleDeleteAnnouncement(announcement._id?.toString() || "")
                  }
                  onEditComment={(announcementId, commentId, newComment) =>
                    updateComment(announcementId, commentId, newComment)
                  }
                  onDeleteComment={(announcementId, commentId) =>
                    deleteComment(announcementId, commentId)
                  }
                  isAdmin={true}
                />
              ))
            )}
          </div>
        );
      default:
        return <DashboardContent activeSection={activeSection} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <MobileMenu
        menuItems={menuItems}
        activeSection={activeSection}
        open={open}
        onOpenChange={setOpen}
        onMenuClick={handleMenuClick}
      />

      <div className="flex">
        <Sidebar
          menuItems={menuItems}
          activeSection={activeSection}
          onMenuClick={handleMenuClick}
        />
        <main className="flex-1 p-6">{renderContent()}</main>
      </div>
    </div>
  );
}
