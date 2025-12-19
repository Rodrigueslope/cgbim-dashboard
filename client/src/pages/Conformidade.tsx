import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, Circle, Clock, Database, FileText, Users, Handshake, Microscope } from "lucide-react";

export default function Conformidade() {
  const { data: conformidade, isLoading } = trpc.conformidade.list.useQuery();
  const { data: secretarias } = trpc.secretarias.list.useQuery();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Carregando conformidade...</p>
        </div>
      </div>
    );
  }

  const getCategoriaIcon = (categoria: string) => {
    const icons: Record<string, any> = {
      biblioteca_bim: Database,
      cde: FileText,
      laboratorio_geobim: Microscope,
      normativas: FileText,
      capacitacao: Users,
      parcerias: Handshake,
    };
    const Icon = icons[categoria] || FileText;
    return <Icon className="w-5 h-5" />;
  };

  const getCategoriaLabel = (categoria: string) => {
    const labels: Record<string, string> = {
      biblioteca_bim: "Biblioteca BIM",
      cde: "Ambiente Comum de Dados (CDE)",
      laboratorio_geobim: "Laboratório GeoBIM",
      normativas: "Instruções Normativas",
      capacitacao: "Programa de Capacitação",
      parcerias: "Parcerias e Cooperações",
    };
    return labels[categoria] || categoria;
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { className: string, label: string, icon: any }> = {
      nao_iniciado: { className: "bg-gray-100 text-gray-700", label: "Não Iniciado", icon: Circle },
      em_progresso: { className: "bg-blue-100 text-blue-700", label: "Em Progresso", icon: Clock },
      concluido: { className: "bg-green-100 text-green-700", label: "Concluído", icon: CheckCircle2 },
    };
    
    const config = variants[status] || variants.nao_iniciado;
    const Icon = config.icon;
    
    return (
      <Badge variant="outline" className={config.className}>
        <Icon className="w-3 h-3 mr-1" />
        {config.label}
      </Badge>
    );
  };

  // Agrupar por categoria
  const categorias = ['biblioteca_bim', 'cde', 'laboratorio_geobim', 'normativas', 'capacitacao', 'parcerias'];
  const conformidadePorCategoria = categorias.map(cat => {
    const itens = conformidade?.filter(c => c.categoria === cat) || [];
    const percentualMedio = itens.length > 0
      ? itens.reduce((acc, item) => acc + item.percentualConclusao, 0) / itens.length
      : 0;
    
    return {
      categoria: cat,
      label: getCategoriaLabel(cat),
      itens,
      percentualMedio: Math.round(percentualMedio),
    };
  });

  // Calcular progresso geral
  const progressoGeral = conformidade && conformidade.length > 0
    ? Math.round(conformidade.reduce((acc, item) => acc + item.percentualConclusao, 0) / conformidade.length)
    : 0;

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Conformidade Regulatória
          </h1>
          <p className="text-lg text-muted-foreground">
            Acompanhamento da implementação dos requisitos do Decreto BIM-BA
          </p>
        </div>

        {/* Progresso Geral */}
        <Card className="shadow-elegant-md hover:shadow-elegant-lg transition-all duration-300 mb-8 border-l-4 border-l-primary animate-fadeIn">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Progresso Geral da Estratégia BIM-BA</span>
              <span className="text-4xl font-bold text-primary">{progressoGeral}%</span>
            </CardTitle>
            <CardDescription>Implementação consolidada de todos os requisitos</CardDescription>
          </CardHeader>
          <CardContent>
            <Progress value={progressoGeral} className="h-4" />
          </CardContent>
        </Card>

        {/* Cards por Categoria */}
        <div className="grid gap-6 lg:grid-cols-2 mb-8 animate-fadeIn" style={{animationDelay: '0.2s'}}>
          {conformidadePorCategoria.map((cat) => (
            <Card key={cat.categoria} className="shadow-elegant-md hover:shadow-elegant-lg transition-all duration-300 hover:scale-[1.01]">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg text-primary">
                    {getCategoriaIcon(cat.categoria)}
                  </div>
                  <div className="flex-1">
                    <div>{cat.label}</div>
                    <div className="text-2xl font-bold text-primary mt-1">{cat.percentualMedio}%</div>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Progress value={cat.percentualMedio} className="h-3 mb-4" />
                <div className="space-y-3">
                  {cat.itens.map((item) => {
                    const secretaria = secretarias?.find(s => s.id === item.responsavelSecretariaId);
                    return (
                      <div key={item.id} className="border border-border rounded-lg p-3">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-medium text-foreground text-sm">{item.item}</h4>
                          {getStatusBadge(item.status)}
                        </div>
                        {item.descricao && (
                          <p className="text-xs text-muted-foreground mb-2">{item.descricao}</p>
                        )}
                        <div className="flex items-center justify-between">
                          <Progress value={item.percentualConclusao} className="h-2 flex-1 mr-3" />
                          <span className="text-xs font-medium text-muted-foreground">{item.percentualConclusao}%</span>
                        </div>
                        {secretaria && (
                          <p className="text-xs text-muted-foreground mt-2">
                            Responsável: <span className="font-medium">{secretaria.sigla}</span>
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Checklist de Requisitos do Decreto */}
        <Card className="shadow-elegant-md hover:shadow-elegant-lg transition-all duration-300 animate-fadeIn" style={{animationDelay: '0.4s'}}>
          <CardHeader>
            <CardTitle>Checklist de Requisitos do Decreto</CardTitle>
            <CardDescription>Status de implementação dos artigos do Decreto BIM-BA</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {conformidade?.map((item) => {
                const secretaria = secretarias?.find(s => s.id === item.responsavelSecretariaId);
                return (
                  <div key={item.id} className="flex items-start gap-4 p-4 border border-border rounded-lg hover:bg-accent/30 transition-colors">
                    <div className="mt-1">
                      {item.status === 'concluido' ? (
                        <CheckCircle2 className="w-6 h-6 text-green-600" />
                      ) : item.status === 'em_progresso' ? (
                        <Clock className="w-6 h-6 text-blue-600" />
                      ) : (
                        <Circle className="w-6 h-6 text-gray-400" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="font-semibold text-foreground">{item.item}</h4>
                          <Badge variant="secondary" className="mt-1 text-xs">
                            {getCategoriaLabel(item.categoria)}
                          </Badge>
                        </div>
                        {getStatusBadge(item.status)}
                      </div>
                      {item.descricao && (
                        <p className="text-sm text-muted-foreground mb-3">{item.descricao}</p>
                      )}
                      <div className="flex items-center gap-3 mb-2">
                        <Progress value={item.percentualConclusao} className="h-2 flex-1" />
                        <span className="text-sm font-medium text-primary">{item.percentualConclusao}%</span>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        {secretaria && (
                          <span>Responsável: <span className="font-medium">{secretaria.sigla}</span></span>
                        )}
                        {item.dataPrevista && (
                          <span>Previsão: {new Date(item.dataPrevista).toLocaleDateString('pt-BR')}</span>
                        )}
                        {item.dataConclusao && (
                          <span className="text-green-600">
                            Concluído: {new Date(item.dataConclusao).toLocaleDateString('pt-BR')}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}

              {!conformidade || conformidade.length === 0 && (
                <div className="py-12 text-center">
                  <FileText className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    Nenhum item de conformidade cadastrado
                  </h3>
                  <p className="text-muted-foreground">
                    Os requisitos do Decreto BIM-BA aparecerão aqui quando forem registrados.
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
