let xp = 0;
let health = 100;
let gold = 50;
let currentWeapon = 0;
let fighting;
let monsterHealth;
let inventory = ["stick"];
let level = 1;
const MAX_LEVEL = 10;
const MAX_GOLD = 500;
let slimesDefeated = 0;
let dragonDefeated = false;
let monstersDefeated = 0;
let playerName = "Adventurer";
let playerAppearance = "warrior";

const button1 = document.querySelector('#button1');
const button2 = document.querySelector("#button2");
const button3 = document.querySelector("#button3");
const button4 = document.querySelector("#button4");
const button5 = document.querySelector("#button5");
const button6 = document.querySelector("#button6");
const button7 = document.querySelector("#button7");
const button8 = document.querySelector("#button8");
const button9 = document.querySelector("#button9");
const text = document.querySelector("#text");
const xpText = document.querySelector("#xpText");
const healthText = document.querySelector("#healthText");
const goldText = document.querySelector("#goldText");
const monsterStats = document.querySelector("#monsterStats");
const monsterName = document.querySelector("#monsterName");
const monsterHealthText = document.querySelector("#monsterHealth");

const weapons = [
  { name: 'stick', power: 5 },
  { name: 'dagger', power: 30 },
  { name: 'claw hammer', power: 50 },
  { name: 'bow', power: 75 },
  { name: 'axe', power: 80 },
  { name: 'crossbow', power: 90 },
  { name: 'trident', power: 110 },
  { name: 'sword', power: 100 },
  { name: 'mace', power: 120 },
  { name: 'magic staff', power: 150 }
];

const monsters = [
  { name: "slime", level: 2, health: 15, weakness: "fire" },
  { name: "fanged beast", level: 8, health: 60, weakness: "ice" },
  { name: "dragon", level: 20, health: 300, weakness: "lightning" },
  { name: "ghost", level: 5, health: 30, weakness: "holy" },
  { name: "goblin", level: 3, health: 20, weakness: "physical" }
];

const quests = [
  { description: "Defeat 3 slimes", completed: false, reward: 50 },
  { description: "Collect 100 gold", completed: false, reward: 100 },
  { description: "Defeat the dragon", completed: false, reward: 200 }
];

const classes = [
  { name: "warrior", health: 120, power: 10 },
  { name: "mage", health: 80, power: 20 },
  { name: "rogue", health: 100, power: 15 }
];
let playerClass = classes[0]; // Default to warrior

const difficulties = [
  { name: "easy", monsterHealthMultiplier: 0.8, goldMultiplier: 1 },
  { name: "medium", monsterHealthMultiplier: 1, goldMultiplier: 1.5 },
  { name: "hard", monsterHealthMultiplier: 1.5, goldMultiplier: 2 }
];
let difficulty = difficulties[0]; // Default to easy

const achievements = [
  { name: "Monster Slayer", condition: "defeat 10 monsters", unlocked: false },
  { name: "Wealthy Adventurer", condition: "collect 500 gold", unlocked: false }
];

const leaderboard = [];

// Locations array
const locations = [
  {
    name: "town square",
    "button text": ["Go to store", "Go to cave", "Fight dragon"],
    "button functions": [goStore, goCave, fightDragon],
    text: "You are in the town square. You see a sign that says \"Store\"."
  },
  {
    name: "store",
    "button text": ["Buy 10 health (10 gold)", "Buy weapon (30 gold)", "Go to town square"],
    "button functions": [buyHealth, buyWeapon, goTown],
    text: "You enter the store."
  },
  {
    name: "cave",
    "button text": ["Fight slime", "Fight fanged beast", "Go to town square"],
    "button functions": [fightSlime, fightBeast, goTown],
    text: "You enter the cave. You see some monsters."
  },
  {
    name: "fight",
    "button text": ["Attack", "Dodge", "Run"],
    "button functions": [attack, dodge, goTown],
    text: "You are fighting a monster."
  },
  {
    name: "kill monster",
    "button text": ["Go to town square", "Go to town square", "Go to town square"],
    "button functions": [goTown, goTown, easterEgg],
    text: 'The monster screams "Arg!" as it dies. You gain experience points and find gold.'
  },
  {
    name: "lose",
    "button text": ["REPLAY?", "REPLAY?", "REPLAY?"],
    "button functions": [restart, restart, restart],
    text: "You die. &#x2620;"
  },
  { 
    name: "win", 
    "button text": ["REPLAY?", "REPLAY?", "REPLAY?"], 
    "button functions": [restart, restart, restart], 
    text: "You defeat the dragon! YOU WIN THE GAME! &#x1F389;" 
  },
  {
    name: "easter egg",
    "button text": ["2", "8", "Go to town square?"],
    "button functions": [pickTwo, pickEight, goTown],
    text: "You find a secret game. Pick a number above. Ten numbers will be randomly chosen between 0 and 10. If the number you choose matches one of the random numbers, you win!"
  }
];

