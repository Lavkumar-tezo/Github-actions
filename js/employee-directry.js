var employeeList
var allRoles
function insertEmployee(employee) {
  let tr = createNewElement("tr", "emp-table-row");
  let tdCheckbox = createNewElement("td", "selected-employee");
  let inputCheckbox = createNewElementWithAttr('input', ["type", "checkbox"], ["name", "select"])
  inputCheckbox.classList.add("select");
  inputCheckbox.addEventListener("click", findSelectedRow);
  let tdProfile = createNewElement("td", "d-flex", "jus-content-start", "emp-profile");
  let tdProfileContainer = createNewElement("div", "d-flex", 'empl-profile-detail')
  let profilDiv = createNewElement("div", "emp-profile-container", "flex-container")
  if (!employee.img) {
    employee.img = "./assets/images/dummy-profile-image.jpg"
  }
  let imgProfile = createNewElementWithAttr("img", ["src", employee.img], ["alt", "employee-image"]);
  imgProfile.classList.add("employee-img");
  let divProfile = createNewElement("div", "employee-profile", "d-flex", "flex-col");
  let spanName = createNewElement('span', 'employee-name');
  let employeeName = `${employee.fname} ${employee.lname}`;
  spanName.textContent = employeeName;
  (employeeName.length > 18) ? spanName.setAttribute('title', employeeName) : spanName.setAttribute('title', '')
  let spanEmail = createNewElement('span', 'employee-email');
  spanEmail.textContent = employee.email;
  (employee.email.length > 18) ? spanEmail.setAttribute('title', employee.email) : spanEmail.setAttribute('title', '')
  let tdLocation = createNewElement('td', 'employee-location')
  tdLocation.textContent = employee.location;
  let tdDepartment = createNewElement('td', 'employee-department')
  tdDepartment.textContent = employee.dept;
  let tdRole = createNewElement('td', 'employee-role')
  let roleDiv = document.createElement('div');
  if (employee.role) {
    let roleName;
    for (let i = 0; i < allRoles.length; i++) {
      if (allRoles[i].roleId == employee.role)
        roleName = allRoles[i].role;
    }
    roleDiv.textContent = roleName;
  }
  else
    roleDiv.textContent = 'N/A';
  let tdEmpNo = createNewElement('td', 'employee-no');
  tdEmpNo.textContent = employee.empNo;
  let tdStatus = createNewElement('td', 'employee-status')
  let spanStatus = createNewElement("span", "employee-status-value")
  spanStatus.textContent = employee.status ? employee.status : "Active";
  let tdJoinDate = createNewElement('td', 'employee-join-dt')
  tdJoinDate.textContent = employee.joinDate;
  let tdDots = createNewElement('td', 'row-edit-container')
  let btnDots = createNewElement('button', 'three-dots')
  let imgDots = createNewElementWithAttr('img', ["src", "./assets/icons/three-dot.svg"], ["alt", "three-dot"])
  let editDiv = createNewElement('div', "empl-edit-options", "d-flex", "flex-col", "hide")
  let option1 = createNewElement('span', 'row-edit')
  option1.innerText = "Edit";
  let option2 = createNewElement('span', 'row-delete')
  option2.innerText = "Delete";
  let option3 = createNewElement('option', 'status-change')
  option3.innerText = "Mark as In Active";
  tr = addElementToParent(tr, [tdCheckbox, inputCheckbox], [tdProfile, [tdProfileContainer, [profilDiv, imgProfile], [divProfile, spanName, spanEmail]]], tdLocation, tdDepartment, [tdRole, roleDiv], tdEmpNo, [tdStatus, spanStatus], tdJoinDate, [tdDots, [btnDots, imgDots], [editDiv, option1, option2, option3]])
  let table = document.getElementsByClassName("employee-table-body")[0];
  table.appendChild(tr);
}

function checkEmployeeStatus() {
  let table, tr, i;
  table = document.getElementsByClassName("employee-table-body");
  tr = table[0].getElementsByClassName("emp-table-row");
  for (i = 0; i < tr.length; i++) {
    let employeeStatus = tr[i].getElementsByClassName("employee-status-value")[0];
    if (employeeStatus.textContent.toLowerCase() == "active") {
    } else {
      employeeStatus.style.color = "red";
      employeeStatus.style.backgroundColor = "#ffe6e6";
    }
  }
}

