import React, { useState, useEffect } from 'react';
import { 
  Swords, 
  Flame, 
  GitCommit, 
  Users, 
  Trophy, 
  Share2, 
  Check, 
  TrendingUp,
  AlertCircle,
  GitPullRequest,
  BookOpen,
  CheckCircle,
  Award,
  Zap,
  ArrowRight,
  Sparkles,
  Star,
  ExternalLink,
  FolderGit2
} from 'lucide-react';
import { DevFighter, BattleResult, BattleMetric, FriendFighter, RepoFighter } from '../types';
import { audio16bit } from '../utils/audio16bit';
import { RepoClashArena } from './RepoClashArena';
import { RivalryHistory } from './RivalryHistory';
import { recordDuel } from '../services/rivalryService';

interface BattleArenaProps {
  fighterA: DevFighter;
  fighterB: DevFighter;
  onSearchUser: (usernameA: string, usernameB: string) => void;
  isLoading: boolean;
  errorMessage?: string | null;
  onSelectPresets: (userA: string, userB: string) => void;
  connectedUser?: DevFighter | null;
  onUseMyAccount?: () => void;
  friends?: FriendFighter[];
  repoA?: RepoFighter;
  repoB?: RepoFighter;
  onSearchRepo?: (repoA: string, repoB: string) => void;
  isLoadingRepos?: boolean;
  repoErrorMessage?: string | null;
  onSelectRepoPresets?: (repoA: string, repoB: string) => void;
}

