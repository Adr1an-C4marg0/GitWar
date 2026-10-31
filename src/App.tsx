/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { OvertakeTicker } from './components/OvertakeTicker';
import { BattleArena } from './components/BattleArena';
import { Leaderboard } from './components/Leaderboard';
import { FriendsArena } from './components/FriendsArena';
import { ConnectAccountModal } from './components/ConnectAccountModal';
import { 
  DEMO_DEVS, 
  DEMO_REPOS,
  INITIAL_OVERTAKES, 
  INITIAL_STRIKE_ALERTS, 
  fetchGithubUser, 
  fetchGithubRepo,
  fetchUserFriends,
  getStoredGitHubToken,
  getStoredConnectedUser
} from './services/githubApi';
import { DevFighter, FriendFighter, RepoFighter, OvertakeNotification, StrikeAlert } from './types';
import { audio16bit } from './utils/audio16bit';

export default function App() {
  const [activeTab, setActiveTab] = useState<'devs' | 'friends' | 'ranking'>('devs');
  const [isMuted, setIsMuted] = useState(audio16bit.getMuted());
  const [isConnectModalOpen, setIsConnectModalOpen] = useState(false);
  const [hasCustomToken, setHasCustomToken] = useState(!!getStoredGitHubToken());

  // Conta do usuário conectado
  const [connectedUser, setConnectedUser] = useState<DevFighter | null>(getStoredConnectedUser());
  const [friends, setFriends] = useState<FriendFighter[]>([]);
  const [isLoadingFriends, setIsLoadingFriends] = useState(false);

  const [devsList, setDevsList] = useState<DevFighter[]>(() => {
    const saved = getStoredConnectedUser();
    if (saved) {
      return [saved, ...DEMO_DEVS.filter(d => d.username.toLowerCase() !== saved.username.toLowerCase())];
    }
    return DEMO_DEVS;
  });

  const [fighterA, setFighterA] = useState<DevFighter>(() => getStoredConnectedUser() || DEMO_DEVS[0]);
  const [fighterB, setFighterB] = useState<DevFighter>(DEMO_DEVS[1]);

  const [overtakes, setOvertakes] = useState<OvertakeNotification[]>(INITIAL_OVERTAKES.filter(o => o.type === 'dev'));
  const [strikeAlerts, setStrikeAlerts] = useState<StrikeAlert[]>(INITIAL_STRIKE_ALERTS);

  const [isLoadingDevs, setIsLoadingDevs] = useState(false);
  const [devError, setDevError] = useState<string | null>(null);

  const [repoA, setRepoA] = useState<RepoFighter>(DEMO_REPOS[0]);
  const [repoB, setRepoB] = useState<RepoFighter>(DEMO_REPOS[1]);
  const [isLoadingRepos, setIsLoadingRepos] = useState(false);
  const [repoError, setRepoError] = useState<string | null>(null);

  const loadFriends = async (username: string) => {
    setIsLoadingFriends(true);
    try {
      const res = await fetchUserFriends(username);
      setFriends(res);

      // Adicionar amigos na lista geral de devs para o leaderboard
      setDevsList((prev) => {
        const existingLogins = new Set(prev.map((d) => d.username.toLowerCase()));
        const newFriends = res.filter((f) => !existingLogins.has(f.username.toLowerCase()));
        return [...prev, ...newFriends];
      });
    } catch {
      setFriends([]);
    } finally {
      setIsLoadingFriends(false);
    }
  };

  useEffect(() => {
    if (connectedUser?.username) {
      loadFriends(connectedUser.username);
    }
  }, [connectedUser?.username]);

  const handleToggleMute = () => {
    const muted = audio16bit.toggleMute();
    setIsMuted(muted);
  };

  // Quando o usuário conecta ou desconecta sua conta
  const handleUserConnected = (user: DevFighter | null) => {
    setConnectedUser(user);
    setHasCustomToken(!!getStoredGitHubToken());

    if (user) {
      setFighterA(user);
      setDevsList((prev) => {
        const next = prev.filter((d) => d.username.toLowerCase() !== user.username.toLowerCase());
        return [user, ...next];
      });
      loadFriends(user.username);
    } else {
      setFighterA(DEMO_DEVS[0]);
      setFriends([]);
    }
  };

  const handleUseMyAccount = () => {
    if (connectedUser) {
      setFighterA(connectedUser);
      audio16bit.playTap();
    }
  };

  const handleSearchDevs = async (usernameA: string, usernameB: string) => {
    setIsLoadingDevs(true);
    setDevError(null);

    const knownPool: DevFighter[] = [
      ...(connectedUser ? [connectedUser] : []),
      ...friends,
      ...devsList,
      ...DEMO_DEVS
    ];

    try {
      const [userA, userB] = await Promise.all([
        fetchGithubUser(usernameA, knownPool),
        fetchGithubUser(usernameB, knownPool)
      ]);

      setFighterA(userA);
      setFighterB(userB);

      setDevsList((prev) => {
        const next = [...prev];
        if (!next.some((d) => d.username.toLowerCase() === userA.username.toLowerCase())) {
          next.push(userA);
        }
        if (!next.some((d) => d.username.toLowerCase() === userB.username.toLowerCase())) {
          next.push(userB);
        }
        return next;
      });

      audio16bit.playSuccess();
    } catch (err: any) {
      setDevError(err?.message || 'Falha ao buscar usuários do GitHub.');
      audio16bit.playWarning();
    } finally {
      setIsLoadingDevs(false);
    }
  };

  const handleSearchRepos = async (nameA: string, nameB: string) => {
    setIsLoadingRepos(true);
    setRepoError(null);
    try {
      const [rA, rB] = await Promise.all([
        fetchGithubRepo(nameA),
        fetchGithubRepo(nameB)
      ]);
      setRepoA(rA);
      setRepoB(rB);
      audio16bit.playSuccess();
    } catch (err: any) {
      setRepoError(err?.message || 'Falha ao buscar repositórios do GitHub.');
      audio16bit.playWarning();
    } finally {
      setIsLoadingRepos(false);
    }
  };

  const handleChallengeDev = (targetDev: DevFighter) => {
    setActiveTab('devs');
    if (connectedUser && connectedUser.username.toLowerCase() !== targetDev.username.toLowerCase()) {
      setFighterA(connectedUser);
      setFighterB(targetDev);
    } else {
      setFighterB(targetDev);
    }
    setDevError(null);
    audio16bit.playTap();
  };

  const handleChallengeFriend = (friend: FriendFighter) => {
    setActiveTab('devs');
    if (connectedUser && connectedUser.username.toLowerCase() !== friend.username.toLowerCase()) {
      setFighterA(connectedUser);
      setFighterB(friend);
    } else {
      setFighterB(friend);
    }
    setDevError(null);
    audio16bit.playTap();
  };

  const maxStreak = Math.max(...devsList.map(d => d.currentStreak));

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-slate-950">
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
        onOpenConnectModal={() => {
          audio16bit.playTap();
          setIsConnectModalOpen(true);
        }}
        connectedUser={connectedUser}
        topStreak={maxStreak}
        friendsCount={friends.length}
      />

      {/* Discrete Notification Strip */}
      <OvertakeTicker
        overtakes={overtakes}
        strikeAlerts={strikeAlerts}
        onSelectBattle={(uA, uB) => {
          setActiveTab('devs');
          handleSearchDevs(uA, uB);
        }}
      />

      {/* Main Container */}
      <main className="flex-1 mx-auto w-full max-w-6xl px-4 sm:px-6 py-8">
        {activeTab === 'devs' && (
          <BattleArena
            fighterA={fighterA}
            fighterB={fighterB}
            onSearchUser={handleSearchDevs}
            isLoading={isLoadingDevs}
            errorMessage={devError}
            onSelectPresets={(uA, uB) => handleSearchDevs(uA, uB)}
            connectedUser={connectedUser}
            onUseMyAccount={handleUseMyAccount}
            friends={friends}
            repoA={repoA}
            repoB={repoB}
            onSearchRepo={handleSearchRepos}
            isLoadingRepos={isLoadingRepos}
            repoErrorMessage={repoError}
            onSelectRepoPresets={(rA, rB) => handleSearchRepos(rA, rB)}
          />
        )}

        {activeTab === 'friends' && (
          <FriendsArena
            connectedUser={connectedUser}
            friends={friends}
            isLoadingFriends={isLoadingFriends}
            onOpenConnectModal={() => setIsConnectModalOpen(true)}
            onChallengeFriend={handleChallengeFriend}
          />
        )}

        {activeTab === 'ranking' && (
          <Leaderboard
            devs={devsList}
            strikeAlerts={strikeAlerts}
            onChallengeDev={handleChallengeDev}
            connectedUser={connectedUser}
            friends={friends}
          />
        )}
      </main>

      {/* Clean Minimalist Footer */}
      <footer className="border-t border-slate-800/80 bg-[#070a10] py-6 text-center text-xs text-slate-500 font-medium">
        <div className="mx-auto max-w-6xl px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span>GitClash Versus · Comparações limpas e gamificadas do GitHub</span>
          <div className="flex items-center gap-4 text-slate-400">
            {connectedUser ? (
              <span className="text-emerald-400 font-bold">Conectado como @{connectedUser.username}</span>
            ) : (
              <button
                onClick={() => setIsConnectModalOpen(true)}
                className="text-emerald-400 hover:underline font-bold"
              >
                Conectar seu perfil do GitHub
              </button>
            )}
            <span>·</span>
            <span>Duelo Versus</span>
            <span>·</span>
            <span>Amigos</span>
            <span>·</span>
            <span>Ranking & Ligas</span>
          </div>
        </div>
      </footer>

      {/* Connect Account Modal */}
      <ConnectAccountModal
        isOpen={isConnectModalOpen}
        onClose={() => setIsConnectModalOpen(false)}
        connectedUser={connectedUser}
        onUserConnected={handleUserConnected}
      />
    </div>
  );
}
