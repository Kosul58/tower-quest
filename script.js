let coin = 100;
let row, column;
let diflvl = 3;
let suprise = [];
let bombber = [];
let moves;
let currentrow;
let gamectr1 = false;
let gamectr2 = false;
document.querySelector(".coincount").innerHTML = coin;
const startGame = () => {
  document.querySelector(".game").style.display = "flex";
  document.querySelector(".startbtn").style.display = "none";
  coin = coin - 1;
  document.querySelector(".coincount").innerHTML = coin;
  difficulty();
  // console.log(suprise, bombber);
};

document.querySelector(".x1").addEventListener("click", () => {
  document.querySelector(".game").style.display = "none";
  document.querySelector(".startbtn").style.display = "flex";
});

document.querySelector(".x2").addEventListener("click", () => {
  document.querySelector(".modal").style.display = "none";
});
const difficulty = async () => {
  try {
    if (document.querySelector("#x101").value == "normal") {
      diflvl = 3;
      gamectr1 = true;
    } else if (document.querySelector("#x101").value == "medium") {
      diflvl = 2;
      gamectr1 = true;
    } else if (document.querySelector("#x101").value == "hard") {
      diflvl = 1;
      gamectr1 = true;
    } else if (document.querySelector("#x101").value == "impossible") {
      diflvl = 0;
      gamectr1 = true;
    }
    for (let i = 0; i < 9; i++) {
      [suprise[i], bombber[i]] = giftgenerator();
    }
    if (gamectr1 == true) {
      if (gamectr2 !== true) {
        coin = coin + 1;
      }
      restartGame();
    }
  } catch (e) {
    console.log(e);
  } finally {
    gamectr1 = false;
  }
};

function giftgenerator() {
  const gift = new Set();
  const bomb = new Set();
  let numofbomb, numofgift;

  if (diflvl == 0) {
    numofgift = 1;
    numofbomb = 3;
  } else if (diflvl == 1) {
    numofgift = 1;
    numofbomb = 2;
  } else if (diflvl == 2) {
    numofgift = 2;
    numofbomb = 1;
  } else if (diflvl == 3) {
    numofgift = 3;
    numofbomb = 1;
  }

  while (gift.size < numofgift) {
    const randomNum = Math.floor(Math.random() * 4) + 1;
    gift.add(randomNum);
  }

  while (bomb.size < numofbomb) {
    const randomNum = Math.floor(Math.random() * 4) + 1;
    if (gift.has(randomNum)) {
    } else {
      bomb.add(randomNum);
    }
  }
  return [gift, bomb];
}

async function reveal() {
  document.querySelectorAll(".towerquest ul li").forEach((li) => {
    row =
      Array.from(li.parentElement.parentElement.children).indexOf(
        li.parentElement
      ) + 1;
    column = Array.from(li.parentElement.children).indexOf(li) + 1;

    const icon = document.createElement("i");
    let paragraph = li.querySelector("p");
    document.querySelectorAll(".towerquest ul").forEach((ul, index) => {
      if (ul.classList.contains("active")) {
        ul.classList.remove("active");
      }
    });

    if (!li.querySelector("i")) {
      if (suprise[row - 1].has(column)) {
        li.style.backgroundColor = "yellow"; // Gift
        icon.classList.add("fa-solid", "fa-gift");
        paragraph.appendChild(icon);
        paragraph.style.backgroundColor = "white";
        icon.style.zIndex = "5";
      } else if (bombber[row - 1].has(column)) {
        li.style.backgroundColor = "red"; // Bomb
        icon.classList.add("fa-solid", "fa-bomb");
        paragraph.appendChild(icon);
        paragraph.style.backgroundColor = "white";
        icon.style.zIndex = "5";
      } else {
        li.style.backgroundColor = "black";
      }
    }
  });
}

const restartGame = async () => {
  try {
    if (coin <= 0) {
      moves--;
    } else {
      coin -= 1;
    }
    document.querySelector(".coincount").innerHTML = coin;
    suprise = [];
    bombber = [];
    for (let i = 0; i < 9; i++) {
      [suprise[i], bombber[i]] = giftgenerator();
    }
    document.querySelectorAll(".towerquest ul li").forEach((li) => {
      li.style.backgroundColor = "";
      li.querySelector("i")?.remove();
      li.querySelector("p")?.removeAttribute("style");
    });

    document.querySelectorAll(".towerquest ul").forEach((ul, index) => {
      if (index === 8) {
        ul.classList.add("active");
      } else {
        ul.classList.remove("active");
      }
    });
  } catch (e) {
    console.log(e);
  } finally {
    if (moves) {
      await autoplay();
    }
    console.log("Game restarted!");
  }
};

