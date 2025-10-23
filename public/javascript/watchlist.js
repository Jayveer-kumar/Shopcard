document.addEventListener("DOMContentLoaded", () => {
  let cartHandler = new CartHandler();

  const changeBtn = document.getElementById(
    "watchlist-product-change-address-btn"
  );
  const addressBox = document.getElementById("addressBox");
  const closeBtn = document.getElementById("closeAddressBox");

  let modeSwitchButton = document.querySelector(".modeSwitchButton");
  let pincodeInput = document.querySelector(".watchlist-pincode-input");
  let pincodeSubmitBtn = document.querySelector(".watchlist-address-pincode-sbmt-btn");

changeBtn.addEventListener("click", (e) => {
  e.stopPropagation(); // stop window click

  if (!addressBox.classList.contains("show")) {
    let selectAddressMainBox = document.querySelector(".watchlist-address-change-select-main");

    //  Show Loader
    const loaderHTML = `
      <div class="dot-spinner">
        <div class="dot-spinner__dot"></div>
        <div class="dot-spinner__dot"></div>
        <div class="dot-spinner__dot"></div>
        <div class="dot-spinner__dot"></div>
        <div class="dot-spinner__dot"></div>
        <div class="dot-spinner__dot"></div>
        <div class="dot-spinner__dot"></div>
        <div class="dot-spinner__dot"></div>
      </div>`;
    selectAddressMainBox.innerHTML = loaderHTML;

    //  setTimeout(..., 0) se JavaScript thoda delay deti hai taaki browser loader paint kar sake.
    setTimeout(async () => {
      try {
        // Fetch addresses 
        let data = await getUserAddress();

        //  Now Remove loader
        selectAddressMainBox.innerHTML = "";

        //   If address exists
        if (data && data.length > 0) {
          let addressOptionsMainBox = document.createElement("div");
          addressOptionsMainBox.className = "watchlist-all-address-option-box";

          data.forEach((adrs) => {
            let addressOptionHTML = `
              <label class="watchlist-address-option">
                <input type="radio" name="selectedAddress" />
                <div class="watchlist-address-details">
                  <div class="watchlist-address-top">
                    <p class="watchlist-address-change-user-name">${adrs.fullName}</p>
                    <span class="watchlist-address-tag home">${adrs.addressType}</span>
                  </div>
                  <p class="pincode">Pincode: ${adrs.pincode}</p>
                  <p class="full-address">${adrs.locality} &nbsp; <span> ${adrs.landmark? adrs.landmark : adrs.state} </span> </p>
                </div>
              </label>`;
            addressOptionsMainBox.innerHTML += addressOptionHTML;
          });

          selectAddressMainBox.appendChild(addressOptionsMainBox);
        } else {
          //  No Address Exists
          selectAddressMainBox.innerHTML = `
            <div class="no-address-box">
              <p>No saved addresses found 😕</p>
              <button class="add-new-address-btn">Add New Address</button>
            </div>`;
        }
      } catch (error) {
        console.error("Error fetching addresses:", error);
        selectAddressMainBox.innerHTML = `
          <div class="error-box">
            <p>⚠️ Something went wrong. Please try again later.</p>
          </div>`;
      }
    }, 0);
  }
  addressBox.classList.toggle("show");
});



  //  close when clicking close icon
  closeBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    addressBox.classList.remove("show");
  });

  //  close when clicking outside box & button
  document.addEventListener("click", (e) => {
    const clickedInsideBox = addressBox.contains(e.target);
    const clickedButton = changeBtn.contains(e.target);
    if (!clickedInsideBox && !clickedButton && !modeSwitchButton) {
      addressBox.classList.remove("show");
    }
  });

pincodeInput.addEventListener("input", (e) => {
  if (e.target.value.length < 6) {
    pincodeSubmitBtn.classList.add("btn-disable");
  } else {
    pincodeSubmitBtn.classList.remove("btn-disable");
  }
});

