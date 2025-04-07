let currentIndex=0;
const slides=document.querySelectorAll(".slide");
const slider=document.querySelector(".slider");

const dotsContainer=document.querySelector(".dots");

slides.forEach((_,index)=>{
    const dot=document.createElement("span");
    dot.classList.add("dot");
    if(index===0) dot.classList.add("active");
    dot.addEventListener("click",()=>{
        goToSlide(index);
        dotsContainer.appendChild(dot);
    })
});

const dots=document.querySelectorAll(".dot");
function updateSlider(){
    slider.style.transform=`translateX(-${currentIndex*100}%)`;
    dots.forEach(dot=>{
        dot.classList.remove("active");
        dots[currentIndex].classList.add("active");
    })
}

function nextSlide(){
    currentIndex=(currentIndex+1)% slides.length;
    updateSlider();
}
function prevSlide(){
    currentIndex=(currentIndex-1 + slides.length)% slides.length;
    updateSlider();
}
function goToSlide(index){
   currentIndex=index;
   updateSlider();
}
document.querySelector(".next").addEventListener("click",nextSlide);
document.querySelector(".prev").addEventListener("click",prevSlide);