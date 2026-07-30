(() => {
  "use strict";

  const data = window.gameData;
  const app = document.getElementById("app");
  const resumeDialog = document.getElementById("resume-dialog");
  const resetDialog = document.getElementById("reset-dialog");
  const toast = document.getElementById("toast");

  const STORAGE_KEY = "sarah-bachelorette-trivia-v1";
  const HISTORY_LIMIT = 30;
  const DEFAULT_TEAMS = ["Team 1", "Team 2"];
  const COLUMN_COLORS = ["#f79bca", "#f47fbb", "#f363ad", "#ec559f", "#ef3293"];

  const clueIndex = new Map();
  data.categories.forEach((category, categoryIndex) => {
    category.clues.forEach((clue) => {
      clueIndex.set(clue.id, { clue, category, categoryIndex });
    });
  });

  let state = createInitialState();
  let history = [];
  let pendingSavedGame = null;
  let toastTimer = null;

  function createInitialState() {
  return {
    version: 1,
    screen: "title",
    currentClueId: null,
    answerRevealed: false,
    selectedTeam: 0,
    teams: [
      { name: "Team 1", score: 0 },
      { name: "Team 2", score: 0 }
    ],
    completedClues: []
  };
}

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function normalizeState(candidate) {
    const fallback = createInitialState();
    if (!candidate || typeof candidate !== "object") return fallback;

    const validScreens = new Set(["title", "rules", "board", "clue"]);
    const teams = Array.isArray(candidate.teams) && candidate.teams.length === 2
  ? candidate.teams.map((team, index) => ({
      name: DEFAULT_TEAMS[index],
      score: Number.isFinite(Number(team.score)) ? Number(team.score) : 0
    }))
  : fallback.teams;

    const completedClues = Array.isArray(candidate.completedClues)
      ? [...new Set(candidate.completedClues.filter((id) => clueIndex.has(id)))]
      : [];

    const currentClueId = clueIndex.has(candidate.currentClueId) ? candidate.currentClueId : null;
    const screen = validScreens.has(candidate.screen) ? candidate.screen : "title";

    return {
      version: 1,
      screen: screen === "clue" && !currentClueId ? "board" : screen,
      currentClueId,
      answerRevealed: Boolean(candidate.answerRevealed && currentClueId),
      selectedTeam: candidate.selectedTeam === 1 ? 1 : 0,
      teams,
      completedClues
    };
  }

  function loadSavedGame() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      return {
        state: normalizeState(parsed.state),
        history: Array.isArray(parsed.history)
          ? parsed.history.slice(-HISTORY_LIMIT).map(normalizeState)
          : []
      };
    } catch (error) {
      console.warn("Could not load saved game:", error);
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }
  }

  function saveProgress() {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ state, history, updatedAt: new Date().toISOString() })
      );
    } catch (error) {
      console.warn("Could not save game progress:", error);
      showToast("Progress could not be saved in this browser.");
    }
  }

  function clearSavedGame() {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.warn("Could not clear saved game:", error);
    }
  }

  function hasMeaningfulProgress(savedState) {
    return (
      savedState.screen !== "title" ||
      savedState.completedClues.length > 0 ||
      savedState.teams.some((team, index) => team.score !== 0 || team.name !== DEFAULT_TEAMS[index])
    );
  }

  function commit(mutator, message = "") {
    history.push(clone(state));
    if (history.length > HISTORY_LIMIT) history.shift();
    mutator(state);
    saveProgress();
    render();
    if (message) showToast(message);
  }

  function undo() {
    if (!history.length) {
      showToast("Nothing to undo.");
      return;
    }
    state = normalizeState(history.pop());
    saveProgress();
    render();
    showToast("Last action undone.");
  }

  function currentClueRecord() {
    return state.currentClueId ? clueIndex.get(state.currentClueId) : null;
  }

  function escapeHtml(value) {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function iconButton(icon, label, action, extra = "") {
    return `
      <button class="icon-button" type="button" data-action="${action}" aria-label="${escapeHtml(label)}" title="${escapeHtml(label)}" ${extra}>
        <img src="assets/icons/${icon}.svg" alt="" aria-hidden="true" />
      </button>
    `;
  }

  function render() {
    switch (state.screen) {
      case "rules":
        app.innerHTML = renderRulesScreen();
        break;
      case "board":
        app.innerHTML = renderBoardScreen();
        break;
      case "clue":
        app.innerHTML = renderClueScreen();
        break;
      case "title":
      default:
        app.innerHTML = renderTitleScreen();
        break;
    }
  }

  function renderTitleScreen() {
  return `
    <section class="app-stage image-screen title-screen" aria-label="Sarah's Bachelorette Trivia title screen">
      <button
        class="image-screen__button"
        type="button"
        data-action="show-rules"
        aria-label="Begin the game"
      >
        <img
          class="image-screen__image"
          src="./assets/images/title-screen.png"
          alt="Sarah's Bachelorette Trivia"
        />
      </button>

      <button
        class="title-fullscreen-button"
        type="button"
        data-action="fullscreen"
        aria-label="Toggle full screen"
      >
        <img
          src="./assets/icons/fullscreen.svg"
          alt=""
          aria-hidden="true"
        />
      </button>
    </section>
  `;
}

  function renderRulesScreen() {
  return `
    <section class="app-stage image-screen" aria-label="Game rules">
      <img
        class="image-screen__image"
        src="./assets/images/rules-screen.png"
        alt="Rules for Sarah's Bachelorette Trivia"
      />

      <div class="rules-controls rules-controls--continue">
        <button
          class="button button-primary"
          type="button"
          data-action="start-board"
        >
          Continue
        </button>
      </div>
    </section>
  `;
}

  function renderScoreCard(team, index) {
    const selectedClass = state.selectedTeam === index ? " is-selected" : "";
    return `
      <section class="score-card${selectedClass}" data-select-team="${index}" aria-label="${escapeHtml(team.name)} score ${team.score}">
        <div class="score-card__identity">
          <span class="score-card__name">${escapeHtml(team.name)}</span>
        </div>
        <div>
          <div class="score-card__score">${team.score}</div>
          <div class="score-adjusters" aria-label="Manual score adjustment">
            <button type="button" data-adjust-score="-100" data-team="${index}" aria-label="Subtract 100 from ${escapeHtml(team.name)}">−</button>
            <button type="button" data-adjust-score="100" data-team="${index}" aria-label="Add 100 to ${escapeHtml(team.name)}">+</button>
          </div>
        </div>
      </section>
    `;
  }

  function renderGlobalControls({ includeBoard = false, includeHome = false } = {}) {
    return `
      <nav class="game-controls" aria-label="Game controls">
        ${includeBoard ? iconButton("home", "Return to board and complete clue", "return-board") : ""}
        ${includeHome ? iconButton("title", "Return to title screen", "return-title") : ""}
        ${iconButton("undo", "Undo last action", "undo", history.length ? "" : "disabled")}
        ${iconButton("fullscreen", document.fullscreenElement ? "Exit full screen" : "Enter full screen", "fullscreen")}
        ${iconButton("reset", "Reset game", "reset")}
        <span class="progress-pill">${state.completedClues.length} / ${clueIndex.size} clues</span>
      </nav>
    `;
  }

  function renderBoardScreen() {
    const tiles = [];
    data.categories.forEach((category, categoryIndex) => {
      const color = COLUMN_COLORS[categoryIndex];
      tiles.push(`
        <div class="category-title" style="--tile-color:${color}">${escapeHtml(category.name)}</div>
      `);
    });

    for (let row = 0; row < 6; row += 1) {
      data.categories.forEach((category, categoryIndex) => {
        const clue = category.clues[row];
        const used = state.completedClues.includes(clue.id);
        tiles.push(`
          <button
            class="clue-tile"
            type="button"
            style="--tile-color:${COLUMN_COLORS[categoryIndex]}"
            data-clue-id="${clue.id}"
            aria-label="${escapeHtml(category.name)}, ${clue.value} points${used ? ", completed" : ""}"
            ${used ? "disabled" : ""}
          >${clue.value}</button>
        `);
      });
    }

    const allComplete = state.completedClues.length === clueIndex.size;
    return `
      <section class="app-stage board-screen" aria-label="Trivia game board">
        <header class="game-topbar">
          ${renderScoreCard(state.teams[0], 0)}
          ${renderGlobalControls()}
          ${renderScoreCard(state.teams[1], 1)}
        </header>
        <div class="board-grid">${tiles.join("")}</div>
        ${allComplete ? renderEndBanner() : ""}
      </section>
    `;
  }

  function renderEndBanner() {
    const [teamOne, teamTwo] = state.teams;
    let result;
    if (teamOne.score === teamTwo.score) {
      result = `It’s a tie at ${teamOne.score} points!`;
    } else {
      const winner = teamOne.score > teamTwo.score ? teamOne : teamTwo;
      result = `${winner.name} wins with ${winner.score} points!`;
    }
    return `
      <aside class="end-banner" aria-label="Game complete">
        <h2>Game Complete!</h2>
        <p>${escapeHtml(result)}</p>
      </aside>
    `;
  }

  function renderClueScreen() {
    const record = currentClueRecord();
    if (!record) {
      state.screen = "board";
      state.currentClueId = null;
      state.answerRevealed = false;
      saveProgress();
      return renderBoardScreen();
    }

    const { clue, category } = record;
    const image = state.answerRevealed
      ? clue.answerImage || clue.questionImage
      : clue.questionImage;
    const hasImage = Boolean(image);

    return `
      <section class="app-stage clue-screen" aria-label="${escapeHtml(category.name)} for ${clue.value} points">
        <header class="clue-topbar">
          <div class="clue-heading">${escapeHtml(category.name)} <strong>— ${clue.value}</strong></div>
          ${renderGlobalControls({ includeBoard: true, includeHome: true })}
        </header>
        <div class="clue-layout">
          <div class="clue-content${hasImage ? " has-image" : ""}">
            ${hasImage ? `
              <div class="clue-image-wrap">
                <img class="clue-image" src="${escapeHtml(image)}" alt="Visual clue for ${escapeHtml(category.name)}" />
              </div>
            ` : ""}
            ${renderClueCopy(clue)}
          </div>
          ${renderClueActions(clue)}
        </div>
      </section>
    `;
  }

  function renderClueCopy(clue) {
    if (!state.answerRevealed) {
      return `
        <div class="clue-copy is-question">
          <div>${escapeHtml(clue.question)}</div>
        </div>
      `;
    }

    const answer = resolveAnswer(clue);
    const countdownClass = clue.answerType === "countdown" ? " countdown-answer" : "";
    return `
      <div class="clue-copy is-answer${countdownClass}">
        <span class="answer-label">Answer</span>
        <div>${escapeHtml(answer)}</div>
        ${clue.answerNote ? `<p class="answer-note">${escapeHtml(clue.answerNote)}</p>` : ""}
      </div>
    `;
  }

  function renderClueActions(clue) {
    if (clue.answerType === "superlative") {
      return `
        <div class="clue-actions">
          <button class="button button-primary reveal-button" type="button" data-action="return-board">Complete Clue &amp; Return to Board</button>
          <p class="keyboard-hint">Category #2 is the exception: this clue has no fixed answer slide.</p>
        </div>
      `;
    }

    if (!state.answerRevealed) {
      return `
        <div class="clue-actions">
          <button class="button button-primary reveal-button" type="button" data-action="reveal-answer">Reveal Answer</button>
          <p class="keyboard-hint">Space reveals the answer · B returns to the board</p>
        </div>
      `;
    }

    return `
      <div class="clue-actions">
        <div class="scoring-group" aria-label="Score this clue">
          ${state.teams.map((team, index) => `
            <button class="score-action correct" type="button" data-score-team="${index}" data-score-delta="${clue.value}">
              ${escapeHtml(team.name)} Correct (+${clue.value})
            </button>
            <button class="score-action incorrect" type="button" data-score-team="${index}" data-score-delta="-${clue.value}">
              ${escapeHtml(team.name)} Incorrect (−${clue.value})
            </button>
          `).join("")}
        </div>
        <div class="clue-footer-row">
          <button class="button button-primary" type="button" data-action="return-board">Return to Board</button>
        </div>
        <p class="keyboard-hint">Select a team with 1 or 2 · + / − applies this clue’s value · Ctrl+Z undoes</p>
      </div>
    `;
  }

  function resolveAnswer(clue) {
    if (clue.answerType === "countdown") {
      return `${calendarDaysUntilWedding()} Days!`;
    }
    return clue.answer || "";
  }

  function calendarDaysUntilWedding() {
    const weddingDatePart = data.weddingDate.slice(0, 10);
    const [weddingYear, weddingMonth, weddingDay] = weddingDatePart.split("-").map(Number);
    const todayParts = datePartsInTimeZone(new Date(), data.weddingTimeZone);
    const weddingUtc = Date.UTC(weddingYear, weddingMonth - 1, weddingDay);
    const todayUtc = Date.UTC(todayParts.year, todayParts.month - 1, todayParts.day);
    return Math.round((weddingUtc - todayUtc) / 86_400_000);
  }

  function datePartsInTimeZone(date, timeZone) {
    const parts = new Intl.DateTimeFormat("en-US", {
      timeZone,
      year: "numeric",
      month: "numeric",
      day: "numeric"
    }).formatToParts(date);
    const lookup = Object.fromEntries(parts.map((part) => [part.type, part.value]));
    return {
      year: Number(lookup.year),
      month: Number(lookup.month),
      day: Number(lookup.day)
    };
  }

  function openClue(clueId) {
    if (!clueIndex.has(clueId) || state.completedClues.includes(clueId)) return;
    commit((draft) => {
      draft.screen = "clue";
      draft.currentClueId = clueId;
      draft.answerRevealed = false;
    });
  }

  function revealAnswer() {
    const record = currentClueRecord();
    if (!record || state.answerRevealed || record.clue.answerType === "superlative") return;
    commit((draft) => {
      draft.answerRevealed = true;
    });
  }

  function returnToBoard({ complete = true } = {}) {
    if (state.screen !== "clue") {
      commit((draft) => {
        draft.screen = "board";
      });
      return;
    }

    const clueId = state.currentClueId;
    commit((draft) => {
      if (complete && clueId && !draft.completedClues.includes(clueId)) {
        draft.completedClues.push(clueId);
      }
      draft.screen = "board";
      draft.currentClueId = null;
      draft.answerRevealed = false;
    });
  }

  function selectTeam(index) {
    if (![0, 1].includes(index) || state.selectedTeam === index) return;
    commit((draft) => {
      draft.selectedTeam = index;
    }, `${state.teams[index].name} selected.`);
  }

  function adjustScore(teamIndex, delta) {
    if (![0, 1].includes(teamIndex) || !Number.isFinite(delta) || delta === 0) return;
    const teamName = state.teams[teamIndex].name;
    commit((draft) => {
      draft.teams[teamIndex].score += delta;
      draft.selectedTeam = teamIndex;
    }, `${teamName} ${delta > 0 ? "+" : ""}${delta}`);
  }

  async function toggleFullscreen() {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
      render();
    } catch (error) {
      console.warn("Fullscreen unavailable:", error);
      showToast("Full screen is unavailable in this browser.");
    }
  }

  function showResetDialog() {
    if (typeof resetDialog.showModal === "function") {
      resetDialog.showModal();
    } else if (window.confirm("Reset the entire game? This will clear all scores and used clues.")) {
      resetGame();
    }
  }