// Submit Pincode
pincodeSubmitBtn.addEventListener("click", async (e) => {
  let loaderContainer = document.querySelector(".watchlist-address-chnge-loader-box");
  
  if (pincodeInput.value.length < 6) {
    loaderContainer.classList.add("wtc-loader-hidden");
    pincodeSubmitBtn.classList.add("btn-disable");
    return;
  } else {
    if (!loaderContainer) return;
    
   
    pincodeSubmitBtn.classList.add("btn-disable");
    loaderContainer.classList.remove("wtc-loader-hidden");
    
    
    let btnSpan = pincodeSubmitBtn.querySelector("span");
    if (btnSpan) {
      btnSpan.textContent = "Verifying";
    }
    
    // Pincode clear karo
    pincodeInput.value = "";
    
    // 5 seconds ke baad reset karo
    setTimeout(() => {
      loaderContainer.classList.add("wtc-loader-hidden");
      pincodeSubmitBtn.classList.remove("btn-disable");
      if (btnSpan) {
        btnSpan.textContent = "Submit";
      }
      alert("Pincode Verified Successfully!");
    }, 5000);
  }
});  
  
  // All Product  pageload changes  action
  let productPriceMainBox = document.querySelectorAll(
    ".watchlist-user-product-price-main"
  );

  let itemCount = 0;
  let itemTotalPriceToCheckout = 0;
  productPriceMainBox.forEach((para) => {
    itemCount++;
    let originalPrice = para.querySelector(".watchlist-user-product-price");
    let fakeOriginalPrice = para.querySelector(
      ".watchlist-user-product-discount"
    );
    let discountOffPrice = para.querySelector(
      ".watchlist-user-product-discount-off"
    );

    // Get the Original Price text  (remove ₹ symbol for calculation)
    let priceText = originalPrice.textContent.replace("₹", "").trim();

    // Get the fake price by using cartHandler Method
    let priceData = cartHandler.generateFakePrice(priceText);

    itemTotalPriceToCheckout+=priceData.discountedPrice;
    // Update the DOM with generated value
    originalPrice.textContent = `₹${priceData.discountedPrice}`;
    fakeOriginalPrice.textContent = `₹${priceData.fakeOriginalPrice}`;
    discountOffPrice.textContent = `${priceData.discountPercentage}% off`;
  });

  // Update the user checkout left sidebar 
  let itemCountPara = document.getElementById("watchlist-checkout-total-productCount");
  let itemTotalPricePara = document.querySelector(".watchlist-checkout-allproduct-totalprice-right");
  let itemTotalPriceParaFooter = document.getElementById("watchlist-checkout-footer-item-totalPrice");
  let plateformFeePara = document.querySelector(".watchlist-checkout-platform-fee-right");
  let couponsPara = document.querySelector(".watchlist-checkout-allproduct-coupons-right");
  let discountPara = document.querySelector(".watchlist-checkout-allproduct-discount-right");
  let youSavePara = document.getElementById("watchlist-checkout-you-save");
  itemCountPara.textContent=`(${itemCount} Items)`;

  

  let generatedData  = generateCheckoutDiscount(itemCount,itemTotalPriceToCheckout,124);
  itemTotalPricePara.textContent  = `₹ ${itemTotalPriceToCheckout.toLocaleString('en-IN')}`;
  discountPara.textContent = ` ₹ ${generatedData.discount.toLocaleString('en-IN')} `;
  couponsPara.textContent = ` ₹ ${generatedData.coupons.toLocaleString('en-IN')} `;
  plateformFeePara.textContent = ` ₹ ${generatedData.plateformFee.toLocaleString('en-IN')} `;
  youSavePara.textContent = ` ₹ ${generatedData.youSave.toLocaleString('en-IN')} `;

  itemTotalPriceParaFooter.textContent = ` ₹ ${generatedData.totalAmount.toLocaleString('en-IN')} `; 
});

function generateCheckoutDiscount(itemsCount , totalAmount, coupons = 1 ){
  let plateformFee = 0 , discount = 0;
  plateformFee = itemsCount *9;
  discount = Math.round(totalAmount*0.2);
  totalAmount = totalAmount-discount;
  let youSave = discount + 120;
  return {
    plateformFee , discount , coupons , totalAmount , youSave }
}

const getUserAddress = async ()=>{
  let res =  await fetch("/shopcard/user-profile/address");
  let data = await res.json();
  return data; 
}

let userAddress1 = [
  {
    name:"Jayveer Kumar",
    tag:"Home",
    pincode:243639,
    fullAddress:"Village and Post Risouli , Badaun"
  },
  {
    name:"Jayveer Kumar",
    tag:"Office",
    pincode:243601,
    fullAddress:"Near Royal agency , dataganj chungi"
  }
]

let userAddress0 =[];