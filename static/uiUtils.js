function networkStatusIndicator(){
    if (navigator.onLine){
        document.getElementById("networkStatusWindow").innerHTML = '<img src="./static/img/statusSyncFinish.svg" style="display: inline-block; height: 1.5rem; width: 1.5rem; margin-bottom: -0.4rem;"> Online';
    } else {
        document.getElementById("networkStatusWindow").innerHTML = '<img src="./static/img/statusOffline.svg" style="display: inline-block; height: 1.5rem; width: 1.5rem; margin-bottom: -0.4rem;"> Offline';
    }
    console.log("Check Status ...");
}

