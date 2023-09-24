let logo = "images/backgrounds/steam ark.jpg";
let waittime = 2;
let killtime = 1;

function ShowLogo() {
    let logodiv = zzz.create( "div", {
        id: "logo"
    }, {
        "background-image": `url("${logo}")`,
        'z-index': 99
    }, document.body );
    let Fade = function () {
        logodiv.classList.add( "fade" );
    }
    let Hide = function () {
        logodiv.style.display = "none";
        document.body.removeChild( logodiv );
    }
    setTimeout( Fade, waittime * 1000 );
    setTimeout( Hide, ( waittime + killtime ) * 1000 );
}