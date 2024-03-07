function changeElementDisplay(element, value) {
  document.querySelector(`${element}`).style.display = value;
}

function showValidInput(element, message, flag) {
  if (!flag) return hideRequiredMessage(element)
  element.style.borderColor = 'red';
  let parentDiv = element.parentElement;
  let span = parentDiv.querySelector('span');
  span.innerHTML = message;
  span.style.color = 'red';
  element.addEventListener('change', (event) => {
    hideRequiredMessage(event.target);
  });
}

function hideRequiredMessage(element) {
  element.style.borderColor = 'rgba(227,229,233,255)';
  let parentDiv = element.parentElement;
  let span = parentDiv.querySelector('span');
  if (!span)
    span = parentDiv.parentElement.querySelector('span');
  span.innerText = '';
}

function setElementAttribute(element, attr, value) {
  document.querySelector(`${element}`).setAttribute(`${attr}`, value)
}

function hidePopUp() {
  let popup = document.querySelector('.toast');
  if (popup)
    popup.remove();
}

function createToastMessage(message) {
  let toastDiv = createNewElement('div', "toast", "flex-container")
  let tickContainer = createNewElement('div', "toast-tick-container", "flex-container")
  let tickImg = createNewElementWithAttr('img', ['src', "./assets/icons/tick.svg"], ['alt', 'tick']);
  let textSpan = document.createElement("span");
  textSpan.textContent = message;
  let crossContainer = createNewElement('div', "toast-cross-container", "flex-container")
  let crossImg = createNewElementWithAttr('img', ['src', "./assets/icons/cross.svg"], ['alt', 'cross'])
  crossContainer.addEventListener('click', hidePopUp);
  toastDiv = addElementToParent(toastDiv, [tickContainer, tickImg], textSpan, [crossContainer, crossImg])
  setTimeout(hidePopUp, 4500);
  let content = document.querySelector(".content");
  content.appendChild(toastDiv);
}

function updateInput(event, mainInput, parent) {
  let input = event.querySelectorAll(`.${mainInput} input`);
  let count = 0;
  for (let i = 0; i < input.length; i++) {
    if (input[i].checked) {
      count++;
    }
  }
  let customInput = event.querySelector(`.${parent}`);
  if (customInput.tagName.toLowerCase() === 'span') {
    customInput.innerText = count == 0 ? "" : `${count} selected`;
  }
  else
    customInput.value = count == 0 ? "" : `${count} selected`;
}

function toggleOptions(event, check) {
  let customOptions = event.querySelector(`.${check}`);
  if (customOptions.style.display === "block") {
    customOptions.style.display = "none";
  } else {
    customOptions.style.display = "block";
  }
}

function createEmployeeDiv(employee, main, flag = false) {
  let div = createNewElement('div', "employee-name-img", "w-100")
  let label = createNewElement('label', "assignable-employee", "d-flex", "jus-content-btw")
  let detail = createNewElement('div', 'assign-emp-detail', 'd-flex')
  let img = createNewElementWithAttr('img', ['src', employee.img], ['alt', 'employee-image'])
  let span = document.createElement("span");
  let employeeName = `${employee.fname} ${employee.lname}`
  span.textContent = `${employeeName} (${employee.empNo})`;
  (employeeName.length > 18) ? span.setAttribute('title', employeeName) : span.setAttribute('title', '')
  let input = createNewElementWithAttr('input', ['type', 'checkbox'])
  input.checked = flag;
  input.addEventListener('click', (event) => {
    updateInput(event.target.parentElement.parentElement.parentElement.parentElement, 'all-employees', 'added-emp-number');
  })
  detail.appendChild(img);
  detail.appendChild(span);
  label.appendChild(detail);
  label.appendChild(input);
  div.appendChild(label);
  let empid = document.createElement("span");
  empid.innerText = employee.empNo;
  empid.classList.add('hide');
  div.appendChild(empid);
  main.appendChild(div);
}

function createNewElement(type, ...classes) {
  let element = document.createElement(`${type}`);
  element.classList.add(...classes);
  return element;
}

function createNewElementWithAttr(type, ...attrArray) {
  let element = document.createElement(`${type}`);
  for (let i = 0; i < attrArray.length; i++)
    element.setAttribute(`${attrArray[i][0]}`, `${attrArray[i][1]}`)
  return element;
}

function addElementToParent(parent, ...child) {
  for (let i = 0; i < child.length; i++) {
    if (Array.isArray(child[i])) {
      parent.appendChild(addElementToParent(...child[i]))
    }
    else {
      parent.appendChild(child[i]);
    }
  }
  return parent;
}