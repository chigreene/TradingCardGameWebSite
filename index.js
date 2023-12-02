function updateGameOutput(message) {
  const outputDiv = document.getElementById("gameOutput");
  outputDiv.innerHTML += message + "<br>"; // Append the message with a line break
  outputDiv.scrollTop = outputDiv.scrollHeight;
}

document.getElementById("clearOutput").addEventListener("click", function () {
  document.getElementById("gameOutput").innerHTML = "";
});

class Pokemon {
  constructor(name, attack, defense, health) {
    this.name = name;
    this.attack = attack;
    this.defense = defense;
    this.health = health;
  }
}

function generatePokemon() {
  const pokemonList = [];

  for (let i = 0; i < 50; i++) {
    const name = `Pokemon ${i + 1}`;
    const attack = Math.floor(Math.random() * 100) + 1;
    const defense = Math.floor(Math.random() * 100) + 1;
    const health = Math.floor(Math.random() * 100) + 1;

    const pokemon = new Pokemon(name, attack, defense, health);
    pokemonList.push(pokemon);
  }

  return pokemonList;
}

const pokemonList = generatePokemon();
// output generated pokemon to the screen in a string formatted to be readable
updateGameOutput(
  pokemonList
    .map(
      (pokemon) =>
        `Name: ${pokemon.name}, Attack: ${pokemon.attack}, Defense: ${pokemon.defense}, Health: ${pokemon.health}`
    )
    .join("<br>")
);