document.querySelectorAll(".towerquest ul li").forEach((li) => {
  li.addEventListener("click", async () => {
    row =
      Array.from(li.parentElement.parentElement.children).indexOf(
        li.parentElement
      ) + 1; // Row number
    column = Array.from(li.parentElement.children).indexOf(li) + 1; // Column number
    gamectr2 = true;
    let upmove = "r" + (row - 1);
    let downmove = "r" + row;
    // console.log(upmove, downmove);
    // console.log(`Row: ${row}, Column: ${column}`);
    let icon = document.createElement("i");
    let paragraph = li.querySelector("p");
    // console.log(suprise, bombber);

    if (suprise[row - 1].has(column)) {
      try {
        li.style.backgroundColor = "yellow";
        icon.classList.add("fa-solid", "fa-gift");
        paragraph.appendChild(icon);
        paragraph.style.backgroundColor = "white";
        icon.style.zIndex = "5";
        if (upmove == "r0") {
        } else {
          document.querySelector(`.${upmove}`).classList.add("active");
        }
        document.querySelector(`.${downmove}`).classList.remove("active");
      } catch (e) {
        console.log(e);
      } finally {
        if (row == 1) {
          alert("You Win!");
          setTimeout(() => {
            restartGame();
          }, 1000);
        }
      }
    } else if (bombber[row - 1].has(column)) {
      li.style.backgroundColor = "red";
      icon.classList.add("fa-solid", "fa-bomb");
      paragraph.appendChild(icon);
      paragraph.style.backgroundColor = "white";
      icon.style.zIndex = "5";
      setTimeout(() => {
        reveal();
      }, 1000);
    } else {
      li.style.backgroundColor = "black";
    }
  });
});

const findActiveRow = () => {
  const rows = document.querySelectorAll(".towerquest ul");
  let activeRow = null;
  rows.forEach((row, index) => {
    if (row.classList.contains("active")) {
      activeRow = index + 1;
    }
  });
  if (activeRow) {
    return activeRow;
  } else if (activeRow > 9) {
    return 9;
  } else {
    return null;
  }
};

// async function cancelautoplay() {
//   moves = 0;
//   await autoplay();
// }

async function autoplay() {
  if (moves <= 0) {
    // console.log("No more moves left!00");
    return;
  }
  currentrow = findActiveRow() || 9;
  if (currentrow == 0) {
    currentrow = 9;
  }

  const playRound = async () => {
    console.log(currentrow, moves);
    if (currentrow == 0) {
      currentrow = 9;
    }
    activerow = document.querySelector(`.r${currentrow}`);
    let columns = activerow.querySelectorAll("li");
    let randomindex = Math.floor(Math.random() * columns.length);
    let selectedcolumn = columns[randomindex];
    selectedcolumn.click();
    const clickcheck = () => {
      if (selectedcolumn.style.backgroundColor == "red") {
        if (moves <= 0) {
          // console.log("No more moves left!01");
          document.querySelector(".autoplayer").textContent = "Autoplay";
          document.querySelector(".autoplayer").classList.remove("cancel");
          return;
        } else {
          moves--;
          setTimeout(() => {
            restartGame();
          }, 2000);
        }
      } else if (selectedcolumn.style.backgroundColor == "yellow") {
        if (moves <= 0) {
          // console.log("No more moves left!01");
          document.querySelector(".autoplayer").textContent = "Autoplay";
          document.querySelector(".autoplayer").classList.remove("cancel");
          return;
        } else {
          moves--;
          currentrow--;
          setTimeout(playRound, 1000);
        }
      }
    };
    clickcheck();
    if (selectedcolumn.style.backgroundColor == "black") {
      if (moves <= 0) {
        // console.log("No more moves left!01");
        document.querySelector(".autoplayer").textContent = "Cancel Autoplay";
        document.querySelector(".autoplayer").classList.remove("cancel");
        return;
      } else {
        moves--;
      }
      let lastIndex = randomindex;
      let indices = Array.from({ length: columns.length }, (_, i) => i);
      indices = indices.filter((index) => index !== lastIndex);
      randomindex = indices[Math.floor(Math.random() * indices.length)];
      selectedcolumn = columns[randomindex];
      selectedcolumn.click();
      moves--;
      clickcheck();
    }
  };
  playRound();
}

