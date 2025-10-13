document.addEventListener("DOMContentLoaded",()=>{
    let allMenuLinkButton = document.querySelectorAll(".us-profile-left-menu-link-button");
    let rightSideMainBox = document.querySelector(".us-profile-right-main");

    allMenuLinkButton.forEach((btn)=>{
        btn.addEventListener("click", () => {
          // Hide All Content Box
          document
            .querySelectorAll(".us-profile-right-content")
            .forEach((box) => {
              box.classList.remove("activeMenu");
            });

          // Remove Active State from link button
          allMenuLinkButton.forEach((b) => {
            b.classList.remove("activeMenuButton");
          });
          // Add activeMenu class to the clicked Button
          btn.classList.add("activeMenuButton");

          // Show Crossponding Box Content
          let targetId = btn.getAttribute("data-target");
          let targetBox = document.getElementById(targetId);
          if (targetBox) {
            targetBox.classList.add("activeMenu");
          }
        });

        
    })

})


// let allMenuLinkButton = document.querySelectorAll(".us-profile-left-menu-link-button");

// allMenuLinkButton.forEach((btn) => {
//   btn.addEventListener("click", () => {
//     // 1️⃣ Hide all right-side content boxes
//     document.querySelectorAll(".us-profile-right-content").forEach((box) => {
//       box.classList.remove("activeMenu");
//     });

//     // 2️⃣ Remove active state from all buttons
//     allMenuLinkButton.forEach((b) => {
//       b.classList.remove("activeMenuButton");
//     });

//     // 3️⃣ Add active state to the clicked button
//     btn.classList.add("activeMenuButton");

//     // 4️⃣ Show corresponding content box
//     let targetId = btn.getAttribute("data-target");
//     let targetBox = document.getElementById(targetId);
//     if (targetBox) {
//       targetBox.classList.add("activeMenu");
//     }
//   });
// });
