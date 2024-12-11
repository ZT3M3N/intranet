// src/components/Navigation/MobileMenu.tsx
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { MenuItem } from "@/types";
import Link from "next/link";

interface MobileMenuProps {
  menuItems: MenuItem[];
  activeSection: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onMenuClick: (section: string) => void;
}

export function MobileMenu({
  menuItems,
  activeSection,
  open,
  onOpenChange,
  onMenuClick,
}: MobileMenuProps) {
  return (
    <div className="bg-[#6cae28]">
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="fixed top-4 left-4 md:hidden bg-accent"
          >
            <Menu className="h-4 w-4" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[240px] sm:w-[300px]">
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
        </SheetContent>
      </Sheet>
    </div>
  );
}
