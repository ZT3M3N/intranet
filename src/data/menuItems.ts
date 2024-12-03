// src/data/menuItems.ts
import { FileText, MessageSquare, Home, LogIn } from "lucide-react";
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
    title: "Ingresar como administrador",
    href: "/login",
    icon: LogIn,
    section: "login",
  },
];
