class GameView {
  constructor() {
    this.output = document.getElementById('output');
    this.input = document.getElementById('userInput');
    this.submitBtn = document.getElementById('submitBtn');
    this.buttonArea = document.getElementById('buttonArea');
    this.option1 = document.getElementById('option1');
    this.option2 = document.getElementById('option2');
    this.option3 = document.getElementById('option3');
    this.inputArea = document.getElementById('inputArea');
    this.leaderboardDiv = document.getElementById('leaderboard');
    this.leaderboardTable = document.getElementById('leaderboardTable').querySelector('tbody');
    this.navigation = document.getElementById('navigation');
    this.prevBtn = document.getElementById('prevBtn');
    this.nextBtn = document.getElementById('nextBtn');
    this.roundIndicator = document.getElementById('roundIndicator');
    this.currentResolve = null;
    this.rounds = [];
    this.currentRoundIndex = 0;
    this.setupNavigation();
  }

  setupNavigation() {
    this.prevBtn.onclick = () => this.goToPrevRound();
    this.nextBtn.onclick = () => this.goToNextRound();
  }

  startNewRound() {
    this.rounds.push('');
    this.currentRoundIndex = this.rounds.length - 1;
    this.updateDisplay();
    this.navigation.classList.remove('hidden');
  }

  printLine(text = '') {
    if (this.rounds.length === 0) {
      this.startNewRound();
    }
    this.rounds[this.currentRoundIndex] += text + '\n';
    this.updateDisplay();
  }

  updateDisplay() {
    this.output.textContent = this.rounds[this.currentRoundIndex] || '';
    this.output.scrollTop = this.output.scrollHeight;
    this.roundIndicator.textContent = `Раунд ${this.currentRoundIndex + 1} из ${this.rounds.length}`;
    this.prevBtn.disabled = this.currentRoundIndex === 0;
    this.nextBtn.disabled = this.currentRoundIndex === this.rounds.length - 1;
  }

  goToPrevRound() {
    if (this.currentRoundIndex > 0) {
      this.currentRoundIndex--;
      this.updateDisplay();
    }
  }

  goToNextRound() {
    if (this.currentRoundIndex < this.rounds.length - 1) {
      this.currentRoundIndex++;
      this.updateDisplay();
    }
  }

  async prompt(question) {
    this.printLine(question);
    this.inputArea.classList.remove('hidden');
    this.buttonArea.classList.add('hidden');
    this.input.focus();
    return new Promise((resolve) => {
      this.currentResolve = resolve;
      this.submitBtn.onclick = () => {
        const value = this.input.value.trim();
        this.input.value = '';
        this.inputArea.classList.add('hidden');
        resolve(value);
      };
      this.input.onkeypress = (e) => {
        if (e.key === 'Enter') {
          this.submitBtn.click();
        }
      };
    });
  }

  async promptChoice(options) {
    this.buttonArea.classList.remove('hidden');
    this.inputArea.classList.add('hidden');
    this.option1.textContent = options[0] || '';
    this.option2.textContent = options[1] || '';
    this.option3.textContent = options[2] || '';
    this.option1.classList.toggle('hidden', !options[0]);
    this.option2.classList.toggle('hidden', !options[1]);
    this.option3.classList.toggle('hidden', !options[2]);
    return new Promise((resolve) => {
      this.currentResolve = resolve;
      this.option1.onclick = () => resolve(options[0]);
      this.option2.onclick = () => resolve(options[1]);
      this.option3.onclick = () => resolve(options[2]);
    });
  }

  printLine(text = '') {
    this.output.textContent += text + '\n';
    this.output.scrollTop = this.output.scrollHeight;
  }

  displayLeaderboard(players) {
    this.leaderboardDiv.classList.remove('hidden');
    this.leaderboardTable.innerHTML = '';
    players.forEach(player => {
      const row = document.createElement('tr');
      row.innerHTML = `<td>${player.name}</td><td>${player.score}</td>`;
      this.leaderboardTable.appendChild(row);
    });
  }

  close() {
    // В браузере не нужно закрывать
  }
}

window.GameView = GameView;
