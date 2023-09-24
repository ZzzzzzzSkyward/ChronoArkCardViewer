let musicplayer;
let aindex = -1;

function GetAudioUrl() {
    aindex++;
    aindex = aindex % audio.length;
    return audio[ aindex ];
}

function InitPlayer() {
    if ( musicplayer ) {
        zzz.set.style( musicplayer, "display", "block" );
        return;
    }
    let common_root = "images/player/";
    let resources = {
        stick: "stick.webp",
        cd: "CD.webp",
        cd_light: "CD_light.webp",
    }
    for ( let i in resources ) {
        if ( resources.hasOwnProperty( i ) ) {
            resources[ i ] = common_root + resources[ i ];
        }
    }
    musicplayer = zzz.create( "div", {
        id: "musicplayer"
    }, {}, ctn );
    let p = musicplayer;
    let aud = GetAudioUrl();
    let cd = zzz.create( "div", {
        className: "musicplayer-cd"
    }, {}, p );
    let cd_img = zzz.create( "div", {
        className: "cd-img no-select"
    }, {}, cd );
    let cd_img_cover = zzz.create( "div", {
        className: "cd-cover",
    }, {}, cd_img );
    let cd_img_cover_img = zzz.create( "img", {
        className: "cd-cover-img",
        draggable: false,
        src: resources.cd
    }, {}, cd_img_cover );
    let cd_img_light = zzz.create( "img", {
        className: "cd-light",
        draggable: false,
        src: resources.cd_light
    }, {}, cd_img );
    let stick = zzz.create( "img", {
        className: "musicplayer-stick",
        src: resources.stick
    }, {}, p );
    let bar_title = zzz.create( "div", {
        className: "musicplayer-title",
        innerHTML: aud.replace( /[.].*$/, "" )
    }, {}, p );
    let bar = zzz.create( "div", {
        className: "musicplayer-bar"
    }, {}, p );
    let bar_timing = zzz.create( "div", {
        className: "bar-timing no-select",
        innerHTML: "00:00"
    }, {}, bar );
    let audio = zzz.audio.create( {
        parent: p,
        src: audio_root + aud
    } );
    let isPlaying = false;
    let currentDegree = 0;
    let currentTime = new Date();
    let va = 360 / 30 / 1000;
    let lastTime = 0;
    let timing = 0;
    let dur = audio.duration();
    let gettime = function () {
        timing = audio.time();
        return `${padZero(timing/60)}:${padZero(timing%60)}`;
    };
    let UpdateTime = function () {
        let t = gettime();
        bar_timing.innerHTML = t;
        let pos = audio.time() / dur;
        if ( isNaN( pos ) ) return;
        zzz.set.style( bar_timing, "--percent", `${Math.round(pos*100)}%` );
    };
    let updateTask = null;
    let StopPlay = function () {
        currentTime = new Date();
        let diff = currentTime - lastTime;
        currentDegree += diff * va;
        currentDegree = currentDegree % 360;
        musicplayer.classList.remove( 'playing' );
        zzz.set.style( cd_img_cover_img, "--angle", `${currentDegree}deg` );
        audio.pause();
        clearInterval( updateTask );
    };
    let StartPlay = function () {
        audio.play();
        dur = audio.duration();
        updateTask = setInterval( UpdateTime, 1000 );
        UpdateTime();
        lastTime = new Date();
        musicplayer.classList.add( 'playing' );
    };
    let TogglePlaying = function ( e ) {
        if ( isPlaying ) {
            StopPlay();
        } else {
            StartPlay();
        }
        isPlaying = !isPlaying;
    }
    zzz.incidence.bind( stick, "click", TogglePlaying );
    zzz.incidence.bind( cd, "click", TogglePlaying );
    let OnEnd = function ( e ) {
        StopPlay();
        audio.to( 0 );
        StartPlay();
    };
    zzz.incidence.bind( audio.get(), "ended", OnEnd );
    let calcPos = function ( e ) {
        return e.offsetX / bar_timing.offsetWidth;
    }
    let handleClick = function ( e ) {
        // 计算点击位置对应的进度比例
        const pos = calcPos( e );
        // 设置音频进度
        dur = audio.duration();
        audio.to( dur * pos );
        // 播放音频
        if ( !isPlaying ) {
            StartPlay();
            isPlaying = true;
        }
    }
    let ChangeTrack = function () {
        let name = GetAudioUrl();
        bar_title.innerHTML = name.replace( /[.].*$/, "" );
        audio.get().src = audio_root + name;
        audio.to( 0 );
        if ( isPlaying ) {
            StopPlay();
            StartPlay();
        }
    };
    zzz.incidence.bind( bar_timing, "click", handleClick );
    zzz.incidence.bind( bar_title, "click", ChangeTrack );
}

function HidePlayer() {
    if ( musicplayer ) {
        zzz.set.style( musicplayer, "display", "none" );
    }
}

function padZero( num ) {
    return Math.floor( num ).toString().padStart( 2, '0' );
}