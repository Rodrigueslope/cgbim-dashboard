import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import Login from "@/pages/Login";
import { Route, Switch, Redirect } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import DashboardLayout from "./components/DashboardLayout";
import Dashboard from "./pages/Dashboard";
import Reunioes from "./pages/Reunioes";
import Acoes from "./pages/Acoes";
import Capacitacoes from "./pages/Capacitacoes";
import Conformidade from "./pages/Conformidade";
import Administracao from "./pages/Administracao";
import MaterialApoio from "./pages/MaterialApoio";
import Informacoes from "./pages/Informacoes";
import { useAuthSimple } from "./hooks/useAuthSimple";

// Componente para proteger rotas
function ProtectedRoute({ component: Component }: { component: React.ComponentType }) {
  const { isAuthenticated, loading } = useAuthSimple();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Verificando autenticação...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Redirect to="/login" />;
  }

  return <Component />;
}

function Router() {
  return (
    <Switch>
      {/* Rota pública de login */}
      <Route path="/login" component={Login} />
      
      {/* Rotas protegidas */}
      <Route path="/" component={() => (
        <ProtectedRoute component={() => (
          <DashboardLayout>
            <Dashboard />
          </DashboardLayout>
        )} />
      )} />
      <Route path="/reunioes" component={() => (
        <ProtectedRoute component={() => (
          <DashboardLayout>
            <Reunioes />
          </DashboardLayout>
        )} />
      )} />
      <Route path="/acoes" component={() => (
        <ProtectedRoute component={() => (
          <DashboardLayout>
            <Acoes />
          </DashboardLayout>
        )} />
      )} />
      <Route path="/capacitacoes" component={() => (
        <ProtectedRoute component={() => (
          <DashboardLayout>
            <Capacitacoes />
          </DashboardLayout>
        )} />
      )} />
      <Route path="/conformidade" component={() => (
        <ProtectedRoute component={() => (
          <DashboardLayout>
            <Conformidade />
          </DashboardLayout>
        )} />
      )} />
      <Route path="/administracao" component={() => (
        <ProtectedRoute component={() => (
          <DashboardLayout>
            <Administracao />
          </DashboardLayout>
        )} />
      )} />
      <Route path="/material-apoio" component={() => (
        <ProtectedRoute component={() => (
          <DashboardLayout>
            <MaterialApoio />
          </DashboardLayout>
        )} />
      )} />
      <Route path="/informacoes" component={() => (
        <ProtectedRoute component={() => (
          <DashboardLayout>
            <Informacoes />
          </DashboardLayout>
        )} />
      )} />
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
