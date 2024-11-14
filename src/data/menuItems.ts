// src/data/menuItems.ts
import { FileText, MessageSquare, Home } from "lucide-react";
import { MenuItem } from "@/types";

export const menuItems: MenuItem[] = [
  {
    title: "Ver documentos",
    href: "#documentos",
    icon: FileText,
    section: "documents",
  },
  {
    title: "Ver comunicados",
    href: "#comunicados",
    icon: MessageSquare,
    section: "announcements",
  },
  { 
    title: "Volver al inicio", 
    href: "/", 
    icon: Home, 
    section: "home" 
  },
];