export const BattleArena: React.FC<BattleArenaProps> = ({
  fighterA,
  fighterB,
  onSearchUser,
  isLoading,
  errorMessage,
  onSelectPresets,
  connectedUser,
  onUseMyAccount,
  friends = [],
  repoA,
  repoB,
  onSearchRepo,
  isLoadingRepos = false,
  repoErrorMessage,
  onSelectRepoPresets
}) => {
  const [combatSubMode, setCombatSubMode] = useState<'devs' | 'repos'>('devs');
  const [inputA, setInputA] = useState(fighterA.username);
  const [inputB, setInputB] = useState(fighterB.username);
  const [copiedLink, setCopiedLink] = useState(false);
  const [simulatedCommits, setSimulatedCommits] = useState(0);

  useEffect(() => {
    setInputA(fighterA.username);
    setInputB(fighterB.username);
    setSimulatedCommits(0);

    if (fighterA?.username && fighterB?.username && fighterA.combatPower > 0 && fighterB.combatPower > 0) {
      const margin = Math.abs(fighterA.combatPower - fighterB.combatPower);
      const winner = fighterA.combatPower > fighterB.combatPower ? 'A' : fighterB.combatPower > fighterA.combatPower ? 'B' : 'DRAW';
      recordDuel(
        'dev',
        {
          username: fighterA.username,
          name: fighterA.name,
          avatarUrl: fighterA.avatarUrl,
          combatPower: fighterA.combatPower
        },
        {
          username: fighterB.username,
          name: fighterB.name,
          avatarUrl: fighterB.avatarUrl,
          combatPower: fighterB.combatPower
        },
        winner,
        margin
      );
    }
  }, [fighterA.username, fighterB.username, fighterA.combatPower, fighterB.combatPower]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanA = inputA.trim().replace(/^@/, '');
    const cleanB = inputB.trim().replace(/^@/, '');
    if (!cleanA || !cleanB) return;
    audio16bit.playTap();
    onSearchUser(cleanA, cleanB);
  };

  // Comparação métrica por métrica precisa e proporcional
  const prsIssuesA = (fighterA.pullRequestsCount || 0) + (fighterA.issuesClosed || 0);
  const prsIssuesB = (fighterB.pullRequestsCount || 0) + (fighterB.issuesClosed || 0);
  const starsA = fighterA.totalStars || 0;
  const starsB = fighterB.totalStars || 0;

  const comparisonItems = [
    {
      label: 'Pontuação Combat Power (CP)',
      valA: fighterA.combatPower.toLocaleString('pt-BR'),
      valB: fighterB.combatPower.toLocaleString('pt-BR'),
      numA: fighterA.combatPower,
      numB: fighterB.combatPower,
      winner: fighterA.combatPower > fighterB.combatPower ? 'A' : fighterA.combatPower < fighterB.combatPower ? 'B' : 'TIE',
      diff: Math.abs(fighterA.combatPower - fighterB.combatPower),
      diffFormatted: Math.abs(fighterA.combatPower - fighterB.combatPower).toLocaleString('pt-BR'),
      icon: Award
    },
    {
      label: 'Estrelas em Repositórios (Stars ⭐)',
      valA: starsA.toLocaleString('pt-BR'),
      valB: starsB.toLocaleString('pt-BR'),
      numA: starsA,
      numB: starsB,
      winner: starsA > starsB ? 'A' : starsA < starsB ? 'B' : 'TIE',
      diff: Math.abs(starsA - starsB),
      diffFormatted: Math.abs(starsA - starsB).toLocaleString('pt-BR'),
      icon: Star
    },
    {
      label: 'Strike Atual (Dias Consecutivos)',
      valA: `${fighterA.currentStreak} dias`,
      valB: `${fighterB.currentStreak} dias`,
      numA: fighterA.currentStreak,
      numB: fighterB.currentStreak,
      winner: fighterA.currentStreak > fighterB.currentStreak ? 'A' : fighterA.currentStreak < fighterB.currentStreak ? 'B' : 'TIE',
      diff: Math.abs(fighterA.currentStreak - fighterB.currentStreak),
      diffFormatted: `${Math.abs(fighterA.currentStreak - fighterB.currentStreak)} dias`,
      icon: Flame
    },
    {
      label: 'Commits Anuais Registrados',
      valA: fighterA.totalCommitsYear.toLocaleString('pt-BR'),
      valB: fighterB.totalCommitsYear.toLocaleString('pt-BR'),
      numA: fighterA.totalCommitsYear,
      numB: fighterB.totalCommitsYear,
      winner: fighterA.totalCommitsYear > fighterB.totalCommitsYear ? 'A' : fighterA.totalCommitsYear < fighterB.totalCommitsYear ? 'B' : 'TIE',
      diff: Math.abs(fighterA.totalCommitsYear - fighterB.totalCommitsYear),
      diffFormatted: Math.abs(fighterA.totalCommitsYear - fighterB.totalCommitsYear).toLocaleString('pt-BR'),
      icon: GitCommit
    },
    {
      label: 'Seguidores no GitHub',
      valA: fighterA.followers.toLocaleString('pt-BR'),
      valB: fighterB.followers.toLocaleString('pt-BR'),
      numA: fighterA.followers,
      numB: fighterB.followers,
      winner: fighterA.followers > fighterB.followers ? 'A' : fighterA.followers < fighterB.followers ? 'B' : 'TIE',
      diff: Math.abs(fighterA.followers - fighterB.followers),
      diffFormatted: Math.abs(fighterA.followers - fighterB.followers).toLocaleString('pt-BR'),
      icon: Users
    },
    {
      label: 'Pull Requests & Issues Resolvidas',
      valA: prsIssuesA.toLocaleString('pt-BR'),
      valB: prsIssuesB.toLocaleString('pt-BR'),
      numA: prsIssuesA,
      numB: prsIssuesB,
      winner: prsIssuesA > prsIssuesB ? 'A' : prsIssuesA < prsIssuesB ? 'B' : 'TIE',
      diff: Math.abs(prsIssuesA - prsIssuesB),
      diffFormatted: Math.abs(prsIssuesA - prsIssuesB).toLocaleString('pt-BR'),
      icon: GitPullRequest
    },
    {
      label: 'Repositórios Públicos',
      valA: fighterA.publicRepos.toLocaleString('pt-BR'),
      valB: fighterB.publicRepos.toLocaleString('pt-BR'),
      numA: fighterA.publicRepos,
      numB: fighterB.publicRepos,
      winner: fighterA.publicRepos > fighterB.publicRepos ? 'A' : fighterA.publicRepos < fighterB.publicRepos ? 'B' : 'TIE',
      diff: Math.abs(fighterA.publicRepos - fighterB.publicRepos),
      diffFormatted: Math.abs(fighterA.publicRepos - fighterB.publicRepos).toLocaleString('pt-BR'),
      icon: BookOpen
    }
  ];

  const winsA = comparisonItems.filter((i) => i.winner === 'A').length;
  const winsB = comparisonItems.filter((i) => i.winner === 'B').length;
  const overallWinner = winsA > winsB ? 'A' : winsB > winsA ? 'B' : 'DRAW';

  const handleShare = () => {
    audio16bit.playSuccess();
    const shareText = `Versus no GitClash: @${fighterA.username} (${fighterA.combatPower} CP) vs @${fighterB.username} (${fighterB.combatPower} CP). Veja quem tem as melhores estatísticas no GitHub: ${window.location.href}`;
    navigator.clipboard.writeText(shareText);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  // Cálculo de Ultrapassagem
  const leader = fighterA.combatPower >= fighterB.combatPower ? fighterA : fighterB;
  const underdog = fighterA.combatPower < fighterB.combatPower ? fighterA : fighterB;
  const cpDiff = leader.combatPower - underdog.combatPower;
  const commitsNeeded = Math.max(1, Math.ceil(cpDiff / 12));
  const streakDaysNeeded = Math.max(1, Math.ceil(cpDiff / 45));

  const simUnderdogCp = underdog.combatPower + (simulatedCommits * 12);
  const isOvertaken = (leader.combatPower - simUnderdogCp) <= 0;

  return (
    <div className="space-y-8">
      {/* Sub-opção de Combate: Desenvolvedores vs Repositórios */}
      <div className="flex items-center justify-center">
        <div className="inline-flex items-center rounded-2xl bg-slate-900/90 p-1.5 border border-slate-800 shadow-inner">
          <button
            onClick={() => {
              audio16bit.playTap();
              setCombatSubMode('devs');
            }}
            className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-black uppercase tracking-wider transition-all ${
              combatSubMode === 'devs'
                ? 'bg-emerald-500 text-slate-950 shadow-md font-black'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Users className="h-4 w-4" />
            <span>Duelo de Desenvolvedores</span>
          </button>

          <button
            onClick={() => {
              audio16bit.playTap();
              setCombatSubMode('repos');
            }}
            className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-black uppercase tracking-wider transition-all ${
              combatSubMode === 'repos'
                ? 'bg-sky-500 text-slate-950 shadow-md font-black'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <FolderGit2 className="h-4 w-4" />
            <span>Duelo de Repositórios</span>
          </button>
        </div>
      </div>

      {combatSubMode === 'repos' && repoA && repoB && onSearchRepo ? (
        <RepoClashArena
          repoA={repoA}
          repoB={repoB}
          onSearchRepo={onSearchRepo}
          isLoading={isLoadingRepos}
          errorMessage={repoErrorMessage}
          onSelectPresets={onSelectRepoPresets || (() => {})}
          connectedUser={connectedUser}
          friends={friends}
        />
      ) : (
        <>
          {/* 1. Clean Search Bar inspirada no Versus.com */}
          <section className="clean-card p-6 shadow-sm">
        <form onSubmit={handleSearchSubmit} className="flex flex-col md:flex-row items-center gap-4">
          <div className="flex-1 flex flex-col sm:flex-row items-center gap-3 w-full">
            <div className="relative flex-1 w-full">
              <span className="absolute left-4 top-3.5 text-sm font-bold text-slate-500">github.com/</span>
              <input
                type="text"
                value={inputA}
                onChange={(e) => setInputA(e.target.value)}
                placeholder="usuário 1 (ex: torvalds)"
                list="known-devs-list"
                autoComplete="off"
                className="w-full rounded-2xl border border-slate-800 bg-[#090d16] py-3 pl-28 pr-4 text-sm font-bold text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none transition-colors"
              />
            </div>

            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-800 border border-slate-700 text-xs font-black text-slate-300">
              VS
            </div>

            <div className="relative flex-1 w-full">
              <span className="absolute left-4 top-3.5 text-sm font-bold text-slate-500">github.com/</span>
              <input
                type="text"
                value={inputB}
                onChange={(e) => setInputB(e.target.value)}
                placeholder="usuário 2 (ex: antfu)"
                list="known-devs-list"
                autoComplete="off"
                className="w-full rounded-2xl border border-slate-800 bg-[#090d16] py-3 pl-28 pr-4 text-sm font-bold text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none transition-colors"
              />
            </div>
          </div>

          {/* Datalist com perfil conectado, amigos e devs para autocompletar na busca */}
          <datalist id="known-devs-list">
            {connectedUser && <option value={connectedUser.username}>{connectedUser.name} (Você)</option>}
            {friends.map((f) => (
              <option key={f.username} value={f.username}>
                {f.name} {f.isMutual ? '🤝 Mútuo' : '👤 Amigo'} · {f.combatPower.toLocaleString('pt-BR')} CP
              </option>
            ))}
            <option value="torvalds">Linus Torvalds</option>
            <option value="antfu">Anthony Fu</option>
            <option value="yyx990803">Evan You</option>
            <option value="gaearon">Dan Abramov</option>
            <option value="shadcn">shadcn</option>
            <option value="sindresorhus">Sindre Sorhus</option>
          </datalist>

          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary rounded-2xl px-8 py-3.5 text-sm font-black uppercase shrink-0 whitespace-nowrap w-full md:w-auto shadow-md"
          >
            {isLoading ? 'Comparando...' : 'Comparar no Versus'}
          </button>
        </form>

        {/* Recomendações de Amigos & Duelos Rápidos com Fotos dos Usuários */}
        <div className="mt-4 pt-3 border-t border-slate-800/60 space-y-2.5">
          {/* Linha 1: Amigos Recomendados com Foto de Perfil */}
          <div className="flex flex-wrap items-center justify-center gap-2 text-xs">
            {connectedUser && onUseMyAccount && (
              <button
                onClick={() => {
                  audio16bit.playTap();
                  onUseMyAccount();
                }}
                className="rounded-xl px-3 py-1.5 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-bold hover:bg-emerald-500/30 transition-all flex items-center gap-1.5 shadow-sm"
                title={`Lutar com seu perfil @${connectedUser.username}`}
              >
                {connectedUser.avatarUrl ? (
                  <img
                    src={connectedUser.avatarUrl}
                    alt={connectedUser.name}
                    className="h-4 w-4 rounded-full object-cover ring-1 ring-emerald-400"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <Sparkles className="h-3.5 w-3.5" />
                )}
                <span>Lutar com Meu Perfil (@{connectedUser.username})</span>
              </button>
            )}

            <div className="flex items-center gap-1.5 text-emerald-400 font-bold ml-1">
              <Users className="h-3.5 w-3.5" />
              <span>Amigos Recomendados:</span>
            </div>

            {(friends.length > 0 ? friends : [
              { username: 'antfu', name: 'Anthony Fu', avatarUrl: 'https://avatars.githubusercontent.com/u/11247099?v=4', isMutual: true },
              { username: 'yyx990803', name: 'Evan You', avatarUrl: 'https://avatars.githubusercontent.com/u/499550?v=4', isMutual: true },
              { username: 'torvalds', name: 'Linus Torvalds', avatarUrl: 'https://avatars.githubusercontent.com/u/1024025?v=4', isMutual: false },
              { username: 'gaearon', name: 'Dan Abramov', avatarUrl: 'https://avatars.githubusercontent.com/u/810438?v=4', isMutual: false },
              { username: 'shadcn', name: 'shadcn', avatarUrl: 'https://avatars.githubusercontent.com/u/124599?v=4', isMutual: true }
            ]).slice(0, 5).map((f) => (
              <button
                key={f.username}
                onClick={() => {
                  audio16bit.playTap();
                  onSelectPresets(connectedUser ? connectedUser.username : fighterA.username, f.username);
                }}
                className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-emerald-500/40 hover:bg-slate-850 px-2.5 py-1 text-xs text-slate-300 hover:text-emerald-300 transition-all group shadow-sm"
                title={`Duelo contra @${f.username}`}
              >
                <img
                  src={f.avatarUrl}
                  alt={f.name}
                  className="h-4 w-4 rounded-full object-cover ring-1 ring-slate-700 group-hover:ring-emerald-400"
                  referrerPolicy="no-referrer"
                />
                <span className="font-semibold">vs @{f.username}</span>
                {f.isMutual && <span className="text-[10px]" title="Seguidor mútuo">🤝</span>}
              </button>
            ))}
          </div>

          {/* Linha 2: Destaques de Desenvolvedores Famosos com Avatares */}
          <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-slate-400">
            <span className="font-semibold text-slate-500">Destaques:</span>
            <button
              onClick={() => {
                audio16bit.playTap();
                onSelectPresets('torvalds', 'antfu');
              }}
              className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 bg-slate-900/80 border border-slate-800/80 text-slate-300 hover:text-emerald-400 hover:border-emerald-500/40 transition-colors"
            >
              <img
                src="https://avatars.githubusercontent.com/u/1024025?v=4"
                alt="Linus"
                className="h-3.5 w-3.5 rounded-full object-cover ring-1 ring-slate-700"
                referrerPolicy="no-referrer"
              />
              <span>Linus vs Anthony Fu</span>
            </button>
            <button
              onClick={() => {
                audio16bit.playTap();
                onSelectPresets('gaearon', 'yyx990803');
              }}
              className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 bg-slate-900/80 border border-slate-800/80 text-slate-300 hover:text-emerald-400 hover:border-emerald-500/40 transition-colors"
            >
              <img
                src="https://avatars.githubusercontent.com/u/810438?v=4"
                alt="Dan"
                className="h-3.5 w-3.5 rounded-full object-cover ring-1 ring-slate-700"
                referrerPolicy="no-referrer"
              />
              <span>Dan Abramov vs Evan You</span>
            </button>
            <button
              onClick={() => {
                audio16bit.playTap();
                onSelectPresets('shadcn', 'sindresorhus');
              }}
              className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 bg-slate-900/80 border border-slate-800/80 text-slate-300 hover:text-emerald-400 hover:border-emerald-500/40 transition-colors"
            >
              <img
                src="https://avatars.githubusercontent.com/u/124599?v=4"
                alt="shadcn"
                className="h-3.5 w-3.5 rounded-full object-cover ring-1 ring-slate-700"
                referrerPolicy="no-referrer"
              />
              <span>shadcn vs Sindre Sorhus</span>
            </button>
          </div>
        </div>

        {errorMessage && (
          <div className="mt-3 flex items-center gap-2 rounded-xl bg-rose-500/10 border border-rose-500/20 p-3 text-xs font-bold text-rose-300">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}
      </section>

      {/* Histórico de Rivalidades Head-to-Head */}
      <RivalryHistory
        userA={fighterA.username}
        nameA={fighterA.name}
        avatarA={fighterA.avatarUrl}
        userB={fighterB.username}
        nameB={fighterB.name}
        avatarB={fighterB.avatarUrl}
        type="dev"
        onReplayMatch={(uA, uB) => onSearchUser(uA, uB)}
      />

      {/* 2. Grandes Cards no Formato Versus.com (Spacious & Clean) */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6 relative items-stretch">
        
        {/* Versus Badge Divider */}
        <div className="hidden md:flex absolute left-1/2 top-12 -translate-x-1/2 z-20 flex-col items-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500 text-slate-950 font-black text-sm shadow-[0_0_20px_rgba(34,197,94,0.35)] border-4 border-[#090d16]">
            VS
          </div>
        </div>

        {/* Card A: Grande e Completo com suas Estatísticas */}
        <div className={`clean-card p-8 flex flex-col justify-between transition-all ${overallWinner === 'A' ? 'ring-2 ring-emerald-500/40' : ''}`}>
          <div>
            {/* Header: Avatar, Name, Score */}
            <div className="flex items-start justify-between gap-5 pb-6 border-b border-slate-800/80">
              <div className="flex items-center gap-4">
                <img
                  src={fighterA.avatarUrl}
                  alt={fighterA.name}
                  className="h-20 w-20 rounded-3xl object-cover ring-2 ring-slate-700 shadow-md"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <h2 className="text-2xl font-black text-white flex items-center gap-2">
                    <span>{fighterA.name}</span>
                    {connectedUser && fighterA.username.toLowerCase() === connectedUser.username.toLowerCase() && (
                      <span className="rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 px-2 py-0.5 text-[10px] font-black uppercase">
                        Você
                      </span>
                    )}
                  </h2>
                  <div className="text-sm font-bold text-slate-400 flex items-center gap-1.5">
                    <span>@{fighterA.username}</span>
                    <a
                      href={`https://github.com/${fighterA.username}`}
                      target="_blank"
                      rel="noreferrer"
                      title={`Abrir perfil de @${fighterA.username} no GitHub`}
                      className="inline-flex items-center text-slate-500 hover:text-emerald-400 transition-colors p-0.5 rounded hover:bg-slate-800/60"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  </div>
                  <div className="mt-1 text-xs font-bold text-emerald-400">
                    {fighterA.division} · Lvl {fighterA.level}
                  </div>
                </div>
              </div>

              {/* Overall Score */}
              <div className="text-right">
                <span className="text-xs uppercase font-extrabold text-slate-500">Pontuação Total</span>
                <div className="text-3xl font-black text-emerald-400 tabular-nums">
                  {fighterA.combatPower.toLocaleString('pt-BR')}
                </div>
                <span className="text-[11px] font-bold text-slate-400">Combat Power</span>
              </div>
            </div>

            {/* Bio / Sobre */}
            <p className="mt-4 text-xs font-medium text-slate-300 leading-relaxed min-h-[36px]">
              {fighterA.bio}
            </p>

            {/* Vantagens / Pontos Fortes no Versus */}
            <div className="mt-5">
              <span className="text-[11px] uppercase font-black tracking-wider text-slate-400 mb-2.5 block">
                Vantagens de @{fighterA.username}:
              </span>
              <div className="space-y-2">
                {comparisonItems.filter((i) => i.winner === 'A').length === 0 ? (
                  <div className="text-xs text-slate-500 italic">Nenhuma métrica com liderança isolada neste duelo.</div>
                ) : (
                  comparisonItems.filter((i) => i.winner === 'A').map((item) => (
                    <div key={item.label} className="flex items-center gap-2 text-xs font-bold text-emerald-300 bg-emerald-500/10 rounded-xl px-3 py-2 border border-emerald-500/20">
                      <CheckCircle className="h-4 w-4 text-emerald-400 shrink-0" />
                      <span>{item.label}: <strong>{item.valA}</strong> (+{item.diffFormatted} de vantagem)</span>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Todas as Estatísticas Individuais de @fighterA (6 Tiles Sincronizados) */}
            <div className="mt-6 pt-5 border-t border-slate-800/80">
              <span className="text-[11px] uppercase font-black tracking-wider text-slate-400 mb-3 block">
                Estatísticas Detalhadas
              </span>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800/80">
                  <div className="text-slate-400 font-semibold flex items-center gap-1.5">
                    <Flame className="h-4 w-4 text-amber-500 fill-amber-500" />
                    <span>Strike</span>
                  </div>
                  <div className="text-lg font-black text-amber-400 mt-1 tabular-nums">
                    {fighterA.currentStreak} dias
                  </div>
                  <span className="text-[10px] text-slate-500">
                    {fighterA.hasCommittedToday ? 'Commit ativo hoje' : 'Pendente hoje!'}
                  </span>
                </div>

                <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800/80">
                  <div className="text-slate-400 font-semibold flex items-center gap-1.5">
                    <GitCommit className="h-4 w-4 text-emerald-400" />
                    <span>Commits</span>
                  </div>
                  <div className="text-lg font-black text-white mt-1 tabular-nums">
                    {fighterA.totalCommitsYear.toLocaleString('pt-BR')}
                  </div>
                  <span className="text-[10px] text-slate-500">Total no ano</span>
                </div>

                <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800/80">
                  <div className="text-slate-400 font-semibold flex items-center gap-1.5">
                    <Users className="h-4 w-4 text-sky-400" />
                    <span>Seguidores</span>
                  </div>
                  <div className="text-lg font-black text-white mt-1 tabular-nums">
                    {fighterA.followers.toLocaleString('pt-BR')}
                  </div>
                  <span className="text-[10px] text-slate-500">Audiência</span>
                </div>

                <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800/80">
                  <div className="text-slate-400 font-semibold flex items-center gap-1.5">
                    <GitPullRequest className="h-4 w-4 text-indigo-400" />
                    <span>PRs & Issues</span>
                  </div>
                  <div className="text-lg font-black text-white mt-1 tabular-nums">
                    {prsIssuesA.toLocaleString('pt-BR')}
                  </div>
                  <span className="text-[10px] text-slate-500">Contribuições</span>
                </div>

                <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800/80">
                  <div className="text-slate-400 font-semibold flex items-center gap-1.5">
                    <BookOpen className="h-4 w-4 text-purple-400" />
                    <span>Repositórios</span>
                  </div>
                  <div className="text-lg font-black text-white mt-1 tabular-nums">
                    {fighterA.publicRepos.toLocaleString('pt-BR')}
                  </div>
                  <span className="text-[10px] text-slate-500">Públicos</span>
                </div>

                <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800/80">
                  <div className="text-slate-400 font-semibold flex items-center gap-1.5">
                    <Star className="h-4 w-4 text-amber-400 fill-amber-400" />
                    <span>Estrelas ⭐</span>
                  </div>
                  <div className="text-lg font-black text-amber-400 mt-1 tabular-nums">
                    {(fighterA.totalStars || 0).toLocaleString('pt-BR')}
                  </div>
                  <span className="text-[10px] text-slate-500">Nos repositórios</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Card B: Grande e Completo com suas Estatísticas */}
        <div className={`clean-card p-8 flex flex-col justify-between transition-all ${overallWinner === 'B' ? 'ring-2 ring-emerald-500/40' : ''}`}>
          <div>
            {/* Header: Avatar, Name, Score */}
            <div className="flex items-start justify-between gap-5 pb-6 border-b border-slate-800/80">
              <div className="flex items-center gap-4">
                <img
                  src={fighterB.avatarUrl}
                  alt={fighterB.name}
                  className="h-20 w-20 rounded-3xl object-cover ring-2 ring-slate-700 shadow-md"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <h2 className="text-2xl font-black text-white flex items-center gap-2">
                    <span>{fighterB.name}</span>
                    {connectedUser && fighterB.username.toLowerCase() === connectedUser.username.toLowerCase() && (
                      <span className="rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 px-2 py-0.5 text-[10px] font-black uppercase">
                        Você
                      </span>
                    )}
                  </h2>
                  <div className="text-sm font-bold text-slate-400 flex items-center gap-1.5">
                    <span>@{fighterB.username}</span>
                    <a
                      href={`https://github.com/${fighterB.username}`}
                      target="_blank"
                      rel="noreferrer"
                      title={`Abrir perfil de @${fighterB.username} no GitHub`}
                      className="inline-flex items-center text-slate-500 hover:text-sky-400 transition-colors p-0.5 rounded hover:bg-slate-800/60"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  </div>
                  <div className="mt-1 text-xs font-bold text-sky-400">
                    {fighterB.division} · Lvl {fighterB.level}
                  </div>
                </div>
              </div>

              {/* Overall Score */}
              <div className="text-right">
                <span className="text-xs uppercase font-extrabold text-slate-500">Pontuação Total</span>
                <div className="text-3xl font-black text-sky-400 tabular-nums">
                  {fighterB.combatPower.toLocaleString('pt-BR')}
                </div>
                <span className="text-[11px] font-bold text-slate-400">Combat Power</span>
              </div>
            </div>

            {/* Bio / Sobre */}
            <p className="mt-4 text-xs font-medium text-slate-300 leading-relaxed min-h-[36px]">
              {fighterB.bio}
            </p>

            {/* Vantagens / Pontos Fortes no Versus */}
            <div className="mt-5">
              <span className="text-[11px] uppercase font-black tracking-wider text-slate-400 mb-2.5 block">
                Vantagens de @{fighterB.username}:
              </span>
              <div className="space-y-2">
                {comparisonItems.filter((i) => i.winner === 'B').length === 0 ? (
                  <div className="text-xs text-slate-500 italic">Nenhuma métrica com liderança isolada neste duelo.</div>
                ) : (
                  comparisonItems.filter((i) => i.winner === 'B').map((item) => (
                    <div key={item.label} className="flex items-center gap-2 text-xs font-bold text-sky-300 bg-sky-500/10 rounded-xl px-3 py-2 border border-sky-500/20">
                      <CheckCircle className="h-4 w-4 text-sky-400 shrink-0" />
                      <span>{item.label}: <strong>{item.valB}</strong> (+{item.diffFormatted} de vantagem)</span>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Todas as Estatísticas Individuais de @fighterB (6 Tiles Sincronizados) */}
            <div className="mt-6 pt-5 border-t border-slate-800/80">
              <span className="text-[11px] uppercase font-black tracking-wider text-slate-400 mb-3 block">
                Estatísticas Detalhadas
              </span>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800/80">
                  <div className="text-slate-400 font-semibold flex items-center gap-1.5">
                    <Flame className="h-4 w-4 text-amber-500 fill-amber-500" />
                    <span>Strike</span>
                  </div>
                  <div className="text-lg font-black text-amber-400 mt-1 tabular-nums">
                    {fighterB.currentStreak} dias
                  </div>
                  <span className="text-[10px] text-slate-500">
                    {fighterB.hasCommittedToday ? 'Commit ativo hoje' : 'Pendente hoje!'}
                  </span>
                </div>

                <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800/80">
                  <div className="text-slate-400 font-semibold flex items-center gap-1.5">
                    <GitCommit className="h-4 w-4 text-emerald-400" />
                    <span>Commits</span>
                  </div>
                  <div className="text-lg font-black text-white mt-1 tabular-nums">
                    {fighterB.totalCommitsYear.toLocaleString('pt-BR')}
                  </div>
                  <span className="text-[10px] text-slate-500">Total no ano</span>
                </div>

                <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800/80">
                  <div className="text-slate-400 font-semibold flex items-center gap-1.5">
                    <Users className="h-4 w-4 text-sky-400" />
                    <span>Seguidores</span>
                  </div>
                  <div className="text-lg font-black text-white mt-1 tabular-nums">
                    {fighterB.followers.toLocaleString('pt-BR')}
                  </div>
                  <span className="text-[10px] text-slate-500">Audiência</span>
                </div>

                <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800/80">
                  <div className="text-slate-400 font-semibold flex items-center gap-1.5">
                    <GitPullRequest className="h-4 w-4 text-indigo-400" />
                    <span>PRs & Issues</span>
                  </div>
                  <div className="text-lg font-black text-white mt-1 tabular-nums">
                    {prsIssuesB.toLocaleString('pt-BR')}
                  </div>
                  <span className="text-[10px] text-slate-500">Contribuições</span>
                </div>

                <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800/80">
                  <div className="text-slate-400 font-semibold flex items-center gap-1.5">
                    <BookOpen className="h-4 w-4 text-purple-400" />
                    <span>Repositórios</span>
                  </div>
                  <div className="text-lg font-black text-white mt-1 tabular-nums">
                    {fighterB.publicRepos.toLocaleString('pt-BR')}
                  </div>
                  <span className="text-[10px] text-slate-500">Públicos</span>
                </div>

                <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800/80">
                  <div className="text-slate-400 font-semibold flex items-center gap-1.5">
                    <Star className="h-4 w-4 text-amber-400 fill-amber-400" />
                    <span>Estrelas ⭐</span>
                  </div>
                  <div className="text-lg font-black text-amber-400 mt-1 tabular-nums">
                    {(fighterB.totalStars || 0).toLocaleString('pt-BR')}
                  </div>
                  <span className="text-[10px] text-slate-500">Nos repositórios</span>
                </div>
              </div>
            </div>
          </div>
        </div>

      </section>

      {/* 3. Tabela Comparativa Direta Estilo Versus.com */}
      <section className="clean-card p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <h3 className="text-lg font-black text-white flex items-center gap-2">
              <Award className="h-5 w-5 text-amber-400" />
              <span>Comparativo Métrica por Métrica</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Quem lidera cada aspecto do ecossistema GitHub entre os dois perfis com barras proporcionais exatas.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleShare}
              className="btn-secondary rounded-xl px-4 py-2.5 text-xs font-bold flex items-center gap-1.5"
            >
              {copiedLink ? <Check className="h-4 w-4 text-emerald-400" /> : <Share2 className="h-4 w-4" />}
              <span>{copiedLink ? 'Copiado!' : 'Compartilhar'}</span>
            </button>
          </div>
        </div>

        {/* Rows da Comparação */}
        <div className="divide-y divide-slate-800/60 mt-4">
          {comparisonItems.map((item) => {
            const total = item.numA + item.numB;
            const pctA = total === 0 ? 50 : Math.round((item.numA / total) * 100);
            const pctB = total === 0 ? 50 : 100 - pctA;

            return (
              <div key={item.label} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-sm">
                <div className="flex items-center gap-2.5 font-bold text-slate-200 sm:w-1/3">
                  <item.icon className="h-4 w-4 text-slate-400" />
                  <span>{item.label}</span>
                </div>

                {/* Center Comparison Bar */}
                <div className="flex-1 max-w-md mx-auto w-full">
                  <div className="flex justify-between text-xs font-black tabular-nums mb-1.5">
                    <span className={item.winner === 'A' ? 'text-emerald-400 font-extrabold flex items-center gap-1' : 'text-slate-400'}>
                      {item.winner === 'A' && '👑'} {item.valA}
                    </span>
                    <span className={item.winner === 'B' ? 'text-sky-400 font-extrabold flex items-center gap-1' : 'text-slate-400'}>
                      {item.valB} {item.winner === 'B' && '👑'}
                    </span>
                  </div>
                  <div className="h-2.5 w-full bg-slate-900 rounded-full overflow-hidden flex border border-slate-800/60">
                    <div
                      className={`h-full transition-all duration-500 ${
                        item.winner === 'A' ? 'bg-emerald-500' : item.winner === 'B' ? 'bg-slate-700' : 'bg-slate-600'
                      }`}
                      style={{ width: `${pctA}%` }}
                    />
                    <div
                      className={`h-full transition-all duration-500 ${
                        item.winner === 'B' ? 'bg-sky-500' : item.winner === 'A' ? 'bg-slate-700' : 'bg-slate-600'
                      }`}
                      style={{ width: `${pctB}%` }}
                    />
                  </div>
                </div>

                {/* Vencedor da Métrica */}
                <div className="sm:w-1/4 text-right text-xs font-bold">
                  {item.winner === 'A' ? (
                    <span className="text-emerald-400">@{fighterA.username} vence (+{item.diffFormatted})</span>
                  ) : item.winner === 'B' ? (
                    <span className="text-sky-400">@{fighterB.username} vence (+{item.diffFormatted})</span>
                  ) : (
                    <span className="text-slate-500">Empate técnico</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. Overtake Lab (O que falta para virar o jogo?) */}
      <section className="clean-card p-6 sm:p-7">
        <div className="flex items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-2.5">
            <TrendingUp className="h-5 w-5 text-emerald-400" />
            <h3 className="text-sm font-black uppercase text-white">
              Calculadora de Ultrapassagem
            </h3>
          </div>
          <span className="text-xs font-extrabold text-amber-400 bg-amber-500/10 px-3 py-1 rounded-xl border border-amber-500/20">
            Diferença: {cpDiff.toLocaleString('pt-BR')} CP
          </span>
        </div>

        <p className="text-xs font-bold text-slate-300 mb-5">
          Para <strong className="text-white">@{underdog.username}</strong> ultrapassar o líder <strong className="text-emerald-400">@{leader.username}</strong>, faltam:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
            <span className="text-xs font-semibold text-slate-400">Volume de Commits Faltante:</span>
            <div className="text-2xl font-black text-white mt-1 tabular-nums">
              +{commitsNeeded.toLocaleString('pt-BR')} commits
            </div>
            <span className="text-xs text-slate-500 mt-1 block">ou ~{(commitsNeeded / 30).toFixed(1)} commits por dia durante 1 mês</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
            <span className="text-xs font-semibold text-slate-400">Sequência Consecutiva Necessária:</span>
            <div className="text-2xl font-black text-amber-400 mt-1 tabular-nums">
              +{streakDaysNeeded} dias de Strike
            </div>
            <span className="text-xs text-slate-500 mt-1 block">Mantendo o fogo ativo todos os dias</span>
          </div>
        </div>

        {/* Interactive Slider */}
        <div className="mt-6 pt-5 border-t border-slate-800/80">
          <div className="flex items-center justify-between text-xs font-bold text-slate-300 mb-2">
            <span>Simulador: Adicionar commits para @{underdog.username}</span>
            <span className="text-emerald-400 font-extrabold text-sm">+{simulatedCommits} commits (+{simulatedCommits * 12} CP)</span>
          </div>

          <input
            type="range"
            min="0"
            max={Math.max(300, commitsNeeded + 60)}
            step="5"
            value={simulatedCommits}
            onChange={(e) => setSimulatedCommits(Number(e.target.value))}
            className="w-full accent-emerald-500 h-2 bg-slate-800 rounded-lg cursor-pointer"
          />

          <div className="mt-3 flex items-center justify-between text-xs font-bold">
            <span className="text-slate-400">
              Novo CP simulado: <strong className="text-white">{simUnderdogCp.toLocaleString('pt-BR')}</strong>
            </span>
            {isOvertaken ? (
              <span className="text-emerald-400 font-black flex items-center gap-1.5 bg-emerald-500/10 px-3 py-1 rounded-lg border border-emerald-500/20">
                <CheckCircle className="h-4 w-4" /> ULTRAPASSA O LÍDER!
              </span>
            ) : (
              <span className="text-slate-500">
                Ainda faltam {(leader.combatPower - simUnderdogCp).toLocaleString('pt-BR')} CP para a liderança
              </span>
            )}
          </div>
        </div>
      </section>
        </>
      )}

    </div>
  );
};
