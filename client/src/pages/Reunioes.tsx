import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Users, CheckCircle2, XCircle } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function Reunioes() {
  const { data: reunioes, isLoading } = trpc.reunioes.list.useQuery();
  const { data: secretarias } = trpc.secretarias.list.useQuery();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Carregando reuniões...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Reuniões do CGBIM-BAHIA
          </h1>
          <p className="text-lg text-muted-foreground">
            Histórico e acompanhamento de reuniões ordinárias e extraordinárias
          </p>
        </div>

        <div className="grid gap-6">
          {reunioes?.map((reuniao) => (
            <Card key={reuniao.id} className="shadow-elegant-md hover:shadow-elegant-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="flex items-center gap-3">
                      <span>Reunião #{reuniao.numero}</span>
                      <Badge 
                        variant={reuniao.tipo === 'ordinaria' ? 'default' : 'secondary'}
                        className="capitalize"
                      >
                        {reuniao.tipo}
                      </Badge>
                      {reuniao.quorumAtingido ? (
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                          <CheckCircle2 className="w-3 h-3 mr-1" />
                          Quórum Atingido
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                          <XCircle className="w-3 h-3 mr-1" />
                          Sem Quórum
                        </Badge>
                      )}
                    </CardTitle>
                    <CardDescription className="mt-2 flex flex-wrap gap-4">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {format(new Date(reuniao.data), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                      </span>
                      {reuniao.local && (
                        <span className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {reuniao.local}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {reuniao.totalPresentes}/{reuniao.totalEsperado} presentes ({reuniao.taxaPresenca}%)
                      </span>
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {reuniao.pauta && (
                  <div className="mb-4">
                    <h4 className="font-semibold text-sm text-muted-foreground mb-2">Pauta:</h4>
                    <p className="text-foreground">{reuniao.pauta}</p>
                  </div>
                )}
                {reuniao.ata && (
                  <div>
                    <h4 className="font-semibold text-sm text-muted-foreground mb-2">Ata:</h4>
                    <p className="text-foreground text-sm">{reuniao.ata}</p>
                  </div>
                )}
                <div className="mt-4 pt-4 border-t border-border">
                  <Badge variant="secondary" className="capitalize">
                    {reuniao.modalidade}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}

          {!reunioes || reunioes.length === 0 && (
            <Card className="shadow-elegant-md">
              <CardContent className="py-12 text-center">
                <Calendar className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Nenhuma reunião registrada
                </h3>
                <p className="text-muted-foreground">
                  As reuniões do CGBIM-BAHIA aparecerão aqui quando forem cadastradas.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
