import React, { useState } from 'react';
import { Swords, Trophy, Clock, Trash2, ChevronDown, ChevronUp, RotateCcw, ShieldAlert, Award } from 'lucide-react';
import { DuelHistoryItem } from '../types';
import { getHeadToHead, getDuelHistory, clearDuelHistory, HeadToHeadStats } from '../services/rivalryService';
import { audio16bit } from '../utils/audio16bit';

interface RivalryHistoryProps {
  userA: string;
  nameA: string;
  avatarA: string;
  userB: string;
  nameB: string;
  avatarB: string;
  type: 'dev' | 'repo';
  onReplayMatch?: (userA: string, userB: string) => void;
}

export const RivalryHistory: React.FC<RivalryHistoryProps> = ({
  userA,
  nameA,
  avatarA,
  userB,
  nameB,
  avatarB,
  type,
  onReplayMatch
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [historyVersion, setHistoryVersion] = useState(0);

  const stats: HeadToHeadStats = getHeadToHead(userA, userB, type);
  const allHistory: DuelHistoryItem[] = getDuelHistory().filter((h) => h.type === type);

  const totalMatches = stats.total;
  const pctA = totalMatches > 0 ? Math.round((stats.winsA / totalMatches) * 100) : 50;
  const pctB = totalMatches > 0 ? Math.round((stats.winsB / totalMatches) * 100) : 50;

  const handleClear = () => {
    audio16bit.playWarning();
    clearDuelHistory();
    setHistoryVersion((v) => v + 1);
  };

  return (
    <div className="rounded-2xl bg-[#0b101d] border border-slate-800/80 p-4 shadow-sm transition-all hover:border-slate-700/80">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Placar Direto Head-to-Head */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/10 border border-amber-500/25 text-amber-400">
            <Swords className="h-5 w-5" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                Rivalidade Direta
              </span>
              <span className="text-xs text-slate-400 font-semibold">
                {totalMatches === 0
                  ? 'Primeiro confronto registrado!'
                  : `${totalMatches} ${totalMatches === 1 ? 'confronto disputado' : 'confrontos disputados'}`}
              </span>
            </div>

            <div className="text-sm font-black text-white mt-0.5 flex items-center gap-2">
              <span className="text-emerald-400">{stats.winsA} {stats.winsA === 1 ? 'Vitória' : 'Vitórias'}</span>
              <span className="text-slate-600">·</span>
              <span className="text-slate-400">{stats.draws} {stats.draws === 1 ? 'Empate' : 'Empates'}</span>
              <span className="text-slate-600">·</span>
              <span className="text-sky-400">{stats.winsB} {stats.winsB === 1 ? 'Vitória' : 'Vitórias'}</span>
            </div>
          </div>
        </div>

        {/* Botão de abrir histórico detalhado */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              audio16bit.playTap();
              setIsOpen(!isOpen);
            }}
            className="btn-secondary rounded-xl px-3.5 py-1.5 text-xs font-bold flex items-center gap-1.5"
          >
            <Clock className="h-3.5 w-3.5 text-slate-400" />
            <span>{isOpen ? 'Ocultar Histórico' : `Histórico (${allHistory.length})`}</span>
            {isOpen ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
          </button>
        </div>
      </div>

      {/* Barra de Proporção de Forças no Histórico */}
      {totalMatches > 0 && (
        <div className="mt-3 pt-3 border-t border-slate-800/60">
          <div className="flex justify-between items-center text-[11px] font-bold text-slate-400 mb-1.5">
            <span className="flex items-center gap-1">
              <span className="text-emerald-400">@{userA}</span> ({pctA}%)
            </span>
            <span className="text-slate-500">Retrospecto Head-to-Head</span>
            <span className="flex items-center gap-1">
              <span className="text-sky-400">@{userB}</span> ({pctB}%)
            </span>
          </div>

          <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden flex">
            <div
              className="h-full bg-emerald-500 transition-all duration-500"
              style={{ width: `${pctA}%` }}
              title={`Vitórias de @${userA}: ${stats.winsA}`}
            />
            {stats.draws > 0 && (
              <div
                className="h-full bg-slate-600 transition-all duration-500"
                style={{ width: `${Math.round((stats.draws / totalMatches) * 100)}%` }}
                title={`Empates: ${stats.draws}`}
              />
            )}
            <div
              className="h-full bg-sky-500 transition-all duration-500"
              style={{ width: `${pctB}%` }}
              title={`Vitórias de @${userB}: ${stats.winsB}`}
            />
          </div>
        </div>
      )}

      {/* Painel Expandido com Lista de Confrontos Recentes */}
      {isOpen && (
        <div className="mt-4 pt-4 border-t border-slate-800/80 animate-in fade-in duration-200">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <Trophy className="h-3.5 w-3.5 text-amber-400" />
              <span>Confrontos Recentes ({type === 'dev' ? 'Desenvolvedores' : 'Repositórios'})</span>
            </h4>

            {allHistory.length > 0 && (
              <button
                onClick={handleClear}
                className="text-[11px] font-bold text-slate-500 hover:text-rose-400 transition-colors flex items-center gap-1"
                title="Limpar todos os registros locais de duelos"
              >
                <Trash2 className="h-3 w-3" />
                <span>Limpar Histórico</span>
              </button>
            )}
          </div>

          {allHistory.length === 0 ? (
            <div className="text-center py-6 text-xs text-slate-500 italic bg-slate-900/40 rounded-xl border border-slate-800/40">
              Nenhum duelo foi registrado ainda nesta sessão. Execute uma comparação para salvar os registros!
            </div>
          ) : (
            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {allHistory.slice(0, 8).map((duel) => {
                const date = new Date(duel.timestamp);
                const timeStr = date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
                const dateStr = date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });

                const isCurrentPair =
                  (duel.fighterA.username.toLowerCase() === userA.toLowerCase() &&
                    duel.fighterB.username.toLowerCase() === userB.toLowerCase()) ||
                  (duel.fighterA.username.toLowerCase() === userB.toLowerCase() &&
                    duel.fighterB.username.toLowerCase() === userA.toLowerCase());

                const winningFighter = duel.winner === 'A' ? duel.fighterA : duel.winner === 'B' ? duel.fighterB : null;

                return (
                  <div
                    key={duel.id}
                    className={`flex items-center justify-between p-2.5 rounded-xl border text-xs transition-colors ${
                      isCurrentPair
                        ? 'bg-amber-500/10 border-amber-500/30'
                        : 'bg-slate-900/60 border-slate-800/80 hover:bg-slate-850'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-[10px] text-slate-500 font-mono">{dateStr} {timeStr}</span>

                      <div className="flex items-center gap-1.5">
                        <img
                          src={duel.fighterA.avatarUrl}
                          alt={duel.fighterA.name}
                          className="h-5 w-5 rounded-md object-cover"
                        />
                        <span className={`font-bold ${duel.winner === 'A' ? 'text-emerald-400' : 'text-slate-300'}`}>
                          @{duel.fighterA.username}
                        </span>

                        <span className="text-slate-600 font-black text-[10px]">vs</span>

                        <img
                          src={duel.fighterB.avatarUrl}
                          alt={duel.fighterB.name}
                          className="h-5 w-5 rounded-md object-cover"
                        />
                        <span className={`font-bold ${duel.winner === 'B' ? 'text-sky-400' : 'text-slate-300'}`}>
                          @{duel.fighterB.username}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-[11px] font-bold text-slate-400">
                        {duel.winner === 'DRAW' ? (
                          <span className="text-slate-400">Empate</span>
                        ) : (
                          <span className="text-emerald-400">
                            Vencedor: <strong>@{winningFighter?.username}</strong> (+{duel.scoreMargin.toLocaleString('pt-BR')} CP)
                          </span>
                        )}
                      </span>

                      {onReplayMatch && (
                        <button
                          onClick={() => {
                            audio16bit.playTap();
                            onReplayMatch(duel.fighterA.username, duel.fighterB.username);
                          }}
                          className="p-1 rounded-lg text-slate-500 hover:text-white hover:bg-slate-800 transition-colors"
                          title="Revanche: Recarregar este duelo"
                        >
                          <RotateCcw className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
