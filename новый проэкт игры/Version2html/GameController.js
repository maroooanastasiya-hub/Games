/* eslint no-constant-condition: "off" */

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

class GameController {
  constructor(model, view) {
    this.model = model;
    this.view = view;
    this.maxRounds = 10;
  }

  async run() {
    this.view.startNewRound();
    this.view.printLine('Добро пожаловать в игру "Правда или действие"!');
    await this.playerSetupLoop();

    if (!this.model.hasPlayers()) {
      this.view.printLine('Игроки не добавлены. Выход.');
      this.view.close();
      return;
    }

    let currentRound = 0;

    while (currentRound < this.maxRounds) {
      this.view.startNewRound();
      this.view.printLine(`\nРаунд ${currentRound + 1} из ${this.maxRounds}`);
      const actionChoice = await this.view.promptChoice(['Бросить кубик', 'Завершить игру']);

      if (actionChoice === 'Завершить игру') {
        break;
      }

      currentRound += 1;
      const selectedPlayer = this.model.players[Math.floor(Math.random() * this.model.players.length)];
      this.view.printLine(`Выбран игрок: ${selectedPlayer.name}`);

      const choice = await this.getChoiceTruthOrAction(selectedPlayer);
      if (choice === 'правда') {
        await this.handleTruth(selectedPlayer);
      } else {
        await this.handleAction(selectedPlayer);
      }
    }

    this.view.startNewRound();
    this.view.displayLeaderboard(this.model.leaderboard());
    this.view.printLine('Спасибо за игру!');
    this.view.close();
  }

  async playerSetupLoop() {
    while (true) {
      const choice = await this.view.promptChoice(['Добавить игрока', 'Начать игру', 'Выйти']);

      if (choice === 'Добавить игрока') {
        const name = await this.view.prompt('Введите имя игрока: ');
        if (this.model.addPlayer(name)) {
          this.view.printLine(`Игрок '${name}' добавлен.`);
        } else {
          this.view.printLine('Неверное имя или игрок с таким именем уже существует.');
        }
      } else if (choice === 'Начать игру') {
        if (!this.model.hasPlayers()) {
          this.view.printLine('Сначала добавьте хотя бы одного игрока.');
          continue;
        }
        break;
      } else if (choice === 'Выйти') {
        break;
      }
    }
  }

  async rollDiceAnimation(player) {
    const frames = ['🎲', '⚀', '⚁', '⚂', '⚃', '⚄', '⚅'];
    this.view.printLine(`${player.name} бросает кубик...`);
    for (let i = 0; i < 15; i++) {
      const symbol = frames[Math.floor(Math.random() * frames.length)];
      // Обновляем текущий раунд
      this.view.rounds[this.view.currentRoundIndex] = this.view.rounds[this.view.currentRoundIndex].replace(/\n[^\n]*$/, '\n' + symbol + ' ');
      this.view.updateDisplay();
      await sleep(80);
    }
    // Убираем последний символ
    this.view.rounds[this.view.currentRoundIndex] = this.view.rounds[this.view.currentRoundIndex].replace(/\n[^\n]*$/, '\n');
    this.view.updateDisplay();
  }

  async getChoiceTruthOrAction(player) {
    await this.rollDiceAnimation(player);
    const dice = Math.floor(Math.random() * 6) + 1;
    this.view.printLine(`Выпало: ${dice}`);

    if (dice === 1 || dice === 2) {
      this.view.printLine('Результат: правда');
      return 'правда';
    }

    if (dice === 3 || dice === 4) {
      this.view.printLine('Результат: действие');
      return 'действие';
    }

    const choice = await this.view.promptChoice(['правда', 'действие']);
    return choice;
  }

  async handleTruth(player) {
    const q = this.model.questions[Math.floor(Math.random() * this.model.questions.length)];
    this.view.printLine(`Вопрос: ${q.text}`);
    const answer = (await this.view.prompt('Ваш ответ: ')).toLowerCase();
    if (answer === q.answer) {
      player.addPoint();
      this.view.printLine('Правильно! +1 очко');
    } else {
      this.view.printLine(`Неправильно. Правильный ответ: ${q.answer}`);
    }
  }

  async handleAction(player) {
    const action = this.model.actions[Math.floor(Math.random() * this.model.actions.length)];
    this.view.printLine(`Действие: ${action.text}`);
    const done = await this.view.promptChoice(['да', 'нет']);
    if (done === 'да') {
      player.addPoint();
      this.view.printLine('Отлично! +1 очко');
    } else {
      this.view.printLine('Хорошо, идем дальше.');
    }
  }
}

window.GameController = GameController;