function resetGame() {
  state = createInitialState();
  history = [];
  clearSavedGame();
  render();
  showToast("Game reset.");
}

  function returnToTitle() {
    commit((draft) => {
      draft.screen = "title";
      draft.currentClueId = null;
      draft.answerRevealed = false;
    });
  }

  function showToast(message) {
    window.clearTimeout(toastTimer);
    toast.textContent = message;
    toast.classList.add("is-visible");
    toastTimer = window.setTimeout(() => {
      toast.classList.remove("is-visible");
    }, 1800);
  }

  app.addEventListener("click", (event) => {
    const scoreAdjuster = event.target.closest("[data-adjust-score]");
    if (scoreAdjuster) {
      event.stopPropagation();
      adjustScore(Number(scoreAdjuster.dataset.team), Number(scoreAdjuster.dataset.adjustScore));
      return;
    }

    const scoreAction = event.target.closest("[data-score-team]");
    if (scoreAction) {
      adjustScore(Number(scoreAction.dataset.scoreTeam), Number(scoreAction.dataset.scoreDelta));
      return;
    }

    const teamCard = event.target.closest("[data-select-team]");
    if (teamCard && !event.target.matches("input, button")) {
      selectTeam(Number(teamCard.dataset.selectTeam));
      return;
    }

    const clueTile = event.target.closest("[data-clue-id]");
    if (clueTile) {
      openClue(clueTile.dataset.clueId);
      return;
    }

    const actionElement = event.target.closest("[data-action]");
    if (!actionElement || actionElement.disabled) return;

    switch (actionElement.dataset.action) {
      case "show-rules":
        commit((draft) => {
          draft.screen = "rules";
        });
        break;
      case "start-board":
        commit((draft) => {
          draft.screen = "board";
        });
        break;
      case "reveal-answer":
        revealAnswer();
        break;
      case "return-board":
        returnToBoard({ complete: true });
        break;
      case "return-title":
        returnToTitle();
        break;
      case "undo":
        undo();
        break;
      case "fullscreen":
        toggleFullscreen();
        break;
      case "reset":
        showResetDialog();
        break;
      default:
        break;
    }
  });

  document.addEventListener("keydown", (event) => {
    const target = event.target;
    const typing = target instanceof HTMLElement && (
      target.matches("input, textarea, select") || target.isContentEditable
    );
    if (typing) return;

    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "z") {
      event.preventDefault();
      undo();
      return;
    }

    if (event.key === "Escape") {
      if (resetDialog.open) resetDialog.close("cancel");
      if (resumeDialog.open) resumeDialog.close("cancel");
      return;
    }

    const key = event.key.toLowerCase();
    if (key === "f") {
      event.preventDefault();
      toggleFullscreen();
    } else if (key === "r") {
      event.preventDefault();
      showResetDialog();
    } else if (key === "h") {
      event.preventDefault();
      returnToTitle();
    } else if (key === "b") {
      event.preventDefault();
      returnToBoard({ complete: state.screen === "clue" });
    } else if (key === "1") {
      event.preventDefault();
      selectTeam(0);
    } else if (key === "2") {
      event.preventDefault();
      selectTeam(1);
    } else if (key === "+" || key === "=") {
      const record = currentClueRecord();
      if (record) {
        event.preventDefault();
        adjustScore(state.selectedTeam, record.clue.value);
      }
    } else if (key === "-" || key === "_") {
      const record = currentClueRecord();
      if (record) {
        event.preventDefault();
        adjustScore(state.selectedTeam, -record.clue.value);
      }
    } else if (event.code === "Space") {
      if (state.screen === "title") {
        event.preventDefault();
        commit((draft) => { draft.screen = "rules"; });
      } else if (state.screen === "rules") {
        event.preventDefault();
        commit((draft) => { draft.screen = "board"; });
      } else if (state.screen === "clue") {
        event.preventDefault();
        revealAnswer();
      }
    } else if ((event.key === "Enter" || event.key === "ArrowRight") && state.screen === "rules") {
      event.preventDefault();
      commit((draft) => { draft.screen = "board"; });
    }
  });

  resetDialog.addEventListener("close", () => {
    if (resetDialog.returnValue === "reset") resetGame();
  });

  resumeDialog.addEventListener("close", () => {
    if (resumeDialog.returnValue === "start-over") {
      pendingSavedGame = null;
      state = createInitialState();
      history = [];
      clearSavedGame();
      render();
    } else if (pendingSavedGame) {
      state = pendingSavedGame.state;
      history = pendingSavedGame.history;
      pendingSavedGame = null;
      render();
      showToast("Saved game resumed.");
    }
  });

  document.addEventListener("fullscreenchange", () => {
    if (state.screen === "board" || state.screen === "clue") render();
  });

  const savedGame = loadSavedGame();
  if (savedGame && hasMeaningfulProgress(savedGame.state)) {
    pendingSavedGame = savedGame;
    state = createInitialState();
    history = [];
    render();
    window.setTimeout(() => {
      if (typeof resumeDialog.showModal === "function") resumeDialog.showModal();
    }, 0);
  } else if (savedGame) {
    state = savedGame.state;
    history = savedGame.history;
    render();
  } else {
    render();
  }
})();