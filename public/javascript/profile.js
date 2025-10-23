document.addEventListener("DOMContentLoaded", () => {
  getTab();
  const buttons = document.querySelectorAll(".us-profile-left-menu-link-button");
  const contentBoxes = document.querySelectorAll(".us-profile-right-content");
  const loader = document.querySelector(".us-profile-right-main-loader");

  // Initial visibility set (in case some are pre-checked)
  updateClearVisiblity(); 

  buttons.forEach((button) => {
    button.addEventListener("click", async (e) => {
      const targetId = button.dataset.target;
      const path = button.dataset.path;
      // Remove active states
      buttons.forEach((b) => b.classList.remove("activeMenuButton"));
      contentBoxes.forEach((box) => box.classList.remove("activeMenu"));

      // Show loader
      loader.classList.add("show");

      try {
        const data = await getUserInformationFromServer(`/shopcard/user-profile/${path}`);
        const targetBox = document.getElementById(targetId);
        if (targetBox) {
          targetBox.classList.add("activeMenu");
          if(targetId === "profileInformation"){
            targetBox.innerHTML = renderProfileInformationTabHTML(data);
          } else if(targetId === "myorders"){
            targetBox.innerHTML = renderMyordersHTML(data);
          }else if(targetId === "manageAddress"){
            targetBox.innerHTML = renderManageAddressHTML(data);
          }else if(targetId === "panCardInformation"){
            targetBox.innerHTML = renderPancardInforManationHTML(data);
          }else if(targetId === "giftCard"){
            targetBox.innerHTML = renderGiftCardHTML(data);
          } else if(targetId === "savedUPI"){
            targetBox.innerHTML = renderSavedUPIHTML(data);
          } else if(targetId === "myCoupon"){
            targetBox.innerHTML = renderMyCouponHTML(data);
          } else if(targetId === "myReview_Rating"){
            targetBox.innerHTML = renderMyReviewRatingHTML(data);
          } else if(targetId === "Notification"){
            targetBox.innerHTML = renderNotificationHTML(data);
          } else if(targetId === "Watchlist"){
            targetBox.innerHTML = renderWatchListHTML(data);
          }
          else{
            targetBox.innerHTML = '<h1> No any Id Matched </h1> ';
            console.log("No any Id Matched : ");
          }
        }
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        loader.classList.remove("show");
      }
      // Activate clicked button
      button.classList.add("activeMenuButton");
    });
  });





  

  
  // Main Event Listner for right section container
  let allTabContainer = document.querySelector(".us-profile-right-main");

  allTabContainer.addEventListener("click",(e)=>{
    const target  = e.target;

    if(target.closest(".myOrdersCheckbox")){
      // Checkbox clicked for filter data
      handleCheckboxClickedForFilterOrders(target.closest(".myOrdersCheckbox"));
    } else if(target.closest("#clearAllFilter")){
      // Clear all Filter Checkbox 
      clearAllFilterCheckBox(target.closest("#clearAllFilter"));
    }else if(target.closest(".add-new-address-btn")){
      // Add New Address button 
      handleAddNewAddress(target.closest(".add-new-address-btn"));
    }  
     // Edit profile button 
    else if(target.closest("#editProfileBtn")){
      handleEditProfile(target.closest("#editProfileBtn")); 
    } else if(target.closest(".manageAddress-edit-btn")){
        // Open Edit From 
        handleEditAddress(target.closest(".manageAddress-edit-btn"));
    } else if(target.closest(".manageAddress-cancel-btn")){
      // Hide Edit Form
      handleCancelChangesAddresses(target.closest(".manageAddress-cancel-btn"));
    } else if(target.closest(".manageAddress-save-btn")){
      // Send Address to Server
      handleAddressEditSave(target.closest(".manageAddress-save-btn"));
    } else if(target.closest(".manageAddress-delete-btn")){
      // Delete Clicked Address
      handleDeleteAddress(target.closest(".manageAddress-delete-btn"));
    }
    else{

    }

  })

});





const getUserInformationFromServer = async (path)=>{
  let res = await fetch(path);
  let data = await res.json();
  return data;
}



async function  handleEditProfile(button){
  const parent = button.closest(".us-profile-right-content");
  const inputs = parent.querySelectorAll("input");
  const labels = parent.querySelectorAll(".profile-info-box label");

  const isEditable = !button.classList.contains("editable");
  button.classList.toggle("editable");

  inputs.forEach((i) => (i.disabled = !isEditable));
  labels.forEach((l) => l.classList.toggle("editable", isEditable));

  button.innerHTML = isEditable
    ? `<span class="material-symbols-outlined">done</span><span>Save</span>`
    : `<span class="material-symbols-outlined">edit</span><span>Edit</span>`;
  
    if(!button.classList.contains("editable")){
      console.log("Send this data to Backend : ");
    }else{
      console.log("Abhi Save button Active nahi hai : ");
    }
}

async function handleCheckboxClickedForFilterOrders(checkbox){
  // first check this checkbox is checked or not 

  // if checked then create a new button with same label text for header visiblity

  if(checkbox.checked){
    const lableEl = document.querySelector(`label[for="${checkbox.id}"]`);
    const labelText = lableEl ? lableEl.textContent.trim() : checkbox.id;

    if(!labelText) return;
    createFilterButton(checkbox,labelText);

  }else{
    removeFilterButtonFor(checkbox);
  }

  updateClearVisiblity();
}

