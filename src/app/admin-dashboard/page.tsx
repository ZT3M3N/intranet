"use client";

import { useEffect, useState } from "react";
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
import { UserTable } from "@/components/Users/UserTable";
import { User } from "@/models/User";

interface User {
  _id: string;
  nombres: string;
  apellidos: string;
  email: string;
  area: string;
  role: string;
}

export default function AdminDashboardPage() {
  const [activeSection, setActiveSection] = useState("dashboard");
  const [open, setOpen] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] =
    useState<AnnouncementModel | null>(null);
  const [showAnnouncementForm, setShowAnnouncementForm] = useState(false);
  const { addAnnouncement, isLoading } = useAnnouncements();
  const { toast } = useToast();

  const {
    announcements,
    error,
    updateAnnouncement,
    deleteAnnouncement,
    addComment,
    updateComment,
    deleteComment,
  } = useAnnouncements();

  const [commentForms, setCommentForms] = useState<{ [key: string]: boolean }>(
    {}
  );

  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const response = await fetch("/api/users");
      const data = await response.json();
      setUsers(data);
    };
    fetchUsers();
  }, []);

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

  const handleCreateAnnouncement = async (formData: FormData) => {
    console.log("Creating announcement...");
    console.log("FormData contents before sending:");
    for (let [key, value] of formData.entries()) {
      if (value instanceof File) {
        console.log(key, "File:", value.name, value.type, value.size);
      } else {
        console.log(key, value);
      }
    }

    try {
      const result = await addAnnouncement(formData);
      console.log("Announcement created:", result);
      setShowAnnouncementForm(false);
      toast({
        title: "Éxito",
        description: "Anuncio creado correctamente",
      });
    } catch (error) {
      console.error("Error creating announcement:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Error al crear el anuncio",
        variant: "destructive",
      });
    }
  };

  const handleEditAnnouncement = async (announcement: AnnouncementModel) => {
    setEditingAnnouncement(announcement);
    setShowAnnouncementForm(true);
  };

  const handleDeleteAnnouncement = async (id: string) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este anuncio?")) {
      try {
        await deleteAnnouncement(id);
        toast({
          title: "Éxito",
          description: "Anuncio eliminado correctamente",
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Error al eliminar el anuncio",
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
      toast({
        title: "Error",
        description: "Error al actualizar el comentario",
        variant: "destructive",
      });
    }
  };

  const handleDeleteComment = async (
    announcementId: string,
    commentId: string
  ) => {
    if (
      window.confirm("¿Estás seguro de que deseas eliminar este comentario?")
    ) {
      try {
        await deleteComment(announcementId, commentId);
        toast({
          title: "Éxito",
          description: "Comentario eliminado correctamente",
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Error al eliminar el comentario",
          variant: "destructive",
        });
      }
    }
  };

  const handleUpdateUser = async (
    id: string,
    userData: Partial<User>,
    adminPassword: string
  ) => {
    try {
      const response = await fetch(`/api/users/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...userData, adminPassword }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Error al actualizar usuario");
      }

      const updatedUser = await response.json();
      setUsers(users.map((user) => (user._id === id ? updatedUser : user)));
      toast({
        title: "Éxito",
        description: "Usuario actualizado correctamente",
      });
    } catch (error) {
      throw error;
    }
  };

  const handleDeleteUser = async (id: string, adminPassword: string) => {
    try {
      const response = await fetch(`/api/users/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adminPassword }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Error al eliminar usuario");
      }

      setUsers(users.filter((user) => user._id !== id));
      toast({
        title: "Éxito",
        description: "Usuario eliminado correctamente",
      });
    } catch (error) {
      throw error;
    }
  };

  useEffect(() => {
    const handleOnline = () => {
      toast({
        title: "Conexión restaurada",
        description: "Ya puedes crear anuncios nuevamente",
      });
    };

    const handleOffline = () => {
      toast({
        title: "Sin conexión",
        description: "No hay conexión a internet",
        variant: "destructive",
      });
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [toast]);

  const renderContent = () => {
    switch (activeSection) {
      case "announcements":
        return (
          <div className="space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Comunicados</h2>
              <Button
                onClick={() => {
                  setEditingAnnouncement(null);
                  setShowAnnouncementForm(true);
                }}
              >
                Nuevo Comunicado
              </Button>
            </div>

            {showAnnouncementForm && (
              <AnnouncementForm
                announcement={editingAnnouncement || undefined}
                onSubmit={handleCreateAnnouncement}
                onCancel={() => {
                  setShowAnnouncementForm(false);
                  setEditingAnnouncement(null);
                }}
                isLoading={isLoading}
              />
            )}

            {/* Lista de anuncios */}
            {announcements.map((announcement) => (
              <AnnouncementCard
                key={announcement._id}
                announcement={announcement}
                showCommentForm={commentForms[announcement._id || ""]}
                comments={announcement.comments || []}
                onToggleComment={() =>
                  toggleCommentForm(announcement._id || "")
                }
                onCommentSubmit={(e) =>
                  handleCommentSubmit(e, announcement._id || "")
                }
                onEdit={() => handleEditAnnouncement(announcement)}
                onDelete={() =>
                  handleDeleteAnnouncement(announcement._id || "")
                }
                onEditComment={handleUpdateComment}
                onDeleteComment={handleDeleteComment}
                isAdmin={true}
              />
            ))}
          </div>
        );
      case "documents":
        return (
          <DocumentList
            documents={documents}
            isAdmin={true}
            showUpload={true}
          />
        );
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

            {isLoading ? (
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
                  onEditComment={handleUpdateComment}
                  onDeleteComment={handleDeleteComment}
                  isAdmin={true}
                />
              ))
            )}
          </div>
        );
      case "users":
        return (
          <div className="space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Gestionar Usuarios</h2>
            </div>
            <UserTable
              users={users}
              onUpdate={handleUpdateUser}
              onDelete={handleDeleteUser}
            />
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
