let class_rank = {
    Legendary: 5,
    Unique: 4,
    Rare: 3,
    UnCommon: 2,
    Common: 1,
};

function SortEquip( def ) {
    let items = [];
    for ( let i in def ) {
        if ( def.hasOwnProperty( i ) ) items.push( def[ i ] );
    }
    items.sort( ( x, y ) => class_rank[ x.Itemclass || x.ItemClass || "Common" ] > class_rank[ y.Itemclass || y.ItemClass || "Common" ] );
    return items;
}
let equip_image_index = 1;

function GetUrl_Equip( definition ) {
    let image = definition.image || "";
    return "images/equips/" + image + ".webp";
}

function CreateEquip( definition ) {
    let card = zzz.create( "div", {
        class: "card trans equip",
        name: definition.KeyID,
    }, {}, root );
    let card_content = zzz.create( "div", {
        class: "card-content trans equip"
    }, {}, card );
    card.start = [ 0, 0 ];
    let image = zzz.create( "img", {
        class: "card-image no-select equip",
        src: GetUrl_Equip( definition ),
        loading: "lazy",
        draggable: false,
        alt: ( definition.Name || "" ) + "(" + ( definition.KeyID || "" ) + ")"
    }, {}, card_content );
    let title = zzz.create( "div", {
        class: "card-title equip",
        innerHTML: definition.Name,
        name: definition.Itemclass
    }, {}, card_content );
    return {
        card,
        image
    };
}

function GenerateEquips( def ) {
    RemoveAllChildren( root );
    def = def || equipdef;
    let sorted = SortEquip( def );
    for ( let i in sorted ) {
        let {
            card,
            image
        } = CreateEquip( sorted[ i ] );
        let onmousedown = function ( e ) {
            e = zzz.incidence.interpret( e );
            e.target = card;
            handleMouseDown( e );
        }
        let onmousemove = function ( e ) {
            e = zzz.incidence.interpret( e );
            e.target = card;
            mousemove( e );
        }
        zzz.incidence.bind( card, "mouseenter", function ( e ) {
            card.mouseover = true;
            card.transformZ = 10;
            UpdateTransform( card );
            DisplayCard( card.getAttribute( "name" ), equipdef, relic_comment );
        } );
        zzz.incidence.bind( card, "mouseleave", function ( e ) {
            card.mouseover = false;
            if ( e.relatedTarget == root ) {
                setTimeout( function () {
                    if ( !card.mouseover ) {
                        card.transformZ = 0;
                        zzz.set.style( card.firstElementChild, "transform", "" );
                    }
                }, 100 );
            } else {
                card.transformZ = 0;
                zzz.set.style( card.firstElementChild, "transform", "" );
            }
        } );
    }
}