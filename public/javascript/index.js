// Import necessary function 

import { generateFakePrize , addCard_userSelection } from "./search.js";

document.addEventListener("DOMContentLoaded", () => { 

    // Testing purpose Start Here

    // 1.  user liked product ko Handle Karna 

    handleUserLikedProduct_when_page_reload();

    // Testing purpose End Here

    // User Releted Product ko move karne ka logic
    const scrollContainer = document.querySelector(".user-releted-card_box");
    const prevSlideBtn = document.getElementById("rel_slide_prev");
    const nextSlideBtn = document.getElementById("rel_slide_next");
    // const scrollAmount=scrollContainer.clientWidth*0.4;
    if(prevSlideBtn !==null && nextSlideBtn !==null) {
    nextSlideBtn.addEventListener("click", () => {
        // scrollContainer.scrollLeft+=scrollAmount;
        scrollContainer.scrollLeft += 200;
    })
    prevSlideBtn.addEventListener("click", () => {
        scrollContainer.scrollLeft -= 200; 
    })
   }
    // New Arival Collections
    const newarivalsliderbox = document.querySelector(".new-arival-slider-box");
    const arivalAmount = newarivalsliderbox.clientWidth * 0.4;
    const arivalnextBtn = document.getElementById("new-arival-nextBtn");
    const arvalprevBtn = document.getElementById("new-arval-prevBtn");
    arivalnextBtn.addEventListener("click", () => {
        newarivalsliderbox.scrollLeft += arivalAmount;
    })
    arvalprevBtn.addEventListener("click", () => {
        newarivalsliderbox.scrollLeft -= arivalAmount;
    })

    // Explore Section Button add active class
    const buttons = document.querySelectorAll(".exploreSec_Btn");
    buttons.forEach((button) => {
        button.addEventListener("click", function () {
            buttons.forEach((btn) => btn.classList.remove("activeBtn"));
            this.classList.add("activeBtn");
        })
    })

    // Filter Buttons Logic  DataValueforfilter
    const DataValueforfilter = document.getElementById("DataValueforfilter").getAttribute("data-Product");
    
    //  availablity logic 
    let sortButton=document.querySelectorAll(".hm-listing-SortBtn");
    sortButton.forEach((button)=>{ 
        button.addEventListener("click",(event)=>{
            event.stopPropagation();
            let listing_filter_card=document.querySelectorAll(".listing_filter_card");
            listing_filter_card.forEach((filterCard)=>{
                filterCard.setAttribute("data-aos", "fade-up");
                filterCard.setAttribute("data-aos-offset", "20");
                filterCard.setAttribute("data-aos-delay", "10");
                filterCard.setAttribute("data-aos-duration", "500");
                filterCard.setAttribute("anchorPlacement", "top-center");
                filterCard.setAttribute("mirror", "true");
                filterCard.style.opacity="0";
                filterCard.style.visibility="hidden";
            });
            sortButton.forEach((filterCard)=>{
                filterCard.classList.remove("activeFilterBtn");
            })
            if(event.target.id==="hm-listing-color"){
                event.target.classList.add("activeFilterBtn");
                colorBasedSortCard();
            }else if(event.target.id==="hm-listing-availablity"){
                event.target.classList.add("activeFilterBtn");
                availablityBasedSortCard();
            }else if(event.target.id==="hm-listing-price"){
                event.target.classList.add("activeFilterBtn");
                prizeBasedSortCard();
            }else if(event.target.id==="hm-listing-tag"){
                event.target.classList.add("activeFilterBtn");
                tagsBasedSortCard();
            }else if(event.target.id==="hm-listing-size"){
                event.target.classList.add("activeFilterBtn");
                sizeBasedSortCard();
            }else if (event.target.id==="filterclearBtn"){
                console.log("Ab card ke selected filter clear karo ");
            } else if(event.target.id==="filterapplyBtn"){
                console.log("ab selection card ki visiblity none set karo : ");
            }
            else{
                console.log("You Cliked Outside the Range : ");
            }
        })
    })

    document.querySelectorAll(".listing_filter_card").forEach((filterCard)=>{
        filterCard.addEventListener("click",(event)=>{
            event.stopPropagation();
        })
    })

    const availablityBtn = document.getElementById("hm-listing-availablity");
    const availablity_container = document.querySelector(".hm-listing_availablity_container");
    availablityBtn.addEventListener("click", () => {
        availablityBtn.classList.add("activeFilterBtn");
        availablity_container.style.opacity = "1";
        availablity_container.style.display = "block";
    })
    // filter apply Logic 
    const filterapplyBtn = document.querySelectorAll("#filterapplyBtn");
    filterapplyBtn.forEach((button)=>{
        button.addEventListener("click",(event)=>{
            // hm-listing_availablity_container
            if(event.target.offsetParent.classList[0]==="hm-listing_availablity_container"){
                hideFilterBox(document.querySelector(".hm-listing_availablity_container"));
            }else if(event.target.offsetParent.classList[0]==="hm-listing-price-container"){
                hideFilterBox(document.querySelector(".hm-listing-price-container"));
            }
            else if(event.target.offsetParent.classList[0]==="hm-listing-sort-color-box"){
                hideFilterBox(document.querySelector(".hm-listing-sort-color-box"));
            }
            else if(event.target.offsetParent.classList[0]==="hm-listing-tag_sort_box"){
                hideFilterBox(document.querySelector(".hm-listing-tag_sort_box"));
            }else{
                hideFilterBox(document.querySelector(".hm-listing-sizes_box"));
            }
        })
    })

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
            })
            let mainCardAppendContainer = document.querySelector(".hm-listing-data");
            mainCardAppendContainer.innerHTML = '';
            finalData.forEach((card) => {
                addCard_userSelection(card);
            })
            pricecontainer.style.opacity = "0";
            setTimeout(() => {
                pricecontainer.style.display = "none";
            }, 50);
            priceBtn.classList.remove("activeFilterBtn");
            priceBtn.classList.add("removeFilterContainer");

        } else {
            alert("please Enter a Valid Prize : ");
        }

    })

    // Add Event Listner on Like Button
    const likeBtns=document.querySelectorAll(".listing_item_likeBtn");
    likeBtns.forEach((likeBtn)=>{
        likeBtn.addEventListener("click",async(event)=>{
            event.preventDefault();
            // likeBtn.classList.toggle("activeLikeBtn");
            // console.dir(likeBtn.parentElement.method);
            // activeLikeBtn if contains that means we send delete request to the server else send post request to the server
            
            // console.log(likeBtn.getAttribute("data-isLiked"));
            if(likeBtn.classList.contains("activeLikeBtn")){
                // Product is already liked
                likeBtn.classList.remove("activeLikeBtn");
                let likeForm = likeBtn.parentElement;
                let productId=likeForm.children[0].name;
                let likedResponse= await  fetch(`/shopcard/${productId}/like`,{
                    method:"delete",
                    headers:{
                        'Content-Type': 'application/json',
                        'X-Requested-With': 'XMLHttpRequest' // important flag to tell server this is ajax/fetch request
                    },
                    body: JSON.stringify({productId}),
                    redirect:"manual"
                })
                if(likedResponse.ok){
                    let likedMessage=await likedResponse.json();
                    showLikeMessageBox(likedMessage.message,"#f44336");
                }else if(likedResponse.status===401){
                    window.location.href="/shopcard/authenticate/register?action=login";
                    
                }else{
                    console.log('An error occurred:', likedResponse.status);
                }
            }else{
                // Product is not liked 
                let likeForm = likeBtn.parentElement;
                let productId=likeForm.children[0].name;
                likeBtn.classList.add("activeLikeBtn");
                let likedResponse= await  fetch(`/shopcard/${productId}/like`,{
                    method:"post",
                    headers:{
                        'Content-Type': 'application/json',
                        'X-Requested-With': 'XMLHttpRequest' // important flag to tell server this is ajax/fetch request
                    },
                    body: JSON.stringify({productId}),
                    redirect:"manual"
                })
                if(likedResponse.ok){
                    let likedMessage=await likedResponse.json();
                    showLikeMessageBox(likedMessage.message,"#4caf50");
                }else if(likedResponse.status===401){
                    window.location.href="/shopcard/authenticate/register?action=login";
                }else{
                    console.log('An error occurred:', likedResponse.status);
                }
            }            
        })
    })

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
        addCardButton.innerText = (`Add To Card`);

        card_price_cardBtn_Box.appendChild(priceButton);

        card_price_cardBtn_Box.appendChild(addCardButton);

        card_descriptionMainBox.appendChild(card_price_cardBtn_Box);

        listingCardBox.appendChild(card_descriptionMainBox);
        cardLink.appendChild(listingCardBox);
        let mainCardAppendContainer = document.querySelector(".hm-listing-data");
        mainCardAppendContainer.appendChild(cardLink);
    }
})

