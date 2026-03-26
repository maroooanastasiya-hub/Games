class Player {
  constructor(name) {
    this.name = name.trim();
    this.score = 0;
  }

  addPoint() {
    this.score += 1;
  }
}

window.Player = Player;