// shuffle generated pokemon so they can be randomly distributed to players
function shuffleArray(array) {
  let currentIndex = array.length;

  while (currentIndex !== 0) {
    const randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // Swap elements
    const temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

// distribute pokemon to players
function distributePokemon(pokemonList, player1, player2) {
  const shuffledPokemon = shuffleArray(pokemonList);
  player1.deck = shuffledPokemon.slice(0, 25);
  player2.deck = shuffledPokemon.slice(25, 50);
}

// async function executeUserTurn(player) {
//   // Display opponent's (computer's) active Pokémon
//   if (player.opponent.activePokemon) {
//     updateGameOutput(`Opponent's active pokemon:`);
//     updateGameOutput(
//       `${player.opponent.activePokemon.name} (Attack: ${player.opponent.activePokemon.attack}, Defense: ${player.opponent.activePokemon.defense}, Health: ${player.opponent.activePokemon.health})`
//     );
//   }

//   // Display opponent's (computer's) bench Pokémon
//   updateGameOutput(`Opponent's bench:`);
//   player.opponent.bench.forEach((pokemon, index) => {
//     updateGameOutput(
//       `${index}: ${pokemon.name} (Attack: ${pokemon.attack}, Defense: ${pokemon.defense}, Health: ${pokemon.health})`
//     );
//   });

//   updateGameOutput(`It's ${player.name}'s turn.`);
//   player.logHand();
//   player.logBench();
//   if (player.activePokemon) {
//     player.logActivePokemon();
//   }

//   // let validAction = false;
//   // while (!validAction) {
//   //   const action = await askQuestion(
//   //     "Do you want to (d)raw a card, (p)lay a card, (s)witch active Pokemon, or (a)ttack? "
//   //   );

//   //   switch (action) {
//   //     case "d":
//   //       // why is .length not working here? i would expect 7 create a had with 7 cards but it creates a hand of 8 cards
//   //       if (player.deck.length > 0 && player.hand.length <= 6) {
//   //         player.drawCard();
//   //         validAction = true;
//   //       } else if (player.deck.length === 0) {
//   //         updateGameOutput("Cannot draw a card. Deck is empty.");
//   //       } else if (player.hand.length > 6) {
//   //         updateGameOutput("Cannot draw a card. Hand is full.");
//   //       }
//   //       break;
//   //     case "p":
//   //       const cardIndex = await askQuestion(
//   //         "Which card do you want to play? Enter the card number: "
//   //       );
//   //       if (cardIndex >= 0 && cardIndex < player.hand.length) {
//   //         player.playCard(player.hand[cardIndex]);
//   //         validAction = true;
//   //       } else {
//   //         updateGameOutput("Invalid card number. Please try again.");
//   //       }
//   //       break;
//   //     case "s":
//   //       if (player.bench.length > 0) {
//   //         await player.switchActivePokemon();
//   //         validAction = true;
//   //       } else {
//   //         updateGameOutput("Cannot switch active Pokemon. Bench is empty.");
//   //         validAction = false;
//   //       }

//   //       break;
//   //     case "a":
//   //       if (player.activePokemon && player.opponent.activePokemon) {
//   //         player.attack(player.opponent.activePokemon);
//   //         validAction = true;
//   //       } else {
//   //         updateGameOutput(
//   //           "Attack not possible. Opponent does not have an active Pokemon or you don't have an active Pokemon."
//   //         );
//   //       }
//   //       break;
//   //     default:
//   //       updateGameOutput("Invalid action. Please try again.");
//   //   }
//   // }

//   player.endTurn();
// }

class Player {
  constructor(name) {
    this.name = name;
    this.deck = [];
    this.hand = [];
    this.bench = [];
    this.activePokemon = null;
    this.discardPile = [];
    this.opponent = null;
    this.turnCount = 0;
  }

  logDeck() {
    updateGameOutput(`${this.name}'s deck:`);
    this.deck.forEach((pokemon) => {
      updateGameOutput(
        `Name: ${pokemon.name}, Attack: ${pokemon.attack}, Defense: ${pokemon.defense}, Health: ${pokemon.health}`
      );
    });
  }

  logHand() {
    updateGameOutput(`${this.name}'s hand:`);
    this.hand.forEach((pokemon, index) => {
      updateGameOutput(
        `${index}: ${pokemon.name} (Attack: ${pokemon.attack}, Defense: ${pokemon.defense}, Health: ${pokemon.health})`
      );
    });
  }

  logBench() {
    updateGameOutput(`${this.name}'s bench:`);
    this.bench.forEach((pokemon, index) => {
      updateGameOutput(
        `${index + 1}: ${pokemon.name} (Attack: ${pokemon.attack}, Defense: ${
          pokemon.defense
        }, Health: ${pokemon.health})`
      );
    });
  }

  logActivePokemon() {
    updateGameOutput(`${this.name}'s active pokemon:`);
    updateGameOutput(this.activePokemon.name);
  }

  shuffleDeck() {
    // Shuffle the deck
    const deck = this.deck;
    let currentIndex = deck.length;

    while (currentIndex !== 0) {
      const randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      // Swap current card with a random card
      const temporaryCard = deck[currentIndex];
      deck[currentIndex] = deck[randomIndex];
      deck[randomIndex] = temporaryCard;
    }
  }

  drawInitialHand() {
    const handSize = 3; // Number of cards to draw for initial hand
    const deck = this.deck;
    const hand = this.hand;

    for (let i = 0; i < handSize; i++) {
      if (deck.length === 0) {
        break; // Stop drawing if deck is empty
      }

      const card = deck.pop(); // Draw the top card from the deck
      hand.push(card); // Add the card to the hand
    }
  }

  drawCard() {
    // Draw a card from the deck
    const deck = this.deck;
    const hand = this.hand;

    if (deck.length === 0) {
      // Handle empty deck scenario
      updateGameOutput(`${this.name}'s deck is empty. Cannot draw a card.`);
      return false; // Indicate the action was not successful
    }

    const card = deck.pop(); // Draw the top card from the deck
    hand.push(card); // Add the card to the hand

    updateGameOutput(`${this.name} drew ${card.name} from the deck.`);

    return true; // Indicate the action was successful
  }

  playCard(card) {
    const hand = this.hand;
    const bench = this.bench;
    let activePokemon = this.activePokemon;

    if (hand.includes(card)) {
      if (bench.length < 5) {
        bench.push(card); // Add the card to the bench
        hand.splice(hand.indexOf(card), 1); // Remove the card from the hand
        updateGameOutput(`${this.name} played ${card.name} to the bench.`);
      } else {
        updateGameOutput(
          "Cannot play the card. Bench is full and there is already an active Pokemon."
        );
      }
    } else {
      updateGameOutput("Cannot play the card. It is not in the hand.");
    }

    if (activePokemon === null && card) {
      activePokemon = card;
      if (card.name) {
        updateGameOutput(`${this.name}'s ${card.name} is now active.`);
      } else {
        updateGameOutput(`${player.name} has no cards left to play.`);
      }
    }
  }

  attack(target) {
    // Attack the target Pokemon
    const activePokemon = this.activePokemon;

    if (activePokemon) {
      updateGameOutput(`${activePokemon.name} attacks ${target.name}!`);
      // Perform the attack logic here
      const damage = Math.max(activePokemon.attack - target.defense, 10);
      if (damage > 0) {
        target.health -= damage;
        updateGameOutput(
          `${target.name} takes ${damage} damage and has ${target.health} health remaining.`
        );
        if (target.health <= 0) {
          updateGameOutput(`${target.name} fainted.`);
          // Handle fainted Pokemon logic here
          this.opponent.activePokemon = null;
          const benchIndex = this.opponent.bench.indexOf(target);
          if (benchIndex !== -1) {
            this.opponent.bench.splice(benchIndex, 1); // Remove the defeated Pokemon from the bench
            this.opponent.discardPile.push(target); // Add the defeated Pokemon to the discard pile
            updateGameOutput(`${target.name} is discarded.`);
          }

          // If the defeated Pokemon was the active Pokemon, remove it from the active position
          if (this.activePokemon === target) {
            this.activePokemon = null;
          }
        }
      } else {
        const halfDamage = Math.floor(damage / 2);
        target.health -= halfDamage;
        updateGameOutput(
          `${target.name} has strong defenses. ${target.name} takes ${halfDamage} damage and has ${target.health} health remaining.`
        );
        if (target.health <= 0) {
          updateGameOutput(`${target.name} fainted.`);
          // Handle fainted Pokemon logic here
          const benchIndex = this.bench.indexOf(target);
          if (benchIndex !== -1) {
            this.bench.splice(benchIndex, 1); // Remove the defeated Pokemon from the bench
            this.discardPile.push(target); // Add the defeated Pokemon to the discard pile
            updateGameOutput(`${target.name} is discarded.`);
          }

          // If the defeated Pokemon was the active Pokemon, remove it from the active position
          if (this.activePokemon === target) {
            this.activePokemon = null;
          }
        }
      }
    } else {
      updateGameOutput("No active Pokemon to attack with.");
    }
  }

  async switchActivePokemon() {
    const benchPokemonNames = this.bench.map(
      (pokemon, index) => `${index}: ${pokemon.name}`
    );
    updateGameOutput(`Bench: ${benchPokemonNames.join(", ")}`);
    const index = await askQuestion(
      "Which Pokemon do you want to make the active Pokemon? Enter the number: "
    );
    const chosenPokemon = this.bench[index];
    if (chosenPokemon !== this.activePokemon) {
      // Switch the active Pokemon with the chosen Pokemon
      this.bench[index] = this.activePokemon;
      this.activePokemon = chosenPokemon;
      updateGameOutput(
        `${this.name} switched active Pokemon. ${chosenPokemon.name} is now active.`
      );
    } else if (chosenPokemon === this.activePokemon) {
      updateGameOutput(`${chosenPokemon.name} is already the active Pokemon.`);
    } else {
      updateGameOutput("Invalid choice. No Pokemon was switched.");
    }
  }

  endTurn() {
    // End the player's turn
    // this.turnCount++;
    // updateGameOutput(`Turn ${this.turnCount} ended.`);

    // Check if there is no active Pokemon
    if (!this.activePokemon) {
      // Loop through the player's Pokemon list
      for (let i = 0; i < this.bench.length; i++) {
        // If the Pokemon is not fainted, set it as the active Pokemon
        if (this.bench[i].health > 0) {
          this.activePokemon = this.bench[i];
          updateGameOutput(`${this.activePokemon.name} is now active.`);
          break;
        }
      }
    }
  }
}

class Game {
  constructor(player1, player2) {
    this.players = [player1, player2];
    this.currentPlayerIndex = 0;
    this.turnCount = 0;
  }

  startGame() {
    this.players.forEach((player) => {
      player.shuffleDeck();
      player.drawInitialHand();
    });
    this.determineStartingPlayer();
    this.mainGameLoop();
  }

  determineStartingPlayer() {
    this.currentPlayerIndex = Math.floor(Math.random() * this.players.length);
  }

  async mainGameLoop() {
    while (!this.isGameOver()) {
      const currentPlayer = this.players[this.currentPlayerIndex];
      await this.executeTurn(currentPlayer);
      this.switchPlayer();

      // Increment turn count and end the turn
      this.nextTurn();
    }
  }

  async executeTurn(player) {
    if (player === this.players[0]) {
      // Player 1's turn (user-controlled)
      await executeUserTurn(player);
    } else {
      // Computer player's turn

      // Priority 1: Activate a Pokémon if none is active
      if (!player.activePokemon) {
        if (player.hand.length > 0) {
          // Play a card if hand is not empty
          const cardToPlay = player.hand.find((card) => card.health > 0);
          if (cardToPlay) {
            player.playCard(cardToPlay);
          }
        } else {
          // Draw a card if hand is empty
          player.drawCard();
        }
      }

      // Priority 2: Draw a card if hand is empty and the deck has cards
      else if (
        player.hand.length === 0 &&
        player.deck.length > 0 &&
        player.hand.length < 7
      ) {
        player.drawCard();
      }

      // Priority 3: Attack if active Pokémon is available
      else if (player.activePokemon && player.opponent.activePokemon) {
        player.attack(player.opponent.activePokemon);
      }

      // priority 4: if the opponent does not have a active pokemon, and the bench is not full, and the hand is not empty, play a card. Else, if the deck is not empty, and the hand is not full, draw a card
      else if (player.activePokemon && !player.opponent.activePokemon) {
        // if opponent does not have an active pokemon, and bench is not full, add a pokemon to the bench. if bench is full, draw a card
        if (player.bench.length < 5) {
          const cardToPlay = player.hand.find((card) => card.health > 0);
          if (cardToPlay) {
            player.playCard(cardToPlay);
          }
          //   if the players hand is not full and the deck still has cards, draw a card
        } else if (player.deck.length > 0 && player.hand.length < 5) {
          // Draw a card if hand is empty
          player.drawCard();
        }
      }

      // priority 5: if the opponent does not have a active pokemon, and the bench is full, and the hand is full,  do nothing and return the console log computer has not moves to make
      else {
        updateGameOutput("Computer has no moves to make.");
      }

      // End the turn
      player.endTurn();
    }
  }

  nextTurn() {
    this.turnCount++;
    updateGameOutput(`Turn ${this.turnCount} ended.`);
    updateGameOutput("\n"); // Add line break after the text
  }

  switchPlayer() {
    this.currentPlayerIndex =
      (this.currentPlayerIndex + 1) % this.players.length;
  }

  isGameOver() {
    const currentPlayer = this.players[this.currentPlayerIndex];
    const otherPlayer =
      this.players[(this.currentPlayerIndex + 1) % this.players.length];

    // Check if any player has no more cards to play
    if (
      currentPlayer.deck.length === 0 &&
      currentPlayer.hand.length === 0 &&
      currentPlayer.bench.length === 0
    ) {
      updateGameOutput(
        `${currentPlayer.name} has no more cards to play. ${otherPlayer.name} wins!`
      );
      return true;
    } else if (
      otherPlayer.deck.length === 0 &&
      otherPlayer.hand.length === 0 &&
      otherPlayer.bench.length === 0
    ) {
      updateGameOutput(
        `${otherPlayer.name} has no more cards to play. ${currentPlayer.name} wins!`
      );
      return true;
    }

    // Check if the turn limit has been reached
    if (this.turnCount >= 100) {
      // Calculate remaining Pokemon for each player
      const currentPlayerRemainingPokemon =
        currentPlayer.deck.length +
        currentPlayer.hand.length +
        currentPlayer.bench.length;
      const otherPlayerRemainingPokemon =
        otherPlayer.deck.length +
        otherPlayer.hand.length +
        otherPlayer.bench.length;

      updateGameOutput(
        `Turn limit reached. ${currentPlayer.name} has ${currentPlayerRemainingPokemon} Pokemon remaining. ${otherPlayer.name} has ${otherPlayerRemainingPokemon} Pokemon remaining.`
      );

      // Declare the winner based on the player with the most remaining Pokemon
      if (currentPlayerRemainingPokemon > otherPlayerRemainingPokemon) {
        updateGameOutput(`${currentPlayer.name} wins!`);
      } else if (currentPlayerRemainingPokemon < otherPlayerRemainingPokemon) {
        updateGameOutput(`${otherPlayer.name} wins!`);
      } else {
        updateGameOutput(`The game is a draw.`);
      }
      return true;
    }

    // Add more win conditions if needed

    return false;
  }
}

// Usage example:
async function start() {
  const player1 = new Player("Player 1");
  const player2 = new Player("Player 2");
  player1.opponent = player2;
  player2.opponent = player1;
  const game = new Game(player1, player2);

  distributePokemon(pokemonList, player1, player2);
  await game.startGame(); // Note the use of await here
}

document
  .getElementById("startGameButton")
  .addEventListener("click", function () {
    start();
  });
