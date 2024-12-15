"use client";

import { useState } from "react";
import { useAnnouncements } from "@/hooks/useAnnouncements";
import { menuItems } from "@/data/menuItems";
import { documents } from "@/data/documents";
import { Sidebar } from "@/components/Navigation/Sidebar";
import { MobileMenu } from "@/components/Navigation/MobileMenu";
import { DocumentList } from "@/components/Documents/DocumentView-Guest";
import { AnnouncementCard } from "@/components/Announcements/AnnouncementCard";
import { DashboardContent } from "@/components/Dashboard/DashboardContent";
import { Announcement } from "@/types";

export default function DashboardPage() {
  const [open, setOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("announcements");
  const [commentForms, setCommentForms] = useState<{ [key: string]: boolean }>(
    {}
  );

  const { announcements, loading, error, addComment, refreshAnnouncements } =
    useAnnouncements();

  const handleMenuClick = (section: string) => {
    setActiveSection(section);
    setOpen(false);
  };

  const toggleCommentForm = (id: string) => {
    setCommentForms((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleCommentSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
    id: string
  ) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const comment = {
      name: formData.get("name") as string,
      area: formData.get("area") as string,
      comment: formData.get("comment") as string,
    };

    if (comment.name && comment.area && comment.comment) {
      await addComment(id, comment);
      toggleCommentForm(id);
    }
    if (event.currentTarget) {
      event.currentTarget.reset();
    }
  };

  const renderContent = () => {
    switch (activeSection) {
      case "documents":
        return (
          <div className="space-y-4">
            <DocumentList
              documents={documents}
              isAdmin={false}
              showUpload={false}
            />
          </div>
        );
      case "announcements":
        return (
          <div className="space-y-4">
            <h2 className="text-4xl font-bold mt-10 text-center">
              Comunicados internos
            </h2>
            {loading ? (
              <p>Cargando comunicados...</p>
            ) : error ? (
              <p className="text-red-500">Error: {error}</p>
            ) : (
              announcements.map((announcement) => (
                <AnnouncementCard
                  key={announcement._id?.toString()}
                  announcement={{
                    ...announcement,
                    id: announcement._id?.toString(),
                    comments:
                      announcement.comments?.filter(
                        (comment) => comment.approved
                      ) || [],
                  }}
                  showCommentForm={
                    commentForms[announcement._id?.toString() || ""]
                  }
                  comments={
                    announcement.comments?.filter(
                      (comment) => comment.approved
                    ) || []
                  }
                  onToggleComment={() =>
                    toggleCommentForm(announcement._id?.toString() || "")
                  }
                  onCommentSubmit={(e) =>
                    handleCommentSubmit(e, announcement._id?.toString() || "")
                  }
                  refetchAnnouncements={refreshAnnouncements}
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
    <div className="min-h-screen bg-[#6cae28]">
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
