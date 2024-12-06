// src/components/Dashboard/DashboardContent.tsx
interface DashboardContentProps {
  activeSection: string;
  isAdmin?: boolean;
}

export function DashboardContent({
  activeSection,
  isAdmin = false,
}: DashboardContentProps) {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6 text-center">Dashboard</h1>
      <p className="text-center">
        Bienvenido al dashboard. Selecciona una opción del menú lateral.
      </p>
    </div>
  );
}
