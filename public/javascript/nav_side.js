document.addEventListener("DOMContentLoaded", () => {

    // Dark Mode Switching Logic Start Here
    let mainBody=document.getElementById("bodyContainer");
    let modeSwitchButton=document.querySelector(".modeSwitchButton");
    let modeIcon=modeSwitchButton.children[0];

    // Also save and set the mode in Local Storage
    // Check if dark mode is already set in local storage
    if(localStorage.getItem("darkMode")==="true"){
        mainBody.classList.add("darkMode");
        modeIcon.classList.remove("fa-moon");
        modeIcon.classList.add("fa-sun");
    }else{
        mainBody.classList.remove("darkMode");
        modeIcon.classList.remove("fa-sun");
        modeIcon.classList.add("fa-moon");
    }
    function toggleMode(){
        mainBody.classList.toggle("darkMode");
        // Change the icon based on the mode
        if(mainBody.classList.contains("darkMode")){
            localStorage.setItem("darkMode","true");
            modeIcon.classList.remove("fa-moon");
            modeIcon.classList.add("fa-sun");
        }else{
            localStorage.setItem("darkMode","false");
            modeIcon.classList.remove("fa-sun");
            modeIcon.classList.add("fa-moon");
        }
    }
    modeSwitchButton.addEventListener("click",toggleMode);
    // Dark Mode Switching Logic End Here
    let small_scr_side = document.querySelector(".small_scr_side");
    let sideBarIcon = document.getElementById("barIcon");
    function checkWindowWidth() {
        if (window.innerWidth > 700) {
            small_scr_side.classList.remove("openSidebar");
            small_scr_side.classList.add("closeSidebar");
        } else {
            small_scr_side.classList.remove("openSidebar");
            small_scr_side.classList.add("closeSidebar");
        }
    }
    window.addEventListener("resize", checkWindowWidth);
    sideBarIcon.addEventListener("click", () => {
        if (!small_scr_side.classList.contains("openSidebar")) {
            small_scr_side.classList.remove("closeSidebar");
            small_scr_side.classList.add("openSidebar");
        } else {
            small_scr_side.classList.remove("openSidebar");
            small_scr_side.classList.add("closeSidebar");
        }
    });

    // Search functanaility Start Here 

    // SearchBoxContainer This Box only for adding some stylling 
    let Search_product_input=document.getElementById("Search_product_input");
    let SearchBoxContainer=document.querySelector(".search_input_box_container");
    let SearchProductPreviewBox=document.querySelector(".search-input-preview-container");
    let previewBoxCard=document.querySelector(".search-product-preview-card_container");
    window.addEventListener("click",(event)=>{
        if(!event.target.closest(".search_input_box_container")){
            SearchProductPreviewBox.classList.remove("activePreviewBox");
        }
    })
    SearchBoxContainer.addEventListener("mouseenter",()=>{
        SearchBoxContainer.classList.add("activeInputBox");
    })
    SearchBoxContainer.addEventListener("mouseleave",()=>{
        SearchBoxContainer.classList.remove("activeInputBox");
    })
    SearchBoxContainer.addEventListener("click",(event)=>{ 
        SearchProductPreviewBox.classList.add("activePreviewBox");
    })
    
    Search_product_input.addEventListener("input",async function(){
        let searchValue=this.value.trim();
        if(searchValue.length===0){
            SearchProductPreviewBox.classList.remove("activePreviewBox");
            previewBoxCard.innerHTML="";
            return; 
        }else{
            SearchProductPreviewBox.classList.add("activePreviewBox");
            try{
             let searchResult=await fetch(`/shopcard/search?q=${searchValue}&json=true`);
             let data=await searchResult.json();
             previewBoxCard.innerHTML="";
            data.forEach((card,index)=>{
                let cardElement=showLiveSearchProduct(card);
                if(!cardElement) return;
                cardElement.setAttribute("data-aos", "fade-left");
                // cardElement.setAttribute("data-aos", "slide-down");
                cardElement.setAttribute("data-aos-duration", "500"); 
            })
            }catch(err){
                console.error(err);
            }
        }
    })

    let search_product_icon=document.querySelector(".search_product_icon");
    search_product_icon.addEventListener("click",(event)=>{
      event.stopPropagation();
      console.log("Search icon Clicked : ");
    }) 

    // Hero section image change Logic Start Here    
  
    let imageSourceContainer = ["/src/hero-section-image-2.png","/src/hero-section-image-3.png","/src/hero-section-image-4.png","/src/hero-section-image-5.png","/src/hero-section-img.png"];
    let currentHeroImage=document.getElementById("hero_section_image");

    let heroImageChangePrevBtn = document.getElementById("prev-img-sld");
    let heroImageChangeNextBtn = document.getElementById("next-img-sld");

    // heroImageChangeNextBtn.addEventListener("click", function (event) {
    //    console.log("Next Slide button Clicked : ");
    // });
    
    // heroImageChangePrevBtn.addEventListener("click", function (event) {
    //     console.log("Prev Slide button Clicked : ");
    // });
    
})

function addTransition(element){

}
function removeTransition(element){

}
let mainCardAppendContainer=document.querySelector(".search-product-preview-card_container");
function showLiveSearchProduct(card){
    // Create an anchor tag show we able to use this card  in watch route
    let cardLink=document.createElement("a");
    cardLink.href=(`/shopcard/${card._id}`);   
    let mainCard=document.createElement("div");
    mainCard.classList.add("search-product-preview-card");
    let cardImageBox=document.createElement("div");
    cardImageBox.classList.add("search-product-card-img");
    let cardImage=document.createElement("img");
    cardImage.src=card.image[0];
    cardImageBox.appendChild(cardImage);
    mainCard.appendChild(cardImageBox);

    let cardDescription=document.createElement("div");
    cardDescription.classList.add("search-product-card-description");
    let cardTitlePara=document.createElement("p");
    cardTitlePara.classList.add("search-product-title");
    cardTitlePara.textContent=card.title;

    let cardBrandIcon=document.createElement("i");
    cardBrandIcon.classList.add("fa-solid","fa-tag");
    let cardBrand=document.createElement("span");
    cardBrand.classList.add("search-product-cardBrand");
    
    cardBrand.innerText=card.Brand;

    let cardPrizePara=document.createElement("p");
    cardPrizePara.innerHTML = `&#8377;${card.prize}`;
    cardPrizePara.classList.add("search-product-price");
    
    cardBrand.appendChild(cardBrandIcon);
    cardDescription.appendChild(cardBrand);

    cardDescription.appendChild(cardTitlePara);
    cardDescription.appendChild(cardPrizePara);
    mainCard.appendChild(cardDescription);
    cardLink.appendChild(mainCard);
    mainCardAppendContainer.appendChild(cardLink);
    return mainCard;
}