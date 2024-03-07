var sideBarChange = 0;
var isHidden = 0;
var employeeList = [
    {
        "img": "./assets/images/profile.webp",
        "fname": "Rajesh",
        "lname": "Singhggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggg",
        "email": "rajesh.singh@tezo.com",
        "location": "HYDERABAD",
        "dept": "Product Engg",
        "role": "IN124",
        "empNo": "TZ876543",
        "status": "Active",
        "joinDate": "12/03/2019",
        "dob": "17/01/2004",
        "projectAssigned": "dummy project 1",
        "managerAssigned": "manager 1",
        "mobile": 1212121212,
        "dots": "./assets/icons/three-dot.svg"
    },
    {
        "img": "./assets/images/dummy-profile-image.jpg",
        "fname": "Lisa",
        "lname": "Smith",
        "email": "lisa.smith@tezo.com",
        "location": "USA",
        "dept": "UI/UX",
        "role": "IN122",
        "empNo": "TZ123456",
        "status": "In Active",
        "joinDate": "05/06/2018",
        "dob": "17/01/2004",
        "projectAssigned": "dummy project 1",
        "managerAssigned": "manager 1",
        "mobile": 1212121212,
        "dots": "./assets/icons/three-dot.svg"
    },
    {
        "img": "./assets/images/dummy-profile-image.jpg",
        "fname": "Emily",
        "lname": "Jones",
        "email": "emily.jones@tezo.com",
        "location": "USA",
        "dept": "Product Engg",
        "role": "IN128",
        "empNo": "TZ345678",
        "status": "In Active",
        "joinDate": "15/07/2017",
        "dob": "17/01/2004",
        "projectAssigned": "dummy project 1",
        "managerAssigned": "manager 1",
        "mobile": 1212121212,
        "dots": "./assets/icons/three-dot.svg"
    }
];

var allRoles = [
    {
        "role": "Customer Service Manager",
        "roleId": "IN125",
        "desc": "",
        "dept": "IT",
        "location": "Hyderabad",
    },
    {
        "role": "UX Designer",
        "roleId": "IN128",
        "desc": "",
        "dept": "Product Engg",
        "location": "Hyderabad",
    },
    {
        "role": "Assistant Backend Designer",
        "roleId": "IN130",
        "desc": "",
        "dept": "UI/UX",
        "location": "Hyderabad",
    },
    {
        "role": "Human Resource Manager",
        "roleId": "IN135",
        "desc": "",
        "dept": "IT",
        "location": "Hyderabad",
    },
    {
        "role": "Front End Developer",
        "roleId": "IN124",
        "desc": "",
        "dept": "Product Engg",
        "location": "Hyderabad",
    },
    {
        "role": "Senior Developer",
        "roleId": "IN122",
        "desc": "",
        "dept": "UI/UX",
        "location": "Hyderabad",
    }
];

let sideSec = document.getElementsByClassName('navbar-item');
for (let i = 0; i < sideSec.length; i++) {
    sideSec[i].addEventListener("mouseover", changeIcon);
    sideSec[i].addEventListener('mouseout', changeIcon);
}
function setTableHeight(){
    let contentDivHeight=document.querySelector(".content").offsetHeight;
    let serachBarHeight = document.querySelector(".search-container").offsetHeight;
    let employeeContainerHeight=document.querySelector(".employees-container").offsetHeight;
    let alphabetFilterHeight=document.querySelector(".alphabet-filter").offsetHeight;
    let resetFilterHeight=document.querySelector(".reset-filter").offsetHeight;
    let employeeTable=document.querySelector(".employee-table-container");
    employeeTable.style.minHeight=`${contentDivHeight-serachBarHeight-employeeContainerHeight-alphabetFilterHeight-resetFilterHeight-100}px`;
}

window.addEventListener("resize", function () {
    if (window.matchMedia("(max-width: 720px)").matches) {
        document.getElementsByClassName('logo')[0].src = "./assets/images/tezo-logo-min.png";
    } else {
        document.getElementsByClassName('logo')[0].src = "./assets/images/tezo-logo.png";
    }
    setTableHeight()
})

