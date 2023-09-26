let menu = zzz.get.id( "menu" );
let toppane = zzz.get.id( "toppane" );
let version_info = "v2.0beta 桃梨";
let version = zzz.create( "div", {
    innerHTML: version_info,
    className: "version-info"
}, {
    "min-width": Math.floor( version_info.length / 2 ) + "em"
}, toppane );
let pivot = [ {
    name: "技能",
    element: root,
    content: "技能",
    onhide: function () {
        RemoveCards();
    },
    onclick: function () {
        GenerateCards();
    },
    popup: [ {
            name: "Public",
            content: "通用",
            onclick: OnClickSkill,
            onhide: RemoveCards,
            style: {},
        },
        {
            name: "Lucy",
            content: "露西",
            onclick: OnClickSkill,
            onhide: RemoveCards,
            style: {},
        },
        {
            name: "LucyC",
            content: "剑圣露西",
            alias: "剑圣",
            onhide: RemoveCards,
            onclick: OnClickSkill,
            style: {},
        },
        {
            name: "Azar",
            content: "阿扎尔",
            alias: "扎男",
            onclick: OnClickSkill,
            onhide: RemoveCards,
            style: {},
        },
        {
            name: "ShadowPriest",
            content: "卡伦",
            onclick: OnClickSkill,
            onhide: RemoveCards,
            style: {},
        },
        {
            name: "Control",
            content: "纳尔罕",
            onclick: OnClickSkill,
            onhide: RemoveCards,
            style: {},
        },
        {
            name: "Hein",
            content: "海因",
            onclick: OnClickSkill,
            onhide: RemoveCards,
            style: {},
        },
        {
            name: "Queen",
            content: "卉子",
            onclick: OnClickSkill,
            onhide: RemoveCards,
            style: {},
        },
        {
            name: "Ilya",
            content: "伊利亚",
            onclick: OnClickSkill,
            onhide: RemoveCards,
            style: {},
        },
        {
            name: "Prime",
            content: "钢铁之心",
            alias: "盾哥",
            onclick: OnClickSkill,
            onhide: RemoveCards,
            style: {},
        },
        {
            name: "Joey",
            content: "乔伊",
            onclick: OnClickSkill,
            onhide: RemoveCards,
            style: {},
        },
        {
            name: "Lian",
            content: "莉安",
            onclick: OnClickSkill,
            onhide: RemoveCards,
            style: {},
        },
        {
            name: "Mement",
            content: "约翰",
            onclick: OnClickSkill,
            onhide: RemoveCards,
            style: {},
        },
        {
            name: "MissChain",
            content: "链锯小姐",
            onclick: OnClickSkill,
            onhide: RemoveCards,
            style: {},
        },
        {
            name: "Phoenix",
            content: "凤凰",
            onclick: OnClickSkill,
            onhide: RemoveCards,
            style: {},
        },
        {
            name: "Priest",
            content: "普瑞斯特",
            onclick: OnClickSkill,
            onhide: RemoveCards,
            style: {},
        },
        {
            name: "SilverStein",
            content: "希尔弗斯坦",
            alias: "枪哥",
            onclick: OnClickSkill,
            onhide: RemoveCards,
            style: {},
        },
        {
            name: "Sizz",
            content: "西斯",
            onclick: OnClickSkill,
            onhide: RemoveCards,
            style: {},
        },
        {
            name: "Trisha",
            content: "特丽莎",
            onclick: OnClickSkill,
            onhide: RemoveCards,
            style: {},
        },
        {
            name: "TW_Red",
            content: "海拉",
            onclick: OnClickSkill,
            onhide: RemoveCards,
            style: {},
        },
        {
            name: "TW_Blue",
            content: "赛琳娜",
            onclick: OnClickSkill,
            onhide: RemoveCards,
            style: {},
        },
        {
            name: "Momori",
            content: "桃梨",
            onclick: OnClickSkill,
            onhide: RemoveCards,
            style: {},
        },
    ]
}, {
    name: "道具",
    content: "道具",
    popup: [ {
            name: "equip",
            content: "装备",
            onhide: function () {
                root.setAttribute( "name", "" );
                RemoveCards();
            },
            onclick: function () {
                root.setAttribute( "name", "equip" );
                GenerateEquips();
            }
        },
        {
            name: "relic",
            content: "遗物",
            onhide: function () {
                root.setAttribute( "name", "" );
                RemoveCards();
            },
            onclick: function () {
                root.setAttribute( "name", "relic" );
                GenerateRelics();
            }
        },
        {
            name: "consume",
            content: "消耗品",
            onhide: function () {
                root.setAttribute( "name", "" );
                RemoveCards();
            },
            onclick: function () {
                root.setAttribute( "name", "consume" );
                GenerateConsumes();
            }
        },
        {
            name: "",
            content: "药水",
            onhide: function () {
                root.setAttribute( "name", "" );
                RemoveCards();
            },
            onclick: function () {
                root.setAttribute( "name", "potion" );
                GeneratePotions();
            }
        },
        {
            name: "",
            content: "卷轴",
            onhide: function () {
                root.setAttribute( "name", "" );
                RemoveCards();
            },
            onclick: function () {
                root.setAttribute( "name", "scroll" );
                GenerateScrolls();
            }
        },
        {
            name: "active",
            content: "主动道具",
            onhide: function () {
                root.setAttribute( "name", "" );
                RemoveCards();
            },
            onclick: function () {
                root.setAttribute( "name", "active" );
                GenerateActives();
            }
        }
    ]
}, {
    disabled: true,
    name: "事件",
    content: "事件",
    onclick: OnClickEvents
}, {
    disabled: true,
    name: "建筑",
    content: "建筑",
    onclick: OnClickConstrction
}, {
    name: "音乐",
    content: "音乐",
    onclick: function () {
        InitPlayer();
    },
    onhide: function () {
        HidePlayer();
    }
} ];
let lastscreen = null;

