var allRoles;
var employeeList;
var selectedRole;
function createRoleCard(employee) {
    let cardContainer = createNewElement('div', "role-card", "flex-container", "flex-col", 'employee-card')
    let empCardDetail = createNewElement('div', 'employee-card-title', 'w-100', 'd-flex')
    let profileImage = createNewElementWithAttr('img', ['src', employee.img], ['alt', 'admin'])
    profileImage.classList.add('employee-card-img');
    let employeeDetails = createNewElement('div', 'employee-detail')
    let employeeName = createNewElement('div', 'employee-name')
    employeeName.textContent = `${employee.fname} ${employee.lname}`;
    let employeeDept = createNewElement('div', 'employee-dept')
    employeeDept.textContent = selectedRole.role;
    let employeeContainer = createNewElement('div', 'w-100', 'role-details')
    let departmentIcon = createNewElement('div', 'dept-icon', 'd-flex')
    let deptImage = createNewElementWithAttr('img', ['src', "./assets/icons/emp-id.svg"], ['alt', 'department-id'])
    let departmentId = createNewElement('div', 'emp-office-detail')
    departmentId.textContent = employee.empNo;
    let departmentDetails = createNewElement('div', "role-department", "d-flex", "w-100", "jus-content-start")
    let emailIcon = createNewElement('div', "dept-icon", "d-flex")
    let emailImage = createNewElementWithAttr('img', ['src', "./assets/icons/email.svg"], ['alt', 'email-icon'])
    let emailAddress = createNewElement('div', 'emp-office-detail')
    emailAddress.textContent = employee.email;
    let emailDetails = createNewElement('div', "role-department", "d-flex", "w-100", "jus-content-start")
    let teamIcon = createNewElement('div', "dept-icon", "d-flex")
    let teamImage = createNewElementWithAttr('img', ['src', "./assets/icons/team.svg"], ['alt', 'team-icon'])
    let teamRole = createNewElement('div', 'emp-office-detail')
    teamRole.textContent = employee.dept;
    let teamDetails = createNewElement('div', "role-department", "d-flex", "w-100", "jus-content-start")
    let locationIcon = createNewElement('div', "dept-icon", "d-flex")
    let locationImage = createNewElementWithAttr('img', ['src', "./assets/icons/location.svg"], ['alt', 'location-icon'])
    locationIcon.appendChild(locationImage)
    let locationAddress = createNewElement('div', 'emp-office-detail')
    locationAddress.textContent = employee.location;
    let locationDetails = createNewElement('div', "role-department", "d-flex", "w-100", "jus-content-start")
    let viewAllLink = createNewElementWithAttr('a', ['href', '#'], ['title', 'employee-page'], ['target', '_blank'])
    viewAllLink.classList.add('anchor', 'view-all-container')
    let viewAllText = createNewElement('div', "view-all", "d-flex")
    viewAllText.textContent = "View ";
    let arrowIcon = createNewElementWithAttr('img', ['src', "./assets/icons/vector.svg"], ['alt', 'right-arrow'])
    cardContainer = addElementToParent(cardContainer, [empCardDetail, profileImage, [employeeDetails, employeeName, employeeDept]], [employeeContainer, [departmentDetails, [departmentIcon, deptImage], departmentId], [emailDetails, [emailIcon, emailImage], emailAddress], [teamDetails, [teamIcon, teamImage], teamRole], [locationDetails, [locationIcon, locationImage], locationAddress]], [viewAllLink, [viewAllText, arrowIcon]])
    document.querySelector('.role-card-container').appendChild(cardContainer)
}

function createDivBlock(element) {
    employeeList.forEach((emp) => {
        if (emp.role == '')
            createEmployeeDiv(emp, element)
    })
}

