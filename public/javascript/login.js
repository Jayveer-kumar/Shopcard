// Login Logic Start Here
const params= new URLSearchParams(window.location.search);
const action=params.get("action"); 

let openBtnRegister=document.getElementById("showRegister");
let openBtnLogin=document.getElementById("showLogin");
// Create a function to show login register form based on action
function showFrom(action){
    let loginFrom=document.querySelector(".loginForm");
    let registerForm=document.querySelector(".registerForm");
    if(action==="register"){
        loginFrom.style.display="none";
        registerForm.classList.remove("hidden");
        registerForm.style.display="block";
    }else if(action==="login"){
        registerForm.classList.add("hidden");
        registerForm.style.display="none";
        loginFrom.classList.remove("hidden");
        loginFrom.style.display="block";
    }else{
        loginFrom.classList.remove("hidden");
        registerForm.classList.add("hidden");        
        registerForm.style.display="none";
        loginFrom.style.display="block";
    }
}
showFrom(action);

// Also Handle the Click Event of already have account and create new account
// So basically we are creating a function that will erase action query from the url and set new action based on the button clicked
// And then we will call the showFrom function to show the respective form
function handleClick(action){
    let url=new URL(window.location.href);
    url.searchParams.delete("action");
    url.searchParams.set("action",action);
    window.history.pushState({},'',url);
    showFrom(action);   
}

openBtnLogin.addEventListener("click",()=>handleClick("login"));
openBtnRegister.addEventListener("click",()=>handleClick("register"));

// Toggle Password Visibility Logic Start Here

let loginPassword=this.document.getElementById("loginPassword");
let loginEyeIcon=this.document.getElementById("loginEyeIcon");
let registerPassword=this.document.getElementById("registerPassword");
let registerEyeIcon=this.document.getElementById("registerEyeIcon");
function showPassword(passwordInput,eyeIcon){
    const isPasswordHidden = passwordInput.type === "password";
    passwordInput.type = isPasswordHidden ? "text" : "password";
    eyeIcon.classList.toggle("fa-eye-slash");
    eyeIcon.classList.toggle("fa-eye");
}
registerEyeIcon.addEventListener("click",()=>showPassword(registerPassword,registerEyeIcon));
loginEyeIcon.addEventListener("click",()=>showPassword(loginPassword,loginEyeIcon));

// Toggle Password Visibility End Here

// Login Logic End Here

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