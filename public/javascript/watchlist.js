import { generateFakePrize } from "./search.js";

let productPriceMainPara=document.querySelectorAll(".watchlist-user-product-price-main");
productPriceMainPara.forEach((para)=>{
    let actualPrice = para.children[0];
    let discountPrice = para.children[1];
    let offPrice = para.children[2];
    let {fakePrice , discountPercentage}=generateFakePrize(actualPrice.textContent);
    discountPrice.innerHTML=`&#8377;${fakePrice}`;
    offPrice.textContent = `${discountPercentage}%Off`;
    actualPrice.innerHTML=`&#8377;${actualPrice.textContent}`; 
})