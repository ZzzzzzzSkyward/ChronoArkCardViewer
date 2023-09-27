let scripts = [ "logo", "audio",
    "backgrounds",
    "carddef_merge",
    "consumedef",
    "relicdef",
    "scrolldef",
    "activedef",
    "potiondef",
    "equipdef",
    "equipstat",
    "relicstat",
    "display",
    "statoverride",
    "评价",
    "遗物评价",
    "card",
    "relic",
    "consume",
    "equip",
    "scroll",
    "active",
    "potion",
    "menu",
    "mouse",
    "musicplayer",
    "qa"
];
let ctn = zzz.get.id( "container" );
let root = zzz.create( "div", {
    id: "cardroot"
}, {}, ctn );
let info = zzz.create( "div", {
    id: "cardinfo",
}, {}, document.body );
let name, attr, key, desc, comment, selected_card;


function Load() {
    //load scripts first. these functions are defined within.
    let p = new Promise( ( resolve, reject ) => {
        let loaded = 0;
        let l = scripts.length - 1;
        let onload = () => {
            if ( loaded++ === l ) resolve();
        }
        let onerror = () => {
            alert( "加载js脚本失败" );
            reject();
        };
        for ( let i of scripts ) {
            let el = document.createElement( "script" );
            el.src = `scripts/${i}.js`;
            document.body.append( el );
            el.onload = onload;
            el.onerror = onerror;
        }
    } );
    p.then( () => {
        let loaders = [
            ShowLogo,
            CreateBG, GenerateMenu, CreateInfo,
            ListenForMouseDown
        ];
        let currentindex = 0;

        let LoadThem = function () {
            if ( currentindex >= loaders.length ) {
                return;
            }
            loaders[ currentindex ]();
            currentindex++;
            setTimeout( LoadThem, 0 );
        }
        LoadThem();
    } );
}
Load();