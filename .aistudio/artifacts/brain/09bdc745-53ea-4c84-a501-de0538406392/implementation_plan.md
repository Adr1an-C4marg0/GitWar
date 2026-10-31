# GitClash 16-bit — Arena Gamificada de Projetos e Contribuições GitHub

Uma plataforma interativa que transforma métricas reais do GitHub (commits, streaks, pull requests, issues fechadas, estrelas e velocidade de contribuição) em batalhas de RPG Arcade 16-bit retrô-modernas, com ranking dinâmico em tempo real, sistema de strikes/streaks, avisos de risco de perda de posição e notificações épicas de ultrapassagem.

---

### Decisões Confirmadas com o Usuário

> [!IMPORTANT]
> - **Modos de Batalha**: Suporte completo a **Batalha de Desenvolvedores** (XP de commits, sequência/streak de dias ativos, taxa de PRs, HP e mana de código) e **Confronto de Repositórios** (velocidade de estrelas, forks, issues resolvidas, frequência de releases).
> - **Fonte de Dados do GitHub**: Conexão em tempo real com a **API pública do GitHub**, munida de um **Modo Demo Rápido** (batalhas pré-configuradas entre lendas do open source como Linus Torvalds, Dan Abramov, Evan You, e projetos como React vs Vue, Tailwind vs Bootstrap) além de campo opcional para Personal Access Token (para contornar os 60 req/h da API sem autenticação).
> - **Estética Visual e Efeitos**: **Arcade RPG Moderno & Minimalista Retrô 16-bit**, paleta dark limpa com contrastes em verde terminal (`#10B981`), âmbar CRT (`#F59E0B`), violeta mana (`#8B5CF6`) e rubi arcade (`#EF4444`), tipografia pixel/display (`Press Start 2P` e `Space Mono` / `Plus Jakarta Sans`) e **sintetizador de áudio Web Audio API 16-bit** integrado (com efeitos sonoros de hit, level up, overtake fanfare, streak flame e toggle mudo).

---

## 1. Visão Geral e Conceito Central

- **O que faz**: Permite comparar quaisquer dois ou mais usuários do GitHub ou repositórios open-source em formato de duelo gamificado. Calcula poder de combate (CP - Combat Power), nível de RPG (Lvl 1 a 99), streaks consecutivas de commits ("Strikes"), bônus por dias ativos e monitoramento de ranking com alerta imediato quando um competidor ultrapassa outro.
- **Público-alvo**: Desenvolvedores, equipes de tecnologia, streamers de dev, comunidades open-source e entusiastas que querem transformar a rotina de commits em competição saudável e visualmente estimulante.
- **Diferencial**: Ao invés de tabelas sem vida, as estatísticas viram barras de vida, magias de commit, alertas animados de ultrapassagem com buzina/fanfarra 16-bit e cards compartilháveis de batalha.

---

## 2. Experiência do Usuário e Design Visual

### Fluxos Principais
1. **Lobby & Quick Battle**:
   - Barra de busca de desenvolvedor (`@username`) ou repositório (`owner/repo`), com chips rápidos de demonstração (ex: Torvalds vs Carmack, React vs Vue, Deno vs Bun).
   - Validação imediata de existência no GitHub e busca assíncrona de eventos, commits recentes e perfil.
2. **Arena de Duelo (Battle View)**:
   - Dois lutadores/repositórios frente a frente com avatares estilizados com molduras 16-bit.
   - Barras de HP/Energia baseadas em consistência de commits e atividade nos últimos 30/365 dias.
   - Comparador métrica por métrica:
     - Streak de Contribuições (Dias ininterruptos / Strikes ativos).
     - Total de Commits & PRs (Dano/Impacto gerado).
     - Estrelas & Forks (Defesa e Reputação da guilda).
     - Índice de Velocidade (Commits/semana).
   - Animação de impacto: cada métrica vencida disfere um "hit" com partículas e som retrô no oponente.
3. **Quadro de Líderes e Ticker de Ultrapassagens (Leaderboard & Overtake Alerts)**:
   - Ranking global com posições, divisões de liga (Bronze, Prata, Ouro, Mestre, Grão-Mestre).
   - Feed ao vivo de ultrapassagens (*"Dan Abramov acabou de ultrapassar Evan You na Liga Ouro (+120 XP)!"*).
   - Banner de alerta de "Strike em Perigo": avisa se o desenvolvedor ainda não commitou hoje e está prestes a perder sua sequência.
4. **Laboratório de Simulação e Desafio (Overclock / Overtake Simulator)**:
   - Permite simular: *"Quantos commits/estrelas faltam para o Player A ultrapassar o Player B?"* com cálculo de tempo estimado e meta gamificada.

