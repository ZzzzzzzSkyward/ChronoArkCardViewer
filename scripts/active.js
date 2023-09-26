function GetUrl_Active( definition ) {
    let image = definition.image || "";
    return "images/actives/" + image + ".webp";
}

function CreateActive( definition ) {
    let card = zzz.create( "div", {
        class: "card trans active",
        name: definition.KeyID,
    }, {}, root );
    let card_content = zzz.create( "div", {
        class: "card-content trans active"
    }, {}, card );
    card.start = [ 0, 0 ];
    let image = zzz.create( "img", {
        class: "card-image no-select active",
        src: GetUrl_Active( definition ),
        loading: "lazy",

        draggable: false,
        alt: ( definition.Name || "" ) + "(" + ( definition.KeyID || "" ) + ")"
    }, {}, card_content );
    let title = zzz.create( "div", {
        class: "card-title active",
        innerHTML: definition.Name
    }, {}, card_content );
    return {
        card,
        image
    };
}

function GenerateActives( def ) {
    RemoveAllChildren( root );
    def = def || activedef;
    for ( let i in def ) {
        let {
            card,
            image
        } = CreateActive( def[ i ] );
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
            DisplayCard( card.getAttribute( "name" ), activedef, relic_comment );
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