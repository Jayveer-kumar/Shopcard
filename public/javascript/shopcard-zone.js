document.addEventListener("DOMContentLoaded", () => {
  const filterButtons = document.querySelectorAll(".zone-filter-btn");
  const cards = document.querySelectorAll(".zone-card");

  filterButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      filterButtons.forEach(b => b.classList.remove("activeZoneBtn"));
      btn.classList.add("activeZoneBtn");
      console.log(btn);

      const filterValue = btn.textContent.trim();
      cards.forEach(card => {
        if (filterValue === "All" || card.dataset.type === filterValue) {
          card.style.display = "block";
        } else {
          card.style.display = "none";
        }
      });
    });
  });
});


console.log("File Loaded Successfully : ");
