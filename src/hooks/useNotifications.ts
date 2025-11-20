import { useEffect, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { achievementService } from '@/services/achievementService';
import { notificacaoService } from '@/services/notificacaoService';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

/**
 * Hook para verificar e exibir novas conquistas automaticamente
 * Deve ser usado após ações importantes como completar módulos, trilhas, etc.
 */
export const useAchievementNotifications = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const checkForNewAchievements = useCallback(async () => {
    if (!user?.userId) return;

    try {
      const newAchievements = await achievementService.verificarNovasConquistas(user.userId);
      
      if (newAchievements && newAchievements.length > 0) {
        // Invalidar cache de achievements e notificações
        queryClient.invalidateQueries({ queryKey: ['achievements', user.userId] });
        queryClient.invalidateQueries({ queryKey: ['notificacoes', user.userId] });
        
        // Mostrar toast para cada nova conquista
        newAchievements.forEach((achievement) => {
          toast({
            title: `🏆 Nova Conquista Desbloqueada!`,
            description: `${achievement.nome} - +${achievement.xpGanho} XP`,
            duration: 5000,
          });
        });
      }
    } catch (error) {
      console.error('Erro ao verificar conquistas:', error);
    }
  }, [user?.userId, queryClient, toast]);

  return { checkForNewAchievements };
};

/**
 * Hook para recarregar notificações automaticamente
 */
export const useNotificationRefresh = (intervalMs: number = 30000) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!user?.userId) return;

    const interval = setInterval(() => {
      queryClient.invalidateQueries({ queryKey: ['notificacoes', user.userId] });
      queryClient.invalidateQueries({ queryKey: ['notificacoesNaoLidas', user.userId] });
    }, intervalMs);

    return () => clearInterval(interval);
  }, [user?.userId, queryClient, intervalMs]);
};

/**
 * Hook para enviar notificação customizada
 */
export const useCreateNotification = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const createNotification = useCallback(async (
    mensagem: string,
    tipo: string = 'INFO'
  ) => {
    if (!user?.userId) return;
    
    try {
      await notificacaoService.criar({
        userId: user.userId,
        titulo: tipo === 'INFO' ? 'Informação' : tipo === 'CONQUISTA' ? 'Nova Conquista' : tipo === 'CERTIFICADO' ? 'Certificado' : 'Lembrete',
        mensagem,
        tipo,
      });
      
      queryClient.invalidateQueries({ queryKey: ['notificacoes', user.userId] });
      queryClient.invalidateQueries({ queryKey: ['notificacoesNaoLidas', user.userId] });
    } catch (error) {
      console.error('Erro ao criar notificação:', error);
    }
  }, [user?.userId, queryClient]);

  return { createNotification };
};

export default {
  useAchievementNotifications,
  useNotificationRefresh,
  useCreateNotification,
};