### Identidade Visual & Design System
- **Fundo**: Base profunda em ardósia grafite arcade (`#0B0F19`), com grade sutil pontilhada CRT e molduras nítidas de 1px sem excessos.
- **Tipografia**:
  - Títulos e Placar: Fonte pixel display retrô limpa aliada a numerais tabulares monoespaçados (`tabular-nums`).
  - Textos de leitura e estatísticas: Sans-serif moderna e legível (`Plus Jakarta Sans`), garantindo contraste WCAG AA.
- **Áudio 16-bit**:
  - Sintetizado nativamente via `AudioContext` sem depender de arquivos `.mp3` externos pesados ou quebrados:
    - *Coin/Click*: Onda quadrada de subida de tom (440Hz -> 880Hz).
    - *Hit/Clash*: Onda dente de serra com decaimento rápido de ruído branco.
    - *Overtake Alarm / Level Up*: Arpeggio de 4 notas 16-bit com fanfarra vitoriosa.
    - Botão global no topo para Ligar/Desligar áudio (`Mute / Unmute`) com estado salvo em `localStorage`.

---

## 3. Decisões de Produto & Arquitetura

### A. Integração com a API do GitHub e Caching Inteligente
- **Estratégia**: Chamadas diretas à API pública do GitHub (`https://api.github.com/users/{user}`, `https://api.github.com/users/{user}/events`, `https://api.github.com/repos/{owner}/{repo}`).
- **Resiliência a Rate Limit**:
  - Armazenamento em memória/`localStorage` com TTL de 15 minutos para evitar requisições repetidas.
  - Mock/Demo fallback automático com dados ricos e fiéis caso a API do GitHub retorne HTTP 403 (Rate limit exceeded).
  - Modal discreto para inserção de GitHub Personal Token (PAT) para usuários que desejam analisar dezenas de repositórios sem limite.

### B. Fórmula de Pontuação Gamificada (RPG Combat Power)
- `CP = (CommitsRecentes * 15) + (StreakAtual * 50) + (StarsRecebidas * 10) + (PRsAceitos * 25) + (Seguidores * 5)`.
- `Level = Math.floor(Math.sqrt(CP / 50)) + 1` (escala suave de RPG até Level 99).
- `Strike Rank`:
  - 1-3 dias: *Fagulha Iniciante* (🔥)
  - 4-7 dias: *Combo em Chamas* (🔥🔥)
  - 8-30 dias: *Tempestade de Código* (⚡⚡)
  - 30+ dias: *Lenda Imortal* (👑✨)

---

## 4. Diagrama de Arquitetura e Fluxo de Componentes

```
┌────────────────────────────────────────────────────────────────────────┐
│                        Top Navigation Bar                              │
│  [ GitClash 16-bit ]   [ Duelo | Ranking | Ultrapassagens | Docs ] [🔊]│
└────────────────────────────────────────────────────────────────────────┘
                                    │
    ┌───────────────────────────────┴───────────────────────────────┐
    ▼                                                               ▼
┌──────────────────────────────┐              ┌───────────────────────────┐
│     Modo de Confronto        │              │   Ticker de Ultrapassagem │
│  [ Dev Battle | Repo Clash ] │              │  Feed em tempo real com   │
└──────────────┬───────────────┘              │  notificações sonoras     │
               ▼                              └───────────────────────────┘
┌──────────────────────────────────────────────┐
│            Arena Head-to-Head                │
│ ┌──────────────────┐    ┌──────────────────┐ │
│ │  Player A Card   │ VS │  Player B Card   │ │
│ │  HP / XP / Lvl   │    │  HP / XP / Lvl   │ │
│ │  Strikes / Badges│    │  Strikes / Badges│ │
│ └─────────┬────────┘    └─────────┬────────┘ │
│           └───────────┬───────────┘          │
│                       ▼                      │
│            Calculadora de Impacto            │
│       Vencedor por Rounds & Estatísticas     │
│       Simulador: O que falta pra virar?      │
└──────────────────────────────────────────────┘
                        │
                        ▼
┌──────────────────────────────────────────────┐
│           Quadro de Líderes (Rank)           │
│  Top Desenvolvedores & Top Projetos          │
│  Indicador de ultrapassagem iminente (⚠️)    │
│  Aviso de Strike em Perigo (< 12h restantes) │
└──────────────────────────────────────────────┘
```

---

## 5. Verificação e Critérios de Aceite

1. **Batalha Funcional**: Capacidade de buscar qualquer par de usuários ou repositórios GitHub e gerar o confronto com barras dinâmicas.
2. **Modo Demo Rápido**: Botões de 1 clique para carregar duelos épicos instantaneamente sem necessidade de digitação.
3. **Sistema de Strikes**: Contagem precisa de dias consecutivos de commits com avisos de risco de perda da sequência.
4. **Notificações de Ultrapassagem**: Ticker dinâmico simulado e acionável com alertas sonoros sintetizados 16-bit e banners visuais.
5. **Responsividade & Acessibilidade**: Interface fluida em mobile e desktop, controles em linha única, zero dead-clicks e controle total de áudio.
