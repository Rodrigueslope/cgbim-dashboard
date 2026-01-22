import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Shield } from "lucide-react";

interface AdminPasswordProps {
  onSuccess: () => void;
}

export default function AdminPassword({ onSuccess }: AdminPasswordProps) {
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Senha de administração: RBIM007
    const senhaCorreta = "RBIM007";

    if (senha === senhaCorreta) {
      // Salvar autorização de admin no sessionStorage (válido apenas durante a sessão)
      sessionStorage.setItem("cgbim_admin_auth", "authorized");
      toast.success("Acesso autorizado!");
      onSuccess();
    } else {
      toast.error("Senha incorreta. Apenas membros da RBIM podem acessar.");
      setLoading(false);
      setSenha("");
    }
  };

  return (
    <div className="min-h-[60vh] flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-elegant-lg">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
            <Shield className="h-8 w-8 text-primary" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold">
              Área Administrativa
            </CardTitle>
            <CardDescription className="mt-2">
              Acesso restrito à RBIM para edição de dados
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="admin-senha" className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Senha de Administração
              </Label>
              <Input
                id="admin-senha"
                type="password"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                placeholder="Digite a senha administrativa"
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
              {loading ? "Verificando..." : "Acessar Administração"}
            </Button>

            <p className="text-xs text-center text-muted-foreground mt-4">
              Esta área permite criar, editar e excluir dados do sistema.
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
