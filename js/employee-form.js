function addRoleOption(form, element) {
  let select = form.querySelector(`#${element}`);
  let selectOption = createNewElementWithAttr('option', ['value', ''], ['selected', true], ['hidden', true])
  selectOption.innerText = "Select Role";
  select.appendChild(selectOption);
  allRoles.forEach((obj) => {
    let option = createNewElementWithAttr('option', ['value', obj.role.toLowerCase()])
    option.innerText = obj.role;
    select.appendChild(option);
  })
}

function openAddEmployeeForm() {
  let elementsToHide = ["employees-container", "alphabet-filter", "reset-filter", "employee-table-container",
  ];
  elementsToHide.forEach((elementClass) => {
    changeElementDisplay(`.${elementClass}`, 'none')
  });
  changeElementDisplay(".employee-form-container", 'block')
  let serachBarHeight = document.querySelector(".search-container").offsetHeight;
  let form = document.querySelector(".employee-form-container")
  form.style.top = `${serachBarHeight + 20}px`;
  addRoleOption(form, 'select-role');
}

function closeAddEmployeeForm() {
  let elementsToHide = ["employees-container", "alphabet-filter", "reset-filter",];
  elementsToHide.forEach((elementClass) => {
    changeElementDisplay(`.${elementClass}`, 'flex')
  });
  changeElementDisplay(".employee-form-container", 'none')
  changeElementDisplay(".employee-table-container", 'block')
  let form = document.querySelector('.employee-form');
  validateField(form, false, 'none')
  form.reset()
  form.querySelector('#select-role').innerHTML = "";
}

function openEditEmployeeForm() {
  let row = this.parentElement.parentElement.parentElement;
  let form = document.getElementsByClassName("edit-employee-form-container")[0];
  changeElementDisplay(".edit-employee-form-container", 'block')
  let serachBarHeight = document.querySelector(".search-container").offsetHeight;
  document.querySelector(".edit-employee-form-container").style.top = `${serachBarHeight + 20}px`;
  let elementsToHide = ["employees-container", "alphabet-filter", "reset-filter", "employee-table-container",];
  elementsToHide.forEach((elementClass) => {
    changeElementDisplay(`.${elementClass}`, 'none')
  });
  addRoleOption(form, 'edit-emp-role');
  let empId = row.querySelector('.employee-no').innerText;
  let selectedEmp;
  for (let i = 0; i < employeeList.length; i++) {
    if (employeeList[i].empNo == empId) {
      selectedEmp = employeeList[i];
      break;
    }
  }
  localStorage.setItem('selectedEmp', JSON.stringify(selectedEmp.empNo))
  const setFormData = {
    "#edit-empl-no": selectedEmp.empNo,
    "#edit-empl-fname": selectedEmp.fname,
    "#edit-empl-lname": selectedEmp.lname,
    "#edit-empl-email": selectedEmp.email,
    "#edit-empl-mobile": selectedEmp.mobile,
    '#edit-emp-location': selectedEmp.location.toLowerCase(),
    '#edit-emp-manager': selectedEmp.managerAssigned.toLowerCase(),
    '#edit-emp-project': selectedEmp.projectAssigned.toLowerCase(),
    '#edit-emp-dept': selectedEmp.dept.toLowerCase(),
  };
  for (const selector in setFormData) {
    const element = document.querySelector(selector);
    if (element) {
      element.value = setFormData[selector];
    }
  }
  let selectedEmpRole = allRoles.filter(function (role) {
    return role.roleId == selectedEmp.role;
  })
  if (selectedEmpRole.length != 0)
    document.querySelector('#edit-emp-role').value = selectedEmpRole[0].role.toLowerCase();
  else
    document.querySelector('#edit-emp-role').value = '';
  let selectedEmpDOB = `${selectedEmp.dob.substring(6, 11)}-${selectedEmp.dob.substring(3, 5)}-${selectedEmp.dob.substring(0, 2)}`;
  setElementAttribute('#edit-empl-dob', 'value', selectedEmpDOB)
  let selectedEmpJoinDate = `${selectedEmp.joinDate.substring(6, 11)}-${selectedEmp.joinDate.substring(3, 5)}-${selectedEmp.joinDate.substring(0, 2)}`;
  setElementAttribute('#edit-empl-join-date', 'value', selectedEmpJoinDate)
  setElementAttribute('.edit-employee-profile', 'src', selectedEmp.img)
}