function formatDate(date) {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  return `${year}-${month}-${day}`;
}

document.addEventListener("DOMContentLoaded", function () {
  employeeList = JSON.parse(localStorage.getItem('employeeList'));
  allRoles = JSON.parse(localStorage.getItem('roles'));
  employeeList.forEach((empl) => {
    insertEmployee(empl)
  })
  localStorage.removeItem('selectedEmp');
  localStorage.removeItem('selectedAlpha');
  localStorage.removeItem('deleteRow');
  checkEmployeeStatus();
  let alphabet = document.getElementsByClassName("alphabet");
  for (let i = 0; i < alphabet.length; i++) {
    alphabet[i].addEventListener("click", alphabetSort);
  }
  document.querySelector('.export-btn').addEventListener('click', exportTableToExcel);
  const eventListeners = {
    ".filter-icon": toggleFilterSection,
    ".reset-btn": resetFilter,
    ".apply-btn": filterSearch,
    ".employee-select": selectAllEmployee,
    ".delete-row-btn": deleteSelectedEmployee,
    ".cancel-delete": hideDeleteDialogBox,
    ".delete-dialog-cross": hideDeleteDialogBox,
    ".add-employee": openAddEmployeeForm,
    ".cancel-new-empl": closeAddEmployeeForm,
  };
  for (const selector in eventListeners) {
    const element = document.querySelector(selector);
    if (element) {
      element.addEventListener("click", eventListeners[selector]);
    }
  }
  document.querySelector('.table-delete-btn').addEventListener("click", (event) => {
    showDeleteDialogBox(false);
  });
  document.querySelector('.employee-form').addEventListener("submit", (event) => {
    addEmployee(event, 'add');
  });
  document.querySelector('.edit-form-close').addEventListener("click", (event) => {
    activateInput(true);
    document.querySelector('.final-edit-empl').innerText = "Edit";
    document.querySelector('.final-edit-empl').type = "button";
    localStorage.removeItem('selectedEmp')
    closeEditEmployeeForm();
  });
  document.querySelector('#empl-img').addEventListener('change', displayImagePreview);
  document.querySelector('#edit-empl-img').addEventListener('change', displayImagePreview);
  let allHeaders = document.querySelectorAll(".employee-table th");
  for (let i = 1; i < allHeaders.length - 1; i++) {
    allHeaders[i].addEventListener("click", () => {
      const tableElement =
        allHeaders[i].parentElement.parentElement.parentElement;
      const headerIndex = Array.prototype.indexOf.call(
        allHeaders[i].parentElement.children, allHeaders[i]);
      const currentIsAscending = allHeaders[i].classList.contains("th-sort-asc");
      sortTableByColumn(tableElement, headerIndex, !currentIsAscending);
    });
  }
  setTableHeight()
  const currDate = new Date();
  const todayDate = formatDate(currDate);
  const lastWeek = new Date(currDate.getTime() - 7 * 24 * 60 * 60 * 1000);
  const lastWeekDate = formatDate(lastWeek);
  let joinDateInput = document.querySelector("#new-emp-join-date");
  joinDateInput.setAttribute("value", todayDate);
  joinDateInput.setAttribute("min", lastWeekDate);
  let dobInput = document.querySelector("#new-emp-dob");
  dobInput.setAttribute("max", todayDate);
  let empDobInput = document.querySelector("#edit-empl-dob");
  empDobInput.setAttribute('max', todayDate);
  let allRowEdit = document.querySelectorAll(".three-dots");
  allRowEdit.forEach((row) => {
    row.addEventListener("click", toggleEditOption);
  });
  let rowsDelete = document.querySelectorAll(".row-delete");
  rowsDelete.forEach((row) => {
    row.addEventListener("click", deleteEmployeeRow);
  });
  let rowsStatus = document.querySelectorAll(".status-change");
  rowsStatus.forEach((row) => {
    let parentRow = row.parentElement.parentElement.parentElement;
    let rowStatusValue = parentRow.querySelector('.employee-status').innerText.toLowerCase();
    rowStatusValue == 'active' ? rowStatusValue = "In active" : rowStatusValue = "Active"
    row.innerText = `Mark as ${rowStatusValue}`
    row.addEventListener("click", toggleStatus);
  });
  let allRowEditForm = document.querySelectorAll(".row-edit");
  allRowEditForm.forEach((row) => {
    row.addEventListener("click", openEditEmployeeForm);
  });
  document.querySelector('.final-edit-empl').addEventListener("click", (event) => {
    if (event.target.innerText == "Edit") {
      event.target.innerText = "Apply Changes";
      activateInput();
    }
    else {
      event.target.type = "submit";
      addEmployee(event, 'edit');
    }
  });
  let allFilterSelects = document.querySelectorAll('.custom-select');
  allFilterSelects.forEach((filter) => {
    var customInput = filter.querySelector(".custom-input");
    var customOption = filter.querySelectorAll(".custom-option");
    customInput.addEventListener("focus", (event) => {
      toggleOptions(event.target.parentElement, 'custom-options');
    });

    for (var i = 0; i < customOption.length; i++) {
      customOption[i].querySelector('input').addEventListener("click", (event) => {
        updateInput(event.target.parentElement.parentElement.parentElement, 'custom-option', 'custom-input')
      })
    }

    document.addEventListener("click", function (event) {
      var target = event.target;
      if (!filter.contains(target)) {
        filter.querySelector('.custom-options').style.display = "none";
      }
    });
  })
  document.querySelector('#search-input').addEventListener('keyup', tableSearch)
});

