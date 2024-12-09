import { AnnouncementCard } from "./AnnouncementCard";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { Plus } from "lucide-react";
import { Announcement } from "@/types";

interface AnnouncementsListProps {
  announcements: Announcement[];
  isLoading: boolean;
  error: string | null;
  isAdmin?: boolean;
  onCreateNew?: () => void;
}

export function AnnouncementsList({
  announcements,
  isLoading,
  error,
  isAdmin = false,
  onCreateNew,
}: AnnouncementsListProps) {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <LoadingSpinner size="lg" />
        <p className="mt-4 text-gray-600">Cargando comunicados...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
        <div className="bg-red-50 text-red-600 p-4 rounded-lg">
          <p className="font-medium">Error al cargar los comunicados</p>
          <p className="text-sm mt-1">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Comunicados</h2>
        {isAdmin && (
          <Button
            onClick={onCreateNew}
            className="bg-primary hover:bg-primary-dark text-black"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Comunicado
          </Button>
        )}
      </div>

      {announcements.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-600">No hay comunicados disponibles</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {announcements.map((announcement) => (
            <AnnouncementCard
              key={announcement._id}
              announcement={announcement}
              isAdmin={isAdmin}
            />
          ))}
        </div>
      )}
    </div>
  );
}
