import { Bell } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Badge } from './ui/badge';
import * as notificacaoService from '../services/notificacaoService';
import { Notificacao } from '../services/notificacaoService';

interface NotificationBellProps {
  userId: number;
}

export default function NotificationBell({ userId }: NotificationBellProps) {
  const [notificacoes, setNotificacoes] = useState<Notificacao[]>([]);
  const [count, setCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  // Buscar notificações não lidas
  const fetchNotificacoes = async () => {
    if (!userId) return;
    
    try {
      const [naoLidas, totalNaoLidas] = await Promise.all([
        notificacaoService.findNaoLidas(userId),
        notificacaoService.contarNaoLidas(userId),
      ]);
      setNotificacoes(naoLidas.slice(0, 5)); // Apenas as 5 mais recentes
      setCount(totalNaoLidas);
    } catch (error) {
      console.error('Erro ao buscar notificações:', error);
    }
  };

  useEffect(() => {
    if (!userId) return;
    
    fetchNotificacoes();
    
    // Atualizar a cada 30 segundos
    const interval = setInterval(fetchNotificacoes, 30000);
    return () => clearInterval(interval);
  }, [userId]);

  const handleMarcarComoLida = async (notificacaoId: number) => {
    try {
      await notificacaoService.marcarComoLida(notificacaoId);
      fetchNotificacoes();
    } catch (error) {
      console.error('Erro ao marcar como lida:', error);
    }
  };

  const handleMarcarTodasComoLidas = async () => {
    try {
      await notificacaoService.marcarTodasComoLidas(userId);
      fetchNotificacoes();
    } catch (error) {
      console.error('Erro ao marcar todas como lidas:', error);
    }
  };

  const getTimeSince = (date: string) => {
    const now = new Date();
    const notifDate = new Date(date);
    const diff = Math.floor((now.getTime() - notifDate.getTime()) / 1000);

    if (diff < 60) return 'agora';
    if (diff < 3600) return `${Math.floor(diff / 60)}m`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
    return `${Math.floor(diff / 86400)}d`;
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {count > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
            >
              {count > 9 ? '9+' : count}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel className="flex justify-between items-center">
          <span>Notificações</span>
          {count > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleMarcarTodasComoLidas}
              className="h-auto p-1 text-xs"
            >
              Marcar todas como lidas
            </Button>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        {notificacoes.length === 0 ? (
          <div className="p-4 text-center text-sm text-muted-foreground">
            Nenhuma notificação nova
          </div>
        ) : (
          <>
            {notificacoes.map((notif) => (
              <DropdownMenuItem 
                key={notif.notificacaoId}
                className="flex flex-col items-start p-3 cursor-pointer"
                onClick={() => handleMarcarComoLida(notif.notificacaoId)}
              >
                <div className="flex justify-between w-full items-start">
                  <div className="flex-1">
                    <p className="font-medium text-sm">{notif.titulo}</p>
                    <p className="text-xs text-muted-foreground mt-1">{notif.mensagem}</p>
                  </div>
                  <span className="text-xs text-muted-foreground ml-2">
                    {getTimeSince(notif.criadaEm)}
                  </span>
                </div>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link 
                to="/notificacoes" 
                className="w-full text-center text-sm text-primary cursor-pointer"
              >
                Ver todas as notificações
              </Link>
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