const showmodal = () => {
  let j = document.querySelector(".autoplayer");
  if (j.classList.contains("cancel")) {
    j.classList.remove("cancel");
    j.textContent = "Autoplay";
    console.log(moves, coin);
    coin = coin + moves;
    document.querySelector(".coincount").innerHTML = coin;
    moves = 0;
  } else {
    document.querySelector(".modal").style.display = "flex";
  }
};

document.querySelectorAll(".modal h2").forEach((h2) => {
  h2.addEventListener("click", () => {
    if (h2.textContent == "10 moves") {
      moves = 10;
      coin = coin - 10;
    } else if (h2.textContent == "20 moves") {
      moves = 20;
      coin = coin - 20;
    } else if (h2.textContent == "Infinite") {
      moves = coin;
      coin = 0;
    }
    let j = document.querySelector(".autoplayer");
    document.querySelector(".coincount").innerHTML = coin;
    document.querySelector(".modal").style.display = "none";
    j.textContent = "Cancel Autoplay";
    j.classList.add("cancel");
    const redcheck = () => {
      const listItems = document.querySelectorAll(".towerquest ul li");
      for (let li of listItems) {
        if (li.style.backgroundColor === "red") {
          console.log("gg");
          return true;
        }
      }
    };
    j = redcheck();
    if (j == true) {
      restartGame();
    } else {
      autoplay();
    }
  });
});

// document.querySelector(".coin").addEventListener("click", () => {
//   const j = prompt("Enter amount of coins to add");
//   coin = coin + parseInt(j);
//   document.querySelector(".coincount").innerHTML = coin;
// });

const addcoin = () => {
  const j = prompt("Enter amount of coins to add");
  coin = coin + parseInt(j);
  document.querySelector(".coincount").innerHTML = coin;
};

// Incomplete Task 2
// class TowerQuestGame {
//   constructor() {
//     this.levels = p;
//     this.difficulties = ["Easy", "Medium", "Hard", "Impossible"];
//     this.rtp = 0.98;
//   }

//   calculateProbabilitiesAndPayouts() {
//     const levelsData = [];
//     const baseWinChance = 0.7;
//     const basePayout = 1.2;

//     for (let level = 1; level <= this.levels; level++) {
//       const levelData = { level, difficulties: {} };

//       this.difficulties.forEach((difficulty, index) => {
//         const difficultyFactor = (index + 1) * 0.1;
//         const winChance = baseWinChance - level * 0.05 - difficultyFactor;
//         const payout = basePayout + level * 0.3 + difficultyFactor * 2;

//         levelData.difficulties[difficulty] = {
//           winChance: Math.max(0.1, winChance),
//           payout: parseFloat(payout.toFixed(2)),
//         };
//       });

//       levelsData.push(levelData);
//     }

//     return levelsData;
//   }

//   calculateRTP(levelsData) {
//     let totalWager = 0;
//     let totalReturn = 0;

//     levelsData.forEach((levelData) => {
//       Object.values(levelData.difficulties).forEach((difficultyData) => {
//         const { winChance, payout } = difficultyData;
//         totalWager += 1;
//         totalReturn += winChance * payout;
//       });
//     });

//     return (totalReturn / totalWager).toFixed(2);
//   }

//   simulateGame() {
//     const levelsData = this.calculateProbabilitiesAndPayouts();
//     const actualRTP = this.calculateRTP(levelsData);

//     console.log("Levels and Difficulty Data:", levelsData);
//     console.log("Calculated RTP:", actualRTP);

//     if (parseFloat(actualRTP) === this.rtp) {
//       console.log("The game meets the 98% RTP requirement.");
//     } else {
//       console.log(
//         `Adjustments needed to match RTP (current: ${actualRTP}, target: ${this.rtp})`
//       );
//     }
//   }
// }

// const towerQuest = new TowerQuestGame();
// towerQuest.simulateGame();
