"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import DashboardPage from "../page";

export default function AnnouncementsPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirigir a guest-dashboard con la sección de comunicados activa
    router.replace("/guest-dashboard");
  }, [router]);

  return <DashboardPage />;
}