function closeEditEmployeeForm() {
  let elementsToHide = ["employees-container", "alphabet-filter", "reset-filter",];
  elementsToHide.forEach((elementClass) => {
    changeElementDisplay(`.${elementClass}`, 'flex')
  });
  changeElementDisplay(".edit-employee-form-container", 'none')
  changeElementDisplay(".employee-table-container", 'block')
  localStorage.removeItem("empRow");
  let form = document.querySelector('.edit-employee-form');
  validateField(form, false, 'none')
  form.querySelector('#edit-emp-role').innerHTML = "";
}

function validateField(form, flag = true, mode) {
  const dangerInputName = {
    "img": "Image",
    "fname": "First Name",
    "lname": "Last Name",
    "email": "Email",
    "location": "Location",
    "dept": "Department",
    "empNo": "Emp Number",
    "status": "Status",
    "joinDate": "Join Date",
    "dob": "Date of Birth",
    "projectAssigned": "Project",
    "managerAssigned": "Manager",
    "mobile": "Mobile Number",
  }
  let formInput = form.getElementsByTagName("input");
  let check = 1;
  for (let key in formInput) {
    let element = formInput[key];
    if (element.name == 'empNo') {
      let empNo = element.value.toUpperCase()
      if (empNo == "") {
        showValidInput(element, `&#9888; ${dangerInputName[element.name]} is required`, flag);
        check = 0
      }
      else if (!empNo.startsWith("TZ")) {
        showValidInput(element, `&#9888; employee Id Should start with TZ`, flag)
        check = 0;
      }
      else if (!empNo.match(/^TZ[0-9]+$/)) {
        showValidInput(element, `&#9888; ${dangerInputName[element.name]} should have number starting with TZ`, flag);
        check = 0
      }
      else if (empNo.startsWith("TZ") && mode == 'add') {
        for (let i = 0; i < employeeList.length; i++) {
          if (employeeList[i].empNo == empNo) {
            showValidInput(element, `&#9888;This Emp Number is already taken`, flag)
            check = 0;
          }
        }
      }

    }
    else if (element.type == 'number') {
      let empNum = element.value
      if (empNum == "") {
        showValidInput(element, `&#9888; ${dangerInputName[element.name]} is required`, flag);
        check = 0
      }
      else if (empNum.length != 10) {
        showValidInput(element, `&#9888; Mobile number should be of 10 digit`, true)
        check = 0;
      }
    }
    else if (element.type == 'email') {
      let email = element.value.toLowerCase();
      if (!email.endsWith("tezo.com")) {
        showValidInput(element, `&#9888;Email should be of tezo`, flag)
        check = 0;
      }
    }
    if (element.value == "" && element.name != "dob" && element.type != "file") {
      showValidInput(element, `&#9888; ${dangerInputName[element.name]} is required`, flag);
      check = 0;
    }
    else if (element.value == "" && element.type != "file") {
      showValidInput(element.parentElement, `&#9888; ${dangerInputName[element.name]} is required`, flag);
      check = 0;
    }
  }
  let formSelect = form.getElementsByTagName('select');
  for (let key in formSelect) {
    let element = formSelect[key];
    if (element.value == "" && element.name != 'role') {
      showValidInput(element, `&#9888; ${dangerInputName[element.name]} is required field`, flag)
      check = 0;
    }
  }
  return check;
}

function displayImagePreview() {
  let image1 = document.getElementById("empl-img").files[0];
  if (image1) {
    const reader = new FileReader();
    reader.readAsDataURL(image1);
    reader.onload = function () {
      document.querySelector('.employee-profile-img').src = reader.result;
    };
  }
  let image2 = document.getElementById("edit-empl-img").files[0];
  if (image2) {
    const reader = new FileReader();
    reader.readAsDataURL(image2);
    reader.onload = function () {
      document.querySelector('.edit-employee-profile').src = reader.result;
    };
  }
}

