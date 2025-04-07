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
    let allInvalidMessage=document.querySelectorAll(".buy_product_form_invalid_msg");
    let saveInformationButton=document.querySelector(".buy_route_address_save_btn");
    
    // Select  final order button 
    let place_order_button=document.getElementById("place_order_button");
    place_order_button.addEventListener("click",function(event){
        event.preventDefault();
        let isFormValid=checkValidation_for_address();
        if(isFormValid){
            showOrderPopUpforSuccess();
        }else{
            showOrderpopUpforError();
        }
    })
    // All Payment method buttons like pay using paypal , google pay , and cash on delivery
    let payment_methodButtons=document.querySelectorAll(".payment_method");
    let credit_card_debit_Card_container=document.querySelector(".buy_route_credit_debit_card_input_container");
    payment_methodButtons.forEach((inputButton)=>{
        inputButton.addEventListener("change",function(event){
          if(event.target.id==="credit_card_debit_card"){         
            credit_card_debit_Card_container.classList.add("open_debit_card_container");
          }else if(event.target.id==="paypal_payment"){
            credit_card_debit_Card_container.classList.remove("open_debit_card_container");
          }else if(event.target.id==="cash_on_delivery"){
            console.log("Cash on delivery Selected  : ");
            credit_card_debit_Card_container.classList.remove("open_debit_card_container");
          }else{
            console.log("Google pay , Paytm Selected  :");
            credit_card_debit_Card_container.classList.remove("open_debit_card_container");
          }
        })
    })
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

let checkValidation_for_address=function(){
    let allInvalidMessage=document.querySelectorAll(".buy_product_form_invalid_msg");
    let isValid = true;
    allInvalidMessage.forEach(function(message){
    let accessParent=message.previousElementSibling;
    if(accessParent.id==="buy_product_email_input"){
        let emailValue=accessParent.value;
        if(!emailValue.includes('@')||emailValue.length<4){
            message.style.display = "block";
            isValid = false;
        }else{
            message.style.display = "none";
        }
    }else if(accessParent.id==="buy_product_mobile_number_input"){
        let cleanedNumber = accessParent.value.replace(/\D/g, '');
        if (cleanedNumber.length === 10 || (cleanedNumber.length === 11 && cleanedNumber.startsWith('0'))) {
            message.style.display = "none";
        } else {
            message.style.display = "block";
            isValid = false;
        }
    }else if(accessParent.id==="buy_product_zipcode_input"){
        let zipcodeNumber = accessParent.value.replace(/\D/g, '');
        if(zipcodeNumber.length<6){
            message.style.display = "block";
            isValid = false;
        }else{
            message.style.display = "none";
        }
    }else{
        if(accessParent.value.length<2){
            message.style.display="block";
            isValid = false;
        }else{
            message.style.display="none";
        }
    }           
    })
    return isValid;  
}