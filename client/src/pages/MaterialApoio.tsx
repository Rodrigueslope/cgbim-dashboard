import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { useState } from "react";
import { Upload, FileText, Download, Trash2, File } from "lucide-react";

export default function MaterialApoio() {
  const utils = trpc.useUtils();
  
  const [selectedReuniao, setSelectedReuniao] = useState<number | null>(null);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    titulo: "",
    descricao: "",
    arquivo: null as File | null,
  });

  // Queries
  const { data: reunioes = [] } = trpc.reunioes.list.useQuery();
  const { data: materiais = [] } = trpc.materiais.list.useQuery();
  
  // Filtrar materiais pela reunião selecionada
  const materiaisFiltrados = selectedReuniao
    ? materiais.filter(m => m.reuniaoId === selectedReuniao)
    : materiais;

  // Mutations
  const createMaterial = trpc.materiais.create.useMutation({
    onSuccess: () => {
      toast.success("Material enviado com sucesso!");
      utils.materiais.list.invalidate();
      setFormData({ titulo: "", descricao: "", arquivo: null });
    },
    onError: (error) => {
      toast.error(`Erro ao enviar material: ${error.message}`);
    },
  });

  const deleteMaterial = trpc.materiais.delete.useMutation({
    onSuccess: () => {
      toast.success("Material excluído com sucesso!");
      utils.materiais.list.invalidate();
    },
    onError: (error) => {
      toast.error(`Erro ao excluir material: ${error.message}`);
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validar tipo de arquivo
      const allowedTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ];
      
      if (!allowedTypes.includes(file.type)) {
        toast.error("Apenas arquivos PDF e Word são permitidos");
        return;
      }

      // Validar tamanho (máximo 16MB)
      if (file.size > 16 * 1024 * 1024) {
        toast.error("Arquivo muito grande. Máximo 16MB");
        return;
      }

      setFormData({ ...formData, arquivo: file });
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedReuniao) {
      toast.error("Selecione uma reunião");
      return;
    }

    if (!formData.arquivo) {
      toast.error("Selecione um arquivo");
      return;
    }

    if (!formData.titulo.trim()) {
      toast.error("Digite um título para o material");
      return;
    }

    setUploading(true);

    try {
      // Converter arquivo para base64
      const reader = new FileReader();
      reader.readAsDataURL(formData.arquivo);
      
      reader.onload = async () => {
        const base64 = reader.result as string;
        const base64Data = base64.split(',')[1];

        // Upload para S3 via backend
        const response = await fetch('/api/upload-material', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            fileName: formData.arquivo!.name,
            fileData: base64Data,
            contentType: formData.arquivo!.type,
          }),
        });

        if (!response.ok) {
          throw new Error('Erro ao fazer upload do arquivo');
        }

        const { url } = await response.json();

        // Criar registro no banco
        await createMaterial.mutateAsync({
          reuniaoId: selectedReuniao!,
          titulo: formData.titulo,
          descricao: formData.descricao || undefined,
          arquivoUrl: url,
          arquivoNome: formData.arquivo!.name,
          tipoArquivo: formData.arquivo!.type,
          tamanho: formData.arquivo!.size,
        });

        setUploading(false);
      };

      reader.onerror = () => {
        toast.error("Erro ao ler arquivo");
        setUploading(false);
      };
    } catch (error) {
      console.error("Erro no upload:", error);
      toast.error("Erro ao enviar arquivo");
      setUploading(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  const getFileIcon = (tipoArquivo?: string) => {
    if (tipoArquivo?.includes("pdf")) return <FileText className="h-5 w-5 text-red-500" />;
    if (tipoArquivo?.includes("word")) return <File className="h-5 w-5 text-blue-500" />;
    return <File className="h-5 w-5 text-gray-500" />;
  };

  return (
    <div className="container py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight">Material de Apoio</h1>
        <p className="text-muted-foreground mt-2">
          Documentos e materiais vinculados às reuniões do CGBIM-BAHIA
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Formulário de Upload */}
        <Card className="shadow-elegant-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Enviar Material
            </CardTitle>
            <CardDescription>
              Adicione documentos PDF ou Word vinculados a uma reunião
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleUpload} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="reuniao-select">Reunião *</Label>
                <Select
                  value={selectedReuniao?.toString() || ""}
                  onValueChange={(value) => setSelectedReuniao(Number(value))}
                >
                  <SelectTrigger id="reuniao-select">
                    <SelectValue placeholder="Selecione a reunião" />
                  </SelectTrigger>
                  <SelectContent>
                    {reunioes.map((reuniao) => (
                      <SelectItem key={reuniao.id} value={reuniao.id.toString()}>
                        Reunião #{reuniao.numero} - {new Date(reuniao.data).toLocaleDateString('pt-BR')}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="titulo-material">Título do Material *</Label>
                <Input
                  id="titulo-material"
                  type="text"
                  value={formData.titulo}
                  onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                  placeholder="Ex: Ata da Reunião, Apresentação BIM"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="descricao-material">Descrição</Label>
                <Textarea
                  id="descricao-material"
                  value={formData.descricao}
                  onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                  placeholder="Descreva o conteúdo do material..."
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="arquivo-upload">Arquivo (PDF ou Word) *</Label>
                <Input
                  id="arquivo-upload"
                  type="file"
                  accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  onChange={handleFileChange}
                  required
                />
                {formData.arquivo && (
                  <p className="text-sm text-muted-foreground">
                    Arquivo selecionado: {formData.arquivo.name} ({formatFileSize(formData.arquivo.size)})
                  </p>
                )}
              </div>

              <Button type="submit" className="w-full" disabled={uploading}>
                {uploading ? (
                  <>
                    <span className="animate-spin mr-2">⏳</span>
                    Enviando...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Enviar Material
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Listagem de Materiais */}
        <Card className="shadow-elegant-md">
          <CardHeader>
            <CardTitle>Materiais Cadastrados</CardTitle>
            <CardDescription>
              {materiaisFiltrados.length} {materiaisFiltrados.length === 1 ? 'material' : 'materiais'} disponível(is)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-[600px] overflow-y-auto">
              {materiaisFiltrados.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  Nenhum material cadastrado ainda
                </p>
              ) : (
                materiaisFiltrados.map((material) => {
                  const reuniao = reunioes.find(r => r.id === material.reuniaoId);
                  return (
                    <div
                      key={material.id}
                      className="flex items-start justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                    >
                      <div className="flex items-start gap-3 flex-1">
                        {getFileIcon(material.tipoArquivo || undefined)}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium truncate">{material.titulo}</h3>
                          {material.descricao && (
                            <p className="text-sm text-muted-foreground line-clamp-2">
                              {material.descricao}
                            </p>
                          )}
                          <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                            <span>Reunião #{reuniao?.numero}</span>
                            <span>•</span>
                            <span>{material.tamanho ? formatFileSize(material.tamanho) : 'Tamanho desconhecido'}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => window.open(material.arquivoUrl, '_blank')}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => {
                            if (confirm('Tem certeza que deseja excluir este material?')) {
                              deleteMaterial.mutate({ id: material.id });
                            }
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