document.addEventListener("DOMContentLoaded", function (event) {
    let allEmps = JSON.parse(localStorage.getItem('employeeList'));
    if (allEmps) {
        employeeList = allEmps;
    }
    else
        localStorage.setItem('employeeList', JSON.stringify(employeeList));
    let allroles = localStorage.getItem('roles');
    if (allroles) {
        allRoles = allroles
    }
    else
        localStorage.setItem('roles', JSON.stringify(allRoles));
    document.querySelector('.sidebar-min-icon').addEventListener("click", layoutChange);
    document.querySelector('.dismiss-btn').addEventListener("click", dismissBtn);
})

function layoutChange() {
    if (window.screen.width > 720 && sideBarChange == 0) {
        document.getElementsByClassName('wrapper')[0].style.gridTemplateColumns = "1fr 20fr";
        document.getElementsByClassName('sidebar-container')[0].style.padding = "0";
        document.getElementsByClassName('logo')[0].src = "./assets/images/tezo-logo-min.png";
        document.getElementsByClassName('logo')[0].style.width = "120%";
        document.getElementsByClassName('sidebar-min-icon')[0].classList.add("sidebar-min-icon-expand");
        document.getElementsByClassName('sm-heading')[0].style.display = "block";
        document.getElementsByClassName('md-heading')[0].style.display = "none";
        let allSecHeading = document.getElementsByClassName('navbar-item-title');
        for (let i = 0; i < allSecHeading.length; i++) {
            allSecHeading[i].style.display = "none";
        }
        document.getElementsByClassName('app-update-container')[0].style.display = "none";
        sideBarChange = 1;
    }
    else if (window.screen.width > 720 && sideBarChange == 1) {
        document.getElementsByClassName('wrapper')[0].style.gridTemplateColumns = "1fr 4.5fr";
        document.getElementsByClassName('sidebar-container')[0].style.padding = "0 0.5rem";
        document.getElementsByClassName('logo')[0].src = "./assets/images/tezo-logo.png";
        document.getElementsByClassName('logo')[0].style.width = "60%";
        document.getElementsByClassName('sidebar-min-icon')[0].classList.remove("sidebar-min-icon-expand");
        document.getElementsByClassName('sm-heading')[0].style.display = "none";
        document.getElementsByClassName('md-heading')[0].style.display = "block";
        let allSecHeading = document.getElementsByClassName('navbar-item-title');
        for (let i = 0; i < allSecHeading.length; i++) {
            allSecHeading[i].style.display = "block";
        }
        if (isHidden != 1)
            document.getElementsByClassName('app-update-container')[0].style.display = "block";
        sideBarChange = 0;
    }
}

function dismissBtn() {
    document.getElementsByClassName("app-update-container")[0].style.display = "none";
    isHidden = 1;
}

function changeIcon(e) {
    console.log(this)
    console.log(e.target)
    if (this.classList.contains("active") == false) {
        let imgSrc = this.getElementsByTagName('img')[0].getAttribute('src');
        if (imgSrc.indexOf("black") > -1) {
            let newImgSrc = imgSrc.replace("black", "red");
            this.getElementsByTagName('img')[0].src = newImgSrc;
        }
        else {
            let newImgSrc = imgSrc.replace("red", "black");
            this.getElementsByTagName('img')[0].src = newImgSrc;
        }
        let imgSrc2 = this.getElementsByTagName('img')[1]?.getAttribute('src');
        if (imgSrc2) {
            if (imgSrc2.indexOf("black") > -1) {
                let newImgSrc = imgSrc2.replace("black", "red");
                this.getElementsByTagName('img')[1].src = newImgSrc;
            }
            else {
                let newImgSrc = imgSrc2.replace("red", "black");
                this.getElementsByTagName('img')[1].src = newImgSrc;
            }
        }

    }
}