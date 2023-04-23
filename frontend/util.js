export function errorRaise(errorMessage){
    const loader = document.getElementById('loadCircle');
    if(loader.classList.contains("done") == false){
        loader.classList.add('done');
    }
    alert(errorMessage);
}