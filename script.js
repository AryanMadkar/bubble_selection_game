let hitnumber;
let timer;
let score = 0;
let clutter = [];
let numberchooser;
let circle;
var cr;
let hittag;

function circlemaker() {
  for (let i = 0; i < 216; i++) {
    let codex = Math.floor(Math.random() * 10);
    clutter += `<div onclick="onclick_score()" class="circle">${codex}</div>`;
    cr =
      "rgb(" +
      Math.floor(Math.random() * 256) +
      "," +
      Math.floor(Math.random() * 256) +
      "," +
      Math.floor(Math.random() * 256) +
      ")";
  }

  document.querySelector("#lower").innerHTML = clutter;
}
circlemaker();

function hitchanger() {
  hittag = Math.floor(Math.random() * 10);
  document.querySelector("#hit_num").value = hittag;
  console.log(typeof hittag);
  console.log(hittag);
}
hitchanger();

function timerchange() {
  timer = 60;
  let interval = 1000;

  setInterval(() => {
    if (timer > 0) {
      document.querySelector("#timer_num").value -= 1;
      timer -= 1;
    } else {
      clearInterval(timer);
      document.querySelector("#upper").innerHTML = `<h1> Game over your score is ${score}</h1>`;
    }
  }, interval);
}

timerchange();

function making_score() {
  score += 1;
  document.querySelector("#score_num").value = score;
}

function onclick_score() {
  document.querySelector("#lower").addEventListener("click", (dets) => {
    numberchooser = Number(dets.target.textContent);
    console.log(typeof numberchooser);
  });
  if (hittag === numberchooser) {
    making_score();
    document.querySelector("#score_num").value = score;
    hitchanger();
  }
}
onclick_score();
