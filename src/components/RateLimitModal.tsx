import React, { useState } from 'react';
import { ShieldAlert, Key, ExternalLink, X, Check, Zap, AlertTriangle, ArrowRight } from 'lucide-react';
import { setStoredGitHubToken, getStoredGitHubToken } from '../services/githubApi';
import { audio16bit } from '../utils/audio16bit';
import confetti from 'canvas-confetti';

interface RateLimitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTokenSavedAndRetry: () => void;
  actionDescription?: string;
}

export const RateLimitModal: React.FC<RateLimitModalProps> = ({
  isOpen,
  onClose,
  onTokenSavedAndRetry,
  actionDescription = 'esta ação'
}) => {
  const [tokenInput, setTokenInput] = useState(getStoredGitHubToken());
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanToken = tokenInput.trim();
    if (!cleanToken) {
      setErrorMsg('Por favor, cole o token gerado no GitHub.');
      return;
    }

    if (!cleanToken.startsWith('ghp_') && !cleanToken.startsWith('github_pat_')) {
      setErrorMsg('O token geralmente começa com "ghp_" ou "github_pat_". Verifique se copiou corretamente.');
      return;
    }

    setStoredGitHubToken(cleanToken);
    audio16bit.playLevelUp();
    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.6 },
      colors: ['#22c55e', '#38bdf8', '#ff9600']
    });

    onClose();
    // Repete a ação imediatamente com os 5.000 req/h liberados
    setTimeout(() => {
      onTokenSavedAndRetry();
    }, 150);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-lg clean-card p-6 sm:p-8 relative shadow-2xl border-amber-500/40">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-slate-400 hover:text-white transition-colors"
          title="Fechar aviso"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Warning Icon & Title */}
        <div className="flex items-center gap-3 mb-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-400 shrink-0">
            <ShieldAlert className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                Rate Limit Exceeded
              </span>
            </div>
            <h2 className="text-lg font-black text-white mt-0.5">
              Limite da API do GitHub Atingido (60 req/h)
            </h2>
          </div>
        </div>

        {/* Answer to the user's specific question */}
        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 mb-4 text-xs text-emerald-300 leading-relaxed">
          <strong className="block text-emerald-400 font-extrabold mb-0.5 flex items-center gap-1.5">
            <Zap className="h-3.5 w-3.5 shrink-0" />
            Sim, funciona na hora mesmo após o bloqueio!
          </strong>
          O bloqueio de 60 requisições por hora é do seu endereço de IP anônimo. Assim que você colar seu token abaixo, o GitHub reconhece sua conta e <strong>desbloqueia 5.000 requisições/hora imediatamente</strong>.
        </div>

        <p className="text-xs text-slate-400 mb-4 leading-relaxed">
          Para continuar {actionDescription} e usar o GitWar sem interrupções, gere um token gratuito no GitHub:
        </p>

        {/* 1-Click Fast Link */}
        <div className="mb-5 p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-3">
          <div className="text-xs text-slate-300">
            <span className="font-bold block text-white">Criar Token sem escopos (10 segundos):</span>
            <span className="text-[11px] text-slate-500">Não precisa marcar permissões especiais. Apenas clique em &quot;Generate token&quot;.</span>
          </div>
          <a
            href="https://github.com/settings/tokens/new?description=GitWar%20Versus&scopes="
            target="_blank"
            rel="noreferrer"
            className="btn-primary rounded-xl px-3 py-2 text-xs font-black shrink-0 flex items-center gap-1 shadow-sm whitespace-nowrap"
          >
            <span>Abrir no GitHub</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>

        {/* Token Input Form */}
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1.5">
              <Key className="h-3.5 w-3.5 text-emerald-400" />
              <span>Cole seu GitHub Personal Access Token:</span>
            </label>
            <input
              type="password"
              value={tokenInput}
              onChange={(e) => {
                setTokenInput(e.target.value);
                setErrorMsg(null);
              }}
              placeholder="ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
              required
              autoFocus
              className="w-full rounded-xl border border-slate-700 bg-[#090d16] py-2.5 px-3.5 text-xs font-bold text-white placeholder-slate-600 focus:border-emerald-500 focus:outline-none transition-colors"
            />
            <p className="text-[10px] text-slate-500 mt-1">
              O token é salvo exclusivamente no armazenamento local do seu navegador (localStorage).
            </p>
          </div>

          {errorMsg && (
            <div className="text-xs text-rose-400 font-semibold p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary rounded-xl px-4 py-2.5 text-xs font-bold"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn-primary rounded-xl px-5 py-2.5 text-xs font-black uppercase flex items-center gap-2 shadow-lg"
            >
              <Check className="h-4 w-4" />
              <span>Salvar e Desbloquear Agora</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
