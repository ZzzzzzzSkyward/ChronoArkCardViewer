const backgrounds = [ "AzarArk.webp", "CutScene_Main4_Lucy.webp",
    "CutScene_standing_lucy.webp",
    "AzarArk.webp",
    "CutScene_Main4_Lucy.webp",
    "CutScene_PhoenixIllust.webp",
    "CutScene_Lucy2_awake.webp",
    "CutScene_Main4_Fist.webp"
];

function GetRandomBG() {
    let n = Math.random() * backgrounds.length;
    return backgrounds[ Math.floor( n ) ];
}

function CreateBG() {
    zzz.set.style( document.body, "background-image", "url('images/backgrounds/" + GetRandomBG() + "')" );
}