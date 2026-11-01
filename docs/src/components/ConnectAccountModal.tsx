import React, { useState } from 'react';
import { UserCheck, X, Check, ExternalLink, Key, LogOut, ArrowRight, Loader2, Sparkles } from 'lucide-react';
import { DevFighter } from '../types';
import { fetchGithubUser, setStoredConnectedUser, setStoredGitHubToken, getStoredGitHubToken } from '../services/githubApi';
import { audio16bit } from '../utils/audio16bit';
import confetti from 'canvas-confetti';

interface ConnectAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  connectedUser: DevFighter | null;
  onUserConnected: (user: DevFighter | null) => void;
}

export const ConnectAccountModal: React.FC<ConnectAccountModalProps> = ({
  isOpen,
  onClose,
  connectedUser,
  onUserConnected
}) => {
  const [usernameInput, setUsernameInput] = useState(connectedUser?.username || '');
  const [tokenInput, setTokenInput] = useState(getStoredGitHubToken());
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleConnect = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!usernameInput.trim()) return;

    setIsLoading(true);
    setErrorMessage(null);

    try {
      if (tokenInput.trim()) {
        setStoredGitHubToken(tokenInput.trim());
      }

      const user = await fetchGithubUser(usernameInput.trim());
      setStoredConnectedUser(user);
      onUserConnected(user);

      audio16bit.playLevelUp();
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#22c55e', '#38bdf8', '#ff9600']
      });

      onClose();
    } catch (err: any) {
      setErrorMessage(err?.message || 'Não foi possível encontrar este perfil no GitHub.');
      audio16bit.playWarning();
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisconnect = () => {
    audio16bit.playTap();
    setStoredConnectedUser(null);
    onUserConnected(null);
    setUsernameInput('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-md clean-card p-6 sm:p-7 relative shadow-2xl">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-slate-400 hover:text-white transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-2.5 text-emerald-400 font-bold text-sm mb-1.5">
          <UserCheck className="h-5 w-5 text-emerald-400" />
          <span>CONECTAR CONTA DO GITHUB</span>
        </div>

        <p className="text-xs text-slate-400 mb-5 leading-relaxed">
          Conecte seu perfil para monitorar seu <strong>Strike de commits</strong> em tempo real, ver sua posição no <strong>Ranking</strong> e lutar na <strong>Arena Versus</strong> contra qualquer desenvolvedor.
        </p>

        {/* Current Connected User Badge */}
        {connectedUser ? (
          <div className="mb-6 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <img
                src={connectedUser.avatarUrl}
                alt={connectedUser.name}
                className="h-12 w-12 rounded-xl object-cover ring-2 ring-emerald-500"
                referrerPolicy="no-referrer"
              />
              <div>
                <div className="text-xs font-bold text-emerald-400">Conta Ativa</div>
                <div className="text-sm font-extrabold text-white">{connectedUser.name}</div>
                <div className="text-xs text-slate-400 font-semibold">@{connectedUser.username} · {connectedUser.combatPower.toLocaleString('pt-BR')} CP</div>
              </div>
            </div>

            <button
              onClick={handleDisconnect}
              className="flex items-center gap-1 text-xs text-rose-400 hover:text-rose-300 font-bold px-2.5 py-1.5 rounded-lg border border-rose-500/20 hover:bg-rose-500/10 transition-colors"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>Desconectar</span>
            </button>
          </div>
        ) : null}

        {/* Form */}
        <form onSubmit={handleConnect} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              Seu nome de usuário no GitHub:
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-2.5 text-sm font-bold text-slate-500">@</span>
              <input
                type="text"
                value={usernameInput}
                onChange={(e) => setUsernameInput(e.target.value)}
                placeholder="ex: adriancamargo"
                required
                className="w-full rounded-xl border border-slate-700 bg-[#090d16] py-2.5 pl-8 pr-3 text-sm font-bold text-white placeholder-slate-600 focus:border-emerald-500 focus:outline-none transition-colors"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-slate-400">
                GitHub Personal Token (opcional para 5.000 req/h):
              </label>
              <a
                href="https://github.com/settings/tokens"
                target="_blank"
                rel="noreferrer"
                className="text-[11px] text-sky-400 hover:underline flex items-center gap-0.5"
              >
                <span>Criar token</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
            <input
              type="password"
              value={tokenInput}
              onChange={(e) => setTokenInput(e.target.value)}
              placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
              className="w-full rounded-xl border border-slate-700 bg-[#090d16] py-2 px-3 text-xs font-bold text-white placeholder-slate-600 focus:border-emerald-500 focus:outline-none transition-colors"
            />
          </div>

          {errorMessage && (
            <div className="text-xs text-rose-400 font-semibold p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20">
              {errorMessage}
            </div>
          )}

          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary rounded-xl px-4 py-2 text-xs font-bold"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary rounded-xl px-5 py-2 text-xs font-black uppercase flex items-center gap-1.5 disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  <span>Conectando...</span>
                </>
              ) : (
                <>
                  <span>Conectar GitHub</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
