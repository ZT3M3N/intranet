import { ReactNode } from "react";
import { Sidebar } from "@/components/Navigation/Sidebar";
import { MobileMenu } from "@/components/Navigation/MobileMenu";
import { Breadcrumbs } from "@/components/ui/Breadcrums";
import { UserNav } from "@/components/Navigation/UserNav";

interface DashboardLayoutProps {
  children: ReactNode;
  menuItems: any[];
  activeSection: string;
  breadcrumbs: { label: string; href?: string }[];
  onMenuClick: (section: string) => void;
}

export function DashboardLayout({
  children,
  menuItems,
  activeSection,
  breadcrumbs,
  onMenuClick,
}: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-black">
      <div className="flex">
        {/* Sidebar para desktop */}
        <Sidebar
          menuItems={menuItems}
          activeSection={activeSection}
          onMenuClick={onMenuClick}
        />

        {/* Contenido principal */}
        <div className="flex-1 flex flex-col min-h-screen">
          {/* Header */}
          <header className="sticky top-0 z-10 bg-white border-b border-gray-200">
            <div className="flex h-16 items-center justify-between px-4">
              <MobileMenu
                menuItems={menuItems}
                activeSection={activeSection}
                onMenuClick={onMenuClick}
              />
              <UserNav />
            </div>
            <div className="px-4 py-2 bg-gray-50">
              <Breadcrumbs items={breadcrumbs} />
            </div>
          </header>

          {/* Contenido principal */}
          <main className="flex-1 p-6">{children}</main>
        </div>
      </div>
    </div>
  );
}
