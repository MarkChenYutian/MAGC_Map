window.addEventListener('online', () => {
    document.getElementById("networkStatusWindow").innerHTML = '<img src="../static/img/statusSyncFinish.svg" style="display: inline-block; height: 1.5rem; width: 1.5rem; margin-bottom: -0.4rem;"> Online';
})

window.addEventListener('offline', ()=>{
    document.getElementById("networkStatusWindow").innerHTML = '<img src="../static/img/statusOffline.svg" style="display: inline-block; height: 1.5rem; width: 1.5rem; margin-bottom: -0.4rem;"> Offline';
})