function activateInput(flag = false) {
  let allDisabledInputs = ['edit-empl-fname', 'edit-empl-lname', 'edit-empl-dob', 'edit-empl-email', 'edit-empl-mobile', 'edit-empl-join-date', 'edit-emp-location', 'edit-emp-dept', 'edit-emp-role', 'edit-emp-manager', 'edit-emp-project', 'edit-empl-img'];
  allDisabledInputs.forEach((input) => {
    document.querySelector(`#${input}`).disabled = flag;
  })
  let profileUploadBtn = document.querySelector('.profile-upload-btn');
  (!flag) ? profileUploadBtn.style.backgroundColor = "red" : profileUploadBtn.style.backgroundColor = "#f89191"
}

function toggleStatus() {
  let status = this.parentElement.parentElement.parentElement.querySelector(
    ".employee-status-value"
  );
  let isActive = status.innerText === "Active";
  status.innerText = isActive ? "In Active" : "Active";
  status.style.color = isActive ? "red" : "green";
  status.style.backgroundColor = isActive ? "#ffe6e6" : "#E7F4E8";
  this.parentElement.classList.add("hide");
  (status.innerText == "Active") ? this.innerText = 'Mark as In active' : this.innerText = 'Mark as Active';
  filterSearch();
}

function deleteEmployeeRow() {
  let row = this.parentElement.parentElement.parentElement;
  showDeleteDialogBox(true);
  localStorage.setItem('deleteRow', row.innerHTML)
}

function deleteEmployee(row) {
  let rowEmpId = row.querySelector(".employee-no").innerText
  document
    .getElementsByClassName("employee-table")[0]
    .deleteRow(row.rowIndex);
  let newEmps = employeeList.filter(function (obj) {
    return obj.empNo !== rowEmpId;
  });
  employeeList = newEmps;
  localStorage.setItem('employeeList', JSON.stringify(employeeList))
}

function alphabetSort() {
  let table = document.querySelector(".employee-table-body");
  let tr = table.querySelectorAll(".emp-table-row");
  let isActive = this.classList.contains("active-alphabet-filter");
  let alphabet = this.innerText.toLowerCase();
  if (isActive) {
    this.classList.remove("active-alphabet-filter");
    tr.forEach((row) => (row.style.display = "table-row"));
    localStorage.removeItem('selectedAlpha');
    document.querySelector('.no-records-container').classList.add('hide')
    filterSearch();
    return;
  }
  localStorage.setItem('selectedAlpha', JSON.stringify(alphabet));
  document
    .querySelectorAll(".alphabet")
    .forEach((alphabet) => alphabet.classList.remove("active-alphabet-filter"));
  this.classList.add("active-alphabet-filter");
  filterSearch()
}

function toggleFilterSection() {
  let filterSection = document.querySelector(".reset-filter");
  let filterTitle = document.querySelector(".toggle-filter-section");
  let filterIcon = document.getElementById("filter-icon");
  filterSection.style.display =
    filterSection.style.display === "none" ? "flex" : "none";
  if (filterTitle.getAttribute("title") === "Hide Filter Section") {
    filterTitle.setAttribute("title", "Show Filter Section");
    filterIcon.src = filterIcon.src.replace("red", "black");
  } else {
    filterTitle.setAttribute("title", "Hide Filter Section");
    filterIcon.src = filterIcon.src.replace("black", "red");
  }
}

