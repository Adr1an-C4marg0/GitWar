import { DuelHistoryItem, SquadGoal } from '../types';

const STORAGE_KEY_DUEL_HISTORY = 'gitclash_duel_history_v1';
const STORAGE_KEY_SQUAD_GOAL = 'gitclash_squad_goal_v1';

export function getDuelHistory(): DuelHistoryItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_DUEL_HISTORY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function recordDuel(
  type: 'dev' | 'repo',
  fighterA: { username: string; name: string; avatarUrl: string; combatPower: number },
  fighterB: { username: string; name: string; avatarUrl: string; combatPower: number },
  winner: 'A' | 'B' | 'DRAW',
  scoreMargin: number
): DuelHistoryItem[] {
  try {
    const history = getDuelHistory();
    const cleanA = fighterA.username.toLowerCase();
    const cleanB = fighterB.username.toLowerCase();

    // Evita duplicar o mesmo duelo registrado em menos de 10 segundos
    const now = Date.now();
    const recentDuplicate = history.find(
      (h) =>
        h.type === type &&
        now - h.timestamp < 10000 &&
        ((h.fighterA.username.toLowerCase() === cleanA && h.fighterB.username.toLowerCase() === cleanB) ||
          (h.fighterA.username.toLowerCase() === cleanB && h.fighterB.username.toLowerCase() === cleanA))
    );

    if (recentDuplicate) {
      return history;
    }

    const newItem: DuelHistoryItem = {
      id: `duel-${now}-${Math.random().toString(36).substring(2, 6)}`,
      timestamp: now,
      type,
      fighterA,
      fighterB,
      winner,
      scoreMargin: Math.abs(scoreMargin)
    };

    const updated = [newItem, ...history].slice(0, 50);
    localStorage.setItem(STORAGE_KEY_DUEL_HISTORY, JSON.stringify(updated));
    return updated;
  } catch {
    return [];
  }
}

export interface HeadToHeadStats {
  winsA: number;
  winsB: number;
  draws: number;
  total: number;
  lastDuel?: DuelHistoryItem;
}

export function getHeadToHead(
  usernameA: string,
  usernameB: string,
  type: 'dev' | 'repo'
): HeadToHeadStats {
  const history = getDuelHistory();
  const cleanA = usernameA.toLowerCase().trim().replace(/^@/, '');
  const cleanB = usernameB.toLowerCase().trim().replace(/^@/, '');

  let winsA = 0;
  let winsB = 0;
  let draws = 0;
  let total = 0;
  let lastDuel: DuelHistoryItem | undefined = undefined;

  for (const item of history) {
    if (item.type !== type) continue;

    const itemA = item.fighterA.username.toLowerCase().trim().replace(/^@/, '');
    const itemB = item.fighterB.username.toLowerCase().trim().replace(/^@/, '');

    if (itemA === cleanA && itemB === cleanB) {
      total++;
      if (!lastDuel) lastDuel = item;
      if (item.winner === 'A') winsA++;
      else if (item.winner === 'B') winsB++;
      else draws++;
    } else if (itemA === cleanB && itemB === cleanA) {
      total++;
      if (!lastDuel) lastDuel = item;
      if (item.winner === 'A') winsB++; // item.fighterA era B
      else if (item.winner === 'B') winsA++;
      else draws++;
    }
  }

  return { winsA, winsB, draws, total, lastDuel };
}

export function clearDuelHistory(): void {
  try {
    localStorage.removeItem(STORAGE_KEY_DUEL_HISTORY);
  } catch {}
}

export function getSquadGoalTarget(): number {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_SQUAD_GOAL);
    if (!raw) return 60; // Meta padrão: 60 commits por semana
    const parsed = parseInt(raw, 10);
    return isNaN(parsed) || parsed <= 0 ? 60 : parsed;
  } catch {
    return 60;
  }
}

export function setSquadGoalTarget(target: number): void {
  try {
    localStorage.setItem(STORAGE_KEY_SQUAD_GOAL, target.toString());
  } catch {}
}
