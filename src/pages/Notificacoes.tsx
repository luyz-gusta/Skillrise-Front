import { useState, useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navbar } from '@/components/Navbar';
import * as notificacaoService from '@/services/notificacaoService';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNotificationRefresh } from '@/hooks/useNotifications';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Bell, Check, CheckCheck, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function Notificacoes() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [filtro, setFiltro] = useState<'todas' | 'nao-lidas' | 'lidas'>('todas');

  // Refresh automático de notificações
  useNotificationRefresh(30000);

  // Buscar notificações do usuário
  const { data: notificacoes = [], isLoading } = useQuery({
    queryKey: ['notificacoes', user?.userId],
    queryFn: () => notificacaoService.findByUserId(user!.userId),
    enabled: !!user?.userId,
    staleTime: 1 * 60 * 1000, // 1 minuto
  });

  // Mutation para marcar como lida
  const marcarLidaMutation = useMutation({
    mutationFn: (notificacaoId: number) => notificacaoService.marcarComoLida(notificacaoId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notificacoes', user?.userId] });
      queryClient.invalidateQueries({ queryKey: ['notificacoesNaoLidas', user?.userId] });
      toast({
        title: "Notificação marcada como lida",
        duration: 2000,
      });
    },
    onError: () => {
      toast({
        title: "Erro ao marcar notificação",
        variant: "destructive",
      });
    },
  });

  // Mutation para marcar todas como lidas
  const marcarTodasLidasMutation = useMutation({
    mutationFn: () => notificacaoService.marcarTodasComoLidas(user!.userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notificacoes', user?.userId] });
      queryClient.invalidateQueries({ queryKey: ['notificacoesNaoLidas', user?.userId] });
      toast({
        title: "Todas notificações marcadas como lidas",
        duration: 2000,
      });
    },
    onError: () => {
      toast({
        title: "Erro ao marcar notificações",
        variant: "destructive",
      });
    },
  });

  // Mutation para deletar
  const deletarMutation = useMutation({
    mutationFn: (notificacaoId: number) => notificacaoService.deletar(notificacaoId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notificacoes', user?.userId] });
      queryClient.invalidateQueries({ queryKey: ['notificacoesNaoLidas', user?.userId] });
      toast({
        title: "Notificação removida",
        duration: 2000,
      });
    },
    onError: () => {
      toast({
        title: "Erro ao remover notificação",
        variant: "destructive",
      });
    },
  });

  const notificacoesFiltradas = useMemo(() => {
    return notificacoes.filter((notif) => {
      if (filtro === 'nao-lidas') return !notif.lida;
      if (filtro === 'lidas') return notif.lida;
      return true;
    });
  }, [notificacoes, filtro]);

  const getTipoColor = (tipo: string) => {
    switch (tipo) {
      case 'ACHIEVEMENT':
        return 'bg-yellow-500';
      case 'CERTIFICADO':
        return 'bg-green-500';
      case 'TRILHA':
        return 'bg-blue-500';
      case 'OPORTUNIDADE':
        return 'bg-purple-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-24">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Notificações</h1>
            <p className="text-muted-foreground">
              Acompanhe suas conquistas, certificados e atualizações
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => marcarTodasLidasMutation.mutate()}
            disabled={!notificacoes.some((n) => !n.lida) || marcarTodasLidasMutation.isPending}
          >
            <CheckCheck className="mr-2 h-4 w-4" />
            Marcar todas como lidas
          </Button>
        </div>

        <Tabs defaultValue="todas" onValueChange={(v) => setFiltro(v as any)}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="todas">
              Todas ({notificacoes.length})
            </TabsTrigger>
            <TabsTrigger value="nao-lidas">
              Não lidas ({notificacoes.filter((n) => !n.lida).length})
            </TabsTrigger>
            <TabsTrigger value="lidas">
              Lidas ({notificacoes.filter((n) => n.lida).length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value={filtro} className="mt-6 space-y-4">
            {isLoading ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Carregando notificações...</p>
              </div>
            ) : notificacoesFiltradas.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Bell className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">
                    {filtro === 'nao-lidas' 
                      ? 'Nenhuma notificação não lida' 
                      : 'Nenhuma notificação encontrada'}
                  </p>
                </CardContent>
              </Card>
            ) : (
              notificacoesFiltradas.map((notif) => (
                <Card 
                  key={notif.notificacaoId} 
                  className={!notif.lida ? 'border-primary' : ''}
                >
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className={getTipoColor(notif.tipo)}>
                            {notif.tipo}
                          </Badge>
                          {!notif.lida && (
                            <Badge variant="secondary">Nova</Badge>
                          )}
                        </div>
                        <CardTitle className="text-lg">{notif.titulo}</CardTitle>
                        <CardDescription className="mt-1">
                          {format(new Date(notif.criadaEm), "PPP 'às' HH:mm", { locale: ptBR })}
                        </CardDescription>
                      </div>
                      <div className="flex gap-2">
                        {!notif.lida && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => marcarLidaMutation.mutate(notif.notificacaoId)}
                            disabled={marcarLidaMutation.isPending}
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => deletarMutation.mutate(notif.notificacaoId)}
                          disabled={deletarMutation.isPending}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">{notif.mensagem}</p>
                    {notif.link && (
                      <Button
                        variant="link"
                        className="mt-2 p-0 h-auto"
                        onClick={() => window.location.href = notif.link}
                      >
                        Ver detalhes →
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>
      </div>
    </div>
  );
}