// Initialize buttons
button1.onclick = goStore;
button2.onclick = goCave;
button3.onclick = fightDragon;
button4.onclick = showQuests;
button5.onclick = playMiniGame;
button6.onclick = setDifficulty;
button7.onclick = saveGame;
button8.onclick = loadGame;
button9.onclick = customizePlayer;

function update(location) {
  monsterStats.style.display = "none";
  button1.innerText = location["button text"][0];
  button2.innerText = location["button text"][1];
  button3.innerText = location["button text"][2];
  button1.onclick = location["button functions"][0];
  button2.onclick = location["button functions"][1];
  button3.onclick = location["button functions"][2];
  text.innerHTML = location.text;
}

function goTown() {
  update(locations[0]);
}

function goStore() {
  update(locations[1]);
}

function goCave() {
  update(locations[2]);
}

function buyHealth() {
  if (gold >= 10) {
    gold -= 10;
    health += 10;
    goldText.innerText = gold;
    healthText.innerText = health;
    updateBars();
  } else {
    text.innerText = "You do not have enough gold to buy health.";
  }
}

function buyWeapon() {
  if (currentWeapon < weapons.length - 1) {
    if (gold >= 30) {
      gold -= 30;
      currentWeapon++;
      goldText.innerText = gold;
      let newWeapon = weapons[currentWeapon].name;
      text.innerText = "You now have a " + newWeapon + ".";
      inventory.push(newWeapon);
      text.innerText += " In your inventory you have: " + inventory;
    } else {
      text.innerText = "You do not have enough gold to buy a weapon.";
    }
  } else {
    text.innerText = "You already have the most powerful weapon!";
    button2.innerText = "Sell weapon for 15 gold";
    button2.onclick = sellWeapon;
  }
}

function sellWeapon() {
  if (inventory.length > 1) {
    gold += 15;
    goldText.innerText = gold;
    let currentWeapon = inventory.shift();
    text.innerText = "You sold a " + currentWeapon + ".";
    text.innerText += " In your inventory you have: " + inventory;
  } else {
    text.innerText = "Don't sell your only weapon!";
  }
}

function fightSlime() {
  fighting = 0;
  goFight();
}

function fightBeast() {
  fighting = 1;
  goFight();
}

function fightDragon() {
  fighting = 2;
  goFight();
}

function goFight() {
  update(locations[3]);
  monsterHealth = monsters[fighting].health;
  monsterStats.style.display = "block";
  monsterName.innerText = monsters[fighting].name;
  monsterHealthText.innerText = monsterHealth;
}

function attack() {
  text.innerText = "The " + monsters[fighting].name + " attacks.";
  text.innerText += " You attack it with your " + weapons[currentWeapon].name + ".";
  health -= getMonsterAttackValue(monsters[fighting].level);
  if (isMonsterHit()) {
    monsterHealth -= weapons[currentWeapon].power + Math.floor(Math.random() * xp) + 1;    
  } else {
    text.innerText += " You miss.";
  }
  healthText.innerText = health;
  monsterHealthText.innerText = monsterHealth;

  updateBars();

  if (health <= 0) {
    lose();
  } else if (monsterHealth <= 0) {
    if (fighting === 2) {
      winGame();
    } else {
      defeatMonster();
    }
  }
  if (Math.random() <= .1 && inventory.length !== 1) {
    text.innerText += " Your " + inventory.pop() + " breaks.";
    currentWeapon--;
  }
}

function getMonsterAttackValue(level) {
  const hit = (level * 5) - (Math.floor(Math.random() * xp));
  console.log(hit);
  return hit > 0 ? hit : 0;
}

function isMonsterHit() {
  return Math.random() > .2 || health < 20;
}

function dodge() {
  text.innerText = "You dodge the attack from the " + monsters[fighting].name;
}

function defeatMonster() {
  let monsterGold = Math.floor(monsters[fighting].level * 5); 
  gold += monsterGold;
  xp += monsters[fighting].level * 3; 
  if (xp > 200) xp = 200;
  levelUp();
  updateBars();
  update(locations[4]);
}

function lose() {
  update(locations[5]);
}

