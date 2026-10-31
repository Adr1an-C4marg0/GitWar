import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Flame, AlertTriangle, ShieldCheck, Clock, Zap, CheckCircle2, Shield, Calendar } from 'lucide-react';
import { DevFighter, StrikeAlert } from '../types';
import { audio16bit } from '../utils/audio16bit';

interface StreakMonitorProps {
  devs: DevFighter[];
  strikeAlerts: StrikeAlert[];
  onCommitSimulated: (username: string) => void;
}

export const StreakMonitor: React.FC<StreakMonitorProps> = ({
  devs,
  strikeAlerts,
  onCommitSimulated
}) => {
  const [selectedUser, setSelectedUser] = useState<string>(devs[0]?.username || '');
  const [simulatedCommitMsg, setSimulatedCommitMsg] = useState('feat: improve duolingo style streak counter');

  const currentDev = devs.find((d) => d.username === selectedUser) || devs[0];

  const handleSimulateCommit = () => {
    if (!currentDev) return;
    audio16bit.playStreakFire();
    onCommitSimulated(currentDev.username);

    confetti({
      particleCount: 70,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#ff9600', '#58cc02', '#ff4b4b', '#ffc800']
    });
  };

  const streak = currentDev?.currentStreak || 0;
  const hasToday = currentDev?.hasCommittedToday || false;

  // Dias da semana reais baseados no strike autêntico
  const dayNames = ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB'];
  const todayDayIndex = new Date().getDay();

  const weekDays = Array.from({ length: 7 }).map((_, i) => {
    const daysAgo = 6 - i;
    const dayIndex = (todayDayIndex - daysAgo + 7) % 7;
    const isToday = daysAgo === 0;

    let done = false;
    if (isToday) {
      done = hasToday;
    } else {
      done = streak > 0 && daysAgo <= (hasToday ? streak : streak);
    }

    return {
      day: dayNames[dayIndex],
      done,
      isToday
    };
  });

  const completedDaysCount = weekDays.filter(d => d.done).length;

  return (
    <div className="space-y-8">
      {/* Duolingo Hero Streak Card */}
      <section className="card-duo p-6 sm:p-8 bg-gradient-to-r from-[#191e2b] via-[#131c2a] to-[#1c182b]">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          
          <div className="flex items-center gap-6">
            {/* Big Flame Pod */}
            <div className={`flex h-24 w-24 sm:h-28 sm:w-28 shrink-0 items-center justify-center rounded-3xl border-4 ${
              streak > 0 
                ? 'bg-gradient-to-b from-amber-400 to-orange-500 shadow-[0_10px_30px_rgba(255,150,0,0.4)] border-amber-300' 
                : 'bg-slate-800 border-slate-700 shadow-none'
            }`}>
              <Flame className={`h-14 w-14 sm:h-16 sm:w-16 ${streak > 0 ? 'text-white fill-white animate-flame' : 'text-slate-600 fill-slate-700'}`} />
            </div>

            <div>
              <div className="inline-flex items-center gap-1.5 rounded-xl bg-amber-500/20 px-3 py-1 text-xs font-black text-amber-400 mb-2">
                <Flame className="h-4 w-4" />
                <span>STREAK OFICIAL DO GITHUB</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-white">
                {streak === 0
                  ? '0 Dias (Strike Inativo)'
                  : `${streak} ${streak === 1 ? 'Dia de Fogo' : 'Dias de Fogo!'}`}
              </h2>
              <p className="mt-1 text-xs sm:text-sm font-bold text-slate-300 max-w-lg leading-relaxed">
                {streak === 0
                  ? 'Nenhum commit consecutivo recente no GitHub. Envie um push hoje para acender sua chama!'
                  : 'Você está no caminho certo. Cada dia consecutivo garante bônus de combo e multiplica sua pontuação na liga.'}
              </p>
            </div>
          </div>

          {/* Duolingo Streak Freeze Shield */}
          <div className="flex items-center gap-3 rounded-2xl border-2 border-sky-500/40 bg-sky-500/10 p-4 shrink-0 shadow-sm">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-sky-500 text-white shadow">
              <Shield className="h-6 w-6" />
            </div>
            <div>
              <div className="text-xs font-black uppercase text-sky-400">Bloqueio de Streak</div>
              <div className="text-sm font-extrabold text-white">1 Escudo Ativo</div>
              <div className="text-[11px] font-bold text-slate-400">Protege se esquecer hoje</div>
            </div>
          </div>

        </div>

        {/* Weekly Calendar Dots (Duolingo Style) */}
        <div className="mt-8 pt-6 border-t border-slate-800">
          <div className="flex items-center justify-between text-xs font-black text-slate-400 uppercase tracking-wider mb-4">
            <span className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4 text-[#58cc02]" />
              Atividade da Semana Atual
            </span>
            <span className={completedDaysCount > 0 ? 'text-[#58cc02]' : 'text-slate-500'}>
              {completedDaysCount} de 7 dias concluídos
            </span>
          </div>

          <div className="grid grid-cols-7 gap-2 sm:gap-4">
            {weekDays.map((item, index) => (
              <div
                key={item.day}
                className="flex flex-col items-center gap-2"
              >
                <div
                  className={`flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-2xl font-black text-sm transition-all shadow-md ${
                    item.done
                      ? 'bg-gradient-to-b from-[#58cc02] to-[#46a302] text-white border-b-4 border-[#357c01]'
                      : 'bg-slate-800 border-2 border-slate-700 text-slate-500'
                  }`}
                >
                  {item.done ? (
                    <CheckCircle2 className="h-6 w-6 text-white stroke-[3]" />
                  ) : (
                    <span>—</span>
                  )}
                </div>
                <span className={`text-[11px] font-extrabold ${item.done ? 'text-white' : 'text-slate-500'}`}>
                  {item.day}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Danger Zone Alerts & Interactive Simulator */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Alerts for Strikes at Risk */}
        <section className="lg:col-span-2 card-duo p-6">
          <div className="flex items-center gap-2 text-rose-400 font-black text-sm mb-4">
            <AlertTriangle className="h-5 w-5" />
            <span>AVISOS DE EXPIRAÇÃO DE STRIKE (HOJE)</span>
          </div>

          {strikeAlerts.length === 0 ? (
            <div className="rounded-2xl border-2 border-emerald-500/30 bg-emerald-500/10 p-5 text-sm font-bold text-emerald-300 flex items-center gap-3">
              <ShieldCheck className="h-6 w-6 text-[#58cc02] shrink-0" />
              <span>Todos os desenvolvedores monitorados já commitou hoje! A chama continua acesa.</span>
            </div>
          ) : (
            <div className="space-y-3">
              {strikeAlerts.map((alert) => (
                <div
                  key={alert.username}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border-2 border-rose-500/40 bg-rose-500/10 p-4 shadow-sm"
                >
                  <div className="flex items-center gap-3.5">
                    <img
                      src={alert.avatarUrl}
                      alt={alert.username}
                      className="h-12 w-12 rounded-2xl border-2 border-rose-500/60 object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div>
                      <div className="font-extrabold text-base text-white flex items-center gap-2">
                        <span>@{alert.username}</span>
                        <span className="text-xs font-black text-amber-400 flex items-center gap-1 bg-amber-500/20 px-2 py-0.5 rounded-lg border border-amber-500/30">
                          <Flame className="h-3.5 w-3.5 fill-amber-400" />
                          {alert.currentStreak} dias em perigo
                        </span>
                      </div>
                      <div className="text-xs font-semibold text-slate-400 truncate max-w-[280px] mt-0.5">
                        Último commit: &quot;{alert.lastCommitMessage}&quot;
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-end sm:self-auto">
                    <div className="text-right text-xs font-bold text-rose-400 flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{alert.hoursRemaining}h restantes</span>
                    </div>

                    <button
                      onClick={() => onCommitSimulated(alert.username)}
                      className="btn-duo-green rounded-xl px-4 py-2 text-xs font-black uppercase whitespace-nowrap"
                    >
                      Salvar Streak
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Interactive Commit Simulator */}
          <div className="mt-6 rounded-2xl border-2 border-slate-800 bg-[#162234] p-5">
            <h3 className="font-extrabold text-sm text-white mb-3 flex items-center gap-2">
              <Zap className="h-4 w-4 text-amber-400 fill-amber-400" />
              <span>Simulador de Commit Diário (Testar salvamento imediato)</span>
            </h3>

            <div className="flex flex-col sm:flex-row gap-2.5">
              <select
                value={selectedUser}
                onChange={(e) => setSelectedUser(e.target.value)}
                className="rounded-xl border-2 border-slate-700 bg-slate-900 px-3.5 py-2 text-xs font-bold text-white focus:outline-none"
              >
                {devs.map((d) => (
                  <option key={d.username} value={d.username}>
                    @{d.username} ({d.currentStreak} dias · {d.hasCommittedToday ? 'Salvo' : 'Pendente'})
                  </option>
                ))}
              </select>

              <input
                type="text"
                value={simulatedCommitMsg}
                onChange={(e) => setSimulatedCommitMsg(e.target.value)}
                placeholder="Mensagem do commit..."
                className="flex-1 rounded-xl border-2 border-slate-700 bg-slate-900 px-3.5 py-2 text-xs font-bold text-white placeholder-slate-500 focus:outline-none"
              />

              <button
                onClick={handleSimulateCommit}
                className="btn-duo-orange rounded-xl px-5 py-2 text-xs font-black uppercase whitespace-nowrap shrink-0"
              >
                Enviar Commit
              </button>
            </div>
          </div>
        </section>

        {/* Tiers de Reputação do Duolingo */}
        <section className="card-duo p-6">
          <div className="text-amber-400 font-black text-sm mb-4">
            CONQUISTAS DE STREAK
          </div>

          <div className="space-y-3 text-xs font-bold">
            <div className="rounded-2xl border-2 border-slate-800 bg-[#162234] p-4">
              <div className="flex items-center justify-between text-white font-extrabold mb-1">
                <span className="flex items-center gap-1.5">
                  <span className="text-base">🔥</span> Fagulha Iniciante
                </span>
                <span className="text-slate-400">1 - 3 dias</span>
              </div>
              <p className="text-[11px] font-semibold text-slate-400">
                Iniciando o hábito de commit. +45 CP por dia.
              </p>
            </div>

            <div className="rounded-2xl border-2 border-amber-500/40 bg-amber-500/10 p-4">
              <div className="flex items-center justify-between text-amber-300 font-extrabold mb-1">
                <span className="flex items-center gap-1.5">
                  <span className="text-base">⚡</span> Combo em Chamas
                </span>
                <span className="text-amber-400">4 - 7 dias</span>
              </div>
              <p className="text-[11px] font-semibold text-slate-300">
                Uma semana sem pausas. Multiplicador de +10% em PRs.
              </p>
            </div>

            <div className="rounded-2xl border-2 border-sky-500/40 bg-sky-500/10 p-4">
              <div className="flex items-center justify-between text-sky-300 font-extrabold mb-1">
                <span className="flex items-center gap-1.5">
                  <span className="text-base">🚀</span> Tempestade de Código
                </span>
                <span className="text-sky-400">8 - 30 dias</span>
              </div>
              <p className="text-[11px] font-semibold text-slate-300">
                Ritmo impecável. Desbloqueia medalha de destaque no radar.
              </p>
            </div>

            <div className="rounded-2xl border-2 border-emerald-500/40 bg-emerald-500/10 p-4">
              <div className="flex items-center justify-between text-[#58cc02] font-extrabold mb-1">
                <span className="flex items-center gap-1.5">
                  <span className="text-base">👑</span> Lenda Imortal
                </span>
                <span className="text-[#58cc02]">30+ dias</span>
              </div>
              <p className="text-[11px] font-semibold text-slate-300">
                Imunidade ao primeiro dia de inatividade com Escudo Protetor.
              </p>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
};
