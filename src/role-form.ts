import { EmployeeSample, RoleSample } from "./module.js";
import { changeElementDisplay, createToastMessage, showValidInput } from "./module.js";
import { activateInput, createDivBlock, createRoleCard } from "./role.js";

var allRoles: RoleSample[];
var employeeList: EmployeeSample[];

export function openAddRoleForm(formClass: string): void {
    let elementsToHide: string[] = ["employees-container", "reset-filter", "role-card-container"];
    elementsToHide.forEach((elementClass) => changeElementDisplay(`.${elementClass}`, "none"));
    let form: HTMLFormElement = document.querySelector(`${formClass}`)!;
    changeElementDisplay(`${formClass}`, 'block');
    let serachBarHeight: number = document.querySelector<HTMLDivElement>(".search-container")!.offsetHeight;
    document.querySelector<HTMLFormElement>(`${formClass}`)!.style.top = `${serachBarHeight + 20}px`;
    let allEmployeeContainer: HTMLDivElement = form.querySelector('.all-employees')!;
    allEmployeeContainer.innerHTML = "";
    createDivBlock(allEmployeeContainer);
}

export function closeRoleForm(formClass: string): void {
    let display: Record<string, string> = {
        ".reset-filter": "flex",
        ".employees-container": "flex",
        ".role-card-container": "grid",
    };
    for (let element in display) {
        changeElementDisplay(`${element}`, display[element])
    }
    changeElementDisplay(`${formClass}`, 'none')
    let form: HTMLFormElement = document.querySelector(`${formClass} form`)!;
    form.reset();
    form.querySelector<HTMLSpanElement>('.added-emp-number')!.innerText = ''
    let allEmployeeContainer: HTMLDivElement = form.querySelector('.all-employees')!;
    allEmployeeContainer.innerHTML = "";
    allEmployeeContainer.style.display = 'none';
    validateField(form, false);
    document.querySelector<HTMLButtonElement>('.submit-edit-role')!.innerText = "Edit";
    document.querySelector<HTMLButtonElement>('.submit-edit-role')!.type = "button";
    activateInput(true);
}

export function openEditRoleForm(event: Event, formClass: string): void {
    openAddRoleForm(formClass);
    let triggredElement = event.target as HTMLFormElement;
    let roleTitle: string = triggredElement.parentElement!.querySelector<HTMLDivElement>('.role-title')!.innerText;
    localStorage.setItem('selectedRole', JSON.stringify(roleTitle));
    let form: HTMLFormElement = document.querySelector(`${formClass}`)!;
    let xhr2 = new XMLHttpRequest();
    xhr2.open('GET', "http://localhost:3000/allRoles", false);
    xhr2.onload = () => {
        allRoles = JSON.parse(xhr2.responseText)
        let selectedRoleDetail: RoleSample | undefined = allRoles.find(obj => obj.role == roleTitle);
        if (selectedRoleDetail) {
            localStorage.setItem('selectedRole', JSON.stringify(roleTitle));
            let initialEmp: number | undefined = selectedRoleDetail.profiles?.length;
            if (initialEmp)
                form.querySelector<HTMLSpanElement>('.added-emp-number')!.innerText = `${initialEmp} selected`
            let editObject: Record<string, string | undefined> = {
                'edit-role-name': selectedRoleDetail.role,
                'edit-role-dept': selectedRoleDetail.dept.toLowerCase(),
                'edit-role-desc': selectedRoleDetail.desc?.toLowerCase(),
                'edit-role-location': selectedRoleDetail.location.toLowerCase()
            }
            for (const selector in editObject) {
                const element: HTMLFormElement = document.querySelector(`#${selector}`)!;
                (element) ? element.value = editObject[selector] : "";
            }
        }
    }
    xhr2.send();
    let allEmployeeContainer: HTMLDivElement = form.querySelector('.all-employees')!;
    allEmployeeContainer.innerHTML = "";
    createDivBlock(allEmployeeContainer);
}

function validateField(form: HTMLFormElement, flag = true): number {
    let check: number = 1;
    let xhr2 = new XMLHttpRequest();
    xhr2.open('GET', "http://localhost:3000/allRoles", false);
    xhr2.onload = () => (allRoles = JSON.parse(xhr2.responseText));
    xhr2.send();
    const DangerInput: string[] = ["role", "dept", "desc", "location",];
    let formInputs = Array.from(form.elements)! as HTMLFormElement[];
    let formInput = formInputs.filter((input): Element | void => {
        let inputName = input.getAttribute('name');
        let find = (inputName) ? DangerInput.indexOf(inputName?.toLowerCase()) : -1;
        if (find != -1)
            return input;
    })
    for (let key in formInput) {
        let element: HTMLFormElement = formInput[key];
        if (element.name == 'desc') {
            continue;
        }
        else if (element.value == "") {
            showValidInput(element, `&#9888; ${DangerInput[key]} is required`, flag);
            check = 0;
        }
        else if (element.name == 'role') {
            let newRoleName: string = element.value.trim().toLowerCase();
            if (!newRoleName.match(/^[a-zA-Z ]+$/)) {
                showValidInput(element, `&#9888; role name should have alphabets`, flag);
                check = 0;
            }
            let selectedRole = JSON.parse(localStorage.getItem('selectedRole')!);
            if ((selectedRole && selectedRole.toLowerCase() != newRoleName) || !selectedRole) {
                for (let i = 0; i < allRoles.length; i++) {
                    if ((allRoles[i].role.trim().toLowerCase() === newRoleName)) {
                        showValidInput(element, `&#9888; This role has been already registered`, flag);
                        check = 0;
                        break;
                    }
                }
            }
        }

    }
    return check;
}

