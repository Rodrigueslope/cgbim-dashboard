import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import DashboardLayout from "./components/DashboardLayout";
import Dashboard from "./pages/Dashboard";
import Reunioes from "./pages/Reunioes";
import Acoes from "./pages/Acoes";
import Capacitacoes from "./pages/Capacitacoes";
import Conformidade from "./pages/Conformidade";
import Administracao from "./pages/Administracao";

function Router() {
  return (
    <Switch>
      <Route path="/" component={() => (
        <DashboardLayout>
          <Dashboard />
        </DashboardLayout>
      )} />
      <Route path="/reunioes" component={() => (
        <DashboardLayout>
          <Reunioes />
        </DashboardLayout>
      )} />
      <Route path="/acoes" component={() => (
        <DashboardLayout>
          <Acoes />
        </DashboardLayout>
      )} />
      <Route path="/capacitacoes" component={() => (
        <DashboardLayout>
          <Capacitacoes />
        </DashboardLayout>
      )} />
      <Route path="/conformidade" component={() => (
        <DashboardLayout>
          <Conformidade />
        </DashboardLayout>
      )} />
      <Route path="/administracao" component={() => (
        <DashboardLayout>
          <Administracao />
        </DashboardLayout>
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
