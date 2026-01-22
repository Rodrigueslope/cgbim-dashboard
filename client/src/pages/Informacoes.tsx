import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Phone, MapPin, Globe, Users, FileText } from "lucide-react";

export default function Informacoes() {
  return (
    <div className="container py-8 max-w-5xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight">Informações e Dúvidas</h1>
        <p className="text-muted-foreground mt-2">
          Entre em contato com a RBIM - Rede BIM Bahia
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Card de Contato */}
        <Card className="shadow-elegant-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-primary" />
              Contato RBIM
            </CardTitle>
            <CardDescription>
              Fale conosco para esclarecer dúvidas ou obter mais informações
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-primary/10 rounded-lg">
                <Mail className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold mb-1">E-mail</h3>
                <a
                  href="mailto:consultoriarbim@gmail.com"
                  className="text-primary hover:underline"
                >
                  consultoriarbim@gmail.com
                </a>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-3 bg-primary/10 rounded-lg">
                <Phone className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold mb-1">Telefone</h3>
                <a
                  href="tel:+5583996297964"
                  className="text-primary hover:underline"
                >
                  (83) 99629-7964
                </a>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Card Sobre o CGBIM-BAHIA */}
        <Card className="shadow-elegant-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Sobre o CGBIM-BAHIA
            </CardTitle>
            <CardDescription>
              Comitê Gestor BIM do Estado da Bahia
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground leading-relaxed">
              O Comitê Gestor BIM-BA (CGBIM-BAHIA) foi instituído pelo Decreto Estadual nº 21.455/2024
              com o objetivo de coordenar a implementação e disseminação da metodologia BIM (Building
              Information Modeling) no Estado da Bahia.
            </p>
            <div className="flex items-start gap-3 text-sm">
              <FileText className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="font-medium">Composição</p>
                <p className="text-muted-foreground">
                  11 secretarias estaduais participantes
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Card de Objetivos */}
        <Card className="shadow-elegant-lg md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-primary" />
              Objetivos do CGBIM-BAHIA
            </CardTitle>
            <CardDescription>
              Principais diretrizes estabelecidas pelo Decreto BIM-BA
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-primary font-semibold text-sm">1</span>
                </div>
                <div>
                  <h4 className="font-medium mb-1">Difundir o BIM</h4>
                  <p className="text-sm text-muted-foreground">
                    Promover a disseminação da metodologia BIM entre os órgãos estaduais e profissionais
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-primary font-semibold text-sm">2</span>
                </div>
                <div>
                  <h4 className="font-medium mb-1">Biblioteca BIM Estadual</h4>
                  <p className="text-sm text-muted-foreground">
                    Desenvolver e implementar biblioteca de objetos BIM para uso nos projetos estaduais
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-primary font-semibold text-sm">3</span>
                </div>
                <div>
                  <h4 className="font-medium mb-1">Ambiente Comum de Dados (CDE)</h4>
                  <p className="text-sm text-muted-foreground">
                    Estruturar plataforma para compartilhamento de informações BIM entre órgãos
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-primary font-semibold text-sm">4</span>
                </div>
                <div>
                  <h4 className="font-medium mb-1">Capacitação</h4>
                  <p className="text-sm text-muted-foreground">
                    Promover treinamentos e capacitações em BIM para servidores estaduais
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-primary font-semibold text-sm">5</span>
                </div>
                <div>
                  <h4 className="font-medium mb-1">Normativas e Protocolos</h4>
                  <p className="text-sm text-muted-foreground">
                    Criar manuais e protocolos para adoção do BIM nos órgãos estaduais
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-primary font-semibold text-sm">6</span>
                </div>
                <div>
                  <h4 className="font-medium mb-1">Laboratório GeoBIM</h4>
                  <p className="text-sm text-muted-foreground">
                    Implementar laboratório para integração de BIM com sistemas de informação geográfica
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Card de Horário de Atendimento */}
        <Card className="shadow-elegant-lg md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" />
              Horário de Atendimento
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Segunda a Sexta-feira: 8h às 17h
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Respondemos e-mails e mensagens em até 48 horas úteis.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
