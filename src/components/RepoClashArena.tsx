import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  GitFork, 
  Star, 
  Activity, 
  Eye, 
  Swords, 
  Trophy, 
  ExternalLink,
  Share2, 
  Check, 
  AlertCircle,
  GitCommit,
  Users,
  GitPullRequest,
  CheckCircle,
  Award,
  Sparkles,
  BookOpen,
  Calendar,
  Layers,
  UserCheck
} from 'lucide-react';
import { RepoFighter, DevFighter, FriendFighter } from '../types';
import { audio16bit } from '../utils/audio16bit';
import { RivalryHistory } from './RivalryHistory';
import { recordDuel } from '../services/rivalryService';

interface RepoClashArenaProps {
  repoA: RepoFighter;
  repoB: RepoFighter;
  onSearchRepo: (repoA: string, repoB: string) => void;
  isLoading: boolean;
  errorMessage?: string | null;
  onSelectPresets: (repoA: string, repoB: string) => void;
  connectedUser?: DevFighter | null;
  friends?: FriendFighter[];
}

export const RepoClashArena: React.FC<RepoClashArenaProps> = ({
  repoA,
  repoB,
  onSearchRepo,
  isLoading,
  errorMessage,
  onSelectPresets,
  connectedUser,
  friends = []
}) => {
  const [inputA, setInputA] = useState(repoA.resolvedFromDev ? `@${repoA.resolvedFromDev}` : repoA.fullName);
  const [inputB, setInputB] = useState(repoB.resolvedFromDev ? `@${repoB.resolvedFromDev}` : repoB.fullName);
  const [isClashing, setIsClashing] = useState(false);
  const [winner, setWinner] = useState<'A' | 'B' | 'DRAW' | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  React.useEffect(() => {
    setInputA(repoA.resolvedFromDev ? `@${repoA.resolvedFromDev}` : repoA.fullName);
    setInputB(repoB.resolvedFromDev ? `@${repoB.resolvedFromDev}` : repoB.fullName);

    if (repoA?.fullName && repoB?.fullName && repoA.combatPower > 0 && repoB.combatPower > 0) {
      const margin = Math.abs(repoA.combatPower - repoB.combatPower);
      const resWinner = repoA.combatPower > repoB.combatPower ? 'A' : repoB.combatPower > repoA.combatPower ? 'B' : 'DRAW';
      recordDuel(
        'repo',
        {
          username: repoA.fullName,
          name: repoA.name,
          avatarUrl: repoA.avatarUrl,
          combatPower: repoA.combatPower
        },
        {
          username: repoB.fullName,
          name: repoB.name,
          avatarUrl: repoB.avatarUrl,
          combatPower: repoB.combatPower
        },
        resWinner,
        margin
      );
    }
  }, [repoA.fullName, repoB.fullName, repoA.resolvedFromDev, repoB.resolvedFromDev, repoA.combatPower, repoB.combatPower]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputA.trim() || !inputB.trim()) return;
    audio16bit.playTap();
    onSearchRepo(inputA.trim(), inputB.trim());
    setWinner(null);
  };

  const handleClash = async () => {
    if (isClashing) return;
    setIsClashing(true);
    setWinner(null);

    await new Promise((res) => setTimeout(res, 600));
    audio16bit.playHit(false);

    const result = repoA.combatPower > repoB.combatPower ? 'A' : repoB.combatPower > repoA.combatPower ? 'B' : 'DRAW';
    setWinner(result);
    setIsClashing(false);

    if (result !== 'DRAW') {
      audio16bit.playLevelUp();
      confetti({
        particleCount: 80,
        spread: 65,
        origin: { y: 0.6 },
        colors: ['#38bdf8', '#22c55e', '#f97316']
      });
    }
  };

  const handleShare = () => {
    audio16bit.playSuccess();
    const shareText = `⚔️ Duelo de Repositórios: ${repoA.fullName} (${repoA.combatPower} CP) vs ${repoB.fullName} (${repoB.combatPower} CP). Veja quem tem maior impacto open source: ${window.location.href}`;
    navigator.clipboard.writeText(shareText);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  // Comparação detalhada entre os critérios solicitados
  const comparisonItems = [
    {
      id: 'commits',
      label: 'Mais Trabalhado: Volume de Commits',
      subtitle: 'Histórico de esforço e desenvolvimento contínuo',
      valA: repoA.totalCommits.toLocaleString('pt-BR'),
      valB: repoB.totalCommits.toLocaleString('pt-BR'),
      numA: repoA.totalCommits,
      numB: repoB.totalCommits,
      winner: repoA.totalCommits > repoB.totalCommits ? 'A' : repoA.totalCommits < repoB.totalCommits ? 'B' : 'TIE',
      diff: Math.abs(repoA.totalCommits - repoB.totalCommits),
      diffFormatted: Math.abs(repoA.totalCommits - repoB.totalCommits).toLocaleString('pt-BR'),
      icon: GitCommit,
      color: 'text-emerald-400'
    },
    {
      id: 'stars',
      label: 'Mais Estrelas: Adoção & Popularidade (⭐)',
      subtitle: 'Reconhecimento da comunidade global de desenvolvedores',
      valA: repoA.stars.toLocaleString('pt-BR'),
      valB: repoB.stars.toLocaleString('pt-BR'),
      numA: repoA.stars,
      numB: repoB.stars,
      winner: repoA.stars > repoB.stars ? 'A' : repoA.stars < repoB.stars ? 'B' : 'TIE',
      diff: Math.abs(repoA.stars - repoB.stars),
      diffFormatted: Math.abs(repoA.stars - repoB.stars).toLocaleString('pt-BR'),
      icon: Star,
      color: 'text-amber-400'
    },
    {
      id: 'contributors',
      label: 'Mais Pessoas Trabalharam Nele: Contribuidores (👥)',
      subtitle: 'Diversidade de colaboradores ativos no código',
      valA: repoA.contributorsCount.toLocaleString('pt-BR'),
      valB: repoB.contributorsCount.toLocaleString('pt-BR'),
      numA: repoA.contributorsCount,
      numB: repoB.contributorsCount,
      winner: repoA.contributorsCount > repoB.contributorsCount ? 'A' : repoA.contributorsCount < repoB.contributorsCount ? 'B' : 'TIE',
      diff: Math.abs(repoA.contributorsCount - repoB.contributorsCount),
      diffFormatted: Math.abs(repoA.contributorsCount - repoB.contributorsCount).toLocaleString('pt-BR'),
      icon: Users,
      color: 'text-sky-400'
    },
    {
      id: 'prs',
      label: 'Mais Pull Requests: Atividade & Colaboração (🔀)',
      subtitle: 'Propostas de melhoria, correções e merges processados',
      valA: repoA.pullRequestsCount.toLocaleString('pt-BR'),
      valB: repoB.pullRequestsCount.toLocaleString('pt-BR'),
      numA: repoA.pullRequestsCount,
      numB: repoB.pullRequestsCount,
      winner: repoA.pullRequestsCount > repoB.pullRequestsCount ? 'A' : repoA.pullRequestsCount < repoB.pullRequestsCount ? 'B' : 'TIE',
      diff: Math.abs(repoA.pullRequestsCount - repoB.pullRequestsCount),
      diffFormatted: Math.abs(repoA.pullRequestsCount - repoB.pullRequestsCount).toLocaleString('pt-BR'),
      icon: GitPullRequest,
      color: 'text-purple-400'
    },
    {
      id: 'forks',
      label: 'Forks: Bifurcações e Projetos Derivados (🍴)',
      subtitle: 'Quantidade de desenvolvedores replicando o código',
      valA: repoA.forks.toLocaleString('pt-BR'),
      valB: repoB.forks.toLocaleString('pt-BR'),
      numA: repoA.forks,
      numB: repoB.forks,
      winner: repoA.forks > repoB.forks ? 'A' : repoA.forks < repoB.forks ? 'B' : 'TIE',
      diff: Math.abs(repoA.forks - repoB.forks),
      diffFormatted: Math.abs(repoA.forks - repoB.forks).toLocaleString('pt-BR'),
      icon: GitFork,
      color: 'text-rose-400'
    },
    {
      id: 'velocity',
      label: 'Velocidade Semanal de Commits',
      subtitle: 'Ritmo atual de commits por semana',
      valA: `${repoA.weeklyCommitVelocity}/sem`,
      valB: `${repoB.weeklyCommitVelocity}/sem`,
      numA: repoA.weeklyCommitVelocity,
      numB: repoB.weeklyCommitVelocity,
      winner: repoA.weeklyCommitVelocity > repoB.weeklyCommitVelocity ? 'A' : repoA.weeklyCommitVelocity < repoB.weeklyCommitVelocity ? 'B' : 'TIE',
      diff: Math.abs(repoA.weeklyCommitVelocity - repoB.weeklyCommitVelocity),
      diffFormatted: `${Math.abs(repoA.weeklyCommitVelocity - repoB.weeklyCommitVelocity)}/sem`,
      icon: Activity,
      color: 'text-emerald-400'
    },
    {
      id: 'watchers',
      label: 'Watchers: Seguidores Atentos',
      subtitle: 'Desenvolvedores monitorando todas as notificações',
      valA: repoA.watchers.toLocaleString('pt-BR'),
      valB: repoB.watchers.toLocaleString('pt-BR'),
      numA: repoA.watchers,
      numB: repoB.watchers,
      winner: repoA.watchers > repoB.watchers ? 'A' : repoA.watchers < repoB.watchers ? 'B' : 'TIE',
      diff: Math.abs(repoA.watchers - repoB.watchers),
      diffFormatted: Math.abs(repoA.watchers - repoB.watchers).toLocaleString('pt-BR'),
      icon: Eye,
      color: 'text-slate-300'
    }
  ];

  const winsA = comparisonItems.filter((i) => i.winner === 'A').length;
  const winsB = comparisonItems.filter((i) => i.winner === 'B').length;
  const overallWinner = repoA.combatPower > repoB.combatPower ? 'A' : repoB.combatPower > repoA.combatPower ? 'B' : 'DRAW';

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* 1. Barra de Busca com suporte a Repo ou Desenvolvedor */}
      <section className="clean-card p-6 shadow-sm">
        <div className="mb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
          <div className="flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 rounded-full bg-sky-400 animate-pulse" />
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-300">
              Duelo de Repositórios & Melhores Projetos de Devs
            </h3>
          </div>
          <span className="text-[11px] font-semibold text-emerald-400/90 flex items-center gap-1">
            <Sparkles className="h-3 w-3" />
            <span>Digite um <strong>dono/repo</strong> ou um <strong>@dev</strong> para selecionar seu melhor repo!</span>
          </span>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col md:flex-row items-center gap-3">
          <div className="flex-1 flex flex-col sm:flex-row items-center gap-3 w-full">
            <div className="relative flex-1 w-full">
              <span className="absolute left-4 top-3 text-xs font-bold text-slate-500">github.com/</span>
              <input
                type="text"
                value={inputA}
                onChange={(e) => setInputA(e.target.value)}
                placeholder="dono/repo ou @dev (ex: antfu ou react)"
                list="repo-clash-recommendations-list"
                autoComplete="off"
                className="w-full rounded-2xl border border-slate-800 bg-[#090d16] py-2.5 pl-24 pr-4 text-sm font-bold text-white placeholder-slate-500 focus:border-sky-500 focus:outline-none transition-colors"
              />
            </div>

            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-800 border border-slate-700 text-xs font-black text-sky-400">
              VS
            </div>

            <div className="relative flex-1 w-full">
              <span className="absolute left-4 top-3 text-xs font-bold text-slate-500">github.com/</span>
              <input
                type="text"
                value={inputB}
                onChange={(e) => setInputB(e.target.value)}
                placeholder="dono/repo ou @dev (ex: torvalds ou vue)"
                list="repo-clash-recommendations-list"
                autoComplete="off"
                className="w-full rounded-2xl border border-slate-800 bg-[#090d16] py-2.5 pl-24 pr-4 text-sm font-bold text-white placeholder-slate-500 focus:border-sky-500 focus:outline-none transition-colors"
              />
            </div>
          </div>

          {/* Datalist com perfil conectado, amigos e devs para autocompletar na busca de repos */}
          <datalist id="repo-clash-recommendations-list">
            {connectedUser && (
              <option value={`@${connectedUser.username}`}>
                {connectedUser.name} (Você) · Selecionar meu melhor repositório
              </option>
            )}
            {friends.map((f) => (
              <option key={f.username} value={`@${f.username}`}>
                {f.name} (@{f.username}) {f.isMutual ? '🤝 Mútuo' : '👤 Amigo'} · Melhor Repositório
              </option>
            ))}
            <option value="@antfu">Anthony Fu (@antfu) · Melhor Repositório</option>
            <option value="@torvalds">Linus Torvalds (@torvalds) · Melhor Repositório</option>
            <option value="@yyx990803">Evan You (@yyx990803) · Melhor Repositório</option>
            <option value="@gaearon">Dan Abramov (@gaearon) · Melhor Repositório</option>
            <option value="@shadcn">shadcn (@shadcn) · Melhor Repositório</option>
            <option value="@sindresorhus">Sindre Sorhus (@sindresorhus) · Melhor Repositório</option>
            <option value="facebook/react">facebook/react (JavaScript)</option>
            <option value="vuejs/core">vuejs/core (TypeScript)</option>
            <option value="tailwindlabs/tailwindcss">tailwindlabs/tailwindcss (Rust / JS)</option>
            <option value="twbs/bootstrap">twbs/bootstrap (JavaScript)</option>
            <option value="oven-sh/bun">oven-sh/bun (Zig)</option>
            <option value="denoland/deno">denoland/deno (Rust)</option>
          </datalist>

          <button
            type="submit"
            disabled={isLoading || isClashing}
            className="btn-primary rounded-2xl px-7 py-3 text-xs font-black uppercase shrink-0 whitespace-nowrap w-full md:w-auto shadow-md"
          >
            {isLoading ? 'Buscando & Analisando...' : 'Comparar Repositórios'}
          </button>
        </form>

        {/* Recomendações de Amigos & Duelos Rápidos (como no Duelo Versus) */}
        <div className="mt-4 pt-3 border-t border-slate-800/60 space-y-2.5">
          {/* Linha 1: Amigos Recomendados para Duelo de Repos */}
          <div className="flex flex-wrap items-center justify-center gap-2 text-xs">
            {connectedUser && (
              <button
                onClick={() => {
                  audio16bit.playTap();
                  onSelectPresets(connectedUser.username, repoB.fullName);
                }}
                className="rounded-xl px-3 py-1.5 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-bold hover:bg-emerald-500/30 transition-all flex items-center gap-1.5 shadow-sm"
              >
                <Sparkles className="h-3.5 w-3.5" />
                <span>Meu Melhor Repo (@{connectedUser.username})</span>
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
                  onSelectPresets(connectedUser ? connectedUser.username : repoA.fullName, f.username);
                }}
                className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-emerald-500/40 hover:bg-slate-850 px-2.5 py-1 text-xs text-slate-300 hover:text-emerald-300 transition-all group shadow-sm"
                title={`Duelo contra o melhor repositório de @${f.username}`}
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

          {/* Linha 2: Duelos Clássicos de Repositórios & Devs Famosos */}
          <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-slate-400">
            <span className="font-semibold text-slate-500">Destaques:</span>
            <button
              onClick={() => {
                audio16bit.playTap();
                onSelectPresets('torvalds', 'antfu');
              }}
              className="rounded-lg px-2 py-0.5 bg-slate-900/80 border border-slate-800/80 text-slate-300 hover:text-sky-400 hover:border-sky-500/40 transition-colors"
            >
              Linus vs Anthony Fu
            </button>
            <button
              onClick={() => {
                audio16bit.playTap();
                onSelectPresets('gaearon', 'yyx990803');
              }}
              className="rounded-lg px-2 py-0.5 bg-slate-900/80 border border-slate-800/80 text-slate-300 hover:text-sky-400 hover:border-sky-500/40 transition-colors"
            >
              Dan Abramov vs Evan You
            </button>
            <button
              onClick={() => {
                audio16bit.playTap();
                onSelectPresets('facebook/react', 'vuejs/core');
              }}
              className="rounded-lg px-2 py-0.5 bg-slate-900/80 border border-slate-800/80 text-slate-300 hover:text-sky-400 hover:border-sky-500/40 transition-colors"
            >
              React vs Vue
            </button>
            <button
              onClick={() => {
                audio16bit.playTap();
                onSelectPresets('tailwindlabs/tailwindcss', 'twbs/bootstrap');
              }}
              className="rounded-lg px-2 py-0.5 bg-slate-900/80 border border-slate-800/80 text-slate-300 hover:text-sky-400 hover:border-sky-500/40 transition-colors"
            >
              Tailwind vs Bootstrap
            </button>
            <button
              onClick={() => {
                audio16bit.playTap();
                onSelectPresets('oven-sh/bun', 'denoland/deno');
              }}
              className="rounded-lg px-2 py-0.5 bg-slate-900/80 border border-slate-800/80 text-slate-300 hover:text-sky-400 hover:border-sky-500/40 transition-colors"
            >
              Bun vs Deno
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

      {/* Histórico de Rivalidades Head-to-Head para Repositórios */}
      <RivalryHistory
        userA={repoA.fullName}
        nameA={repoA.name}
        avatarA={repoA.avatarUrl}
        userB={repoB.fullName}
        nameB={repoB.name}
        avatarB={repoB.avatarUrl}
        type="repo"
        onReplayMatch={(rA, rB) => onSearchRepo(rA, rB)}
      />

      {/* 2. Grandes Cards Comparativos dos Repositórios */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6 relative items-stretch">
        
        {/* Versus Badge Central */}
        <div className="hidden md:flex absolute left-1/2 top-10 -translate-x-1/2 z-20 flex-col items-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-sky-500 text-slate-950 font-black text-xs shadow-[0_0_20px_rgba(56,189,248,0.35)] border-4 border-[#090d16]">
            VS
          </div>
        </div>

        {/* Card Repo A */}
        <div className={`clean-card p-6 sm:p-7 flex flex-col justify-between transition-all ${overallWinner === 'A' ? 'ring-2 ring-sky-500/40' : ''}`}>
          <div>
            <div className="flex items-start justify-between gap-4 pb-5 border-b border-slate-800/80">
              <div className="flex items-center gap-3.5">
                <img
                  src={repoA.avatarUrl}
                  alt={repoA.name}
                  className="h-16 w-16 rounded-2xl object-cover bg-slate-900 border border-slate-800 shadow-sm"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-black text-white">
                      {repoA.fullName}
                    </h2>
                    {/* Botão sutil de ir para o GitHub */}
                    <a
                      href={`https://github.com/${repoA.fullName}`}
                      target="_blank"
                      rel="noreferrer"
                      title={`Abrir ${repoA.fullName} no GitHub`}
                      className="inline-flex items-center text-slate-500 hover:text-sky-400 transition-colors p-1 rounded hover:bg-slate-800/70"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  </div>

                  {/* Indicador de Dev detectado automaticamente */}
                  {repoA.resolvedFromDev && (
                    <div className="mt-1 flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full inline-flex">
                      <UserCheck className="h-3 w-3" />
                      <span>Melhor repo do dev <strong>@{repoA.resolvedFromDev}</strong></span>
                      <a
                        href={`https://github.com/${repoA.resolvedFromDev}`}
                        target="_blank"
                        rel="noreferrer"
                        title={`Ver perfil de @${repoA.resolvedFromDev}`}
                        className="text-slate-400 hover:text-emerald-300 ml-0.5"
                      >
                        <ExternalLink className="h-2.5 w-2.5 inline" />
                      </a>
                    </div>
                  )}

                  <div className="flex items-center gap-2 mt-1.5 text-xs">
                    <span className="font-bold text-sky-400">{repoA.language}</span>
                    <span className="text-slate-600">·</span>
                    <span className="text-slate-400">Licença {repoA.license || 'Open Source'}</span>
                    <span className="text-slate-600">·</span>
                    <span className="text-slate-500 text-[11px]">{repoA.pushedAt || 'Ativo'}</span>
                  </div>
                </div>
              </div>

              <div className="text-right shrink-0">
                <span className="text-[10px] uppercase font-black text-slate-500 block">Poder de Tração</span>
                <div className="text-2xl font-black text-sky-400 tabular-nums">
                  {repoA.combatPower.toLocaleString('pt-BR')}
                </div>
                <span className="text-[10px] font-bold text-slate-500">Combat Power</span>
              </div>
            </div>

            <p className="mt-4 text-xs font-medium text-slate-300 leading-relaxed min-h-[36px]">
              {repoA.description}
            </p>

            {/* Vantagens do Repo A */}
            <div className="mt-5">
              <span className="text-[11px] uppercase font-black tracking-wider text-slate-400 mb-2.5 block">
                Vantagens de {repoA.name}:
              </span>
              <div className="space-y-1.5">
                {comparisonItems.filter((i) => i.winner === 'A').length === 0 ? (
                  <div className="text-xs text-slate-500 italic">Nenhum critério com liderança isolada.</div>
                ) : (
                  comparisonItems.filter((i) => i.winner === 'A').map((item) => (
                    <div key={item.id} className="flex items-center gap-2 text-xs font-bold text-sky-300 bg-sky-500/10 rounded-xl px-3 py-1.5 border border-sky-500/20">
                      <CheckCircle className="h-3.5 w-3.5 text-sky-400 shrink-0" />
                      <span>{item.label.split(':')[0]}: <strong>{item.valA}</strong> (+{item.diffFormatted} de vantagem)</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* 4 Métricas Principais Destacadas */}
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-2 pt-4 border-t border-slate-800/80 text-center">
            <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800/80">
              <span className="text-[10px] font-bold text-slate-400 flex items-center justify-center gap-1">
                <GitCommit className="h-3 w-3 text-emerald-400" /> Commits
              </span>
              <div className="text-sm font-black text-white mt-0.5 tabular-nums">
                {repoA.totalCommits.toLocaleString('pt-BR')}
              </div>
              <span className="text-[9px] text-slate-500">Mais trabalhado</span>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800/80">
              <span className="text-[10px] font-bold text-slate-400 flex items-center justify-center gap-1">
                <Star className="h-3 w-3 text-amber-400 fill-amber-400" /> Estrelas
              </span>
              <div className="text-sm font-black text-amber-400 mt-0.5 tabular-nums">
                {repoA.stars.toLocaleString('pt-BR')}
              </div>
              <span className="text-[9px] text-slate-500">Popularidade</span>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800/80">
              <span className="text-[10px] font-bold text-slate-400 flex items-center justify-center gap-1">
                <Users className="h-3 w-3 text-sky-400" /> Pessoas
              </span>
              <div className="text-sm font-black text-white mt-0.5 tabular-nums">
                {repoA.contributorsCount.toLocaleString('pt-BR')}
              </div>
              <span className="text-[9px] text-slate-500">Contribuidores</span>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800/80">
              <span className="text-[10px] font-bold text-slate-400 flex items-center justify-center gap-1">
                <GitPullRequest className="h-3 w-3 text-purple-400" /> Pull Requests
              </span>
              <div className="text-sm font-black text-white mt-0.5 tabular-nums">
                {repoA.pullRequestsCount.toLocaleString('pt-BR')}
              </div>
              <span className="text-[9px] text-slate-500">Colaboração</span>
            </div>
          </div>
        </div>

        {/* Card Repo B */}
        <div className={`clean-card p-6 sm:p-7 flex flex-col justify-between transition-all ${overallWinner === 'B' ? 'ring-2 ring-sky-500/40' : ''}`}>
          <div>
            <div className="flex items-start justify-between gap-4 pb-5 border-b border-slate-800/80">
              <div className="flex items-center gap-3.5">
                <img
                  src={repoB.avatarUrl}
                  alt={repoB.name}
                  className="h-16 w-16 rounded-2xl object-cover bg-slate-900 border border-slate-800 shadow-sm"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-black text-white">
                      {repoB.fullName}
                    </h2>
                    {/* Botão sutil de ir para o GitHub */}
                    <a
                      href={`https://github.com/${repoB.fullName}`}
                      target="_blank"
                      rel="noreferrer"
                      title={`Abrir ${repoB.fullName} no GitHub`}
                      className="inline-flex items-center text-slate-500 hover:text-sky-400 transition-colors p-1 rounded hover:bg-slate-800/70"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  </div>

                  {/* Indicador de Dev detectado automaticamente */}
                  {repoB.resolvedFromDev && (
                    <div className="mt-1 flex items-center gap-1 text-[11px] font-bold text-sky-400 bg-sky-500/10 border border-sky-500/20 px-2 py-0.5 rounded-full inline-flex">
                      <UserCheck className="h-3 w-3" />
                      <span>Melhor repo do dev <strong>@{repoB.resolvedFromDev}</strong></span>
                      <a
                        href={`https://github.com/${repoB.resolvedFromDev}`}
                        target="_blank"
                        rel="noreferrer"
                        title={`Ver perfil de @${repoB.resolvedFromDev}`}
                        className="text-slate-400 hover:text-sky-300 ml-0.5"
                      >
                        <ExternalLink className="h-2.5 w-2.5 inline" />
                      </a>
                    </div>
                  )}

                  <div className="flex items-center gap-2 mt-1.5 text-xs">
                    <span className="font-bold text-sky-400">{repoB.language}</span>
                    <span className="text-slate-600">·</span>
                    <span className="text-slate-400">Licença {repoB.license || 'Open Source'}</span>
                    <span className="text-slate-600">·</span>
                    <span className="text-slate-500 text-[11px]">{repoB.pushedAt || 'Ativo'}</span>
                  </div>
                </div>
              </div>

              <div className="text-right shrink-0">
                <span className="text-[10px] uppercase font-black text-slate-500 block">Poder de Tração</span>
                <div className="text-2xl font-black text-sky-400 tabular-nums">
                  {repoB.combatPower.toLocaleString('pt-BR')}
                </div>
                <span className="text-[10px] font-bold text-slate-500">Combat Power</span>
              </div>
            </div>

            <p className="mt-4 text-xs font-medium text-slate-300 leading-relaxed min-h-[36px]">
              {repoB.description}
            </p>

            {/* Vantagens do Repo B */}
            <div className="mt-5">
              <span className="text-[11px] uppercase font-black tracking-wider text-slate-400 mb-2.5 block">
                Vantagens de {repoB.name}:
              </span>
              <div className="space-y-1.5">
                {comparisonItems.filter((i) => i.winner === 'B').length === 0 ? (
                  <div className="text-xs text-slate-500 italic">Nenhum critério com liderança isolada.</div>
                ) : (
                  comparisonItems.filter((i) => i.winner === 'B').map((item) => (
                    <div key={item.id} className="flex items-center gap-2 text-xs font-bold text-sky-300 bg-sky-500/10 rounded-xl px-3 py-1.5 border border-sky-500/20">
                      <CheckCircle className="h-3.5 w-3.5 text-sky-400 shrink-0" />
                      <span>{item.label.split(':')[0]}: <strong>{item.valB}</strong> (+{item.diffFormatted} de vantagem)</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* 4 Métricas Principais Destacadas */}
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-2 pt-4 border-t border-slate-800/80 text-center">
            <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800/80">
              <span className="text-[10px] font-bold text-slate-400 flex items-center justify-center gap-1">
                <GitCommit className="h-3 w-3 text-emerald-400" /> Commits
              </span>
              <div className="text-sm font-black text-white mt-0.5 tabular-nums">
                {repoB.totalCommits.toLocaleString('pt-BR')}
              </div>
              <span className="text-[9px] text-slate-500">Mais trabalhado</span>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800/80">
              <span className="text-[10px] font-bold text-slate-400 flex items-center justify-center gap-1">
                <Star className="h-3 w-3 text-amber-400 fill-amber-400" /> Estrelas
              </span>
              <div className="text-sm font-black text-amber-400 mt-0.5 tabular-nums">
                {repoB.stars.toLocaleString('pt-BR')}
              </div>
              <span className="text-[9px] text-slate-500">Popularidade</span>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800/80">
              <span className="text-[10px] font-bold text-slate-400 flex items-center justify-center gap-1">
                <Users className="h-3 w-3 text-sky-400" /> Pessoas
              </span>
              <div className="text-sm font-black text-white mt-0.5 tabular-nums">
                {repoB.contributorsCount.toLocaleString('pt-BR')}
              </div>
              <span className="text-[9px] text-slate-500">Contribuidores</span>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800/80">
              <span className="text-[10px] font-bold text-slate-400 flex items-center justify-center gap-1">
                <GitPullRequest className="h-3 w-3 text-purple-400" /> Pull Requests
              </span>
              <div className="text-sm font-black text-white mt-0.5 tabular-nums">
                {repoB.pullRequestsCount.toLocaleString('pt-BR')}
              </div>
              <span className="text-[9px] text-slate-500">Colaboração</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Tabela Comparativa Detalhada (Versus Style) */}
      <section className="clean-card p-6 sm:p-7">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-800/80">
          <div>
            <h3 className="text-base font-black text-white flex items-center gap-2">
              <Award className="h-5 w-5 text-sky-400" />
              <span>Comparativo Métrica a Métrica</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Análise comparativa direta entre {repoA.fullName} e {repoB.fullName}
            </p>
          </div>

          <button
            onClick={handleShare}
            className="btn-secondary rounded-xl px-3 py-1.5 text-xs font-bold flex items-center gap-1.5 shrink-0"
          >
            {copiedLink ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Share2 className="h-3.5 w-3.5" />}
            <span>{copiedLink ? 'Link Copiado!' : 'Compartilhar Duelo'}</span>
          </button>
        </div>

        <div className="space-y-3">
          {comparisonItems.map((item) => {
            const Icon = item.icon;
            const maxVal = Math.max(item.numA, item.numB, 1);
            const pctA = Math.min(100, Math.round((item.numA / maxVal) * 100));
            const pctB = Math.min(100, Math.round((item.numB / maxVal) * 100));

            return (
              <div
                key={item.id}
                className="rounded-2xl bg-slate-900/60 border border-slate-800/80 p-4 transition-all hover:border-slate-700/80"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-800 border border-slate-700/80 shrink-0">
                      <Icon className={`h-4 w-4 ${item.color}`} />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white">{item.label}</div>
                      <div className="text-[11px] text-slate-500">{item.subtitle}</div>
                    </div>
                  </div>

                  {/* Vencedor da Métrica */}
                  <div className="text-right shrink-0">
                    {item.winner === 'A' ? (
                      <span className="text-[10px] font-black uppercase text-sky-400 bg-sky-500/10 border border-sky-500/30 px-2 py-0.5 rounded-full">
                        {repoA.name} lidera (+{item.diffFormatted})
                      </span>
                    ) : item.winner === 'B' ? (
                      <span className="text-[10px] font-black uppercase text-sky-400 bg-sky-500/10 border border-sky-500/30 px-2 py-0.5 rounded-full">
                        {repoB.name} lidera (+{item.diffFormatted})
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold text-slate-500 bg-slate-800 px-2 py-0.5 rounded-full">
                        Empate
                      </span>
                    )}
                  </div>
                </div>

                {/* Dupla Barra de Progresso Visual */}
                <div className="grid grid-cols-2 gap-3 items-center pt-1">
                  <div>
                    <div className="flex justify-between items-center text-xs font-bold mb-1">
                      <span className="text-slate-400 truncate max-w-[140px]">{repoA.name}</span>
                      <span className={`tabular-nums ${item.winner === 'A' ? 'text-sky-400 font-extrabold' : 'text-slate-300'}`}>
                        {item.valA}
                      </span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${item.winner === 'A' ? 'bg-sky-400' : 'bg-slate-600'}`}
                        style={{ width: `${pctA}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center text-xs font-bold mb-1">
                      <span className="text-slate-400 truncate max-w-[140px]">{repoB.name}</span>
                      <span className={`tabular-nums ${item.winner === 'B' ? 'text-sky-400 font-extrabold' : 'text-slate-300'}`}>
                        {item.valB}
                      </span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${item.winner === 'B' ? 'bg-sky-400' : 'bg-slate-600'}`}
                        style={{ width: `${pctB}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Resumo Final do Vencedor */}
        <div className="mt-6 pt-5 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Trophy className="h-6 w-6 text-sky-400 shrink-0" />
            <div>
              <h4 className="text-sm font-black text-white">
                Resultado Geral: {overallWinner === 'A' ? repoA.fullName : overallWinner === 'B' ? repoB.fullName : 'Empate'}
              </h4>
              <p className="text-xs text-slate-400">
                {overallWinner !== 'DRAW' 
                  ? `Vantagem de ${Math.abs(repoA.combatPower - repoB.combatPower).toLocaleString('pt-BR')} CP com vitórias em ${overallWinner === 'A' ? winsA : winsB} critérios fundamentais.`
                  : 'Equilíbrio exato de forças entre os repositórios.'
                }
              </p>
            </div>
          </div>

          <button
            onClick={handleClash}
            disabled={isClashing}
            className="btn-primary rounded-xl px-5 py-2.5 text-xs font-black uppercase flex items-center gap-2 shrink-0 shadow-md"
          >
            <Swords className="h-4 w-4" />
            <span>{isClashing ? 'Celebrando...' : 'Re-animar Duelo'}</span>
          </button>
        </div>
      </section>
    </div>
  );
};
