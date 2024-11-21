import { FileText, MessageSquare, Home, Users, Settings, PlusCircle } from "lucide-react";
import { MenuItem } from "@/types";

export const menuItems: MenuItem[] = [
  {
    title: "Gestionar documentos",
    href: "#documentos",
    icon: FileText,
    section: "documents",
  },
  {
    title: "Gestionar comunicados",
    href: "#comunicados",
    icon: MessageSquare,
    section: "announcements",
  },
  {
    title: "Gestionar usuarios",
    href: "#usuarios",
    icon: Users,
    section: "users",
  },
  {
    title: "Crear anuncio",
    href: "#crear-anuncio",
    icon: PlusCircle,
    section: "create-announcement",
  },
  {
    title: "Configuración",
    href: "#configuracion",
    icon: Settings,
    section: "settings",
  },
  { 
    title: "Volver al inicio", 
    href: "/", 
    icon: Home, 
    section: "home" 
  },
];