function showLikeMessageBox(messageText, color = "#4caf50") {
    console.log("Show Like function is Executed : and we access below Box");
    const msgBox = document.getElementById("userlikeMsgBox");
    console.log(msgBox);
    msgBox.textContent = messageText;
    msgBox.style.backgroundColor = "#f0f0f0";
    msgBox.style.color = "#333";
    msgBox.classList.remove("userLikehidden");

    // Animate border color dynamically
    msgBox.style.setProperty('--bar-color', color);

    // Trigger reflow to restart animation
    msgBox.classList.remove("userLikemsg-box");
    void msgBox.offsetWidth;
    msgBox.classList.add("userLikemsg-box");

    // Hide after 3.2 seconds
    setTimeout(() => {
        msgBox.classList.add("userLikehidden");
    }, 3200);
}


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



async  function handleUserLikedProduct_when_page_reload(){
    try{
      let response= await  fetch("/shopcard/liked-product",{
        method:"GET",
        headers:{
            "Content-Type":"application/json",
            "X-Requested-With":"XMLHttpRequest",
        },
      })
      if(response.ok){
       let userLikedProduct = await response.json();
       console.log(userLikedProduct);
      }else if(response.status===401 ){
        console.info("Please Login to See Your Liked Product : ");
      }
      else{
        console.info("Failed to Fetch User Liked Product : ");
      }
    } catch(err){
        console.error("An Error Occured When Fetching User Liked Product : ")
    }
}