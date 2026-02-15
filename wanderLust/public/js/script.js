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
const starInputs = document.querySelectorAll(".star-input");

starInputs.forEach((input,index)=>{
  input.addEventListener("change",()=>{
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

const closeBtn=document.querySelectorAll(".close-btn");

closeBtn.forEach((close,index)=>{
  close.addEventListener("click",()=>{
    starBtns.forEach((btn) =>{
      btn.classList.remove("fa-solid", "text-warning");
      btn.classList.add("fa-regular");
    });
  })
})

function changeRoute(event, newRoute) {
    event.preventDefault();//prevent default behaviour

    const stateObj = { newRoute };
    history.pushState(stateObj,newRoute);//stops reloading

    updateContent(newRoute);
}

function updateContent(url){
  if(url == "/confirmRequest"){ 
    const confirmModal = new bootstrap.Modal(document.querySelector("#confirmDelete"));
    confirmModal.show();
  }else if(url == "/reviewModal"){
    const reviewModal = new bootstrap.Modal(document.querySelector("#reviewModal"));
    reviewModal.show();
  }else if(url == "/loginModal"){
      if(window.location.pathname != "/login" && window.location.pathname !="/signup"){
        const loginModal = new bootstrap.Modal(document.querySelector("#loginModal"));
        loginModal.show();
      }else{
        window.location.href = "/login";
      }
  }else if( url == "/signupModal"){
    if( window.location.pathname != "/login" && window.location.pathname != "/signup" ){
      const signupModal = new bootstrap.Modal(document.querySelector("#signupModal"));
      signupModal.show();
    }else {
      window.location.href = "/signup";
    }
  }
}
