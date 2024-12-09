"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/Dashboard/DashboardLayout";
import { DashboardContent } from "@/components/Dashboard/DashboardContent";
import { DocumentList } from "@/components/Documents/DocumentList";
import { AnnouncementsList } from "@/components/Announcements/AnnouncementsList";
import { menuItems } from "@/data/menuItemsAdmin";
import { useAnnouncements } from "@/hooks/useAnnouncements";

export default function AdminDashboardPage() {
  const [activeSection, setActiveSection] = useState("dashboard");
  const { announcements, isLoading, error } = useAnnouncements();

  const getBreadcrumbs = () => {
    const baseBreadcrumbs = [{ label: "Inicio", href: "/admin-dashboard" }];

    switch (activeSection) {
      case "documents":
        return [...baseBreadcrumbs, { label: "Documentos" }];
      case "announcements":
        return [...baseBreadcrumbs, { label: "Comunicados" }];
      default:
        return baseBreadcrumbs;
    }
  };

  const renderContent = () => {
    switch (activeSection) {
      case "documents":
        return <DocumentList isAdmin={true} />;
      case "announcements":
        return (
          <AnnouncementsList
            announcements={announcements}
            isLoading={isLoading}
            error={error}
            isAdmin={true}
          />
        );
      default:
        return <DashboardContent activeSection={activeSection} />;
    }
  };

  return (
    <DashboardLayout
      menuItems={menuItems}
      activeSection={activeSection}
      breadcrumbs={getBreadcrumbs()}
      onMenuClick={setActiveSection}
    >
      {renderContent()}
    </DashboardLayout>
  );
}
