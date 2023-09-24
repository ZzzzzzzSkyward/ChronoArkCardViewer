let loaders = [
    ShowLogo,
    CreateBG, GenerateMenu, CreateInfo,
    GenerateCards,
    ListenForMouseDown
];
let currentindex = 0;

function LoadThem() {
    if ( currentindex >= loaders.length ) {
        PushScreen( pivot[ 0 ] );
        return;
    }
    loaders[ currentindex ]();
    currentindex++;
    setTimeout( LoadThem, 0 );
}
LoadThem();