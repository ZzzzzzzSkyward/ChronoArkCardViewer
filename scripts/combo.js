let combodef = [ {
    title: "莫环抽牌流",
    content: `核心牌：(莫比乌斯环)[S_Leryn_10_Rare]
配合牌：(纯净防护)[S_Prime_3]续一回合、(魔法抽牌)[S_Lucy_11]加费
检索牌：(翻滚)[S_LucyD_11]拿到莫环和纯净防护、(龙形曲线)[S_Leryn_7]=(重整旗鼓)[SE_LucyD_7]删掉打不出的牌
辅助：各种加费手段、露西等待消除过载
`
}, {
    title: "伊利亚蕾琳弃牌流",
    content: `核心牌：(龙形曲线)[S_Leryn_7]、(循环曲线)[SE_Leryn_9]
配合牌：(重整旗鼓)[S_LucyD_7]、(急中生智)[SE_LucyD_4]
装备：恶魔猎人、
道具：伏特加、
强化：一回合后弃牌（配合纳刀：对随机敌人释放后再次抽取该技能）`
} ];

function RenderCombo( text ) {
    //replace (name)[url] with <span>name<div class='combo-card'><img src=url/></div></span>
    let matches = text.match( /\([^)]*\)\[([^\]]+)\]/g );
    let res = text;
    res = res.replace( "\n", "<br/>" );
    matches.forEach( match => {
        let name = match.match( /\([^)]*\)/ )[ 0 ];
        let url = match.match( /\[([^\]]+)\]/ )[ 0 ].slice( 1, -1 );
        res = res.replace( match, `<div>${name}<div class='combo-card'> <img src="${GetUrl(carddef[url])}"/></div></div>` );
    } );
    return res;
}

function CreateCombo( definition, root ) {
    let combo = zzz.create( "div", {
        class: "combo"
    }, {}, root );
    let title = zzz.create( "div", {
        innerHTML: definition.title,
        class: "combo-title"
    }, {}, combo );
    let content = zzz.create( "div", {
        innerHTML: RenderCombo( definition.content ),
        class: "combo-content"
    }, {}, combo );
    return combo;
}

function CreateCombos( root ) {
    for ( let i of combodef ) {
        let c = CreateCombo( i, root );
    }
}