const backgrounds = [ "AzarArk.webp", "CutScene_Main4_Lucy.webp",
    "CutScene_standing_lucy.webp",
    "AzarArk.webp",
    "CutScene_Main4_Lucy.webp",
    "CutScene_PhoenixIllust.webp",
    "CutScene_Lucy2_awake.webp",
    "CutScene_Main4_Fist.webp",
    "CutScene_EndingFake_0.webp",
    "3.webp",
    "1.webp",
    "4.webp",
    "2.webp",
    "CutScene_BarFight_1.webp",
    "CutScene_Lucy_CloseEye.webp",
    "CutScene_DespairLucy_3_1.webp",
    "CutScene_DespairLucy_0.webp",
    "CutScene_FatherAndDaughter.webp",
    "CutScene_FinalAsh_4.webp",
    "CutScene_FinalAsh_2.webp",
    "CutScene_FinalAsh_1.webp",
    "CutScene_Attack_Hein_3.webp",
    "CutScene_Attack_Hein_1.webp",
    "CutScene_MasterBattle_1_Lucy.webp",
    "CutScene_Lucy0_Lucy.webp",
    "CutScene_Attack_Hein_6.webp",
    "ending_front.webp",
];

function GetRandomBG() {
    let n = Math.random() * backgrounds.length;
    return backgrounds[ Math.floor( n ) ];
}

function CreateBG() {
    zzz.set.style( document.body, "background-image", "url('images/backgrounds/" + GetRandomBG() + "')" );
}