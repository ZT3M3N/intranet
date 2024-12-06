import { FileText, MessageSquare, Home, User2Icon } from "lucide-react";
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
    icon: User2Icon,
    section: "users",
  },
  {
    title: "Volver al inicio",
    href: "/",
    icon: Home,
    section: "home",
  },
];
