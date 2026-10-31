import React from 'react';
import { Zap, AlertTriangle, ChevronRight, X } from 'lucide-react';
import { OvertakeNotification, StrikeAlert } from '../types';
import { audio16bit } from '../utils/audio16bit';

interface OvertakeTickerProps {
  overtakes: OvertakeNotification[];
  strikeAlerts: StrikeAlert[];
  onSelectBattle: (userA: string, userB: string) => void;
}

export const OvertakeTicker: React.FC<OvertakeTickerProps> = ({
  overtakes,
  strikeAlerts,
  onSelectBattle
}) => {
  const latestOvertake = overtakes[0];
  const urgentStrike = strikeAlerts[0];

  if (!latestOvertake && !urgentStrike) return null;

  return (
    <div className="w-full border-b border-slate-800/60 bg-[#0d1320] py-2">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 sm:px-6 text-xs text-slate-300">
        
        {/* Left: Overtake Notice */}
        {latestOvertake && (
          <div className="flex items-center gap-2 truncate">
            <span className="flex h-5 items-center gap-1 rounded bg-emerald-500/10 px-2 font-bold text-emerald-400 shrink-0">
              <Zap className="h-3 w-3 fill-emerald-400" />
              Ultrapassagem
            </span>
            <span className="truncate">
              <strong className="text-white">@{latestOvertake.leaderName}</strong> ultrapassou{' '}
              <span className="text-slate-400">@{latestOvertake.overtakenName}</span> (+{latestOvertake.margin} XP)
            </span>
            <button
              onClick={() => {
                audio16bit.playTap();
                onSelectBattle(latestOvertake.leaderName, latestOvertake.overtakenName);
              }}
              className="text-emerald-400 font-bold hover:underline shrink-0 ml-1 inline-flex items-center gap-0.5"
            >
              <span>Ver duelo</span>
              <ChevronRight className="h-3 w-3" />
            </button>
          </div>
        )}

        {/* Right: Strike at risk */}
        {urgentStrike && (
          <div className="hidden sm:flex items-center gap-2 text-amber-300 shrink-0">
            <AlertTriangle className="h-3.5 w-3.5 text-amber-400 shrink-0" />
            <span>
              Strike de <strong className="text-white">@{urgentStrike.username}</strong> em risco ({urgentStrike.hoursRemaining}h restantes)
            </span>
          </div>
        )}

      </div>
    </div>
  );
};
