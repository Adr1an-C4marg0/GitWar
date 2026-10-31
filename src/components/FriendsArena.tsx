import React, { useState } from 'react';
import { 
  Users, 
  Flame, 
  Swords, 
  AlertTriangle, 
  Search, 
  UserCheck, 
  Bell, 
  Check, 
  Shield,
  Send,
  Sparkles,
  Trophy,
  ArrowRight,
  Star,
  ExternalLink
} from 'lucide-react';
import { FriendFighter, DevFighter } from '../types';
import { audio16bit } from '../utils/audio16bit';
import { SquadGoalCard } from './SquadGoalCard';

interface FriendsArenaProps {
  connectedUser: DevFighter | null;
  friends: FriendFighter[];
  isLoadingFriends: boolean;
  onOpenConnectModal: () => void;
  onChallengeFriend: (friend: FriendFighter) => void;
}

export const FriendsArena: React.FC<FriendsArenaProps> = ({
  connectedUser,
  friends,
  isLoadingFriends,
  onOpenConnectModal,
  onChallengeFriend
}) => {
  const [filterType, setFilterType] = useState<'all' | 'mutual' | 'risk'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [nudgedFriends, setNudgedFriends] = useState<Set<string>>(new Set());

  if (!connectedUser) {
    return (
      <div className="clean-card p-8 sm:p-12 text-center max-w-xl mx-auto space-y-4">
        <div className="flex h-16 w-16 mx-auto items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          <Users className="h-8 w-8" />
        </div>
        <h2 className="text-xl font-black text-white">Conecte sua conta para ver seus amigos</h2>
        <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
          Ao vincular seu GitHub, o GitClash sincroniza automaticamente as pessoas que você segue e seus seguidores mútuos, permitindo duelos diretos e monitoramento de strikes.
        </p>
        <button
          onClick={onOpenConnectModal}
          className="btn-primary rounded-xl px-6 py-2.5 text-xs font-black uppercase inline-flex items-center gap-2 shadow-lg"
        >
          <UserCheck className="h-4 w-4" />
          <span>Conectar Meu GitHub</span>
        </button>
      </div>
    );
  }

  // Filtragem
  const mutualCount = friends.filter((f) => f.isMutual).length;
  const riskCount = friends.filter((f) => !f.hasCommittedToday && f.currentStreak > 0).length;

  const filteredFriends = friends.filter((f) => {
    const matchesSearch = f.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.name.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;
    if (filterType === 'mutual') return f.isMutual;
    if (filterType === 'risk') return !f.hasCommittedToday && f.currentStreak > 0;
    return true;
  });

  const handleNudgeFriend = (friendUsername: string) => {
    audio16bit.playSuccess();
    setNudgedFriends((prev) => new Set(prev).add(friendUsername));
  };

  return (
    <div className="space-y-6">
      {/* 🎯 Meta Coletiva de Commits do Esquadrão */}
      <SquadGoalCard connectedUser={connectedUser} friends={friends} />

      {/* Header com Resumo dos Amigos */}
      <section className="clean-card p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-800/80">
          <div className="flex items-center gap-3.5">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <Users className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black text-white">Amigos do GitHub</h2>
                <span className="text-xs font-bold text-slate-400">@{connectedUser.username}</span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Acompanhe os strikes dos seus amigos, envie lembretes de commits e dispute no Versus.
              </p>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center gap-3 text-xs font-bold shrink-0">
            <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-center">
              <span className="text-slate-400 block text-[10px] uppercase">Total Amigos</span>
              <span className="text-white text-sm font-extrabold">{friends.length}</span>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-center">
              <span className="text-emerald-400 block text-[10px] uppercase">Mútuos 🤝</span>
              <span className="text-emerald-400 text-sm font-extrabold">{mutualCount}</span>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-center">
              <span className="text-amber-400 block text-[10px] uppercase">Em Risco 🔥</span>
              <span className="text-amber-400 text-sm font-extrabold">{riskCount}</span>
            </div>
          </div>
        </div>

        {/* Filter Controls (com a distinção solicitada pelo usuário) */}
        <div className="mt-5 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          
          {/* Segmented Filter */}
          <div className="flex items-center gap-1 rounded-xl bg-slate-900 p-1 border border-slate-800 shrink-0">
            <button
              onClick={() => {
                audio16bit.playTap();
                setFilterType('all');
              }}
              className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
                filterType === 'all'
                  ? 'bg-slate-800 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Todos ({friends.length})
            </button>

            <button
              onClick={() => {
                audio16bit.playTap();
                setFilterType('mutual');
              }}
              className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all flex items-center gap-1 ${
                filterType === 'mutual'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>🤝 Seguidores Mútuos</span>
              <span className="text-[10px] opacity-80">({mutualCount})</span>
            </button>

            <button
              onClick={() => {
                audio16bit.playTap();
                setFilterType('risk');
              }}
              className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all flex items-center gap-1 ${
                filterType === 'risk'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>🔥 Strike em Risco</span>
              <span className="text-[10px] opacity-80">({riskCount})</span>
            </button>
          </div>

          {/* Search inside friends */}
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3.5 top-2.5 h-3.5 w-3.5 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar amigo por nome ou @"
              className="w-full rounded-xl border border-slate-800 bg-[#090d16] py-1.5 pl-9 pr-3 text-xs font-semibold text-slate-200 placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
            />
          </div>

        </div>
      </section>

      {/* Friends Cards Grid */}
      {isLoadingFriends ? (
        <div className="clean-card p-12 text-center text-xs font-bold text-slate-400">
          Sincronizando amigos do GitHub...
        </div>
      ) : filteredFriends.length === 0 ? (
        <div className="clean-card p-8 text-center text-xs font-bold text-slate-500">
          Nenhum amigo encontrado neste filtro.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredFriends.map((friend) => {
            const hasNudge = nudgedFriends.has(friend.username);
            const isStrikeAtRisk = !friend.hasCommittedToday && friend.currentStreak > 0;

            return (
              <div
                key={friend.username}
                onClick={() => {
                  audio16bit.playTap();
                  onChallengeFriend(friend);
                }}
                className="clean-card p-5 flex flex-col justify-between hover:border-emerald-500/50 hover:bg-slate-900/50 transition-all cursor-pointer group"
                title={`Clique para comparar @${friend.username} no Versus`}
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={friend.avatarUrl}
                        alt={friend.name}
                        className="h-14 w-14 rounded-2xl object-cover ring-2 ring-slate-800 group-hover:ring-emerald-500/50 shadow-sm transition-all"
                        referrerPolicy="no-referrer"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-extrabold text-sm text-white group-hover:text-emerald-400 transition-colors">
                            {friend.name}
                          </h3>
                        </div>
                        <div className="text-xs text-slate-400 font-semibold flex items-center gap-1.5">
                          <span>@{friend.username}</span>
                          <a
                            href={`https://github.com/${friend.username}`}
                            target="_blank"
                            rel="noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            title={`Ver @${friend.username} no GitHub`}
                            className="text-slate-500 hover:text-emerald-400 transition-colors p-0.5 rounded hover:bg-slate-800"
                          >
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        </div>
                        
                        {/* Mutual or Following tag */}
                        <div className="mt-1 flex items-center gap-1.5">
                          {friend.isMutual ? (
                            <span className="rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 px-2 py-0.5 text-[10px] font-bold">
                              🤝 Mútuo
                            </span>
                          ) : (
                            <span className="rounded-full bg-slate-800 text-slate-400 px-2 py-0.5 text-[10px] font-bold">
                              👤 Seguindo
                            </span>
                          )}
                          <span className="text-[10px] text-slate-500">{friend.division} · Lvl {friend.level}</span>
                        </div>
                      </div>
                    </div>

                    {/* CP & Stars */}
                    <div className="text-right flex flex-col items-end">
                      <span className="text-[10px] uppercase font-bold text-slate-500">Poder (CP)</span>
                      <div className="text-base font-black text-emerald-400 tabular-nums">
                        {friend.combatPower.toLocaleString('pt-BR')}
                      </div>
                      <div className="flex items-center gap-1 text-[11px] font-bold text-amber-400 mt-1">
                        <Star className="h-3 w-3 fill-amber-400" />
                        <span>{(friend.totalStars || 0).toLocaleString('pt-BR')}</span>
                      </div>
                    </div>
                  </div>

                  <p className="mt-3 text-xs text-slate-400 line-clamp-1 leading-relaxed">
                    {friend.bio}
                  </p>
                </div>

                {/* Bottom Row: Strike status & Actions */}
                <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2 text-xs">
                  {/* Strike status */}
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 font-extrabold text-amber-400">
                      <Flame className="h-4 w-4 fill-amber-400" />
                      <span>{friend.currentStreak}d</span>
                    </div>

                    {friend.currentStreak === 0 ? (
                      <span className="text-[10px] font-bold text-slate-500 bg-slate-800/80 px-2 py-0.5 rounded-lg">
                        Sem strike ativo
                      </span>
                    ) : isStrikeAtRisk ? (
                      <span className="text-[10px] font-bold text-rose-400 bg-rose-500/10 border border-rose-500/20 px-2 py-0.5 rounded-lg flex items-center gap-1">
                        <AlertTriangle className="h-3 w-3" />
                        <span>Não comitou hoje</span>
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-lg">
                        Commit ativo
                      </span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    {/* Cutucar / Salvar Strike de Amigo */}
                    {isStrikeAtRisk && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleNudgeFriend(friend.username);
                        }}
                        disabled={hasNudge}
                        title="Enviar lembrete para seu amigo não perder o strike"
                        className={`rounded-lg px-2.5 py-1 text-[11px] font-bold flex items-center gap-1 transition-colors ${
                          hasNudge
                            ? 'bg-slate-800 text-slate-400'
                            : 'bg-amber-500/20 border border-amber-500/40 text-amber-300 hover:bg-amber-500/30'
                        }`}
                      >
                        {hasNudge ? (
                          <>
                            <Check className="h-3 w-3 text-emerald-400" />
                            <span>Avisado!</span>
                          </>
                        ) : (
                          <>
                            <Bell className="h-3 w-3" />
                            <span>Avisar Strike</span>
                          </>
                        )}
                      </button>
                    )}

                    {/* Desafiar no Versus */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        audio16bit.playTap();
                        onChallengeFriend(friend);
                      }}
                      className="btn-primary rounded-lg px-3 py-1 text-[11px] font-black uppercase flex items-center gap-1 shadow-sm"
                    >
                      <Swords className="h-3 w-3" />
                      <span>Versus</span>
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
