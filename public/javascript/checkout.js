document.addEventListener("DOMContentLoaded",()=>{
  getUserAddress();
  let params = new URLSearchParams(window.location.search);
  let productSize = params.get("Size");
  let productQuantity = params.get("Quantity");
  if (productSize) {
    let productSizeText = document.querySelector(".buy_product_sizeValue");
    productSizeText.textContent = productSize;
  }
  if (productQuantity) {
    let productQuantityText = document.querySelector(
      ".buy_route_selected_product_quantity"
    );
    productQuantityText.textContent = productQuantity;
  }

  let addNewAddressButton = document.querySelector(
    ".buy_route_address_add_btn"
  );
  addNewAddressButton.addEventListener("click", async (e) => {
    console.log("Button clicked ; ");
    e.preventDefault();
    addNewAddress();
  });

  async function showAddressList(data) {
    let userAddressListBox = document.querySelector(
      ".buy-route-saved-address-list"
    );
    if (data && data.length > 0) {
      let addressCardHTML = data
        .map((item) => {
          return `
          <label class="saved-address-card">
                <input type="radio" name="selectedAddress" class="select-address-radio" >
                <div class="saved-add-card-content">
                <p class="address-cd-user">
                    <span class="saved-add-cd-username">${item.fullName}</span> | 
                    <span class="saved-add-cd-phone"> ${item.mobileNumber}</span>
                </p>
                <p class="saved-address-card-fulladdress">
                    ${item.landmark},  ${item.addressLine}, ${item.locality}, ${item.city}, ${item.state} - ${item.pincode}.
                </p>
                </div>
            </label>
          
          `;
        })
        .join("");
      userAddressListBox.innerHTML = addressCardHTML;
    } else {
      addNewAddress();
    }
  }

  async function getUserAddress() {
    try {
      let res = await fetch("/shopcard/user-profile/address");
      let data = await res.json();
      showAddressList(data);
    } catch (err) {
      console.error("Error fetching user addresses : ", err);
      return null;
    }
  }

  function addNewAddress() {
    let addressBox = document.querySelector(
      ".buy-route-add-new-address-hidden"
    );
    if (!addressBox) return;
    addressBox.style.display = "block";
    let newAddressHTML = `
  <div class="addnew-address-form">
                        <h4>Add New Address</h4>
                        <form action="/shopcard/user-profile/address" method="post" class="addnew-address-form-box" > 
                        <div class="form-group">
                            <label>Name</label>
                            <input type="text" name="fullName"  required > 
                        </div>
                        <div class="form-group">
                            <label>10-digit Mobile Number</label>
                            <input type="text" name="mobileNumber" required >
                        </div>
                        <div class="form-group">
                             <label> Gender </label>
                             <div class="gender-type">
                                 <label><input type="radio" name="gender" value="Male" > Male</label>
                                 <label><input type="radio" name="gender" value="Femail" > Femail</label>
                                 <label><input type="radio" name="gender" value="Other" > Other</label>
                             </div>
                        </div>
                        <div class="form-group">
                            <label>Pincode</label>
                            <input type="text" name="pincode" required >
                        </div>
                        <div class="form-group">
                            <label>Locality</label>
                            <input type="text" name="locality" required>
                        </div>
                        <div class="form-group">
                            <label>Address (Area and Street)</label>
                            <input type="text" name="addressLine" required >
                        </div>
                        <div class="form-group">
                            <label>City/District/Town</label>
                            <input type="text" name="city" required >
                        </div>
                        <div class="form-group">
                            <label>State</label>
                            <input type="text" name="state" required >
                        </div>
                        <div class="form-group">
                            <label>Landmark (Home No.) (Optional)</label>
                            <input type="text" name="landmark" >
                        </div>
                        <div class="form-group">
                            <label>Alternate Phone (Optional)</label>
                            <input type="text" name="alternatePhone" >
                        </div>
                        <div class="form-group">
                            <label>Address Type</label>
                            <div class="address-type">
                                <label><input type="radio" name="addressType" value="Home"  > Home</label>
                                <label><input type="radio" name="addressType" value="Work" > Work</label>
                                <label><input type="radio" name="addressType" value="Office" > Office</label>
                            </div>
                        </div>
                        <div class="form-buttons">
                            <button type="submit" class="addnewAddress-save-btn">Save</button>
                            <button class="addnewAddress-cancel-btn">Cancel</button>
                        </div>
                        </form>
                    </div>
  `;
    addressBox.innerHTML = newAddressHTML;

    let cancelButton = document.querySelector(".addnewAddress-cancel-btn");
    let saveButton = document.querySelector(".addnewAddress-save-btn");

    cancelButton.addEventListener("click", () => {
      addressBox.innerHTML = "";
      addressBox.style.display = "none";
    });

    saveButton.addEventListener("click", async (e) => {
      e.preventDefault();
      let form = document.querySelector(".addnew-address-form-box");
      // Now collect From Data

      const formData = {
        fullName: form.querySelector('input[name="fullName"]').value.trim(),
        mobileNumber: form
          .querySelector('input[name="mobileNumber"]')
          .value.trim(),
        gender: form.querySelector('input[name="gender"]:checked')?.value,
        pincode: form.querySelector('input[name="pincode"]').value.trim(),
        locality: form.querySelector('input[name="locality"]').value.trim(),
        addressLine: form
          .querySelector('input[name="addressLine"]')
          .value.trim(),
        city: form.querySelector('input[name="city"]').value.trim(),
        state: form.querySelector('input[name="state"]').value.trim(),
        landmark: form.querySelector('input[name="landmark"]').value.trim(),
        alternatePhone: form
          .querySelector('input[name="alternatePhone"]')
          .value.trim(),
        addressType: form.querySelector('input[name="addressType"]:checked')
          ?.value,
      };

      try {
        let res = await fetch("/shopcard/user-profile/address/new", {
          method: "post",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        let data = await res.json();
        if (data.success) {
          window.showMessage("New Address Saved Successfully", "#4caf50");
          // showAddressList(data);
          showAddressList(data.totalAddress);
          addressBox.innerHTML = "";
          addressBox.style.display = "none";
        } else {
          window.showMessage(
            "Please Fill all the Address Field's Properly.",
            "#f44336"
          );
        }
      } catch (e) {
        window.showMessage(
          "Something went wrong. Please try again.",
          "#f44336"
        );
      }
    });
  }

  // Payment Logic State Management

  let paymentState = {
    selectedMethod: null,
    isPaid: false,
    isAddressSelected:false,
  };
  
  let addressList = document.querySelector(".buy-route-saved-address-list");

  addressList.addEventListener("click",(e)=>{
    let target = e.target;
    // Check if clicked element is  address card 
    const addressCard = target.closest(".saved-address-card");
    if(addressCard){
      // Get the radio input inside that card
      const radio = addressCard.querySelector('input[name="selectedAddress"]');
      if(radio){
        radio.checked = true;
        paymentState.isAddressSelected = true;
        updatePlaceOrderButton();
      }
    }
  })


  // Get all necesory elements
  const paymentOptions = document.querySelectorAll(".paymentOptionBox");
  const paymentRadios = document.querySelectorAll('input[name="paymentMethod"]');
  const paymentDetailsSections = document.querySelectorAll(".paymentDetailsSection");
  const placeOrderBtn = document.getElementById("placeOrderBtn");

  // Payment method details mapping
  const paymentDetailsMap = {
    UPI: "upiDetails",
    Card: "cardDetails",
    NetBanking: "netBankingDetails",
    COD: "codDetails",
  };

  // Handle payment method selection
  paymentOptions.forEach((box, index) => {
    box.addEventListener("click", function () {
      const radio = this.querySelector('input[type="radio"]');
      radio.checked = true;
      handlePaymentSelection(radio.value);
    });
  });

  paymentRadios.forEach((radio) => {
    radio.addEventListener("change", function () {
      handlePaymentSelection(this.value);
    });
  });

  function handlePaymentSelection(method) {
    paymentState.selectedMethod = method;
    paymentState.isPaid = false;

    // Update active states
    paymentOptions.forEach((box) => box.classList.remove("active"));
    const selectedBox = document.querySelector(`input[value="${method}"]`).closest(".paymentOptionBox");
    selectedBox.classList.add("active");

    // Hide all payment details
    paymentDetailsSections.forEach((section) =>
      section.classList.remove("active")
    );

    // Show selected payment details
    const detailsId = paymentDetailsMap[method];
    if (detailsId) {
      if(method === "UPI"){
        // Generate QR Code
        const qrContainer = document.getElementById("qrCodeContainer");
        qrContainer.innerHTML = ""; // Clear previous QR if any
        let price = document.getElementById("product_price").textContent.trim();
        // Create UPI payment link
        let upiId = document.getElementById("upiId").value.trim() || "jasanjatav@oksbi";
        const upiLink = `upi://pay?pa=${upiId}&pn=Jayveer%20Shopcard%20Store&am=${price}&cu=INR`;
        // Generate new QR code
        new QRCode(qrContainer, {
            text: upiLink,
            width: 200,
            height: 200,
            colorDark: "#000000",
            colorLight: "#ffffff",
            correctLevel: QRCode.CorrectLevel.H
        });
      }
      document.getElementById(detailsId).classList.add("active");
    }

    // Update button state
    updatePlaceOrderButton();
  }

  function updatePlaceOrderButton() {
    if(!paymentState.isAddressSelected){
      placeOrderBtn.disabled = true;
      placeOrderBtn.textContent = "Select Shipping Address";
      return;
    }

    if (!paymentState.selectedMethod) {
      placeOrderBtn.disabled = true;
      placeOrderBtn.textContent = "Select Payment Method";
    } else if (paymentState.selectedMethod === "COD") {
      placeOrderBtn.disabled = false;
      placeOrderBtn.textContent = "Place Order (Cash on Delivery)";
    } else if (paymentState.isPaid) {
      placeOrderBtn.disabled = false;
      placeOrderBtn.textContent = "Place Order";
    } else {
      placeOrderBtn.disabled = true;
      placeOrderBtn.textContent = "Complete Payment First";
    }
  }

  // UPI Payment verification
  document.getElementById("verifyUpiBtn").addEventListener("click", function () {
      const upiId = document.getElementById("upiId").value.trim();
      if (!upiId) {
        alert("Please enter UPI ID");
        return;
      }
      // Simulate payment verification
      simulatePayment("upiSuccess");
    });

  // Later Additional Feature . like when user want to generate new QR Code  
  // document.getElementById("verifyQrBtn").addEventListener("click", function () {
  //   simulatePayment("upiSuccess");
  // });

  // Card Payment verification
  document.getElementById("verifyCardBtn").addEventListener("click", function () {
      const cardNumber = document.getElementById("cardNumber").value.trim();
      const cardName = document.getElementById("cardName").value.trim();
      const expiryDate = document.getElementById("expiryDate").value.trim();
      const cvv = document.getElementById("cvv").value.trim();

      if (!cardNumber || !cardName || !expiryDate || !cvv) {
        alert("Please fill all card details");
        return;
      }
      simulatePayment("cardSuccess");
    });

  // Net Banking verification
  document.getElementById("verifyBankBtn").addEventListener("click", function () {
      const bank = document.getElementById("bankSelect").value;
      if (!bank) {
        alert("Please select a bank");
        return;
      }
      simulatePayment("bankSuccess");
    });

  // Simulate payment process
  function simulatePayment(successElementId) {
    // Show loading or processing state
    const btn = event.target;
    const originalText = btn.textContent;
    btn.textContent = "Processing...";
    btn.disabled = true;

    // Simulate API call
    setTimeout(() => {
      paymentState.isPaid = true;
      document.getElementById(successElementId).style.display = "block";
      btn.textContent = "✓ Paid";
      updatePlaceOrderButton();
    }, 1500);
  }

  // Place Order button click
  placeOrderBtn.addEventListener("click", function () {
    if (paymentState.selectedMethod === "COD" || paymentState.isPaid) {
      showOrderPopUpforSuccess();
    }
  });

  // Initialize - check if any radio is checked on load
  const checkedRadio = document.querySelector('input[name="paymentMethod"]:checked');
  if (checkedRadio) {
    handlePaymentSelection(checkedRadio.value);
  }

  // Order Flash message Function
  function showOrderPopUpforSuccess() {
    Swal.fire({
      title: "Order Successful!",
      text: "Your order has been placed successfully.",
      icon: "success",
      confirmButtonText: "Okay",
    });
  }

  function showOrderpopUpforError() {
    Swal.fire({
      title: "Error!",
      text: "Please fill all the required fields properly.",
      icon: "error",
    });
  }
})






function checkValidationForCreditCard() {
    const paymentMethod = document.querySelector('input[name="payment"]:checked')?.value;
    if(paymentMethod !== "CreditCard") return true; // ignore validation

    const cardInputs = document.querySelectorAll(".buy_route_credit_debit_card_input_container input");
    const cardErrors = document.querySelectorAll(".buy_product_creditCard_invalid_msg");
    let isValid = true;

    cardErrors.forEach(msg => msg.style.display = 'none');

    cardInputs.forEach((input, index) => {
        if(input.value.trim() === ''){
            cardErrors[index].style.display = 'block';
            isValid = false;
        }
    });

    return isValid;
}