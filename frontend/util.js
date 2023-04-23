export function errorRaise(errorMessage){
    loadCircleSwitch(false);
    alert(errorMessage);
}

export function loadCircleSwitch(bool){
    const loader = document.getElementById('loadCircle');
    if(bool == true && loader.classList.contains("done") == true){
        loader.classList.remove("done")
    }else if(bool == false && loader.classList.contains("done") == false){
        loader.classList.add("done")
    }
}