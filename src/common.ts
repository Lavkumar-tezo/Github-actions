let isSidebarCollpased: boolean = false;
let isUpdateVisible: boolean = true;

document.addEventListener('DOMContentLoaded', () => {
    document.querySelector<HTMLImageElement>('.logo')!.src = (window.matchMedia("(max-width: 720px)").matches) ? "./assets/images/tezo-logo-min.png" : "./assets/images/tezo-logo.png";
    document.querySelector<HTMLImageElement>('.sidebar-min-icon')!.addEventListener("click", layoutChange);
    document.querySelector<HTMLButtonElement>('.dismiss-btn')!.addEventListener("click", dismissBtn);
    const sideSec: NodeListOf<HTMLElement> = document.querySelectorAll('.navbar-item');
    for (let i = 0; i < sideSec.length; i++) {
        sideSec[i].addEventListener("mouseover", (e: Event) => { changeIcon(e) });
        sideSec[i].addEventListener('mouseout', (e: Event) => { changeIcon(e) });
    }
})

window.addEventListener("resize", () => document.querySelector<HTMLImageElement>('.logo')!.src = (window.matchMedia("(max-width: 720px)").matches) ? "./assets/images/tezo-logo-min.png" : "./assets/images/tezo-logo.png");

function layoutChange(): void {
    if (window.screen.width > 720) {
        document.querySelector<HTMLElement>('.wrapper')!.style.gridTemplateColumns = !isSidebarCollpased ? "1fr 20fr" : "1fr 4.5fr";
        document.querySelector<HTMLElement>('.sidebar-container')!.style.padding = !isSidebarCollpased ? "0" : "0 0.5rem";
        document.querySelector<HTMLImageElement>('.logo')!.src = !isSidebarCollpased ? "./assets/images/tezo-logo-min.png" : "./assets/images/tezo-logo.png";
        document.querySelector<HTMLImageElement>('.logo')!.style.width = !isSidebarCollpased ? "120%" : "60%";
        document.querySelector<HTMLImageElement>('.sidebar-min-icon')!.classList.toggle("sidebar-min-icon-expand");
        document.querySelector<HTMLElement>('.sm-heading')!.style.display = !isSidebarCollpased ? "block" : "none";
        document.querySelector<HTMLElement>('.md-heading')!.style.display = !isSidebarCollpased ? "none" : "block";
        const allSecHeading: NodeListOf<HTMLElement> = document.querySelectorAll('.navbar-item-title');
        for (let i = 0; i < allSecHeading.length; i++) {
            allSecHeading[i].style.display = !isSidebarCollpased ? "none" : "block"
        }
        document.querySelector<HTMLElement>('.app-update-container')!.style.display = (!isSidebarCollpased || !isUpdateVisible) ? "none" : "block";
        isSidebarCollpased = !isSidebarCollpased;
    }
}

function dismissBtn(): void {
    document.querySelector<HTMLElement>(".app-update-container")!.style.display = "none";
    isUpdateVisible = false;
}

function changeIcon(e: Event): void {
    let div = e.currentTarget as HTMLDivElement;
    if (div.classList.contains("active") == false) {
        let imgSrc: string = div.querySelector<HTMLImageElement>('img')!.src;
        div.getElementsByTagName('img')[0].src = (imgSrc.indexOf("black") > -1) ? imgSrc.replace("black", "red") : imgSrc.replace("red", "black")
        let imgSrc2: string | null = div.getElementsByTagName('img')[1]?.getAttribute('src');
        if (imgSrc2) {
            div.getElementsByTagName('img')[1].src = (imgSrc2.indexOf("black") > -1) ? imgSrc2.replace("black", "red") : imgSrc2.replace("red", "black");
        }
    }
}
