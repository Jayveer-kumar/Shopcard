// Import necessary function 

// import { generateFakePrize , addCard_userSelection } from "./search.js";

document.addEventListener("DOMContentLoaded", () => {
  // 1.  user liked product ko Handle Karna

  // handleUserLikedProduct_when_page_reload();

    // User Related Products Slider
    initializeSlider('.user-releted-card_box', 'rel_slide_prev', 'rel_slide_next', 320);
    // New Arrivals Slider
    initializeSlider('.new-arival-slider-box', 'new-arval-prevBtn', 'new-arival-nextBtn', 320);


    

  // Add click handlers for collection buttons
   document.addEventListener('click', (e) => {
            if (e.target.classList.contains('rel-collection_btn') || e.target.id === 'add_to_bagBtn') {
                e.preventDefault();
                if (e.target.id === 'add_to_bagBtn') {
                    alert('Item added to bag!');
                } else {
                    alert('Collection page will open here!');
                }
            }
    });

  // Explore Section Button add active class
  const buttons = document.querySelectorAll(".exploreSec_Btn");
  buttons.forEach((button) => {
    button.addEventListener("click", function () {
      buttons.forEach((btn) => btn.classList.remove("activeBtn"));
      this.classList.add("activeBtn");
    });
  });

  // Filter Buttons Logic  DataValueforfilter
  const DataValueforfilter = document
    .getElementById("DataValueforfilter")
    .getAttribute("data-Product");

  //  availablity logic
  let sortButton = document.querySelectorAll(".hm-listing-SortBtn");
  sortButton.forEach((button) => {
    button.addEventListener("click", (event) => {
      event.stopPropagation();
      let listing_filter_card = document.querySelectorAll(
        ".listing_filter_card"
      );
      listing_filter_card.forEach((filterCard) => {
        filterCard.setAttribute("data-aos", "fade-up");
        filterCard.setAttribute("data-aos-offset", "20");
        filterCard.setAttribute("data-aos-delay", "10");
        filterCard.setAttribute("data-aos-duration", "500");
        filterCard.setAttribute("anchorPlacement", "top-center");
        filterCard.setAttribute("mirror", "true");
        filterCard.style.opacity = "0";
        filterCard.style.visibility = "hidden";
      });
      sortButton.forEach((filterCard) => {
        filterCard.classList.remove("activeFilterBtn");
      });
      if (event.target.id === "hm-listing-color") {
        event.target.classList.add("activeFilterBtn");
        colorBasedSortCard();
      } else if (event.target.id === "hm-listing-availablity") {
        event.target.classList.add("activeFilterBtn");
        availablityBasedSortCard();
      } else if (event.target.id === "hm-listing-price") {
        event.target.classList.add("activeFilterBtn");
        prizeBasedSortCard();
      } else if (event.target.id === "hm-listing-tag") {
        event.target.classList.add("activeFilterBtn");
        tagsBasedSortCard();
      } else if (event.target.id === "hm-listing-size") {
        event.target.classList.add("activeFilterBtn");
        sizeBasedSortCard();
      } else if (event.target.id === "filterclearBtn") {
        console.log("Ab card ke selected filter clear karo ");
      } else if (event.target.id === "filterapplyBtn") {
        console.log("ab selection card ki visiblity none set karo : ");
      } else {
        console.log("You Cliked Outside the Range : ");
      }
    });
  });

  document.querySelectorAll(".listing_filter_card").forEach((filterCard) => {
    filterCard.addEventListener("click", (event) => {
      event.stopPropagation();
    });
  });

  const availablityBtn = document.getElementById("hm-listing-availablity");
  const availablity_container = document.querySelector(
    ".hm-listing_availablity_container"
  );
  availablityBtn.addEventListener("click", () => {
    availablityBtn.classList.add("activeFilterBtn");
    availablity_container.style.opacity = "1";
    availablity_container.style.display = "block";
  });
  // filter apply Logic
  const filterapplyBtn = document.querySelectorAll("#filterapplyBtn");
  filterapplyBtn.forEach((button) => {
    button.addEventListener("click", (event) => {
      // hm-listing_availablity_container
      if (
        event.target.offsetParent.classList[0] ===
        "hm-listing_availablity_container"
      ) {
        hideFilterBox(
          document.querySelector(".hm-listing_availablity_container")
        );
      } else if (
        event.target.offsetParent.classList[0] === "hm-listing-price-container"
      ) {
        hideFilterBox(document.querySelector(".hm-listing-price-container"));
      } else if (
        event.target.offsetParent.classList[0] === "hm-listing-sort-color-box"
      ) {
        hideFilterBox(document.querySelector(".hm-listing-sort-color-box"));
      } else if (
        event.target.offsetParent.classList[0] === "hm-listing-tag_sort_box"
      ) {
        hideFilterBox(document.querySelector(".hm-listing-tag_sort_box"));
      } else {
        hideFilterBox(document.querySelector(".hm-listing-sizes_box"));
      }
    });
  });

  // Price Select Logic
  const pricecontainer = document.querySelector(".hm-listing-price-container");
  const priceBtn = document.getElementById("hm-listing-price");

  priceBtn.addEventListener("click", () => {
    pricecontainer.style.opacity = "1";
    pricecontainer.style.display = "block";
    // priceBtn.classList.add("activeFilterBtn");
  });

  const priceFilterApplyBtn = document.querySelector(".priceFilterApply");
  priceFilterApplyBtn.addEventListener("click", () => {
    // Get user Selected Price
    let priceMin = document.getElementById("priceMin").value;
    let priceMax = document.getElementById("priceMax").value;
    let forFilterData = JSON.parse(DataValueforfilter);

    if (priceMax > 10 && priceMin > 10) {
      let finalData = forFilterData.filter((element) => {
        return element.prize < priceMax && element.prize > priceMin;
      });
      let mainCardAppendContainer = document.querySelector(".hm-listing-data");
      mainCardAppendContainer.innerHTML = "";
      finalData.forEach((card) => {
        addCard_userSelection(card);
      });
      pricecontainer.style.opacity = "0";
      setTimeout(() => {
        pricecontainer.style.display = "none";
      }, 50);
      priceBtn.classList.remove("activeFilterBtn");
      priceBtn.classList.add("removeFilterContainer");
    } else {
      alert("please Enter a Valid Prize : ");
    }
  });




  // Funcation to add Cards based on user Selection
  function addCard_userSelection(card) {
    // Create a anchor tag so be able to see this card in detail and also buy this product
    let cardLink = document.createElement("a");
    cardLink.classList.add("ProductLink");
    cardLink.href = card._id;
    // Create main Container of card
    let listingCardBox = document.createElement("div");
    listingCardBox.classList.add("hm-listing-dt-card-box");
    // Create image box then image tag
    let cardImageBox = document.createElement("div");
    cardImageBox.classList.add("hm-listing-dt-card-box_img");
    // Create image tag
    let card_productImage = document.createElement("img");
    card_productImage.src = card.image[0];

    cardImageBox.appendChild(card_productImage);
    listingCardBox.appendChild(cardImageBox);

    // Create Card Description box main Container
    let card_descriptionMainBox = document.createElement("div");
    card_descriptionMainBox.classList.add("hm-listing-dt-card-box_dis");

    let cardTitlePara = document.createElement("p");
    cardTitlePara.classList.add("hm-listing-item_title");
    cardTitlePara.textContent = card.title;
    card_descriptionMainBox.appendChild(cardTitlePara);

    let cardDescriptionPara = document.createElement("p");
    cardDescriptionPara.classList.add("hm-listing_item_discription");
    cardDescriptionPara.textContent = card.description;
    card_descriptionMainBox.appendChild(cardDescriptionPara);

    // Create Card Button main Box
    let card_price_cardBtn_Box = document.createElement("div");
    card_price_cardBtn_Box.classList.add("hm_listing_price_cardBtn");

    let priceButton = document.createElement("button");
    priceButton.classList.add("hm-listing_item_price");
    priceButton.textContent = card.prize;

    let addCardButton = document.createElement("button");
    addCardButton.classList.add("hm-listing_item_addCard");

    // Add Card icon in addcardButton
    let cardIcon = document.createElement("i");
    cardIcon.classList.add("fa-solid", "fa-cart-shopping");
    addCardButton.append(cardIcon);
    addCardButton.innerText = `Add To Card`;

    card_price_cardBtn_Box.appendChild(priceButton);

    card_price_cardBtn_Box.appendChild(addCardButton);

    card_descriptionMainBox.appendChild(card_price_cardBtn_Box);

    listingCardBox.appendChild(card_descriptionMainBox);
    cardLink.appendChild(listingCardBox);
    let mainCardAppendContainer = document.querySelector(".hm-listing-data");
    mainCardAppendContainer.appendChild(cardLink);
  }

  // logic for frequent asked question
  const faqItems = document.querySelectorAll('.faq-item');
  
  faqItems.forEach(item=>{
    const question = item.querySelector('.faq-question');
    question.addEventListener("click",()=>{
      item.classList.toggle('active');
    })
  })
})


