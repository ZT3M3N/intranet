"use client";

import { useState } from "react";
import { useAnnouncements } from "@/hooks/useAnnouncements";
import { menuItems } from "@/data/menuItemsAdmin"; // Crearemos este archivo
import { documents } from "@/data/documents";
import { Sidebar } from "@/components/Navigation/Sidebar";
import { MobileMenu } from "@/components/Navigation/MobileMenu";
import { DocumentList } from "@/components/Documents/DocumentList";
import { AnnouncementCard } from "@/components/Announcements/AnnouncementCard";
import { DashboardContent } from "@/components/Dashboard/DashboardContent";

export default function AdminDashboardPage() {
  const [activeSection, setActiveSection] = useState("dashboard");
  const [open, setOpen] = useState(false);
  const {
    announcements,
    loading,
    error,
    addAnnouncement,
    addComment,
    refreshAnnouncements,
  } = useAnnouncements();

  const [commentForms, setCommentForms] = useState<{ [key: string]: boolean }>({});

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
    e.currentTarget.reset();
  };

  const renderContent = () => {
    switch (activeSection) {
      case "documents":
        return <DocumentList documents={documents} />;
      case "announcements":
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold mb-4 text-center">Comunicados</h2>
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