document.addEventListener('DOMContentLoaded', function (event) {
    allRoles = JSON.parse(localStorage.getItem('roles'))
    employeeList = JSON.parse(localStorage.getItem('employeeList'));
    var params = new URLSearchParams(window.location.search)
    let selectedRoleTitle = params.get("selectedRole");
    let getRole = allRoles.filter(function (obj) {
        return obj.role == selectedRoleTitle
    })
    selectedRole = getRole[0];
    for (let obj of selectedRole.profiles) {
        let empNo = obj.empNo;
        let emp = employeeList.filter(function (obj) {
            return obj.empNo == empNo;
        })
        createRoleCard(emp[0]);
    }
    document.querySelector('.add-employee').addEventListener('click', openAddEmployeeForm);
    document.querySelector('.cancel-edit-role').addEventListener('click', closeAddRoleForm)
    document.querySelector('#edit-assign-employees').addEventListener('focus', (event) => {
        event.target.parentElement.querySelector('.all-employees').style.display = "block";
    })
    document.querySelector(`#edit-assign-employees`).addEventListener('keyup', (event) => {
        let searchValue = event.target.value.toLowerCase()
        let allEmpList = document.querySelectorAll('.employee-name-img');
        allEmpList.forEach((emp) => {
            let name = emp.innerText.toLowerCase();
            if (name.startsWith(searchValue))
                emp.style.display = "block";
            else
                emp.style.display = "none"
        })
    })
    document.querySelector('.edit-role').addEventListener('submit', (event) => { editRole(event) })
})

function openAddEmployeeForm() {
    let elementsToHide = ["employees-title-container", "role-desc-container", "role-card-container",];
    elementsToHide.forEach((elementClass) => {
        document.querySelector(`.${elementClass}`).style.display = "none";
    });
    let form = document.querySelector(".edit-role-container")
    form.style.display = "block";
    let serachBarHeight =
        document.querySelector(".search-container").offsetHeight;
    document.querySelector(".edit-role-container").style.top = `${serachBarHeight + 20
        }px`;
    let editObject = {
        'edit-role-name': selectedRole.role,
        'edit-role-dept': selectedRole.dept.toLowerCase(),
        'edit-role-desc': selectedRole.desc.toLowerCase(),
        'edit-role-location': selectedRole.location.toLowerCase()
    }
    for (const selector in editObject) {
        const element = document.querySelector(`#${selector}`);
        if (element) {
            element.value = editObject[selector];
        }
    }
    let allEmployeeContainer = form.querySelector('.all-employees');
    allEmployeeContainer.innerHTML = ""
    createDivBlock(allEmployeeContainer);
}

function closeAddRoleForm() {
    document.querySelector(`.employees-title-container`).style.display = 'flex';
    document.querySelector(`.role-desc-container`).style.display = 'block';
    document.querySelector(`.role-card-container`).style.display = 'grid';
    document.querySelector('.edit-role-container').style.display = 'none';
    let form = document.querySelector('.edit-role');
    let allEmployeeContainer = form.querySelector('.all-employees');
    allEmployeeContainer.innerHTML = "";
    allEmployeeContainer.style.display = 'none'
}

function editRole(event) {
    event.preventDefault();
    let form = document.getElementsByClassName("edit-role")[0];
    let allEmpList = form.querySelectorAll('.employee-name-img');
    allEmpList.forEach((emp) => {
        let input = emp.querySelector('input');
        if (input.checked) {
            let empId = emp.querySelector('.hide').innerText;
            for (let employee of employeeList) {
                if (employee.empNo == empId) {
                    employee.role = selectedRole.roleId;
                    selectedRole['profiles'].push(employee);
                    break;
                }
            }
        }
    })
    localStorage.setItem('employeeList', JSON.stringify(employeeList))
    localStorage.setItem('roles', JSON.stringify(allRoles));
    form.reset();
    createToastMessage('Employee Added')
    document.querySelector('.role-card-container').innerHTML = "";
    for (let obj of selectedRole.profiles) {
        let empNo = obj.empNo;
        let emp = employeeList.filter(function (obj) {
            return obj.empNo == empNo;
        })
        createRoleCard(emp[0]);
    }
    closeAddRoleForm();
}