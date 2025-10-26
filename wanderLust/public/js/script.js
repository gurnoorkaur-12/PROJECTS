// Example starter JavaScript for disabling form submissions if there are invalid fields
(() => {
  'use strict'

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  const forms = document.querySelectorAll('.needs-validation')

  // Loop over them and prevent submission
  Array.from(forms).forEach(form => {
    form.addEventListener('submit', event => {
      if (!form.checkValidity()) {
        event.preventDefault()
        event.stopPropagation()
      }

      form.classList.add('was-validated')
    }, false)
  })
})()

const starBtns = document.querySelectorAll(".star-rating");
console.log(starBtns);
const starInputs = document.querySelectorAll(".star-input");
console.log(starInputs);

starInputs.forEach((input,index)=>{
  input.addEventListener("change",()=>{
    console.log(index);
    // Reset all stars first
      starBtns.forEach((btn) => {
          btn.classList.remove("fa-solid", "text-warning");
          btn.classList.add("fa-regular");
      });
    //fill all stars till the one clicked(index)
    for(let i=0 ; i<=index ; i++){
        starBtns[i].classList.add("fa-solid", "text-warning");
        starBtns[i].classList.remove("fa-regular");      
    }  
  }) 
})

const Modal1 = document.getElementById('reviewModal')
const Input1 = document.getElementById('reviewInput')

Modal1.addEventListener('shown.bs.modal', () => {
  Input1.focus();
})
const Modal2 = document.getElementById('confirmRequest')
const Input2 = document.getElementById('confirmation')

Modal2.addEventListener('shown.bs.modal', () => {
  Input2.focus();
})


const closeBtn=document.querySelectorAll(".close-btn");

closeBtn.forEach((close,index)=>{
  close.addEventListener("click",()=>{
    starBtns.forEach((btn) =>{
      btn.classList.remove("fa-solid", "text-warning");
      btn.classList.add("fa-regular");
    });
  })
})

function addDeleteListeners(){
let deleteReviewBtn = document.querySelectorAll(".delete-review-btn");
let deleteFinalBtn = document.querySelector("#delete-reviewFinal")
deleteReviewBtn.forEach((btn)=>{
  btn.addEventListener("click",()=>{
    console.log("clicked")
    let formId = btn.closest("form").getAttribute("id");
    console.log(formId);

    deleteFinalBtn.setAttribute("form",`${formId}`);
  })
})
}

addDeleteListeners();