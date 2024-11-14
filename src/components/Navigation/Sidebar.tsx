// src/components/Navigation/Sidebar.tsx
import { MenuItem } from "@/types";
import Link from "next/link";

interface SidebarProps {
  menuItems: MenuItem[];
  activeSection: string;
  onMenuClick: (section: string) => void;
}

export function Sidebar({ menuItems, activeSection, onMenuClick }: SidebarProps) {
  return (
    <aside className="hidden w-64 min-h-screen p-4 bg-white shadow-md md:block">
      <nav className="flex flex-col gap-4">
        {menuItems.map((item) => (
          <Link
            key={item.title}
            href={item.href}
            onClick={() => onMenuClick(item.section)}
            className={`flex items-center space-x-2 px-2 py-1 text-lg rounded-md transition-colors
              ${
                activeSection === item.section
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-accent hover:text-accent-foreground"
              }`}
          >
            <item.icon className="h-5 w-5" />
            <span>{item.title}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
}