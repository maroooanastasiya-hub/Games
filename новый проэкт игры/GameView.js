const readline = require('readline');
const { promisify } = require('util');

class GameView {
  constructor() {
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    this.questionAsync = promisify(this.rl.question).bind(this.rl);
  }

  async prompt(question) {
    const answer = await this.questionAsync(question);
    return answer.trim();
  }

  printLine(text = '') {
    console.log(text);
  }

  displayLeaderboard(players) {
    console.log('\n=== Таблица лидеров ===');
    console.log('Имя\tОчки');
    players.forEach((p) => console.log(`${p.name}\t${p.score}`));
    console.log('=======================\n');
  }

  close() {
    this.rl.close();
  }
}

module.exports = GameView;
