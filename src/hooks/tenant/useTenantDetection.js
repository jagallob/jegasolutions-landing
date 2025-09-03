import { useState, useEffect } from "react";

export const useTenantDetection = () => {
  const [tenant, setTenant] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isTenantRoute, setIsTenantRoute] = useState(false);

  useEffect(() => {
    const detectTenant = () => {
      const hostname = window.location.hostname;

      // Detectar si estamos en un subdominio de tenant
      if (
        hostname.includes(".jegasolutions.co") &&
        !hostname.startsWith("www.")
      ) {
        const subdomain = hostname.split(".")[0];

        // Ignorar subdominios conocidos que no son tenants
        const reservedSubdomains = ["api", "admin", "app", "www"];
        if (!reservedSubdomains.includes(subdomain)) {
          setIsTenantRoute(true);
          setTenant({
            subdomain,
            url: `https://${hostname}`,
            isLocal:
              hostname.includes("localhost") || hostname.includes("127.0.0.1"),
          });
        } else {
          setIsTenantRoute(false);
          setTenant(null);
        }
      } else {
        setIsTenantRoute(false);
        setTenant(null);
      }

      setIsLoading(false);
    };

    detectTenant();
  }, []);

  const getTenantInfo = async (subdomain) => {
    try {
      // En producción, esto haría una llamada a la API
      // const response = await fetch(`/api/tenants/subdomain/${subdomain}`);
      // return await response.json();

      // Simulación para desarrollo
      return {
        id: 1,
        name: "Mi Empresa",
        subdomain,
        ownerEmail: "admin@miempresa.com",
        status: "ACTIVE",
        modules: [
          {
            id: 1,
            name: "GestorHorasExtra",
            displayName: "Gestión de Horas Extra",
            status: "ACTIVE",
          },
          {
            id: 2,
            name: "ReportBuilderProject",
            displayName: "Reportes con IA",
            status: "ACTIVE",
          },
        ],
      };
    } catch (error) {
      console.error("Error fetching tenant info:", error);
      return null;
    }
  };

  return {
    tenant,
    isTenantRoute,
    isLoading,
    getTenantInfo,
  };
};