function winGame() {
  update(locations[6]);
  xpText.innerText = xp; 
  updateBars();
}

function restart() {
  xp = 0;
  health = 100;
  gold = 50;
  currentWeapon = 0;
  inventory = ["stick"];
  goldText.innerText = gold;
  healthText.innerText = health;
  xpText.innerText = xp;
  goTown();
}

function easterEgg() {
  update(locations[7]);
}

function pickTwo() {
  pick(2);
}

function pickEight() {
  pick(8);
}

function pick(guess) {
  const numbers = [];
  while (numbers.length < 10) {
      numbers.push(Math.floor(Math.random() * 11));
  }
  text.innerText = "You picked " + guess + ". Here are the random numbers:\n";
  for (let i = 0; i < 10; i++) {
      text.innerText += numbers[i] + "\n";
  }
  if (numbers.includes(guess)) {
      text.innerText += "Right! You win 20 gold!";
      gold += 20;
  } else {
      text.innerText += "Wrong! You lose 10 health!";
      health = Math.max(0, health - 10); 
  }
  updateBars();
  if (health <= 0) {
      lose();
  }
}

function updateBars() {
  document.querySelector("#healthBar div").style.width = health + "%";
  document.querySelector("#xpBar div").style.width = Math.min((xp / 200) * 100, 100) + "%";
  document.querySelector("#goldBar div").style.width = Math.min((gold / MAX_GOLD) * 100, 100) + "%";
  document.querySelector("#bottomHealthText").innerText = "Health: " + health;
  document.querySelector("#bottomXpText").innerText = "XP: " + xp + " (Level " + level + ")";
  document.querySelector("#bottomGoldText").innerText = "Gold: " + gold;
}

function levelUp() {
  if (xp >= 100) {
      level++;
      xp = 0;
      health += 20; 
      gold += 20;
      alert("You leveled up to Level " + level + "!");
      if (level === MAX_LEVEL) {
        alert("You have reached the maximum level!");
      }
  }
}

function showQuests() {
  text.innerText = "Active Quests:\n";
  quests.forEach((quest, index) => {
    if (!quest.completed) {
      text.innerText += `${quest.description}\n`;
    }
  });
}

function playMiniGame() {
  if (gold < 20) {
    text.innerText = "You need at least 20 gold to play the mini-game!";
    return; 
  }

  text.innerText = "You are gambling 10 gold for a chance to win 50 gold or lose 10 gold. Do you want to proceed?";
  button5.innerText = "Yes";
  button5.onclick = confirmMiniGame;
}

function confirmMiniGame() {
  const guess = Math.floor(Math.random() * 10);
  if (guess === 5) {
    text.innerText = "You won 50 gold!";
    gold += 50;
  } else {
    text.innerText = "You lost 10 gold!";
    gold -= 10;
  }
  updateBars();
  button5.innerText = "Play Mini-Game";
  button5.onclick = playMiniGame;
}

function setDifficulty() {
  text.innerHTML = `
    <h3>Choose a difficulty level:</h3>
    <form id="difficultyForm">
      <label>
        <input type="radio" name="difficulty" value="easy" checked> Easy
      </label><br>
      <label>
        <input type="radio" name="difficulty" value="medium"> Medium
      </label><br>
      <label>
        <input type="radio" name="difficulty" value="hard"> Hard
      </label><br>
      <button type="button" onclick="applyDifficulty()">Confirm</button>
    </form>
  `;
}

function applyDifficulty() {
  const selectedDifficulty = document.querySelector('input[name="difficulty"]:checked').value;
  difficulty = difficulties.find(d => d.name === selectedDifficulty);
  text.innerText = `Difficulty set to ${difficulty.name}.`;
}

function saveGame() {
  localStorage.setItem("gameState", JSON.stringify({ xp, health, gold, currentWeapon, inventory, level }));
  text.innerText = "Game saved!";
}

function loadGame() {
  const gameState = JSON.parse(localStorage.getItem("gameState"));
  if (gameState) {
    xp = gameState.xp;
    health = gameState.health;
    gold = gameState.gold;
    currentWeapon = gameState.currentWeapon;
    inventory = gameState.inventory;
    level = gameState.level;
    updateBars();
    text.innerText = "Game loaded!";
  } else {
    text.innerText = "No saved game found.";
  }
}

function customizePlayer() {
  playerName = prompt("Enter your character's name:");
  playerAppearance = prompt("Choose your appearance (warrior, mage, rogue):");
  text.innerText = `You are now ${playerName}, the ${playerAppearance}!`;
}

updateBars();