function PushScreen( def, arg ) {
    if ( def == lastscreen ) return;
    if ( lastscreen && lastscreen.onhide ) {
        lastscreen.onhide( def, arg );
    }
    lastscreen = def;
    if ( def.onclick ) {
        def.onclick( def, arg );
    }
}

function OnClickSkill( info, e ) {
    GenerateWhoseCards( info.name );
}

function OnClickItems( info, e ) {

}

function OnClickConstrction() {}

function OnClickEvents() {}

function OnClickPivot( e ) {
    let item = e.target;
    pivot.forEach( ( x ) => {
        if ( x.name === item.getAttribute( "name" ) ) {
            PushScreen( x );
            return;
        }
    } )
}

function GeneratePivot( definition, index ) {
    let piv = zzz.create( "div", {
        className: "pivot",
        name: definition.name,
    }, {}, menu );
    piv.setAttribute( "name", definition.name );
    let icon = zzz.create( "div", {
        className: "pivot-icon"
    }, {}, piv );
    let text = zzz.create( "div", {
        className: "pivot-text",
        innerHTML: definition.content
    }, {}, piv );
    let submenu = zzz.create( "div", {
        className: "pivot-submenu fasttrans"
    }, {
        "z-index": "-1"
    }, piv );
    if ( definition.popup ) {
        definition.popup.forEach( ( x ) => {
            let dic = zzz.create( "div", {
                className: "pivot-popup fasttrans",
                innerHTML: x.content
            }, {}, submenu );
            zzz.incidence.bind( dic, "click", function ( e ) {
                e.stopPropagation();
                e = zzz.incidence.interpret( e );
                PushScreen( x, e );
            } );
        } );
    }
    let onclick = function ( e ) {
        e = zzz.incidence.interpret( e );
        e.target = piv;
        return OnClickPivot( e );
    };
    zzz.incidence.bind( piv, "click", onclick );
    return piv;
}

function GenerateMenu() {
    pivot.forEach( ( i ) => !i.disabled && GeneratePivot( i ) );
}