function filterCheck(tr, check, alpha = 'none') {
  if (alpha != 'none') {
    let rowName = tr.querySelector(".employee-name").textContent.toLowerCase();
    return (rowName.startsWith(alpha))
  }
  let status = document.getElementById(check);
  if (!status.value) return true;
  let selectedStatus = [];
  let allOptions = status.parentElement.querySelectorAll('.custom-option input');
  for (let option of allOptions) {
    if (option.checked) selectedStatus.push(option.value.toLowerCase());
  }
  let empStatus = tr
    .getElementsByClassName(`employee-${check}`)[0]
    .innerText.toLowerCase();
  for (let i = 0; i < selectedStatus.length; i++) {
    if (selectedStatus[i] == empStatus) return true;
  }
  return false;
}

function filterSearch() {
  let table = document.getElementsByClassName("employee-table-body");
  let tr = table[0].getElementsByClassName("emp-table-row");
  let selectedAlpha = JSON.parse(localStorage.getItem('selectedAlpha'));
  let count = 0;
  for (let i = 0; i < tr.length; i++) {
    let alphacheck = true;
    if (selectedAlpha)
      alphacheck = filterCheck(tr[i], "status", selectedAlpha);
    let statusCheck = filterCheck(tr[i], 'status');
    let deptCheck = filterCheck(tr[i], 'department');
    let locationCheck = filterCheck(tr[i], 'location');
    if (statusCheck && deptCheck && locationCheck && alphacheck) {
      tr[i].style.display = "table-row";
      count++;
    }
    else
      tr[i].style.display = "none";
  }
  (count == 0) ? document.querySelector('.no-records-container').classList.remove('hide') : document.querySelector('.no-records-container').classList.add('hide');
}

function resetFilter() {
  localStorage.removeItem('selectedAlpha')
  document.querySelectorAll(".filter-select .custom-input").forEach((select) => {
    select.value = "";
  });
  document.querySelectorAll(".filter-select .custom-option input").forEach((input) => {
    input.checked = false;
  });
  document
    .querySelectorAll(".alphabet.active-alphabet-filter")
    .forEach((el) => {
      el.classList.remove("active-alphabet-filter");
    });
  filterSearch();
}

function selectAllEmployee() {
  let headCheckbox = document.querySelector(".employee-select");
  let table = document.querySelector(".employee-table-body");
  let tr = table.querySelectorAll(".emp-table-row");
  let isChecked = headCheckbox.checked;
  for (let row of tr) {
    row.querySelector(".select").checked = isChecked;
  }
  changeTableDeleteBtnBG(isChecked ? "red" : "#F89191", false);
}

function changeTableDeleteBtnBG(color, flag = true) {
  let tableDeleteBtn = document.getElementsByClassName("table-delete-btn")[0];
  tableDeleteBtn.style.backgroundColor = color;
  tableDeleteBtn.disabled = flag;
}

function findSelectedRow() {
  let table = document.querySelector(".employee-table-body");
  let tr = table.querySelectorAll(".emp-table-row");
  let count = 0;
  for (let row of tr) {
    let rowCheck = row.querySelector(".select");
    if (rowCheck.checked) {
      changeTableDeleteBtnBG("red", false);
      count++;
    }
  }
  if (count == 0)
    changeTableDeleteBtnBG("#F89191",);
  else
    return count;
}

function showDeleteDialogBox(flag = false) {
  let count;
  if (flag)
    count = "this"
  else
    count = findSelectedRow();
  document.querySelector('.delete-pop-up').style.display = 'flex';
  document.querySelector('.delete-pop-up span').innerText = `Do you really want to delete ${count} row`;
  document.querySelector('.wrapper').style.filter = 'blur(4px)';
  document.querySelector('.wrapper').style.pointerEvents = 'none';
}

function hideDeleteDialogBox() {
  document.querySelector('.delete-pop-up').style.display = 'none';
  document.querySelector('.wrapper').style.filter = 'blur(0px)';
  document.querySelector('.wrapper').style.pointerEvents = 'auto';
}

