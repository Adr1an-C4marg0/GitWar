import React from 'react';
import { Volume2, VolumeX, Swords, Trophy, Flame, User, LogIn } from 'lucide-react';
import { DevFighter } from '../types';
import { audio16bit } from '../utils/audio16bit';

interface NavbarProps {
  activeTab: 'devs' | 'friends' | 'ranking';
  setActiveTab: (tab: 'devs' | 'friends' | 'ranking') => void;
  isMuted: boolean;
  onToggleMute: () => void;
  onOpenConnectModal: () => void;
  connectedUser: DevFighter | null;
  topStreak: number;
  friendsCount?: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  isMuted,
  onToggleMute,
  onOpenConnectModal,
  connectedUser,
  topStreak,
  friendsCount = 0
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-[#090d16]/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        
        {/* Brand */}
        <button
          onClick={() => {
            audio16bit.playTap();
            setActiveTab('devs');
          }}
          className="flex items-center gap-2.5 text-left group"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500 text-slate-950 font-black shadow-sm group-hover:scale-105 transition-transform">
            <Swords className="h-5 w-5" />
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-lg font-black tracking-tight text-white">GitClash</span>
            <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
              Versus
            </span>
          </div>
        </button>

        {/* Navigation Tabs */}
        <nav className="hidden md:flex items-center gap-1 rounded-xl bg-slate-900/80 p-1 border border-slate-800">
          <button
            onClick={() => {
              audio16bit.playTap();
              setActiveTab('devs');
            }}
            className={`flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-bold transition-all ${
              activeTab === 'devs'
                ? 'bg-slate-800 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Swords className="h-3.5 w-3.5 text-emerald-400" />
            <span>Duelo Versus</span>
          </button>

          <button
            onClick={() => {
              audio16bit.playTap();
              setActiveTab('friends');
            }}
            className={`flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-bold transition-all ${
              activeTab === 'friends'
                ? 'bg-slate-800 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <User className="h-3.5 w-3.5 text-amber-400" />
            <span>Amigos</span>
            {friendsCount > 0 && (
              <span className="rounded-full bg-slate-800 px-1.5 py-0.2 text-[10px] text-slate-300">
                {friendsCount}
              </span>
            )}
          </button>


          <button
            onClick={() => {
              audio16bit.playTap();
              setActiveTab('ranking');
            }}
            className={`flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-bold transition-all ${
              activeTab === 'ranking'
                ? 'bg-slate-800 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Trophy className="h-3.5 w-3.5 text-amber-400" />
            <span>Ranking & Ligas</span>
          </button>
        </nav>

        {/* User Account & Actions */}
        <div className="flex items-center gap-2.5">
          {/* User Streak */}
          <div
            className="flex items-center gap-1.5 rounded-xl border border-amber-500/20 bg-amber-500/10 px-2.5 py-1 text-xs font-bold text-amber-400"
            title="Seu Strike de commits diários"
          >
            <Flame className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
            <span>{connectedUser ? `${connectedUser.currentStreak}d` : `${topStreak}d`}</span>
          </div>

          {/* Sound Toggle */}
          <button
            onClick={onToggleMute}
            aria-label={isMuted ? 'Ativar som' : 'Silenciar'}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-800 bg-slate-900 text-slate-400 hover:text-white transition-colors"
          >
            {isMuted ? <VolumeX className="h-3.5 w-3.5 text-rose-400" /> : <Volume2 className="h-3.5 w-3.5 text-emerald-400" />}
          </button>

          {/* Connect Account Button / User Profile Pill */}
          {connectedUser ? (
            <button
              onClick={onOpenConnectModal}
              className="flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-xs font-bold text-white hover:bg-emerald-500/20 transition-all"
            >
              <img
                src={connectedUser.avatarUrl}
                alt={connectedUser.name}
                className="h-6 w-6 rounded-lg object-cover ring-1 ring-emerald-500"
                referrerPolicy="no-referrer"
              />
              <span className="hidden sm:inline">@{connectedUser.username}</span>
            </button>
          ) : (
            <button
              onClick={onOpenConnectModal}
              className="btn-primary rounded-xl px-3.5 py-1.5 text-xs font-extrabold flex items-center gap-1.5 uppercase"
            >
              <LogIn className="h-3.5 w-3.5" />
              <span>Conectar Conta</span>
            </button>
          )}
        </div>
      </div>

      {/* Mobile nav */}
      <div className="flex md:hidden border-t border-slate-800/80 bg-[#090d16] px-3 py-2 gap-1.5 text-xs font-bold justify-around overflow-x-auto">
        <button
          onClick={() => { audio16bit.playTap(); setActiveTab('devs'); }}
          className={`px-2.5 py-1 rounded-lg whitespace-nowrap ${activeTab === 'devs' ? 'bg-slate-800 text-white' : 'text-slate-400'}`}
        >
          Versus
        </button>
        <button
          onClick={() => { audio16bit.playTap(); setActiveTab('friends'); }}
          className={`px-2.5 py-1 rounded-lg whitespace-nowrap ${activeTab === 'friends' ? 'bg-slate-800 text-amber-400' : 'text-slate-400'}`}
        >
          Amigos
        </button>
        <button
          onClick={() => { audio16bit.playTap(); setActiveTab('ranking'); }}
          className={`px-2.5 py-1 rounded-lg whitespace-nowrap ${activeTab === 'ranking' ? 'bg-slate-800 text-white' : 'text-slate-400'}`}
        >
          Ranking
        </button>
      </div>
    </header>
  );
};
