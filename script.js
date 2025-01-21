let coin = 100;
let row, column;
let diflvl = 3;
let suprise = [];
let bombber = [];
let moves;
let currentrow;
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
const difficulty = () => {
  if (document.querySelector("#x101").value == "easy") {
    diflvl = 3;
  } else if (document.querySelector("#x101").value == "medium") {
    diflvl = 2;
  } else if (document.querySelector("#x101").value == "hard") {
    diflvl = 1;
  } else if (document.querySelector("#x101").value == "impossible") {
    diflvl = 0;
  }
  for (let i = 0; i < 9; i++) {
    [suprise[i], bombber[i]] = giftgenerator();
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
    // Reset suprise array
    suprise = [];
    bombber = [];
    for (let i = 0; i < 9; i++) {
      [suprise[i], bombber[i]] = giftgenerator();
    }
    // Reset all li elements
    document.querySelectorAll(".towerquest ul li").forEach((li) => {
      li.style.backgroundColor = "";
      li.querySelector("i")?.remove();
      li.querySelector("p")?.removeAttribute("style");
    });

    // Reset active class to the last row
    document.querySelectorAll(".towerquest ul").forEach((ul, index) => {
      if (index === 8) {
        ul.classList.add("active");
      } else {
        ul.classList.remove("active");
      }
    });

    // Reset game UI
    document.querySelector(".game").style.display = "flex";
    document.querySelector(".startbtn").style.display = "none";
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

async function cancelautoplay() {
  moves = 0;
  await autoplay();
}

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
    autoplay();
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