export function addRole(event: Event, mode: string) {
    event.preventDefault();
    let xhr = new XMLHttpRequest();
    xhr.open('GET', "http://localhost:3000/employeeList", false);
    xhr.onload = () => { employeeList = JSON.parse(xhr.responseText) }
    xhr.send();
    let xhr2 = new XMLHttpRequest();
    xhr2.open('GET', "http://localhost:3000/allRoles", false);
    xhr2.onload = () => (allRoles = JSON.parse(xhr2.responseText));
    xhr2.send();
    let form: HTMLFormElement = (mode == 'add') ? document.querySelector(".add-role")! : document.querySelector(".edit-role")!;
    let check = validateField(form, true);
    if (check == 0)
        return;
    let newFormObject: Record<string, string> = {}
    let element: HTMLFormElement = form.querySelector('[name="role"]')!;
    newFormObject[element.name] = element.value;
    element = form.querySelector('[name="desc"]')!;
    newFormObject[element.name] = element.value;
    element = form.querySelector('[name="location"]')!;
    let optionText: string = element.options[element.selectedIndex].innerText;
    newFormObject[element.name] = optionText;
    element = form.querySelector('[name="dept"]')!;
    optionText = element.options[element.selectedIndex].innerText;
    newFormObject[element.name] = optionText;
    let allEmpList: NodeListOf<HTMLDivElement> = form.querySelectorAll('.employee-name-img')!;
    let allAllotedEmp: Record<string, EmployeeSample[]> = {
        profile: []
    }
    allEmpList.forEach((emp) => {
        let input: HTMLInputElement = emp.querySelector('input')!;
        if (input.checked) {
            let empId: string = emp.querySelector<HTMLSpanElement>('.hide')!.innerText;
            for (let employee of employeeList) {
                if (employee.id == empId) {
                    allAllotedEmp.profile.push(employee);
                    break;
                }
            }
        }
    })
    let newRoleId: string = getNewRoleId(allRoles);
    let newRole: RoleSample = {
        role: newFormObject.role,
        dept: newFormObject.dept,
        desc: newFormObject.desc,
        location: newFormObject.location,
        profiles: allAllotedEmp.profile,
        id: newRoleId,
    }
    if (mode == "edit") {
        let selectedRole: string = JSON.parse(localStorage.getItem("selectedRole")!).toLowerCase();
        let allRoleCard: NodeListOf<HTMLDivElement> = document.querySelectorAll('.role-card')
        allRoleCard.forEach(roleCard => {
            let roleCardTitle: string = roleCard.querySelector<HTMLDivElement>('.role-title')!.innerText.toLowerCase();
            (roleCardTitle == selectedRole) ? roleCard.remove() : "";
        })
        let selectedRoleDetail: RoleSample | undefined = allRoles.find((role) => role.role.toLowerCase() == selectedRole);
        if (selectedRoleDetail) {
            let xhr2 = new XMLHttpRequest();
            xhr2.open('DELETE', `http://localhost:3000/allRoles/${selectedRoleDetail.id}`,false)
            xhr2.onload = () => {
                let selectedRoleDetails: RoleSample[] = allRoles.filter(obj => obj.role.toLowerCase() == selectedRole);
                let selectedRoleId: string = selectedRoleDetails[0].id;
                employeeList.forEach((empl) => {
                    if (empl.role == selectedRoleId) {
                        empl.role = ''
                        let xhr = new XMLHttpRequest();
                        xhr.open('PUT', `http://localhost:3000/employeeList/${empl.id}`, false)
                        xhr.send(JSON.stringify(empl));
                    }
                })
            }
            xhr2.send(JSON.stringify(newRole));
        }
        addRoleToEmployee(newRoleId, newRole, employeeList);
        localStorage.removeItem("selectedRole");
    }
    createRoleCard(newRole);
    allRoles.push(newRole);
    let xhr3 = new XMLHttpRequest();
    xhr3.open('POST', "http://localhost:3000/allRoles", true);
    xhr3.send(JSON.stringify(newRole));
    addRoleToEmployee(newRoleId, newRole, employeeList);
    form.reset();
    if (mode == 'add') {
        closeRoleForm('.add-role-container');
        createToastMessage('Role Added')
    }
    else {
        closeRoleForm('.edit-role-container');
        createToastMessage('Changes Applied')
    }
}

function getNewRoleId(roles: RoleSample[]): string {
    let sortedRole: RoleSample[] = roles.sort((a, b) => a.id > b.id ? 1 : -1)
    let highestRoleId: string = sortedRole[sortedRole.length - 1].id;
    let highestRoleNum: string = highestRoleId.substring(2, highestRoleId.length);
    return `IN${Number(highestRoleNum) + 1}`;
}

function addRoleToEmployee(roleId: string, newRole: RoleSample, employees: EmployeeSample[]) {
    employeeList = employees;
    if (newRole.profiles) {
        for (let i = 0; i < newRole.profiles.length; i++) {
            let empl: EmployeeSample = newRole.profiles[i];
            for (let employee of employeeList) {
                if (employee.id == empl.id) {
                    employee.role = roleId;
                    let xhr = new XMLHttpRequest();
                    xhr.open('PUT', `http://localhost:3000/employeeList/${employee.id}`, true);
                    xhr.send(JSON.stringify(employee));
                }
            }
        }
    }
}
