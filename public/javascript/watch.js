document.addEventListener("DOMContentLoaded", () => {
    // Product Size Selection Logic
    let allwtc_productsizeBtn = document.querySelectorAll(".wtc_product-sizeBtn");
    allwtc_productsizeBtn.forEach((buttons) => {
        buttons.addEventListener("click", function () {
            allwtc_productsizeBtn.forEach((btn) => btn.classList.remove("wtc-product-size-active"));
            this.classList.add("wtc-product-size-active");
            let sizeValue = encodeURIComponent(this.textContent.trim());
            const url = new URL(window.location);
            url.searchParams.set("Size", sizeValue);
            history.pushState(null, "", url);
        })
    })
    // Change image based on user selection
    let productMainimage = document.querySelector(".wtc-productimage");
    let allProductImage = document.querySelectorAll(".select-prodct-img");
    allProductImage.forEach((image) => {
        image.addEventListener("click", (ele) => {
            productMainimage.setAttribute("src", ele.target.currentSrc); 
        })
    })
    // Increase and decrease product quantity
    let productCurrentQuantity = 1;
    let increaseQuantityBtn = document.querySelector(".plusQuantity");
    let decreaseQuantityBtn = document.querySelector(".minusQuantity");
    let productQuantityPara = document.querySelector(".wtc-item-current-quantity");
    increaseQuantityBtn.addEventListener("click", () => {
        productCurrentQuantity = increaseQuantity(productCurrentQuantity);
        productQuantityPara.textContent = productCurrentQuantity;
        const url = new URL(window.location);
        url.searchParams.set("Quantity", productCurrentQuantity);
        history.pushState(null, "", url);
    })
    decreaseQuantityBtn.addEventListener("click", () => {
        productCurrentQuantity = decreaseQuantity(productCurrentQuantity);
        productQuantityPara.textContent = productCurrentQuantity;
        const url = new URL(window.location);
        url.searchParams.set("Quantity", productCurrentQuantity);
        history.pushState(null, "", url);
    });


    // send Size , color and quantity in url so be able to access these property in buy page

    let buyButton = document.querySelector(".buy_Productbutton");
    buyButton.addEventListener("click", (event) => {
        let productId = window.location.pathname.split("/")[2];
        let selectedItem = window.location.search;
        let buyLink = document.querySelector(".buy_Productbutton").parentElement;
        if (selectedItem.length) {
            buyLink.href = `/shopcard/${productId}/checkout${selectedItem}`;
        } else {
            buyLink.href = `/shopcard/${productId}/checkout`;
        }
    })

    function increaseQuantity(quantity) {
        return quantity + 1;
    }
    function decreaseQuantity(quantity) {
        return quantity > 1 ? quantity - 1 : 1;
    }


    // Product Share Logic Start here

    let shareButtons = document.querySelectorAll(".social-icon");
    let shareUrl = window.location.href;
    let shareProductTitle = document.querySelector(".wtc-productTitle").textContent;
    let shareProductImage = document.querySelector(".wtc-productimage").src;
    let shareProductDescription = document.querySelector(".wtc-product-Description").textContent;

    shareButtons.forEach((button) => {
        button.addEventListener("click", (event) => {
            let sharePlatform = event.currentTarget.dataset.platform;
            let shareLink;
            switch (sharePlatform) {
                case "facebook":
                    shareLink = `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`;
                    break;
                case "twitter":
                    shareLink = `https://twitter.com/intent/tweet?text=${shareProductTitle}&url=${shareUrl}`;
                    break;
                case "whatsapp":
                    shareLink = `https://api.whatsapp.com/send?text=${shareProductTitle} ${shareUrl}`;
                    break;
                case "linkedin":
                    shareLink = `https://www.linkedin.com/shareArticle?mini=true&url=${shareUrl}&title=${shareProductTitle}&summary=${shareProductDescription}&source=${shareProductImage}`;
                    break;
                default:
                    break;
            }
            if (shareLink) {
                window.open(shareLink, "_blank");
            }
        })
    })

    // Product Share Logic End here


    // Review Logic Start here

    // Preview Review Form Logic
    let previewForm = document.getElementById("previewForm");
    previewForm.addEventListener("submit", (event) => {
        event.preventDefault();
    });

    let reviewEditForms = document.querySelectorAll(".reviewEditForm");
    let reviewEditButtons = document.querySelectorAll(".reviewEditButton");
    let editReviewUpdateButtons = document.querySelectorAll(".editReviewUpdateButton");
    let allOldReviewParagraphs = document.querySelectorAll(".wtc_review_descriptionPara");

    if (reviewEditButtons !== null) {
        reviewEditButtons.forEach((button, index) => {
            button.addEventListener("click", (event) => {
                const newUrl = window.location.pathname + "?edit=true";
                history.pushState(null, "", newUrl);
                allOldReviewParagraphs[index].style.display = "none";
                reviewEditForms[index].classList.remove("CloseEditForm");
                reviewEditForms[index].classList.add("openEditForm");
                button.style.display = "none";
            })
        })// End Here
        editReviewUpdateButtons.forEach((button, index) => {
            button.addEventListener("click", (event) => {
                reviewEditForms[index].classList.add("CloseEditForm");
                reviewEditForms[index].classList.remove("openEditForm");
                allOldReviewParagraphs[index].style.display = "block";
            })
        })// End Here

    }

})
