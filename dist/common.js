"use strict";
let isSidebarCollpased = false;
let isUpdateVisible = true;
document.addEventListener('DOMContentLoaded', () => {
    document.querySelector('.logo').src = (window.matchMedia("(max-width: 720px)").matches) ? "./assets/images/tezo-logo-min.png" : "./assets/images/tezo-logo.png";
    document.querySelector('.sidebar-min-icon').addEventListener("click", layoutChange);
    document.querySelector('.dismiss-btn').addEventListener("click", dismissBtn);
    const sideSec = document.querySelectorAll('.navbar-item');
    for (let i = 0; i < sideSec.length; i++) {
        sideSec[i].addEventListener("mouseover", (e) => { changeIcon(e); });
        sideSec[i].addEventListener('mouseout', (e) => { changeIcon(e); });
    }
});
window.addEventListener("resize", () => document.querySelector('.logo').src = (window.matchMedia("(max-width: 720px)").matches) ? "./assets/images/tezo-logo-min.png" : "./assets/images/tezo-logo.png");
function layoutChange() {
    if (window.screen.width > 720) {
        document.querySelector('.wrapper').style.gridTemplateColumns = !isSidebarCollpased ? "1fr 20fr" : "1fr 4.5fr";
        document.querySelector('.sidebar-container').style.padding = !isSidebarCollpased ? "0" : "0 0.5rem";
        document.querySelector('.logo').src = !isSidebarCollpased ? "./assets/images/tezo-logo-min.png" : "./assets/images/tezo-logo.png";
        document.querySelector('.logo').style.width = !isSidebarCollpased ? "120%" : "60%";
        document.querySelector('.sidebar-min-icon').classList.toggle("sidebar-min-icon-expand");
        document.querySelector('.sm-heading').style.display = !isSidebarCollpased ? "block" : "none";
        document.querySelector('.md-heading').style.display = !isSidebarCollpased ? "none" : "block";
        const allSecHeading = document.querySelectorAll('.navbar-item-title');
        for (let i = 0; i < allSecHeading.length; i++) {
            allSecHeading[i].style.display = !isSidebarCollpased ? "none" : "block";
        }
        document.querySelector('.app-update-container').style.display = (!isSidebarCollpased || !isUpdateVisible) ? "none" : "block";
        isSidebarCollpased = !isSidebarCollpased;
    }
}
function dismissBtn() {
    document.querySelector(".app-update-container").style.display = "none";
    isUpdateVisible = false;
}
function changeIcon(e) {
    var _a;
    let div = e.currentTarget;
    if (div.classList.contains("active") == false) {
        let imgSrc = div.querySelector('img').src;
        div.getElementsByTagName('img')[0].src = (imgSrc.indexOf("black") > -1) ? imgSrc.replace("black", "red") : imgSrc.replace("red", "black");
        let imgSrc2 = (_a = div.getElementsByTagName('img')[1]) === null || _a === void 0 ? void 0 : _a.getAttribute('src');
        if (imgSrc2) {
            div.getElementsByTagName('img')[1].src = (imgSrc2.indexOf("black") > -1) ? imgSrc2.replace("black", "red") : imgSrc2.replace("red", "black");
        }
    }
}
//# sourceMappingURL=common.js.map