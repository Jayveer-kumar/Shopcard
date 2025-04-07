// LoginLogic Start
let openBtnRegister=document.getElementById("showRegister");
let openBtnLogin=document.getElementById("showLogin");
openBtnRegister.addEventListener("click",()=>{
    let loginFrom=document.querySelector(".loginForm");
    loginFrom.style.display="none";
    let registerForm=document.querySelector(".registerForm");
    registerForm.classList.remove("hidden");
    registerForm.style.display="block";
});
openBtnLogin.addEventListener("click",()=>{
    let loginFrom=document.querySelector(".loginForm");
    let registerForm=document.querySelector(".registerForm");
    registerForm.classList.add("hidden");
    registerForm.style.display="none";
    loginFrom.classList.remove("hidden");
    loginFrom.style.display="block";
})

// Login Logic End 


document.getElementById("registration-image").addEventListener("change",(event)=>{
    let file=event.target.files[0];
    let imagePreview=document.querySelector(".registration-image-preview");
    let noImageSelectPara=document.querySelector(".no-image-selected");
    let fileLabel=document.querySelector(".registration-image-selection-btn");
    if(file){
        noImageSelectPara.style.display="none";
        let reader=new FileReader();
        reader.onload=function(e){
            imagePreview.src=e.target.result;
            imagePreview.style.display="block";
            fileLabel.textContent="Change";
        }
        reader.readAsDataURL(file);
    }else{      
        noImageSelectPara.style.display="inline-block";
        imagePreview.style.display="none";
        fileLabel.textContent="Upload Image";
    }
})
// Registration image preview Logic End Here