document.addEventListener("DOMContentLoaded", () => {
  const burger = document.getElementById("burgerToggle");
  const sidebar = document.getElementById("sidebar");

  if (burger && sidebar) {
    burger.addEventListener("click", () => {
      sidebar.classList.toggle("open");
    });
  }

  document.addEventListener("click", (e) => {
    if (
      sidebar.classList.contains("open") &&
      !sidebar.contains(e.target) &&
      !burger.contains(e.target)
    ) {
      sidebar.classList.remove("open");
    }
  });
});