function createFilterButton(checkbox, labelText) {
    const filterBox = document.querySelector(".us-profile-right-myorder-fltr-head-btnBox");
    // Avoid duplicate buttons
    if (filterBox.querySelector(`button[data-id="${checkbox.id}"]`)) return;
    const button = document.createElement("button");

    button.innerHTML = `<span class="material-symbols-outlined">close</span> <span>${labelText}</span>`;
    button.setAttribute("data-id", checkbox.id);

    // clicking the 'x' on the button should uncheck the checkbox, remove the button, and update visibility
    const closeIcon = button.querySelector(".material-symbols-outlined");
    closeIcon.addEventListener("click", (e) => {
      e.stopPropagation();
      checkbox.checked = false;
      const existing = filterBox.querySelector(`button[data-id="${checkbox.id}"]`);
      if (existing) existing.remove();
      updateClearVisiblity();
    });

    filterBox.appendChild(button);
  }

function updateClearVisiblity() {
    const checkboxes = document.querySelectorAll(".myOrdersCheckbox");
    let clearBox = document.querySelector(".profile-order-filter-clear");
    let anyChecked = Array.from(checkboxes).some((cb) => cb.checked);
    if (!clearBox) return;
    if (anyChecked) clearBox.classList.remove("hideAllClear");
    else clearBox.classList.add("hideAllClear");
  }

function removeFilterButtonFor(checkbox) {
  const filterBox = document.querySelector(".us-profile-right-myorder-fltr-head-btnBox");
  const existing = filterBox.querySelector(`button[data-id="${checkbox.id}"]`);
  if (existing) existing.remove();
}

function clearAllFilterCheckBox(clearAllBtn){
  const checkboxes = document.querySelectorAll(".myOrdersCheckbox");
  const filterBox = document.querySelector(".us-profile-right-myorder-fltr-head-btnBox");
  if (clearAllBtn) {
    clearAllBtn.addEventListener("click", (e) => {
      checkboxes.forEach((cb) => (cb.checked = false));

      if (filterBox) filterBox.innerHTML = "";
      updateClearVisiblity();
    });
  }
}


// Handle Edit Address

function handleEditAddress(button){
  // 1 . Find Nearest Address Card
  let addressCard = button.closest(".address-card");

  const id = addressCard.dataset.id; 

  // 2. Find Next Sibling Edit Form
  const editForm = document.querySelector(`.edit-address-form[data-id="${id}"]`);

  if(editForm && editForm.classList.contains("hide-form")){
    editForm.classList.remove("hide-form");
    addressCard.style.display = "none";
  }
}

// Handle edit address change cancle button 

function handleCancelChangesAddresses(button){
  let editForm = button.closest(".edit-address-form");
  let id = editForm.dataset.id;
  let addressCard = document.querySelector(`.address-card[data-id="${id}"]`);
  if(addressCard){
    addressCard.style.display = "block";
    editForm.classList.add("hide-form");
  }
}

// Handle Save Address when user edit there existing address
async function handleAddressEditSave(button){
  let id = button.dataset.id;
  let form = document.querySelector(`.edit-address-form-${id}`);
  let manageAddressMainBox = document.querySelector("#manageAddress");

  const formData = {
      fullName : form.querySelector('input[name="fullName"]').value.trim(),
      mobileNumber : form.querySelector('input[name="mobileNumber"]').value.trim(),
      gender  : form.querySelector('input[name="gender"]:checked')?.value,
      pincode: form.querySelector('input[name="pincode"]').value.trim(),
      locality: form.querySelector('input[name="locality"]').value.trim(),
      addressLine: form.querySelector('input[name="addressLine"]').value.trim(),
      city: form.querySelector('input[name="city"]').value.trim(),
      state: form.querySelector('input[name="state"]').value.trim(),
      landmark: form.querySelector('input[name="landmark"]').value.trim(),
      alternatePhone: form.querySelector('input[name="alternatePhone"]').value.trim(),
      addressType: form.querySelector('input[name="addressType"]:checked')?.value,
  }

  try{
    let res = await fetch(`/shopcard/user-profile/address/${id}`,{
      method : "PUT",
      headers : { "Content-Type" : "application/json" },
      body : JSON.stringify(formData)
    })
    let data = await res.json();
    if(data.success){     
      form.classList.add("hide-form");
      manageAddressMainBox.innerHTML = renderManageAddressHTML(data.addresses);
      window.showMessage(data.message,'#4caf50');
    }else{
      window.showMessage(data.message,'#f44336');
    }
  }catch(err){
    console.error("Some Error while updating address ",err);
    window.showMessage("Please check your internet connection and Try again ",'#f44336');
  }
}

// Handle Delete Address

async function handleDeleteAddress(button) {
  let manageAddressMainBox = document.querySelector("#manageAddress");
  console.log("Handle DeleteAddress Function  manageAddressMainBox : "); 
  let addressBox = button.closest(".address-card");
  try{   

    const confirmDelete = await showCustomConfirm("Delete Address?","Are you sure you want to delete this address? This action cannot be undone.");


    if(!confirmDelete) return;

    let res = await fetch(`/shopcard/user-profile/address/${addressBox.dataset.id}`,{
      method : "DELETE",
      headers : { "Content-Type" : "application/json" }
    });
    let data = await res.json();
    console.log("Below is Data : ",data);
    if(data.success){
      manageAddressMainBox.innerHTML = renderManageAddressHTML(data.totalAddress);
      window.showMessage(data.message,'#4caf50');
    }else{
      window.showMessage(data.message,'#f44336');
    }
  }catch(err){
    console.error("Some Error Occured While Deleting Address : ",err);
    window.showMessage("Something went wrong. Please try again",'#f44336');
  }
  
}

