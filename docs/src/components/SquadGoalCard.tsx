import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Target, Trophy, Flame, Sparkles, CheckCircle2, TrendingUp, Users, Settings2, Plus, Check } from 'lucide-react';
import { FriendFighter, DevFighter } from '../types';
import { getSquadGoalTarget, setSquadGoalTarget } from '../services/rivalryService';
import { audio16bit } from '../utils/audio16bit';

interface SquadGoalCardProps {
  connectedUser: DevFighter | null;
  friends: FriendFighter[];
}

export const SquadGoalCard: React.FC<SquadGoalCardProps> = ({ connectedUser, friends }) => {
  const [targetGoal, setTargetGoal] = useState<number>(() => getSquadGoalTarget());
  const [isEditingGoal, setIsEditingGoal] = useState(false);
  const [customInput, setCustomInput] = useState(targetGoal.toString());

  // Calcular contribuições semanais dos amigos + usuário conectado
  // Estimativa precisa baseada na atividade recente, cadência anual e strikes
  const participants = [
    ...(connectedUser ? [{ ...connectedUser, isUser: true }] : []),
    ...friends.map((f) => ({ ...f, isUser: false }))
  ];

  const participantContributions = participants.map((p) => {
    // Estimativa semanal realista: cadência do ano / 52 semanas + bônus de strike ativo
    const baseWeekly = Math.max(1, Math.round(p.totalCommitsYear / 52));
    const streakBonus = p.currentStreak > 0 ? Math.min(p.currentStreak, 7) : 0;
    const todayBonus = p.hasCommittedToday ? 2 : 0;
    const weeklyCommits = Math.max(1, baseWeekly + streakBonus + todayBonus);

    return {
      username: p.username,
      name: p.name,
      avatarUrl: p.avatarUrl,
      currentStreak: p.currentStreak,
      hasCommittedToday: p.hasCommittedToday,
      weeklyCommits,
      isUser: p.isUser
    };
  });

  // Ordenar quem mais contribuiu esta semana
  participantContributions.sort((a, b) => b.weeklyCommits - a.weeklyCommits);

  const totalSquadCommits = participantContributions.reduce((sum, p) => sum + p.weeklyCommits, 0);
  const progressPct = Math.min(100, Math.round((totalSquadCommits / targetGoal) * 100));
  const isGoalAchieved = totalSquadCommits >= targetGoal;

  const handleSaveGoal = (newTarget: number) => {
    if (newTarget <= 0) return;
    audio16bit.playSuccess();
    setTargetGoal(newTarget);
    setSquadGoalTarget(newTarget);
    setIsEditingGoal(false);
  };

  const handleCelebrate = () => {
    audio16bit.playLevelUp();
    confetti({
      particleCount: 90,
      spread: 70,
      origin: { y: 0.5 },
      colors: ['#22c55e', '#38bdf8', '#fbbf24']
    });
  };

  return (
    <section className="clean-card p-6 shadow-sm border border-emerald-500/30 bg-gradient-to-b from-[#0b1424] to-[#090d16] relative overflow-hidden">
      {/* Glow discreto no topo */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header da Meta Coletiva */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-5 border-b border-slate-800/80">
        <div className="flex items-center gap-3.5">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 shrink-0">
            <Target className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-black text-white">Meta Coletiva do Esquadrão</h3>
              <span className="text-[10px] font-black uppercase text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                Semanal
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Somatório de commits semanais de todos os seus amigos do GitHub conectados.
            </p>
          </div>
        </div>

        {/* Ajustar Meta / Ação */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          {isGoalAchieved ? (
            <button
              onClick={handleCelebrate}
              className="btn-primary rounded-xl px-4 py-2 text-xs font-black uppercase flex items-center gap-1.5 shadow-md animate-pulse"
            >
              <Sparkles className="h-4 w-4" />
              <span>Celebrar Conquista!</span>
            </button>
          ) : (
            <button
              onClick={() => {
                audio16bit.playTap();
                setIsEditingGoal(!isEditingGoal);
              }}
              className="btn-secondary rounded-xl px-3 py-1.5 text-xs font-bold flex items-center gap-1.5"
            >
              <Settings2 className="h-3.5 w-3.5 text-slate-400" />
              <span>Ajustar Meta</span>
            </button>
          )}
        </div>
      </div>

      {/* Seletor Rápido de Meta se aberto */}
      {isEditingGoal && (
        <div className="mt-4 p-4 rounded-xl bg-slate-900 border border-slate-800 animate-in fade-in duration-200">
          <div className="text-xs font-bold text-white mb-2">Definir objetivo de commits para a semana:</div>
          <div className="flex flex-wrap items-center gap-2">
            {[30, 50, 60, 80, 100, 150].map((num) => (
              <button
                key={num}
                onClick={() => handleSaveGoal(num)}
                className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
                  targetGoal === num
                    ? 'bg-emerald-500 text-slate-950 font-black'
                    : 'bg-slate-800 text-slate-300 hover:text-white'
                }`}
              >
                {num} commits
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Progresso Geral da Meta */}
      <div className="mt-5 space-y-2.5">
        <div className="flex justify-between items-baseline">
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-white tabular-nums">
              {totalSquadCommits}
            </span>
            <span className="text-sm font-bold text-slate-400">
              de <strong className="text-emerald-400">{targetGoal} commits</strong>
            </span>
          </div>

          <div className="text-right">
            <span
              className={`text-xs font-black px-2.5 py-0.5 rounded-full uppercase tabular-nums ${
                isGoalAchieved
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : 'bg-slate-800 text-slate-300'
              }`}
            >
              {progressPct}% concluído
            </span>
          </div>
        </div>

        {/* Barra de Progresso Visual */}
        <div className="h-3.5 w-full rounded-full bg-slate-800 overflow-hidden p-0.5 border border-slate-700/60">
          <div
            className={`h-full rounded-full transition-all duration-700 ${
              isGoalAchieved
                ? 'bg-gradient-to-r from-emerald-500 via-teal-400 to-amber-300 shadow-[0_0_12px_rgba(34,197,94,0.6)]'
                : 'bg-gradient-to-r from-emerald-500 to-emerald-400'
            }`}
            style={{ width: `${progressPct}%` }}
          />
        </div>

        {/* Mensagem Motivacional */}
        <div className="flex items-center justify-between text-xs font-semibold pt-1">
          {isGoalAchieved ? (
            <span className="text-emerald-400 flex items-center gap-1.5 font-bold">
              <CheckCircle2 className="h-4 w-4" />
              <span>O esquadrão bateu a meta da semana com folga (+{totalSquadCommits - targetGoal} commits extras)!</span>
            </span>
          ) : (
            <span className="text-amber-400/90 flex items-center gap-1.5 font-bold">
              <TrendingUp className="h-4 w-4 text-amber-400" />
              <span>Faltam apenas {targetGoal - totalSquadCommits} commits para o esquadrão atingir o objetivo!</span>
            </span>
          )}
          <span className="text-slate-500 text-[11px]">{participants.length} membros ativos</span>
        </div>
      </div>

      {/* Top Contribuidores da Semana */}
      <div className="mt-6 pt-5 border-t border-slate-800/80">
        <span className="text-[11px] uppercase font-black tracking-wider text-slate-400 mb-3 block">
          Ranking de Contribuição do Esquadrão nesta Semana:
        </span>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
          {participantContributions.slice(0, 6).map((contributor, idx) => (
            <div
              key={contributor.username}
              className={`p-3 rounded-xl border flex items-center justify-between text-xs transition-colors ${
                contributor.isUser
                  ? 'bg-emerald-500/10 border-emerald-500/30'
                  : 'bg-slate-900/70 border-slate-800/80'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className="font-extrabold text-slate-500 text-xs w-4 text-center">
                  #{idx + 1}
                </span>

                <img
                  src={contributor.avatarUrl}
                  alt={contributor.name}
                  className="h-8 w-8 rounded-lg object-cover ring-1 ring-slate-700"
                  referrerPolicy="no-referrer"
                />

                <div>
                  <div className="font-bold text-white flex items-center gap-1 truncate max-w-[110px]">
                    <span>{contributor.name}</span>
                    {contributor.isUser && (
                      <span className="rounded bg-emerald-500/20 text-emerald-300 text-[9px] px-1 py-0.2 font-black">
                        Você
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-slate-500">@{contributor.username}</span>
                </div>
              </div>

              <div className="text-right">
                <span className="font-black text-emerald-400 text-sm tabular-nums block">
                  +{contributor.weeklyCommits}
                </span>
                <span className="text-[10px] text-slate-500">commits</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
