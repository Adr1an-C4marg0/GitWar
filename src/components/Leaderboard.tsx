import React, { useState } from 'react';
import { Trophy, Flame, AlertTriangle, Search, Users, Star, ExternalLink } from 'lucide-react';
import { DevFighter, StrikeAlert, FriendFighter } from '../types';
import { audio16bit } from '../utils/audio16bit';

interface LeaderboardProps {
  devs: DevFighter[];
  strikeAlerts: StrikeAlert[];
  onChallengeDev: (targetDev: DevFighter) => void;
  connectedUser?: DevFighter | null;
  friends?: FriendFighter[];
  repos?: any[];
  onChallengeRepo?: (repo: any) => void;
}

export const Leaderboard: React.FC<LeaderboardProps> = ({
  devs,
  strikeAlerts,
  onChallengeDev,
  connectedUser,
  friends = []
}) => {
  const [scope, setScope] = useState<'global' | 'friends'>('global');
  const [searchQuery, setSearchQuery] = useState('');

  // Se o escopo for amigos, montar a lista de amigos + o usuário conectado
  const devSource = scope === 'friends' && connectedUser
    ? [connectedUser, ...friends.filter(f => f.username.toLowerCase() !== connectedUser.username.toLowerCase())]
    : devs;

  const sortedDevs = [...devSource].sort((a, b) => b.combatPower - a.combatPower);

  const filteredDevs = sortedDevs.filter((d) =>
    d.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const alertMap = new Map<string, StrikeAlert>();
  strikeAlerts.forEach((a) => alertMap.set(a.username.toLowerCase(), a));

  return (
    <div className="space-y-6">
      {/* Header & Filter Controls */}
      <div className="clean-card p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Trophy className="h-5 w-5 text-amber-400" />
            <span>Ranking & Ligas do GitHub</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Classificação geral por consistência de código, volume de commits, estrelas em repositórios e tração open-source.
          </p>
        </div>

        {connectedUser && (
          <div className="flex items-center gap-1 rounded-xl bg-slate-900/90 p-1 border border-slate-800 shrink-0">
            <button
              onClick={() => {
                audio16bit.playTap();
                setScope('global');
              }}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                scope === 'global' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              Global
            </button>
            <button
              onClick={() => {
                audio16bit.playTap();
                setScope('friends');
              }}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all flex items-center gap-1 ${
                scope === 'friends' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Users className="h-3 w-3" />
              <span>Amigos ({friends.length})</span>
            </button>
          </div>
        )}
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-500" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Buscar desenvolvedor por nome ou usuário..."
          className="w-full rounded-xl border border-slate-800 bg-[#090d16] py-2 pl-9 pr-4 text-xs font-semibold text-slate-200 placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
        />
      </div>

      {/* Clean Table */}
      <div className="clean-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-800/80 bg-slate-900/40 text-[11px] font-bold text-slate-400">
              <tr>
                <th className="py-3 px-4 w-12 text-center">#</th>
                <th className="py-3 px-4">DESENVOLVEDOR</th>
                <th className="py-3 px-4">STRIKE</th>
                <th className="py-3 px-4 text-right">COMMITS & STARS</th>
                <th className="py-3 px-4 text-right">COMBAT POWER</th>
                <th className="py-3 px-4 text-center w-24">AÇÃO</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-semibold">
              {filteredDevs.map((dev, index) => {
                  const alert = alertMap.get(dev.username.toLowerCase());
                  const isMe = connectedUser && dev.username.toLowerCase() === connectedUser.username.toLowerCase();
                  return (
                    <tr
                      key={dev.username}
                      className={`transition-colors ${
                        isMe
                          ? 'bg-emerald-500/10 hover:bg-emerald-500/15 border-l-2 border-emerald-400'
                          : 'hover:bg-slate-850/40'
                      }`}
                    >
                      {/* Rank Position */}
                      <td className="py-3.5 px-4 text-center">
                        {index === 0 ? (
                          <span className="font-extrabold text-amber-400">1</span>
                        ) : index === 1 ? (
                          <span className="font-extrabold text-slate-300">2</span>
                        ) : index === 2 ? (
                          <span className="font-extrabold text-amber-600">3</span>
                        ) : (
                          <span className="text-slate-500">{index + 1}</span>
                        )}
                      </td>

                      {/* Developer Info */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={dev.avatarUrl}
                            alt={dev.name}
                            className={`h-8 w-8 rounded-xl object-cover ring-1 ${isMe ? 'ring-emerald-400' : 'ring-slate-800'}`}
                            referrerPolicy="no-referrer"
                          />
                          <div>
                            <div className="font-bold text-white flex items-center gap-1.5">
                              <span>{dev.name}</span>
                              {isMe && (
                                <span className="rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.2 text-[10px] font-bold">
                                  Você
                                </span>
                              )}
                              <div className="flex items-center gap-1">
                                <span className="text-[11px] text-slate-500 font-normal">@{dev.username}</span>
                                <a
                                  href={`https://github.com/${dev.username}`}
                                  target="_blank"
                                  rel="noreferrer"
                                  onClick={(e) => e.stopPropagation()}
                                  title={`Ver @${dev.username} no GitHub`}
                                  className="text-slate-600 hover:text-emerald-400 transition-colors p-0.5 rounded"
                                >
                                  <ExternalLink className="h-3 w-3" />
                                </a>
                              </div>
                            </div>
                            <div className="text-[11px] text-slate-400">
                              {dev.division} · Lvl {dev.level}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Strike */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1 text-amber-400 font-bold">
                            <Flame className="h-3.5 w-3.5 fill-amber-400" />
                            <span>{dev.currentStreak}d</span>
                          </div>

                          {alert && (
                            <span
                              title={`Restam ${alert.hoursRemaining}h para commitar hoje e manter o Strike!`}
                              className="flex items-center gap-1 text-[10px] text-rose-400 bg-rose-500/10 px-1.5 py-0.5 rounded font-bold"
                            >
                              <AlertTriangle className="h-3 w-3" />
                              <span>{alert.hoursRemaining}h</span>
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Commits & Stars */}
                      <td className="py-3.5 px-4 text-right tabular-nums text-slate-300">
                        <div className="font-bold text-white">{dev.totalCommitsYear.toLocaleString('pt-BR')} commits</div>
                        <div className="text-[11px] text-amber-400 font-semibold flex items-center justify-end gap-1 mt-0.5">
                          <Star className="h-3 w-3 fill-amber-400" />
                          <span>{(dev.totalStars || 0).toLocaleString('pt-BR')} estrelas</span>
                        </div>
                      </td>

                      {/* CP */}
                      <td className="py-3.5 px-4 text-right tabular-nums font-bold text-emerald-400">
                        {dev.combatPower.toLocaleString('pt-BR')} CP
                      </td>

                      {/* Action */}
                      <td className="py-3.5 px-4 text-center">
                        <button
                          onClick={() => {
                            audio16bit.playTap();
                            onChallengeDev(dev);
                          }}
                          className="btn-secondary rounded-lg px-2.5 py-1 text-[11px] font-bold"
                        >
                          Versus
                        </button>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