async function handleAddNewAddress(button) {
  let manageAddressMainBox = document.querySelector("#manageAddress");
  let newAddresBox = document.querySelector(".add-new-address-hidden-box");
  newAddresBox.style.display = "block"
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
  `
  newAddresBox.innerHTML = newAddressHTML;

  // Event Listner's for cancel save new address or save new address
  let cancelButton  = document.querySelector(".addnewAddress-cancel-btn");
  let saveButton = document.querySelector(".addnewAddress-save-btn");
  

  cancelButton.addEventListener("click",()=>{
   newAddresBox.innerHTML="";
   newAddresBox.style.display="none";
  })

  saveButton.addEventListener("click",async (e)=>{
    e.preventDefault();
    let form = document.querySelector(".addnew-address-form-box");

    // Now collect From Data   

    const formData = {
      fullName : form.querySelector('input[name="fullName"]').value.trim(),
      mobileNumber : form.querySelector('input[name="mobileNumber"]').value.trim(),
      gender  : form.querySelector('input[name="gender"]:checked')?.value,
      pincode: form.querySelector('input[name="pincode"]').value.trim(),
      locality: form.querySelector('input[name="locality"]').value.trim(),
      addressLine: form.querySelector('input[name="addressLine"]').value.trim(),
      city: form.querySelector('input[name="city"]').value.trim(),
      state: form.querySelector('input[name="state"]').value.trim(),
      landmark: form.querySelector('input[name="landmark"]').value.trim(),
      alternatePhone: form.querySelector('input[name="alternatePhone"]').value.trim(),
      addressType: form.querySelector('input[name="addressType"]:checked')?.value,
    }
    try {
      let res = await fetch("/shopcard/user-profile/address/new",{
        method : "post",
        headers: { "Content-Type": "application/json" },
        body : JSON.stringify(formData),
      })
      let data = await res.json();
      if(data.success){
        manageAddressMainBox.innerHTML= renderManageAddressHTML(data.totalAddress);
        window.showMessage("New Address Saved Successfully",'#4caf50');
        newAddresBox.innerHTML="";
        newAddresBox.style.display="none";
      }else{
        window.showMessage("Please Fill all the Address Field's Properly.",'#f44336');
      }
    } catch(e){
      window.showMessage("Something went wrong. Please try again.", '#f44336');
    }


  })
  
}


function showCustomConfirm(title , message){
  return new Promise ((resolve)=>{
    const overlay = document.createElement("div");
    overlay.className = 'confirm-overlay';

    // Create confirm card HTML
    overlay.innerHTML = `
      <div class="custom-confirm-card">
        <div class="confirm-card-content">
          <p class="confirm-card-heading">${title}</p>
          <p class="confirm-card-description">${message}</p>
        </div>
        <div class="confirm-card-button-wrapper">
          <button class="confirm-card-button secondary" data-action="cancel">Cancel</button>
          <button class="confirm-card-button primary" data-action="confirm">Delete</button>
        </div>
        <button class="confirm-exit-button" data-action="cancel">
          <svg height="20px" viewBox="0 0 384 512">
            <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"></path>
          </svg>
        </button>
      </div>
    `;

    // Append to Body
    document.body.appendChild(overlay);

    // Handle Button  Clicks

    overlay.addEventListener("click",(e)=>{
      const action = e.target.closest('[data-action]')?.dataset.action;

      if(action === "confirm"){
        resolve(true);
        removeOverlay();
      }else if(action === "cancel"){
        resolve(false);
        removeOverlay();
      }
    })

    // Remove Overlay function

    function removeOverlay(){
      overlay.style.animation = 'fadeOut 0.3s forwards';
      setTimeout(() => overlay.remove(), 300);
    }

    // Add fadeOut animation 

    const style = document.createElement("style");
    style.textContent = '@keyframes fadeOut { to { opacity: 0; } }';
    document.head.appendChild(style);

  })
}


async function openSelectedProfileTab(tabId) {
    const urlParams = new URLSearchParams(window.location.search);
    const selectedTab = urlParams.get("tab");
    if (!tabId) return;
    const buttons = document.querySelectorAll(
      ".us-profile-left-menu-link-button"
    );
    const contentBoxes = document.querySelectorAll(".us-profile-right-content");
    const loader = document.querySelector(".us-profile-right-main-loader");

    // Now Open Selected Tab
    buttons.forEach((b) => b.classList.remove("activeMenuButton"));
    contentBoxes.forEach((box) => box.classList.remove("activeMenu"));
    // Now Activate Selected Left Button
    let leftMenuButton = document.querySelector(
      `.us-profile-left-menu-link-button[data-target="${tabId}"]`
    );

    // First Show loader
    loader.classList.add("show");

    try {
      // Now Get API Path from leftMenuButton
      let path = leftMenuButton.dataset.path;
      let data = await getUserInformationFromServer(
        `/shopcard/user-profile/${path}`
      );
      console.log("Recieved Data is  : ", data);
      let targetBox = document.getElementById(tabId);
      if (targetBox) {
        targetBox.classList.add("activeMenu");

        if (selectedTab === "profileInformation") {
          targetBox.innerHTML = renderProfileInformationTabHTML(data);
        } else if (selectedTab === "myorders") {
          targetBox.innerHTML = renderMyordersHTML(data);
        } else if (selectedTab === "giftCard") {
          targetBox.innerHTML = renderGiftCardHTML(data);
        } else if (selectedTab === "myCoupon") {
          targetBox.innerHTML = renderMyCouponHTML(data);
        } else {
          console.log("No any Id Matched : ");
        }
      }
    } catch (err) {
      console.error(
        `Some Error Occured in openSelectedProfileTab Function :  `,
        err
      );
    } finally {
      loader.classList.remove("show");
    }

    if (!leftMenuButton) {
      return;
    }
    leftMenuButton.classList.add("activeMenuButton");
}

function getTab(){
  const urlParams = new URLSearchParams(window.location.search);
  const selectedTab = urlParams.get("tab");
  if(selectedTab){
    openSelectedProfileTab(selectedTab);
  }else{
    console.log("No Selected Tab Match in User Profile Page : ");
  }
}


function renderMyordersHTML(data){

  console.log("Render MyOrder function Called : ");

  // Agar koi wishlist item empty  hai
  if (!data || data.length === 0) {
    return `
      <div class="us-profile-right-myorder-contentCardsBox">
       <div class="us-profile-empty-orders">
        <img src="https://cdn.dribbble.com/userupload/36779200/file/original-ec7a201eb6a1916a83ef9582681b8fce.png?resize=1024x865&vertical=center" alt="Empty Orders" class="empty-orders-img" />
        <h2 class="empty-orders-text">Your order collection is empty 😔</h2>
        <button class="shop-now-btn">Shop Now</button>
      </div>
      </div>
    `;
  }

  let myOrderCards = data.map((item)=>{
    `

     <div class="us-profile-right-myorder-contentCard delivered">
                                <!--  Image + Details --> 
          <div class="us-profile-right-myorder-contentCard-left">
              <div class="us-profile-right-myorder-contentCard-image">
                  <img src="https://m.media-amazon.com/images/I/61LKTD-YnrL._UF1000,1000_QL80_.jpg"
                                            alt="Product" />
              </div>
              <div class="us-profile-right-myorder-contentCard-details">
              <p class="us-profile-order-item-title">Boat Airdopes 131</p>
              <p class="us-profile-order-item-price">₹2,452</p>
              </div>
              </div>
    
              <!-- : Status -->
              <div class="us-profile-right-myorder-contentCard-right">
                <p class="order-status">Delivered</p>
              <a href="#" class="us-profile-myorder-item-rate-review-btn">Rate & Review</a>
          </div>
       </div>


    `;
  })

  let tabInnerHTML = `
  <div class="us-profile-right-myOrdersMainBox">
                    <div class="us-profile-right-myOrder-filterBox">
                        <div class="us-profile-right-myorder-filter-head">
                            <div class="us-profile-rght-myordr-fltr-cler">
                                <h4>Add Filter</h4>
                                <div class="profile-order-filter-clear hideAllClear ">
                                    <button id="clearAllFilter">
                                        <span class="material-symbols-outlined">close</span>
                                        <span>Clear All</span>
                                    </button> 
                                    <hr>
                                </div>
                            </div>
                            <div class="us-profile-right-myorder-fltr-head-btnBox">
                            </div>
                        </div>
                        <hr>
                        <div class="us-profile-right-myorder-filter-status">
    
                            <p>Order Status</p>  
    
    
                            <div>
                                <input type="checkbox" name="on-the-way" id="on-the-way" class="myOrdersCheckbox">
                                <label for="on-the-way">on the way</label>
                            </div>
                            <div>
                                <input type="checkbox" name="delivered" id="delivered" class="myOrdersCheckbox">
                                <label for="delivered"> Delivered</label>
                            </div>
                            <div>
                                <input type="checkbox" name="canceled" id="canceled" class="myOrdersCheckbox">
                                <label for="canceled"> Canceled</label>
                            </div>
                            <div>
                                <input type="checkbox" name="returned" id="returned" class="myOrdersCheckbox">
                                <label for="returned"> Returned</label>
                            </div>
                        </div>
                        <div class="us-profile-right-myorder-filter-timeline">
                            <p>Order Time Line</p>
                            <div>
                                <input type="checkbox" name="l30day" id="l30day" class="myOrdersCheckbox">
                                <label for="l30day">Last 30 Day's</label>
                            </div>
                            <div>
                                <input type="checkbox" name="2024" id="2024" class="myOrdersCheckbox">
                                <label for="2024">2024</label>
                            </div>
                            <div>
                                <input type="checkbox" name="2023" id="2023" class="myOrdersCheckbox">
                                <label for="2023">2023</label>
                            </div>
                            <div>
                                <input type="checkbox" name="2022" id="2022" class="myOrdersCheckbox">
                                <label for="2022">2022</label>
                            </div>
                        </div>
                    </div>
                    <div class="us-profile-right-myOrder-contentBox">
                        <div class="us-profile-right-myorder-content-head">
                            <input type="search" placeholder="Search your orders here" id="profile-order-search">
                            <button>
                                <span class="material-symbols-outlined">search</span>
                                <span>Search</span>
                            </button>
                        </div>
                        <div class="us-profile-right-myorder-contentCardsBox">  
                              ${myOrderCards}                   
    
                      </div>
                    </div>
                </div>
  `
  return tabInnerHTML;
}



function renderProfileInformationTabHTML(data){
  console.log("Render ProfileInformation function called with this data  : ",data);
  let tabInnerHTML = `
  <div class="us-profile-right-profileInformationMainBox">
    
                    <div class="us-profile-right-profileInfoHead">
                        <h3>Profile Information</h3>
                        <button class="us-profile-right-edit-profile-button" id="editProfileBtn">
                            <span class="material-symbols-outlined">edit</span>
                            <span>Edit</span>
                        </button>
                    </div>
    
                    <div class="us-profile-right-profileInfoContainer">
                        <!-- Box 1: Name -->
                        <div class="profile-info-box">
                            <p>Your Name</p>
                            <div class="name-box">
                                <input type="text" id="firstName" value="${data.name}" disabled>
                            </div>
                        </div>
    
                        <!-- Box 2: Gender -->
                        <div class="profile-info-box">
                            <p>Your Gender</p>
                            <div class="gender-box">
                                <label><input type="radio" name="gender" value="male" disabled ${data.gender === 'Male' ? 'checked' : ''} > Male</label>
                                <label><input type="radio" name="gender" value="female" disabled ${data.gender === 'Femail' ? 'checked' : ''} > Female</label>
                                <label><input type="radio" name="gender" value="other" disabled ${data.gender === 'Other' ? 'checked' : ''} > Other</label>
                            </div>
                        </div>
    
                        <!-- Box 3: Email -->
                        <div class="profile-info-box">
                            <p>Your Email</p>
                            <input type="email" id="email" value="${data.email}" disabled>
                        </div>
    
                        <!-- Box 4: Mobile Number -->
                        <div class="profile-info-box">
                            <p>Your Mobile Number</p>
                            <input type="tel" id="mobile" value="+91 ${data.phone}" disabled>
                        </div>
                    </div>
                    <div class="us-profile-right-profileInfo-faqBox">
                        <h4>FAQs</h4>
    
                        <div class="us-profile-faq-item">
                            <h5>What happens when I update my email address (or mobile number)?</h5>
                            <p>
                                Your login email ID (or mobile number) changes likewise. You'll receive
                                all your account-related communication on your updated email address (or mobile number).
                            </p>
                        </div>
    
                        <div class="us-profile-faq-item">
                            <h5>When will my ShopCard account be updated with the new email address (or mobile number)?</h5>
                            <p>
                                It happens as soon as you confirm the verification code sent to your email (or mobile)
                                and save the changes.
                            </p>
                        </div>
    
                        <div class="us-profile-faq-item">
                            <h5>What happens to my existing ShopCard account when I update my email address (or mobile
                                number)?</h5>
                            <p>
                                Updating your email address (or mobile number) doesn't invalidate your account.
                                Your account remains fully functional. You'll continue seeing your order history,
                                saved information, and personal details.
                            </p>
                        </div>
    
                        <div class="us-profile-faq-item">
                            <h5>Does my Seller account get affected when I update my email address?</h5>
                            <p>
                                ShopCard follows a ‘single sign-on’ policy. Any changes will reflect in your Seller account
                                as well.
                            </p>
                        </div>
    
                        <div class="us-profile-faq-actions">
                            <button class="us-profile-deactivate-btn">Deactivate Account</button>
                            <button class="us-profile-delete-btn">Delete Account</button>
                        </div>
                    </div>
                </div>
  `

  return tabInnerHTML;

}



// Select Main Box for Adding new Address 
function renderManageAddressHTML(data){
  console.log("Render Manage Address Function Called with this data : ",data)
    if (!data || data.length === 0) {
    return `
      <div class="empty-address-box">
        <img src="https://cdni.iconscout.com/illustration/premium/thumb/place-not-found-illustration-svg-download-png-6423006.png" alt="Empty Address" />
        <h1>No saved addresses yet .</h1>
        <p> Save your addresses for a faster, more convenient checkout next time. <br /> by clicking <b> Add new address button </b> </p>
        <button class="add-new-address-btn">
        <span class="material-symbols-outlined">add</span>
        <span>Add a new address</span>
        </button>

        <div class="add-new-address-hidden-box" style="display:none" >

        </div>

      </div>
    `;
  }
  // If Address Length > 0
  let addressCard = data.map((item)=>{
    console.log(item);
    return `
    <div class="address-card address-card-${item._id}" data-id="${item._id}">
                            <div class="address-card-top">
                                <span class="address-tag"> ${item.addressType? item.addressType : "Home" } </span>
                                <div class="address-menu">
                                    <span class="material-symbols-outlined menu-icon">more_vert</span>
                                    <div class="menu-options">
                                        <button class="manageAddress-edit-btn">Edit</button>
                                        <button data-id="${item._id}"  class="manageAddress-delete-btn">Delete</button>
                                    </div>
                                </div>
                            </div>
    
                            <p class="address-user">
                                <span class="user-name">${item.fullName}</span> |
                                <span class="user-phone">${item.mobileNumber}</span>
                            </p>
                            <p class="address-full">
                              ${item.landmark},  ${item.addressLine}, ${item.locality}, ${item.city}, ${item.state} - ${item.pincode}.
                            </p>
                        
                    </div>
    
                    <!-- Hidden Edit Form -->
                    <div class="edit-address-form edit-address-form-${item._id} hide-form" data-id="${item._id}" >
                        <h4>Edit Address</h4>
                        <div class="form-group">
                            <label>Name</label>
                            <input type="text" name="fullName" value="${item.fullName}">
                        </div>
                        <div class="form-group">
                            <label>10-digit Mobile Number</label>
                            <input type="text" name="mobileNumber" value="${item.mobileNumber}">
                        </div>
                        <div class="form-group">
                           <label> Gender </label>
                            <div class="gender-type">
                                 <label><input type="radio" name="gender" value="Male" ${item.gender === 'Male' ? 'checked' : ''} > Male</label>
                                 <label><input type="radio" name="gender" value="Femail" ${item.gender === 'Femail' ? 'checked' : ''} > Femail</label>
                                 <label><input type="radio" name="gender" value="Other" ${item.gender === 'Other' ? 'checked' : ''} > Other</label>
                            </div>                         
                        </div>
                        <div class="form-group">
                            <label>Pincode</label>
                            <input type="text" name="pincode" value="${item.pincode}">
                        </div>
                        <div class="form-group">
                            <label>Locality</label>
                            <input type="text" name="locality" value="${item.locality}">
                        </div>
                        <div class="form-group">
                            <label>Address (Area and Street)</label>
                            <input type="text" name="addressLine" value="${item.addressLine}">
                        </div>
                        <div class="form-group">
                            <label>City/District/Town</label>
                            <input type="text" name="city" value="${item.city}">
                        </div>
                        <div class="form-group">
                            <label>State</label>
                            <input type="text" name="state" value="${item.state}">
                        </div>
                        <div class="form-group">
                            <label>Landmark (Optional)</label>
                            <input type="text" name="landmark" value="${item.landmark}">
                        </div>
                        <div class="form-group">
                            <label>Alternate Phone (Optional)</label>
                            <input type="text" name="alternatePhone" value="${item.alternatePhone}">
                        </div>
                        <div class="form-group">
                            <label>Address Type</label>
                            <div class="address-type">
                                <label><input type="radio" name="addressType" value="Home" ${item.addressType === "Home" ? "checked" : ""}  > Home</label>
                                <label><input type="radio" name="addressType" value="Work" ${item.addressType === "Work" ? "checked" : ""} > Work</label>
                                <label><input type="radio" name="addressType" value="Office" ${item.addressType === "Office" ? "checked" : ""} > Office</label>
                            </div>
                        </div>
                        <div class="form-buttons">
                            <button class="manageAddress-save-btn" data-id="${item._id}" >Save</button>
                            <button class="manageAddress-cancel-btn">Cancel</button>
                        </div>
                    </div>


    `
  }).join("")


  return `
  <div class="us-profile-right-manageAddressMainBox">
                    
                    <div class="profile-manageaddress-head">
                        <h3>Manage Address</h3>
                        <button class="add-new-address-btn">
                            <span class="material-symbols-outlined">add</span>
                            <span>Add a new address</span>
                        </button>
                    </div>
    
                    <!-- Saved Address Cards -->
                    <div class="saved-address-list">
                    ${addressCard}
                    </div>
                    <div class="add-new-address-hidden-box" style="display:none" >

                    </div>
  </div>
  `
}



function renderPancardInforManationHTML(data){
  console.log("Render Pancard Information function called with this data: ",data)
  let tabInnerHTML = `
  <div class="us-profile-pancard-mainBox">
                    <h3 class="us-profile-pancard-heading">PAN Card Information</h3>
    
                    <div class="us-profile-pancard-form">
                        <div class="us-profile-pancard-inputBox">
                            <label for="panNumber">PAN Card Number</label>
                            <input type="text" id="panNumber" placeholder="Enter your PAN card number" />
                        </div>
    
                        <div class="us-profile-pancard-inputBox">
                            <label for="fullName">Full Name</label>
                            <input type="text" id="fullName" placeholder="Enter your full name" />
                        </div>
    
                        <div class="us-profile-pancard-inputBox">
                            <label for="uploadPan">Upload PAN Card (Only JPEG file is allowed)</label>
                            <input type="file" id="uploadPan" accept="image/jpeg" />
                        </div>
    
                        <div class="us-profile-pancard-declarationBox">
                            <input type="checkbox" id="declarePan" />
                            <label for="declarePan">
                                I do hereby declare that PAN furnished/stated above is correct and belongs to me, registered
                                as an
                                account holder with www.shopcart.com.
                                I further declare that I shall solely be held responsible for the consequences, in case of
                                any false
                                PAN declaration.
                            </label>
                        </div>
    
                        <button class="us-profile-pancard-uploadBtn">UPLOAD</button>
    
                        <p class="us-profile-pancard-terms">
                            Read <a href="#">Terms & Conditions</a> of PAN Card Information.
                        </p>
                    </div>
                </div>
  `
  return tabInnerHTML;
}

function renderGiftCardHTML(data){
  console.log("render Gift Card function called with this data : ",data)
  let tabInnerHTML = `
  <div class="us-profile-right-giftCardMainBox">
                    <h2 class="us-profile-giftCard-heading">Gift Cards</h2>
                    <hr />
    
                    <div class="us-profile-giftCard-content">
                        <div class="us-profile-giftCard-inner">
                            <img src="https://lepure.in/cdn/shop/files/GiftCard.png?v=1754908948&width=2048" alt="Gift Card"
                                class="us-profile-giftCard-image" />
                            <div class="us-profile-giftCard-text">
                                <h3>No Gift Cards Available</h3>
                                <p>
                                    You don’t have any active gift cards right now.
                                    When you purchase or receive a ShopCart Gift Card, it will appear here.
                                </p>
                                <button class="us-profile-giftCard-btn">Buy a Gift Card</button>
                            </div>
                        </div>
                    </div>
                </div>
  `

  return  tabInnerHTML;
}


function renderSavedUPIHTML(data){
  console.log("render savedUPI function with this data : ",data)
  let tabInnerHTML = `
  <div class="us-profile-savedupi-mainBox">
                    <h3 class="us-profile-savedupi-heading">Manage Saved UPI</h3>
    
                    <div class="us-profile-savedupi-listBox">
                        <div class="us-profile-savedupi-card">
                            <div class="us-profile-savedupi-left">
                                <h4>Google Pay UPI</h4>
                                <p>jayveerk394@oksbi</p>
                            </div>
                            <div class="us-profile-savedupi-right">
                                <span class="material-symbols-outlined delete-icon">delete</span>
                            </div>
                        </div>
                    </div>
    
                    <div class="us-profile-savedupi-faqBox">
                        <h4>FAQs</h4>
    
                        <div class="us-profile-savedupi-faq">
                            <p class="question">Why is my UPI being saved on Shopcart?</p>
                            <p class="answer">
                                It's quicker. You can save the hassle of typing in the complete UPI information every time
                                you shop
                                at Shopcart by saving your UPI details.
                                You can make your payment by selecting the saved UPI ID of your choice at checkout. While
                                this is
                                obviously faster, it is also very secure.
                            </p>
                        </div>
    
                        <div class="us-profile-savedupi-faq">
                            <p class="question">Is it safe to save my UPI on Shopcart?</p>
                            <p class="answer">
                                Absolutely. Your UPI ID information is 100 percent safe with us. UPI ID details are non PCI
                                compliant and are non confidential data.
                            </p>
                        </div>
    
                        <div class="us-profile-savedupi-faq">
                            <p class="question">What all UPI information does Shopcart store?</p>
                            <p class="answer">
                                Shopcart only stores UPI ID and payment provider details. We do not store UPI PIN/MPIN.
                            </p>
                        </div>
    
                        <div class="us-profile-savedupi-faq">
                            <p class="question">Can I delete my saved UPI?</p>
                            <p class="answer">
                                Yes, you can delete your UPI ID at any given time.
                            </p>
                        </div>
    
                        <p class="us-profile-savedupi-viewFaqs">View all FAQs</p>
                    </div>
                </div>
  `

  return tabInnerHTML;
}

function renderMyCouponHTML(data){
  console.log("render Mycoupon function called with this data : ",data);
  let tabInnerHTML = `
   <div class="us-profile-coupons-mainBox">
                    <h3 class="us-profile-coupons-heading">Available Coupons</h3>
    
                    <div class="us-profile-coupons-list">
                        <!-- Coupon Card -->
                        <div class="us-profile-coupons-card">
                            <div class="us-profile-coupons-left">
                                <h4>Get product at Re.1</h4>
                                <p>Valid till 31 Oct, 2025</p>
                                <p class="coupon-detail">
                                    Get product at Re.1 (Valid till: 11:59 PM, 31 Oct)
                                </p>
                                <p class="coupon-terms">View T&amp;C</p>
                            </div>
                        </div>
    
                        <div class="us-profile-coupons-card">
                            <div class="us-profile-coupons-left">
                                <h4>Get products at Re.1</h4>
                                <p>Valid till 31 Oct, 2025</p>
                                <p class="coupon-detail">
                                    Get products at Re.1 (Valid till: 11:59 PM, 31 Oct)
                                </p>
                                <p class="coupon-terms">View T&amp;C</p>
                            </div>
                        </div>
    
                        <div class="us-profile-coupons-card">
                            <div class="us-profile-coupons-left">
                                <h4>Get product at Re.1</h4>
                                <p>Valid till 31 Oct, 2025</p>
                                <p class="coupon-detail">
                                    Get product at Re.1 (Valid till: 11:59 PM, 31 Oct)
                                </p>
                                <p class="coupon-terms">View T&amp;C</p>
                            </div>
                        </div>
                    </div>
    
                    <p class="us-profile-coupons-viewMore">View more</p>
    
                    <h3 class="us-profile-coupons-heading">Upcoming Coupons</h3>
    
                    <div class="us-profile-coupons-list">
                        <div class="us-profile-coupons-card upcoming">
                            <div class="us-profile-coupons-left">
                                <h4>Steal Deal on Coffee Maker</h4>
                                <p>Valid till 17 Oct, 2025</p>
                                <p class="coupon-detail">
                                    Steal Deal on Coffee Maker (Valid till: 05:20 PM, 17 Oct)
                                </p>
                                <p class="coupon-terms">View T&amp;C</p>
                            </div>
                        </div>
                    </div>
                </div>
  `
  return tabInnerHTML;
}

function renderMyReviewRatingHTML(data){
  console.log("Render My Review function called with this data : ",data)
  let tabInnerHTML = `
  <div class="us-profile-reviews-mainBox">
                    <h3 class="us-profile-reviews-heading">My Reviews (1)</h3>
    
                    <!-- User Review List -->
                    <div class="us-profile-reviews-list">
    
                        <!-- Single Review Card -->
                        <div class="us-profile-reviews-card">
                            <div class="us-profile-reviews-product">
                                <img src="https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRAWX-W3CQ2r4wyTOGYuT9vJ6HRP0-40i-D9zz-Y9PLI324cYwwOQbhYuBBjLxgstVsF5TJbeFw8asa4XfbXYfPIxCw3zfaghxBzunes9A"
                                    alt="Product Image" />
                                <div class="us-profile-reviews-details">
                                    <h4>TRIGGR Ultrabuds N1 Neo with ENC, 40Hr Playback, 13mm Drivers, Rich Bass, Fast
                                        Charging
                                        Bluetooth</h4>
                                    <div class="us-profile-reviews-rating">
                                        ⭐⭐⭐⭐⭐ <span>5</span>
                                    </div>
                                    <h5>Wonderful</h5>
                                    <p>
                                        Amazing buds 😁 👏 sound quality is good and battery backup is also good
                                    </p>
                                    <div class="us-profile-reviews-userInfo">
                                        <span>Jayveer</span> | <span class="certified">Certified Buyer</span> | <span>10
                                            Jun,
                                            2025</span>
                                    </div>
    
                                    <div class="us-profile-reviews-actions">
                                        <button><span class="material-symbols-outlined">edit</span> Edit</button>
                                        <button><span class="material-symbols-outlined">delete</span> Delete</button>
                                        <button><span class="material-symbols-outlined">share</span> Share</button>
                                    </div>
                                </div>
                            </div>
                        </div>
    
                    </div>
    
                    <!-- Orders pending review -->
                    <h3 class="us-profile-reviews-subheading">Orders you might be interested reviewing</h3>
    
                    <div class="us-profile-reviews-pending-list">
    
                        <!-- Pending Review Card -->
                        <div class="us-profile-reviews-pending-card">
                            <img src="https://m.media-amazon.com/images/I/71LAS1-Tr4L._UF1000,1000_QL80_.jpg"
                                alt="Product Image" />
                            <div class="us-profile-reviews-pending-details">
                                <h4>SSC General Awareness | Chapter Wise And Type Wise | Aditya Ranjan Sir | HINDI MEDIUM |
                                    SSC GS
                                </h4>
                                <div class="stars">★★★★★</div>
                                <button class="review-btn">Rate and Review</button>
                            </div>
                        </div>
    
                        <div class="us-profile-reviews-pending-card">
                            <img src="https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/MQTQ3?wid=1144&hei=1144&fmt=jpeg&qlt=90&.v=dkp4djAxbnA1NnpYWDIvVklnLzRpUWtuVHYzMERCZURia3c5SzJFOTlPZ3oveDdpQVpwS0ltY2w2UW05aU90T1lYTmlwOFY3ZXdFd0FRY2dWaUc5UlE"
                                alt="Product Image" />
                            <div class="us-profile-reviews-pending-details">
                                <h4>VDTECH Airdrops pro 3 White wireless bluetooth earbuds & earbuds case Bluetooth</h4>
                                <div class="stars">★★★★★</div>
                                <button class="review-btn">Write a Review</button>
                            </div>
                        </div>
    
                    </div>
                </div>
  `

  return tabInnerHTML;
}


function renderNotificationHTML(data){
  console.log("Render Notification function  called with this data : ",data)
  let tabInnerHTML = `
  <div class="us-profile-right-notificationMainBox">
                    <h2 class="us-profile-notification-title">Notifications</h2>
                    <hr>
    
                    <div class="us-profile-notification-card">
                        <img src="https://thumbs.dreamstime.com/b/phone-alert-notification-phone-alert-notification-vector-flat-style-illustration-human-hand-holding-mobile-smartphone-speech-110306568.jpg"
                            alt="Notification Icon" class="us-profile-notification-icon" />
                        <div class="us-profile-notification-content">
                            <h3 class="us-profile-notification-heading">All caught up!</h3>
                            <p class="us-profile-notification-text">
                                There are no new notifications for you.
                            </p>
                        </div>
                    </div>
                </div>
  `

  return tabInnerHTML;
}

function renderWatchListHTML(data){

  // Agar koi wishlist item empty  hai
  if (!data || data.length === 0) {
    return `
      <div class="us-profile-right-wishlistMainBox">
        <h2 class="us-profile-wishlist-title">My Wishlist <span>(0)</span></h2>
        <div class="us-profile-empty-wishlist">
          <p>Your wishlist is empty 😔</p>
          <button class="shop-now-btn">Shop Now</button>
        </div>
      </div>
    `;
  }

  const watchlistCards = data.map((item)=>{
    return `
    <div class="us-profile-wishlist-card">
        <img src="${item.image[0]}" alt="Product Image" class="us-profile-wishlist-image">
        <div class="us-profile-wishlist-details">
          <p>${item.title}</p>
          <p class="us-profile-wishlist-price">
            ₹${item.prize} 
            <span class="us-profile-wishlist-oldPrice">₹${item.oldPrice}</span>
            <span class="us-profile-wishlist-off">${item.discount}% off</span>
          </p>
        </div>
        <button class="us-profile-wishlist-deleteBtn">
          <span class="material-symbols-outlined watchList-delete-icon">delete</span>
        </button>
      </div>
    `
  }).join("");

  return `
    <div class="us-profile-right-wishlistMainBox">
      <h2 class="us-profile-wishlist-title">My Wishlist <span>(${data.length})</span></h2>
      <div class="us-profile-wishlist-container">
        ${watchlistCards}
      </div>
    </div>
  `;
}