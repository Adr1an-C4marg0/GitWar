export type BattleMode = 'DEVS' | 'REPOS';

export type Division = 'Grandmaster' | 'Master' | 'Diamond' | 'Platinum' | 'Gold' | 'Silver';

export interface DevFighter {
  username: string;
  name: string;
  avatarUrl: string;
  bio: string;
  company?: string;
  location?: string;
  publicRepos: number;
  followers: number;
  following: number;
  totalStars: number; // Soma de estrelas nos repositórios públicos
  totalCommitsYear: number;
  currentStreak: number; // in days (Strikes)
  longestStreak: number;
  hasCommittedToday: boolean;
  pullRequestsCount: number;
  issuesClosed: number;
  combatPower: number; // CP
  level: number;
  hp: number;
  maxHp: number;
  mana: number;
  maxMana: number;
  division: Division;
  primaryLanguage: string;
  recentActivityScore: number;
  isCustomOrLive?: boolean;
  hasRealProfileData?: boolean;
}

export interface FriendFighter extends DevFighter {
  isMutual: boolean; // true = seguidor mútuo, false = apenas seguindo
  isCollaborator?: boolean;
  nudgeSent?: boolean;
}

export interface RepoFighter {
  fullName: string;
  name: string;
  owner: string;
  avatarUrl: string;
  description: string;
  stars: number;
  forks: number;
  openIssues: number;
  watchers: number;
  language: string;
  weeklyCommitVelocity: number;
  totalCommits: number; // Volume de commits (Mais trabalhados)
  contributorsCount: number; // Pessoas que trabalharam nele
  pullRequestsCount: number; // Pull Requests registrados
  pushedAt?: string; // Última atualização
  releasesCount: number;
  combatPower: number;
  level: number;
  hp: number;
  maxHp: number;
  license?: string;
  isCustomOrLive?: boolean;
  resolvedFromDev?: string; // Se o repositório foi selecionado automaticamente a partir de um perfil de dev
}

export interface BattleMetric {
  id: string;
  label: string;
  iconName: string;
  valA: number | string;
  valB: number | string;
  rawA: number;
  rawB: number;
  winner: 'A' | 'B' | 'TIE';
  damage: number;
}

export interface BattleResult {
  winner: 'A' | 'B' | 'DRAW';
  scoreA: number;
  scoreB: number;
  criticalHitMetric?: string;
  summary: string;
  metrics: BattleMetric[];
}

export interface OvertakeNotification {
  id: string;
  timestamp: string;
  type: 'dev' | 'repo';
  leaderName: string;
  leaderAvatar: string;
  overtakenName: string;
  overtakenAvatar: string;
  margin: number;
  division: string;
  metricName: string;
}

export interface StrikeAlert {
  username: string;
  avatarUrl: string;
  currentStreak: number;
  status: 'safe' | 'warning' | 'critical';
  hoursRemaining: number;
  lastCommitMessage: string;
}

export interface DuelHistoryItem {
  id: string;
  timestamp: number;
  type: 'dev' | 'repo';
  fighterA: {
    username: string;
    name: string;
    avatarUrl: string;
    combatPower: number;
  };
  fighterB: {
    username: string;
    name: string;
    avatarUrl: string;
    combatPower: number;
  };
  winner: 'A' | 'B' | 'DRAW';
  scoreMargin: number;
}

export interface SquadGoal {
  targetCommits: number;
  lastUpdatedWeek: string;
}
