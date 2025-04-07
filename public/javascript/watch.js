document.addEventListener("DOMContentLoaded",()=>{
    // Product Size Selection Logic
    let allwtc_productsizeBtn=document.querySelectorAll(".wtc_product-sizeBtn");
    allwtc_productsizeBtn.forEach((buttons)=>{
        buttons.addEventListener("click",function(){
            allwtc_productsizeBtn.forEach((btn)=>btn.classList.remove("wtc-product-size-active"));
            this.classList.add("wtc-product-size-active");
            let sizeValue = encodeURIComponent(this.textContent.trim());          
            const url=new URL(window.location);
            url.searchParams.set("Size",sizeValue);
            history.pushState(null,"",url);               
        })
    }) 
    // Change image based on user selection
    let productMainimage=document.querySelector(".wtc-productimage");
    let allProductImage=document.querySelectorAll(".select-prodct-img");
    allProductImage.forEach((image)=>{
        image.addEventListener("click",(ele)=>{ 
            productMainimage.setAttribute("src",ele.target.currentSrc);
        })
    })
    // Increase and decrease product quantity
    let productCurrentQuantity=1;
    let increaseQuantityBtn=document.querySelector(".plusQuantity");
    let decreaseQuantityBtn=document.querySelector(".minusQuantity");
    let productQuantityPara=document.querySelector(".wtc-item-current-quantity");
    increaseQuantityBtn.addEventListener("click",()=>{ 
        productCurrentQuantity=increaseQuantity(productCurrentQuantity);
        productQuantityPara.textContent=productCurrentQuantity;
        const url=new URL(window.location);
        url.searchParams.set("Quantity",productCurrentQuantity);
        history.pushState(null,"",url);
    })
    decreaseQuantityBtn.addEventListener("click",()=>{
        productCurrentQuantity=decreaseQuantity(productCurrentQuantity);
        productQuantityPara.textContent=productCurrentQuantity;
        const url = new URL(window.location);
        url.searchParams.set("Quantity",productCurrentQuantity);
        history.pushState(null,"",url);
    });
    

    // send Size , color and quantity in url so be able to access these property in buy page

    let buyButton=document.querySelector(".buy_Productbutton");
    buyButton.addEventListener("click",(event)=>{
        let productId=window.location.pathname.split("/")[2];
        let selectedItem=window.location.search;
        let buyLink= document.querySelector(".buy_Productbutton").parentElement;
        if(selectedItem.length){
            buyLink.href=`/shopcard/${productId}/checkout${selectedItem}`;
        }else{
            buyLink.href=`/shopcard/${productId}/checkout`;
        }
    })

    function increaseQuantity(quantity){
        return quantity+1;
    }
    function decreaseQuantity(quantity){
        return quantity>1?quantity-1:1; 
    }
    

    // Review Logic Start here

    // Preview Review Form Logic
    let previewForm=document.getElementById("previewForm");
    previewForm.addEventListener("submit",(event)=>{
        event.preventDefault();
    });

    let reviewEditForm=document.getElementById("reviewEditForm");
    let reviewEditButton=document.querySelector(".reviewEditButton");
    let editReviewUpdateButton=document.getElementById("editReviewUpdateButton");

    if(reviewEditButton !==null){
        reviewEditButton.addEventListener("click", (event) => {
            event.preventDefault();
            reviewEditForm.classList.remove("CloseEditForm");
            reviewEditForm.classList.add("openEditForm");
            console.log("OpenForm class Added : ");
            let oldReviewPara = document.getElementById("wtc_review_descriptionPara");
            const newUrl = window.location.pathname + "?edit=true";
            history.pushState(null, "", newUrl);
            // Edit form dikhana        
            oldReviewPara.style.display = "none";
            reviewEditForm.style.display = "block";
            reviewEditButton.style.display = "none";
        })

        if (reviewEditForm.style.display === "block") {
            editReviewUpdateButton.addEventListener("click", (event) => {
                event.preventDefault();
                reviewEditForm.classList.add("CloseEditForm");
                reviewEditForm.classList.remove("openEditForm");
                console.log("OpenForm class removed : ");
            })
        }
    }  
    
})
