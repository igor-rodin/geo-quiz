(function(){
  const ERROR_404 = "Страница не найдена";
  const EMAIL  = "test@test.mail";
  const FILL_MESSAGE = "Заполните это поле";

  document.addEventListener('DOMContentLoaded', ()=>{
    const orderForm = document.querySelector('#orderForm');
    const btnSubmit = document.querySelector('#btnSubmit');
    
    btnSubmit.addEventListener('click', event => {
      event.preventDefault();
      if (validateForm(orderForm)) {
        const elements = orderForm;
        const orderInfo = {
          name: elements.name.value,
          phone: elements.phone.value,
          comment: elements.comment.value,
          street: elements.street.value,
          house: elements.house.value,
          housing: elements.housing.value,
          flat: elements.flat.value,
          floor: elements.floor.value,
          options: elements.options.value,
          call: elements.call.checked,
          to: EMAIL
        };

        sendOrder(orderInfo);
      }
    })
  });

  function validateForm(form){
    let isValid = true;
    const elements = form.elements;
    const elementToValidate = [elements.name, elements.phone, elements.comment];
    elementToValidate.forEach(elem => {
      if (!validateElement(elem)) {
        isValid = false;
      }  
    })

    return isValid;
  };

  function validateElement(element){
    if (!element.checkValidity() || (element.value.trim() === "")) {
      const error = element.nextElementSibling;
      error.classList.add('form-element__error--active');
      error.textContent = FILL_MESSAGE;
      element.style.border = "4px solid red";
      return false;
    }
    else {
      const error = element.nextElementSibling;
      error.classList.remove('form-element__error--active');
      error.textContent = "";
      element.style.border = "";
      return true;
    }
  };

  function sendOrder(order) {
    const xhr  = new XMLHttpRequest();
    
    xhr.open('POST', ' https://webdev-api.loftschool.com/sendmail', true);
    xhr.setRequestHeader('content-type', 'application/json');
    let respMessage;
    let  respStatus = 0;
    xhr.onload = () => {
      if (xhr.status === 404){
        respMessage = ERROR_404;  
      }
      else{
        respMessage = JSON.parse(xhr.response).message;
        respStatus = JSON.parse(xhr.response).status;
      }
      
      showModalWindow(respMessage, 'закрыть', respStatus);
    }

    xhr.send(JSON.stringify(order));
  };

  function showModalWindow(windowMessage, btnText, respStatus){
    const modalTepmlate = document.querySelector('#modalTemplate').content;
    const template = modalTepmlate.querySelector('.overlay').cloneNode(true);
    template.querySelector('.overlay__text').textContent = windowMessage;
    if (respStatus === 0) {
      template.querySelector('.overlay__text').classList.add('overlay__text--error');
    }

    const closeBtn = template.querySelector('.overlay__button');    
    closeBtn.textContent = btnText;
    closeBtn.addEventListener('click', event => {
      document.body.removeChild(template);
      document.body.classList.remove('popup-shown');
    })
    
    document.body.appendChild(template);
    document.body.classList.add('popup-shown');    
  };

})();