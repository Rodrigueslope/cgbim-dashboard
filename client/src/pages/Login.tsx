import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Lock } from "lucide-react";

export default function Login() {
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Senha definida: "RBIM2025"
    const senhaCorreta = "RBIM2025";

    if (senha === senhaCorreta) {
      // Salvar autenticação no localStorage
      localStorage.setItem("cgbim_auth", "authenticated");
      localStorage.setItem("cgbim_auth_time", Date.now().toString());
      toast.success("Login realizado com sucesso!");
      
      // Recarregar página para aplicar autenticação
      window.location.href = "/";
    } else {
      toast.error("Senha incorreta. Tente novamente.");
      setLoading(false);
      setSenha("");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-50 p-4">
      <Card className="w-full max-w-md shadow-elegant-lg">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-32 h-32">
            <img 
              src="/logo-bahia.png" 
              alt="Governo da Bahia" 
              className="w-full h-full object-contain"
            />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold">
              Painel CG BIM-BA
            </CardTitle>
            <CardDescription className="mt-2">
              Acesso restrito à RBIM - Rede BIM Bahia
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="senha" className="flex items-center gap-2">
                <Lock className="h-4 w-4" />
                Senha de Acesso
              </Label>
              <Input
                id="senha"
                type="password"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                placeholder="Digite a senha"
                required
                autoFocus
                className="text-center text-lg tracking-wider"
              />
            </div>

            <Button 
              type="submit" 
              className="w-full" 
              size="lg"
              disabled={loading}
            >
              {loading ? "Verificando..." : "Entrar"}
            </Button>

            <p className="text-xs text-center text-muted-foreground mt-4">
              Apenas membros autorizados da RBIM podem acessar este sistema.
            </p>
          </form>
        </CardContent>
      </Card>

      <div className="fixed bottom-4 left-4 text-sm text-muted-foreground">
        Comitê Gestor BIM-BA - Governo do Estado da Bahia
      </div>
    </div>
  );
}
