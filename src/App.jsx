import { Routes, Route } from "react-router-dom";
import JEGASolutionsLanding from "./components/JEGASolutionsLanding";
import PaymentSuccess from "./pages/PaymentSuccess";
import PaymentFailure from "./pages/PaymentFailure";
import TenantDashboard from "./pages/tenant/TenantDashboard";
import { useTenantDetection } from "./hooks/tenant/useTenantDetection";
import { AuthProvider } from "./hooks/useAuth.jsx";
import "./index.css";

function App() {
  const { isTenantRoute, isLoading } = useTenantDetection();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-jega-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  // Si estamos en una ruta de tenant, mostrar el dashboard con AuthProvider
  if (isTenantRoute) {
    return (
      <AuthProvider>
        <Routes>
          <Route path="/*" element={<TenantDashboard />} />
        </Routes>
      </AuthProvider>
    );
  }

  // Si estamos en la landing principal
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<JEGASolutionsLanding />} />
        <Route path="/payment-success" element={<PaymentSuccess />} />
        <Route path="/payment-failure" element={<PaymentFailure />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
