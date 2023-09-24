let mousedown = false;

function ChangeMouse_Impl() {
    if ( mousedown )
        document.body.classList.add( "mousedown" );
    else
        document.body.classList.remove( "mousedown" );
}

function ChangeMouse( down ) {
    mousedown = down;
    requestAnimationFrame( ChangeMouse_Impl );
}

function ListenForMouseDown() {
    zzz.incidence.bind( document.body, "mousedown", function ( e ) {
        ChangeMouse( true );
    } );
    zzz.incidence.bind( document.body, "mouseup", function ( e ) {
        ChangeMouse( false );
    } );
    setInterval( function () {
        document.body.classList.add( "mouseblink" );
        setTimeout( function () {
            document.body.classList.remove( "mouseblink" );
        }, Math.random() * 100 );
    }, 1000 * 10 );
}