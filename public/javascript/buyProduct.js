document.addEventListener("DOMContentLoaded",()=>{  
  
    let params=new URLSearchParams(window.location.search);
    let productSize=params.get("Size");
    let productQuantity=params.get("Quantity");
    if(productSize){
        let productSizeText=document.querySelector(".buy_product_sizeValue");
        productSizeText.textContent=productSize;
    }
    if(productQuantity){
        let productQuantityText=document.querySelector(".buy_route_selected_product_quantity");
        productQuantityText.textContent=productQuantity;
    }


    let saveInformationButton=document.querySelector(".buy_route_address_save_btn");

    
    
    // Select  final order button 
    let place_order_button = document.getElementById("place_order_button");
    if (place_order_button) {
      place_order_button.addEventListener("click", function (event) {
        event.preventDefault();

        // Pehle selected payment method lo
        const selectedPaymentMethod = document.querySelector(
          'input[name="payment_method"]:checked'
        )?.id;

        // Address validation
        const validateAddress = checkValidation_for_address();

        // Credit card validation sirf tab
        let isCreditCardValid = true;
        if (selectedPaymentMethod === "credit_card_debit_card") {
          isCreditCardValid = checkValidationForCreditCard();
        }

        // Ab sab valid hua to button enable karo aur popup dikhao
        if (validateAddress && isCreditCardValid) {
          place_order_button.classList.remove("disabled-place-order-btn");
          showOrderPopUpforSuccess();
        } else {
          place_order_button.classList.add("disabled-place-order-btn");
          showOrderpopUpforError();
          return; // optional — error hone par kuch aur mat karo
        }
      });
    }

    // All Payment method buttons like pay using paypal , google pay , and cash on delivery
    let payment_methodButtons = document.querySelectorAll(".payment_method");
    let credit_card_debit_Card_container = document.querySelector(
      ".buy_route_credit_debit_card_input_container"
    );
    payment_methodButtons.forEach((inputButton) => {
      inputButton.addEventListener("change", function (event) {
        if (event.target.id === "credit_card_debit_card") {
          credit_card_debit_Card_container.classList.add(
            "open_debit_card_container"
          );
        } else {
          credit_card_debit_Card_container.classList.remove(
            "open_debit_card_container"
          );
        }
      });
    });
    // Order Flash message Function
    function showOrderPopUpforSuccess(){
        Swal.fire({
            title: "Order Successful!",
            text: "Your order has been placed successfully.",
            icon: "success",
            confirmButtonText: "Okay",
        });          
    }

    function showOrderpopUpforError(){
        Swal.fire({
            title: "Error!",
            text: "Please fill all the required fields properly.",
            icon: "error"
        });
    }
})

let checkValidation_for_address = function() {
    // Select only address-related error paragraphs
    let allInvalidMessage = document.querySelectorAll(".buy_product_form_invalid_msg");
    let isValid = true;

    allInvalidMessage.forEach(function(message){
        let accessParent = message.previousElementSibling;

        // Email field validation
        if(accessParent.id === "buy_product_email_input"){
            let emailValue = accessParent.value;
            if(!emailValue.includes('@') || emailValue.length < 4){
                message.style.display = "block";
                isValid = false;
            }else{
                message.style.display = "none";
            }
        }
        // Mobile number validation
        else if(accessParent.id === "buy_product_mobile_number_input"){
            let cleanedNumber = accessParent.value.replace(/\D/g, '');
            if(cleanedNumber.length === 10 || (cleanedNumber.length === 11 && cleanedNumber.startsWith('0'))) {
                message.style.display = "none";
            } else {
                message.style.display = "block";
                isValid = false;
            }
        }
        // Zipcode validation
        else if(accessParent.id === "buy_product_zipcode_input"){
            let zipcodeNumber = accessParent.value.replace(/\D/g, '');
            if(zipcodeNumber.length < 6){
                message.style.display = "block";
                isValid = false;
            }else{
                message.style.display = "none";
            }
        }
        // Generic validation for other fields
        else{
            if(accessParent.value.trim().length < 2){
                message.style.display = "block";
                isValid = false;
            }else{
                message.style.display = "none";
            }
        }           
    });

    return isValid;  
}



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


