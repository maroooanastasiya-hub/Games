class GameModel {
  constructor() {
    this.players = [];
    this.questions = [];
    this.actions = [];
  }

  async init(dataFilePath = 'data.json') {
    await this.loadData(dataFilePath);
    return this;
  }

  async loadData(dataFilePath) {
    try {
      const response = await fetch(dataFilePath);
      if (!response.ok) throw new Error('Failed to load data');
      const data = await response.json();

      if (Array.isArray(data.questions) && data.questions.length > 0) {
        this.questions = data.questions.map((q) => new Question(q.text, q.answer));
      }
      if (Array.isArray(data.actions) && data.actions.length > 0) {
        this.actions = data.actions.map((a) => new Action(a.text));
      }

      if (this.questions.length === 0 || this.actions.length === 0) {
        this.loadDefaultData();
      }
    } catch (error) {
      // Файл не существует или повреждён, используем данные по умолчанию
      this.loadDefaultData();
    }
  }

  loadDefaultData() {
    this.questions = [
      new Question('Столица Франции?', 'париж'),
      new Question('2+2=?', '4'),
      new Question('Сколько сторон у треугольника?', '3'),
      new Question('Какой язык программирования мы сейчас используем?', 'javascript'),
      new Question('Сколько букв в слове "кот"?', '3'),
    ];

    this.actions = [
      new Action('Сделать 5 отжиманий'),
      new Action('Спеть короткую песню'),
      new Action('Прыгнуть на месте 10 раз'),
      new Action('Рассказать анекдот'),
      new Action('Станцевать 10 секунд'),
    ];
  }

  addPlayer(name) {
    const trimmed = name.trim();
    if (!trimmed) return false;
    if (this.players.some((p) => p.name.toLowerCase() === trimmed.toLowerCase())) return false;
    this.players.push(new Player(trimmed));
    return true;
  }

  hasPlayers() {
    return this.players.length > 0;
  }

  leaderboard() {
    return [...this.players].sort((a, b) => b.score - a.score);
  }
}

window.GameModel = GameModel;
