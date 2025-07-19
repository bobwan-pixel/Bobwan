document.addEventListener("DOMContentLoaded", () => {
  let timeLeft = 180;
  const timerEl = document.getElementById("timer");

  const countdown = setInterval(() => {
    timeLeft--;
    timerEl.textContent = timeLeft;
    if (timeLeft <= 0) {
      clearInterval(countdown);
      window.location.href = "proses.html";
    }
  }, 1000);
});