function colorBasedSortCard(){
    let filterBox=document.querySelector(".hm-listing-sort-color-box");
    filterBox.style.opacity = "1";
    filterBox.style.visibility = "visible";
    filterBox.setAttribute("data-aos","fade-up");
    filterBox.setAttribute("data-aos-offset","20");
    filterBox.setAttribute("data-aos-delay","10");
    filterBox.setAttribute("data-aos-duration","500");
    filterBox.setAttribute("anchorPlacement","top-center");
    filterBox.setAttribute("mirror","true");
}
function availablityBasedSortCard(){
    let filterBox=document.querySelector(".hm-listing_availablity_container");
    filterBox.style.opacity = "1";
    filterBox.style.visibility = "visible";
    filterBox.setAttribute("data-aos","fade-up");
    filterBox.setAttribute("data-aos-offset","20"); 
    filterBox.setAttribute("data-aos-delay","10");
    filterBox.setAttribute("data-aos-duration","500");
    filterBox.setAttribute("anchorPlacement","top-center");
    filterBox.setAttribute("mirror","true");
}
function prizeBasedSortCard(){
    let filterBox=document.querySelector(".hm-listing-price-container");
    filterBox.style.opacity = "1";
    filterBox.style.visibility = "visible";
    filterBox.setAttribute("data-aos","fade-up");
    filterBox.setAttribute("data-aos-offset","20"); 
    filterBox.setAttribute("data-aos-delay","10");
    filterBox.setAttribute("data-aos-duration","500");
    filterBox.setAttribute("anchorPlacement","top-center");
    filterBox.setAttribute("mirror","true");
    
}
function tagsBasedSortCard(){
   let filterBox=document.querySelector(".hm-listing-tag_sort_box");
    filterBox.style.opacity = "1";
    filterBox.style.visibility = "visible";
    filterBox.setAttribute("data-aos","fade-up");
    filterBox.setAttribute("data-aos-offset","20"); 
    filterBox.setAttribute("data-aos-delay","10");
    filterBox.setAttribute("data-aos-duration","500");
    filterBox.setAttribute("anchorPlacement","top-center");
    filterBox.setAttribute("mirror","true");
}
function sizeBasedSortCard(){
    let filterBox=document.querySelector(".hm-listing-sizes_box");
    filterBox.style.opacity = "1";
    filterBox.style.visibility = "visible";
    filterBox.setAttribute("data-aos","fade-up");
    filterBox.setAttribute("data-aos-offset","20"); 
    filterBox.setAttribute("data-aos-delay","10");
    filterBox.setAttribute("data-aos-duration","500");
    filterBox.setAttribute("anchorPlacement","top-center");
    filterBox.setAttribute("mirror","true");
}

