import React, { useState } from 'react';
import { Key, Shield, X, Check, ExternalLink } from 'lucide-react';
import { getStoredGitHubToken, setStoredGitHubToken } from '../services/githubApi';
import { audio16bit } from '../utils/audio16bit';

interface TokenModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTokenUpdated: () => void;
}

export const TokenModal: React.FC<TokenModalProps> = ({
  isOpen,
  onClose,
  onTokenUpdated
}) => {
  const [tokenInput, setTokenInput] = useState(getStoredGitHubToken());
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    audio16bit.playSuccess();
    setStoredGitHubToken(tokenInput);
    setSavedSuccess(true);
    onTokenUpdated();
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1200);
  };

  const handleClear = () => {
    audio16bit.playTap();
    setStoredGitHubToken('');
    setTokenInput('');
    onTokenUpdated();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-md card-duo p-6 sm:p-7 relative shadow-2xl">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-slate-400 hover:text-white transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-2.5 text-amber-400 font-black text-sm mb-2">
          <Key className="h-5 w-5" />
          <span>CONFIGURAÇÃO DE TOKEN DO GITHUB</span>
        </div>

        <p className="text-xs sm:text-sm font-semibold text-slate-300 leading-relaxed mb-5">
          A API pública do GitHub limita requisições anônimas a <strong>60 por hora</strong>. Inserir um Personal Access Token gratuito aumenta seu limite para <strong>5.000 requisições por hora</strong>.
        </p>

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-400 mb-1.5">
              GitHub Personal Access Token (classic ou fine-grained):
            </label>
            <input
              type="password"
              value={tokenInput}
              onChange={(e) => setTokenInput(e.target.value)}
              placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
              className="w-full rounded-2xl border-2 border-slate-700 bg-slate-900 px-4 py-2.5 text-xs font-bold text-white placeholder-slate-600 focus:border-[#58cc02] focus:outline-none transition-colors"
            />
          </div>

          <div className="flex items-center justify-between text-xs font-bold text-slate-400">
            <span className="flex items-center gap-1.5 text-slate-300">
              <Shield className="h-4 w-4 text-[#58cc02]" />
              Salvo localmente no seu navegador
            </span>
            <a
              href="https://github.com/settings/tokens"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1 text-[#1cb0f6] hover:underline"
            >
              <span>Gerar no GitHub</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-800">
            {tokenInput && (
              <button
                type="button"
                onClick={handleClear}
                className="rounded-xl border border-rose-500/40 px-3.5 py-2 text-xs font-bold text-rose-300 hover:bg-rose-950/30 transition-colors"
              >
                Remover Token
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="btn-duo-slate rounded-xl px-4 py-2 text-xs font-bold"
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="btn-duo-green flex items-center gap-1.5 rounded-xl px-5 py-2 text-xs font-black uppercase"
            >
              {savedSuccess ? (
                <>
                  <Check className="h-4 w-4" />
                  <span>Salvo!</span>
                </>
              ) : (
                <span>Salvar Token</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
