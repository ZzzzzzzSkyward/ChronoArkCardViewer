function GetComment( info, cmt ) {
    let comment = cmt[ info.KeyID ];
    if ( comment ) comment = ( comment[ '评价等级' ] || "" ) + "<br/>" + ( comment[ '评价' ] || "" );
    else comment = "";
    if ( comment.search( "<br" ) === 0 ) {
        comment = comment.substring( 5 );
    }
    return comment;
}

function GetDescription( info ) {
    let desc = info.Description || "";
    desc = desc
        .replace( /\(&[a-z]+\)/g, "" )
        .replace( /&[a-z]/g, "??" )
        .replace( /[\r\n]+/g, "<br/>" );

    //convert <color={color}>...</color> to <style> tag
    let colors = desc.match( /<color=[a-zA-Z#0-9]+>(.*?)<\/color>/g );
    if ( colors ) {
        colors.forEach( color => {
            let colorValue = color.match( /color=([a-zA-Z#0-9]+)/ )[ 1 ];
            desc = desc.replace( color, `<span style="color: ${colorValue}">${color.match(/>(.*?)<\/color>/)[1]}</span>` );
        } );
    }
    //todo convert <sprite=...> to <img> tag
    let sprites = desc.match( /<sprite=[a-zA-Z#0-9]+>/g );
    if ( sprites ) {
        sprites.forEach( sprite => {
            let which = sprite.match( /<sprite=([a-zA-Z#0-9]+)>/ )[ 1 ];
            desc = desc.replace( sprite, `<span>[符号${which}]</span>` )
        } )
    }
    return desc;
}
let translation_stat = {
    "PlusCriDmg": "暴击时增加伤害",
    "Penetration": "防御破除",
    "def": "防御力",
    "PlusCriHeal": "暴击时增加治疗",
    "spd": "速度",
    "Strength": "保护体力极限",
    "RES_CC": "抵抗干扰",
    "atk": "攻击力",
    "cri": "暴击率",
    "HIT_CC": "干扰力",
    "RES_DOT": "抵抗痛苦",
    "HIT_DEBUFF": "弱化力",
    "AggroPer": "嘲讽",
    "maxhp": "最大体力",
    "DeadImmune": "濒死抵抗",
    "dod": "闪避率",
    "hit": "命中率",
    "HEALTaken": "受治疗",
    "crihit": "受暴击率",
    "DMGTaken": "受攻击",
    "reg": "治疗力",
    "HitMaximum": "命中率溢出到暴击率",
    "RES_DEBUFF": "弱化防御力",
    "HIT_DOT": "痛苦力",
    "Damage": "攻击力",
    "Heal": "治疗力",
    "MaxHP": "最大体力",
    "PlusDiscard": "技能交换次数",
    "MPR": "法力值"
};
let suffix_stat = {
    "PlusCriDmg": "%",
    "Penetration": "%",
    "PlusCriHeal": "%",
    "RES_CC": "%",
    "cri": "%",
    "def": "%",
    "HIT_CC": "%",
    "RES_DOT": "%",
    "HIT_DEBUFF": "%",
    "AggroPer": "%",
    "DeadImmune": "%",
    "dod": "%",
    "hit": "%",
    "HEALTaken": "%",
    "crihit": "%",
    "DMGTaken": "%",
    "RES_DEBUFF": "%",
    "HIT_DOT": "%",
    "Damage": "%",
    "Heal": "%",
    "MaxHP": "%",
};

function GetStat( key ) {
    let override = stat_override[ key ];
    let info = equip_stat[ key ] || relic_stat[ key ];
    if ( !info ) {
        return null;
    }
    let st = [];
    for ( let k in translation_stat ) {
        let v = info[ k ];
        if ( v ) {
            let suffix = suffix_stat[ k ];
            let tra = translation_stat[ k ];
            let override_v = override && override[ k ];
            if ( override_v ) v = override_v;
            st.push( tra );
            st.push( ":" );
            if ( typeof ( v ) == "number" ) {
                if ( v > 0 )
                    st.push( "+" );
                if ( v - Math.floor( v ) < 1e-6 ) {
                    v = v.toFixed( 0 );
                }
            }
            st.push( v.toString() );
            if ( suffix && !override_v )
                st.push( suffix );
            st.push( "<br/>" );
        }
    }
    if ( st.length == 0 ) return null;
    return st.join( "" );
}

function GetAttribute( info ) {
    let turns = info.AutoDelete || 0;
    let basic = info.Basic || false;
    let fatal = info.Fatal || false;
    let fee = info.UseAp;
    let desc = "";
    let price = info.Price;
    let target = info.Target;
    let stack = info.Stack;
    let ununequippable = info.Unchangeable;
    let nodrop = info.NoDrop;
    let nonbasic = info.NoBasicSkill;
    let countdown = info.Counting || 0;
    let ignore = info.IgnoreTaunt || false;
    let stat = GetStat( info.Equip_Script || info.passive_script );
    let disposable = info.Disposable;
    let instant = info.NotCount;
    switch ( target ) {
        case 'Misc':
            target = null;
            break;
        case undefined:
        case null:
        case '':
            target = null;
            break;
        case 'enemy':
            target = "<span name='enemy'>对敌</span>";
            break;
        case 'all_enemy':
            target = "<span name='all_enemy'>AOE对敌</span>";
            break;
        case 'random_enemy':
            target = "<span name='random_enemy'>随机对敌</span>";
            break;
        case 'ally':
            target = "<span name='ally'>对友</span>";
            break;
        case 'otherally':
            target = "<span name='otherally'>对其他队友</span>";
            break;
        case 'self':
            target = "<span name='self'>对己</span>";
            break;
        case 'all_ally':
            target = "<span name='all_ally'>AOE对友</span>";
            break;
        case 'skill':
            target = "<span name='skill'>对技能</span>";
            break;
        case 'deathally':
            target = "<span name='deathally'>对不能战斗者</span>";
            break;
        default:
            target = `<span name='${target}'>对象：${target}</span>`;
    }
    let cls = info.Itemclass;
    switch ( cls ) {
        case 'Legendary':
            cls = "<span name='Legendary'>传说</span>";
            break;
        case 'Unique':
            cls = "<span name='Unique'>英雄</span>";
            break;
        case 'Rare':
            cls = "<span name='Rare'>稀有</span>";
            break;
        case 'UnCommon':
            cls = "<span name='UnCommon'>特殊</span>";
            break;
        case 'Common':
            cls = "<span name='Common'>普通</span>";
            break;
        default:
            cls = `<span name='${cls}'></span>`;
    }
    if ( disposable ) {
        desc = desc + `<span class="card-disposable">一次性</span>`;
    }
    if ( instant ) {
        desc = desc + `<span class="card-instant">迅速</span>`;
    }
    if ( ignore ) {
        desc = desc + `<span class="card-ignore">无视嘲讽</span>`;
    }
    if ( countdown && countdown > 0 ) {
        desc = desc + `<span class="card-countdown">倒计时${countdown}</span>`;
    }
    if ( ununequippable ) {
        desc = desc + `<span class="card-ununequippable">不可卸下</span>`;
    }
    if ( nodrop ) {
        desc = desc + `<span class="card-nodrop">非掉落物</span>`;
    }
    if ( turns > 0 ) {
        desc = desc + `<span class="card-turns">${turns}回合后弃牌</span>`;
    }
    if ( basic ) {
        desc = desc + `<span class="card-basic">基本</span>`;
    }
    if ( nonbasic ) {
        desc = desc + `<span class="card-nonbasic">非基本</span>`;
    }
    if ( fatal ) {
        desc = desc + `<span class="card-fatal">致命</span>`;
    }
    if ( typeof ( fee ) == "number" && fee >= 0 ) {
        desc = desc + "<br/>" + `<span class="card-cost">费用${fee}</span>`;
    }
    if ( target ) {
        desc = desc + "<br/>" + target;
    }
    if ( cls ) {
        desc = desc + "<br/>" + cls;
    }
    if ( price ) {
        desc = desc + "<br/>" + `<span class="card-price">价格${price}</span>`;
    }
    if ( stack ) {
        desc = desc + "<br/>" + `<span class="card-stack">堆叠数量${stack}</span>`;
    }
    if ( stat ) {
        desc = desc + "<br/>" + `<div class="card-stat">${stat}</div>`;
    }
    if ( desc.search( "<br" ) === 0 ) {
        desc = desc.substring( 5 )
    }
    return desc;
}