function deleteSelectedEmployee() {
  let table = document.getElementsByClassName("employee-table-body");
  let tr = table[0].getElementsByClassName("emp-table-row");
  let deleteRow = localStorage.getItem('deleteRow');
  if (deleteRow) {
    for (let i = 0; i < tr.length; i++) {
      if (tr[i].innerHTML == deleteRow)
        deleteEmployee(tr[i]);
    }
    localStorage.removeItem('deleteRow')
    hideDeleteDialogBox()
    return;

  }
  for (let i = 0; i < tr.length; i++) {
    let rowCheck = tr[i].getElementsByClassName("select")[0];
    if (rowCheck.checked == true) {
      deleteEmployee(tr[i]);
      i--;
    }
  }
  changeTableDeleteBtnBG("#F89191");
  let headCheckbox = document.getElementsByClassName("employee-select")[0];
  headCheckbox.checked = false;
  hideDeleteDialogBox()
}

function sortTableByColumn(table, column, asc = true) {
  let dirModifier = asc ? 1 : -1;
  let tBody = table.tBodies[0];
  let rows = Array.from(tBody.querySelectorAll(".emp-table-row"));
  let sortedRows;
  if (column == 7) {
    sortedRows = rows.sort((a, b) => {
      let aColText = a
        .querySelector(`td:nth-child(${column + 1})`)
        .textContent.trim().split("/").reverse().join("/");
      let bColText = b
        .querySelector(`td:nth-child(${column + 1})`)
        .textContent.trim().split("/").reverse().join("/");
      return aColText > bColText ? 1 * dirModifier : -1 * dirModifier;
    });
  }
  else {
    sortedRows = rows.sort((a, b) => {
      let aColText = a
        .querySelector(`td:nth-child(${column + 1})`)
        .textContent.trim();
      let bColText = b
        .querySelector(`td:nth-child(${column + 1})`)
        .textContent.trim();
      return aColText > bColText ? 1 * dirModifier : -1 * dirModifier;
    });
  }
  while (tBody.firstChild) {
    tBody.removeChild(tBody.firstChild);
  }
  tBody.append(...sortedRows);
  table
    .querySelectorAll("th")
    .forEach((th) => th.classList.remove("th-sort-asc", "th-sort-desc"));
  table
    .querySelector(`th:nth-child(${column + 1})`)
    .classList.toggle("th-sort-asc", asc);
  table
    .querySelector(`th:nth-child(${column + 1})`)
    .classList.toggle("th-sort-desc", !asc);
}

function toggleEditOption() {
  let td = this.parentElement;
  let dots = this.parentElement.children[1];
  dots.classList.toggle("hide");
  document.addEventListener("click", function (event) {
    let isOutside = !td.contains(event.target);
    if (isOutside) {
      dots.classList.add("hide");
    }
  });
}

function exportTableToExcel() {
  var tableElement = document.getElementsByClassName('employee-table')[0];;
  var sourceData = "data:text/csv;charset=utf-8,";
  var i = 0;
  while (row = tableElement.rows[i]) {
    if (i == 0) {
      sourceData += ([
        'Name', 'Email',
        row.cells[2].innerText,
        row.cells[3].innerText,
        row.cells[4].innerText,
        row.cells[5].innerText,
        row.cells[6].innerText,
        row.cells[7].innerText,
      ]).join(",") + "\r\n";
    }
    else {
      if (row.querySelectorAll('td').length != 1) {
        sourceData += ([
          row.cells[1].querySelector('.employee-name').innerText,
          row.cells[1].querySelector('.employee-email').innerText,
          row.cells[2].innerText,
          row.cells[3].innerText,
          row.cells[4].innerText,
          row.cells[5].innerText,
          row.cells[6].innerText,
          row.cells[7].innerText,
        ]).join(",") + "\r\n";
      }
    }
    i++
  }
  window.location.href = encodeURI(sourceData);
}

function tableSearch() {
  let searchName = document.querySelector('#search-input').value.toLowerCase();
  let table = document.querySelector('.employee-table-body');
  table.querySelectorAll('.emp-table-row').forEach((row) => {
    if (!row.querySelector('.employee-name').innerText.toLowerCase().startsWith(searchName))
      row.style.display = 'none';
    else
      row.style.display = 'table-row';
  })
}