// Function to hide Filter Cards

function hideFilterBox(cardName) {       
    // Remove old AOS attributes
    cardName.removeAttribute("data-aos");
    cardName.removeAttribute("data-aos-offset");
    cardName.removeAttribute("data-aos-delay");
    cardName.removeAttribute("data-aos-duration");
    cardName.removeAttribute("anchorPlacement");
    cardName.removeAttribute("mirror");

    // Add new AOS attributes
    cardName.setAttribute("data-aos", "fade-down");
    cardName.setAttribute("data-aos-offset", "20");
    cardName.setAttribute("data-aos-delay", "10");
    cardName.setAttribute("data-aos-duration", "300");
    cardName.setAttribute("anchorPlacement", "bottom-top");
    cardName.setAttribute("mirror", "true");

    // Smooth fade-down effect
    cardName.classList.add("hide_filter_Box_smoothly");
    cardName.parentElement.classList.remove("activeFilterBtn"); 
    setTimeout(() => {
        cardName.style.opacity = "0";
        cardName.style.visibility = "hidden";// Completely hide after transition
        cardName.classList.remove("hide_filter_Box_smoothly"); // After get Transition then remove this class
    }, 300); // Match transition duration 
}






 function initializeSlider(
   containerSelector,
   prevBtnId,
   nextBtnId,
   scrollAmount = null
 ) {
   const scrollContainer = document.querySelector(containerSelector);
   const prevSlideBtn = document.getElementById(prevBtnId);
   const nextSlideBtn = document.getElementById(nextBtnId);

   if (!scrollContainer || !prevSlideBtn || !nextSlideBtn) {
     console.warn(`Slider elements not found for: ${containerSelector}`);
     return;
   }

   // Calculate dynamic scroll amount based on container's first card
   function calculateScrollAmount() {
     if (scrollAmount !== null) {
       return scrollAmount; // Use provided fixed amount
     }

     const firstCard = scrollContainer.children[0];
     if (firstCard) {
       const cardStyle = getComputedStyle(firstCard);
       const cardWidth = firstCard.offsetWidth;
       const marginRight = parseFloat(cardStyle.marginRight) || 0;
       const gap = parseFloat(getComputedStyle(scrollContainer).gap) || 16;

       const dynamicAmount = cardWidth + Math.max(marginRight, gap);
       console.log(
         `📏 Dynamic scroll amount for ${containerSelector}: ${dynamicAmount}px`
       );
       return dynamicAmount;
     }
     return 320; // Fallback
   }

   function updateButtonStates() {
     const maxScrollLeft =
       scrollContainer.scrollWidth - scrollContainer.clientWidth;

     // Update button opacity based on scroll position
     prevSlideBtn.style.opacity = scrollContainer.scrollLeft <= 0 ? "0.4" : "1";
     nextSlideBtn.style.opacity =
       scrollContainer.scrollLeft >= maxScrollLeft ? "0.4" : "1";

     // Disable/enable buttons
     prevSlideBtn.disabled = scrollContainer.scrollLeft <= 0;
     nextSlideBtn.disabled = scrollContainer.scrollLeft >= maxScrollLeft;
   }

   // Next button event
   nextSlideBtn.addEventListener("click", () => {
     const currentScrollAmount = calculateScrollAmount();
     scrollContainer.scrollLeft += currentScrollAmount;
     setTimeout(updateButtonStates, 150); // Increased timeout for smooth scroll
   });

   // Previous button event
   prevSlideBtn.addEventListener("click", () => {
     const currentScrollAmount = calculateScrollAmount();
     scrollContainer.scrollLeft -= currentScrollAmount;
     setTimeout(updateButtonStates, 150); // Increased timeout for smooth scroll
   });

   // Listen for scroll events to update button states in real-time
   scrollContainer.addEventListener("scroll", updateButtonStates);

   // Initialize button states with delay to ensure DOM is ready
   setTimeout(() => {
     updateButtonStates();
   }, 200);

   // Handle resize for this specific slider
   const resizeHandler = () => {
     setTimeout(() => {
       updateButtonStates();
     }, 200);
   };
   window.addEventListener("resize", resizeHandler);
 }