function addEmployee(event, mode) {
  event.preventDefault();
  let form;
  if (mode == 'add') {
    form = document.getElementsByClassName("employee-form")[0];
  }
  else {
    form = document.getElementsByClassName("edit-employee-form")[0];
  }
  let check = validateField(form, true, mode);
  if (check == 0)
    return;
  let newObject = {};
  let image;
  if (mode == 'add') {
    image = document.getElementById("empl-img").files[0];
  }
  else {
    image = document.getElementById("edit-empl-img").files[0];
  }
  const formElements = Array.from(form.elements);
  formElements.forEach((element) => {
    if (element.type == "date") {
      let value = element.value.split("-");
      newObject[element.name] = `${value[2]}/${value[1]}/${value[0]}`;
    }
    else if (element.type == "file") {
      newObject[element.name] = (mode == 'add') ? document.querySelector('.employee-profile-img').src : document.querySelector('.edit-employee-profile').src
    }
    else if (element.name == 'role') {
      let allotedRoleId = allRoles.filter(function (obj) {
        if (obj.role.toLowerCase() == element.value.toLowerCase())
          return obj.roleId;
      })
      if (allotedRoleId.length != 0)
        newObject[element.name] = allotedRoleId[0].roleId;
      else
        newObject[element.name] = '';
    }
    else if (element.name == 'empNo') {
      newObject[element.name] = element.value.toUpperCase();
    }
    else if (element.tagName.toLowerCase() == "select") {
      let optionText = element.options[element.selectedIndex].innerText;
      newObject[element.name] = optionText;
    } else if (element.type != "submit") {
      newObject[element.name] = element.value;
    }
  });
  if (check) {
    if (mode == "edit") {
      let rowId = JSON.parse(localStorage.getItem("selectedEmp"));
      let rowIndex = employeeList.findIndex(
        (employee) => employee.empNo == rowId
      );
      document.querySelector('.employee-table-body').deleteRow(rowIndex + 1);
      let newEmps = employeeList.filter(function (obj) {
        return obj.empNo !== rowId;
      });
      activateInput(true)
      employeeList = newEmps;
      localStorage.setItem('employeeList', JSON.stringify(employeeList))
      localStorage.removeItem("selectedEmp");
    }
    insertEmployee(newObject);
    employeeList.push(newObject);
    document.querySelector('.final-edit-empl').innerText = 'Edit'
    localStorage.setItem('employeeList', JSON.stringify(employeeList))
    let row = document.getElementsByClassName("three-dots");
    row[row.length - 1].addEventListener("click", toggleEditOption);
    let rowDelete = document.getElementsByClassName("row-delete");
    rowDelete[rowDelete.length - 1].addEventListener("click", deleteEmployeeRow);
    let rowStatus = document.getElementsByClassName("status-change");
    rowStatus[rowStatus.length - 1].addEventListener("click", toggleStatus);
    let rowEditForm = document.getElementsByClassName("row-edit");
    rowEditForm[rowEditForm.length - 1].addEventListener("click", openEditEmployeeForm);
    checkEmployeeStatus();
    if (mode == 'add') {
      closeAddEmployeeForm();
      createToastMessage('Employee Added')
    }
    else {
      closeEditEmployeeForm();
      document.querySelector('.final-edit-empl').type = "button";
      createToastMessage('Changes Applied');
    }
    form.reset();
    form.querySelector('img').src = "./assets/images/dummy-profile-image.jpg";
  }
}

document.querySelector(".dob-input").addEventListener("click", (event) => {
  let input = document.getElementById("new-emp-dob");
  setElementAttribute("#new-emp-dob", "type", "date")
  input.focus();
  input.showPicker();
  event.target.parentElement.style.borderColor = 'var(--blue)';
});

document.querySelector("#new-emp-dob").addEventListener("focus", (event) => {
  let input = event.target;
  setElementAttribute("#new-emp-dob", "type", "date")
  input.showPicker();
  event.target.parentElement.style.borderColor = 'var(--blue)';
});

document.querySelector("#new-emp-dob").addEventListener("blur", (event) => {
  if (!event.target.value) {
    event.target.type = "text";
  }
  event.target.parentElement.style.borderColor = 'rgba(227,229,233,255)';
});