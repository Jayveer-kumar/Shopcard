document.addEventListener("DOMContentLoaded", function () {
  let currentIndex = 0;
  const cards = document.querySelectorAll(".explorepg-product-card");
  const container = document.querySelector(".explorepg-cards-container");
  const leftBtn = document.querySelector(".explorepg-nav-left");
  const rightBtn = document.querySelector(".explorepg-nav-right");

  const cardWidth = 250 + 24; // Card width + gap

  leftBtn.addEventListener("click", () => {
    if (currentIndex > 0) {
      currentIndex--;
      container.style.transform = `translateX(-${currentIndex * cardWidth}px)`;
    }
  });

  rightBtn.addEventListener("click", () => {
    if (currentIndex < cards.length - 3) {
      // Show 3 cards at a time
      currentIndex++;
      container.style.transform = `translateX(-${currentIndex * cardWidth}px)`;
    }
  });

  let offerCurrentIndex = 0;
  const offerCards = document.querySelectorAll(".explorepg-offer-card");
  const offerContainer = document.querySelector(
    ".explorepg-offer-cards-container"
  );
  const offerLeftBtn = document.querySelector(".explorepg-offer-nav-left");
  const offerRightBtn = document.querySelector(".explorepg-offer-nav-right");

  const offerCardWidth = 280 + 24; // Card width + gap

  offerLeftBtn.addEventListener("click", () => {
    if (offerCurrentIndex > 0) {
      offerCurrentIndex--;
      offerContainer.style.transform = `translateX(-${
        offerCurrentIndex * offerCardWidth
      }px)`;
    }
  });

  offerRightBtn.addEventListener("click", () => {
    if (offerCurrentIndex < offerCards.length - 3) {
      // Show 3 cards at a time
      offerCurrentIndex++;
      offerContainer.style.transform = `translateX(-${
        offerCurrentIndex * offerCardWidth
      }px)`;
    }
  });
});
