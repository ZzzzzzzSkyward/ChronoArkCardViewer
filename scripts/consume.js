function GetUrl_Consume( definition ) {
    let image = definition.image || "";
    return "images/consumes/" + image + ".webp";
}

function CreateConsume( definition ) {
    let card = zzz.create( "div", {
        class: "card trans consume",
        name: definition.KeyID,
    }, {}, root );
    let card_content = zzz.create( "div", {
        class: "card-content trans consume"
    }, {}, card );
    card.start = [ 0, 0 ];
    let image = zzz.create( "img", {
        class: "card-image no-select consume",
        src: GetUrl_Consume( definition ),
        loading: "lazy",

        draggable: false,
        alt: ( definition.Name || "" ) + "(" + ( definition.KeyID || "" ) + ")"
    }, {}, card_content );
    let title = zzz.create( "div", {
        class: "card-title consume",
        innerHTML: definition.Name
    }, {}, card_content );
    return {
        card,
        image
    };
}

function GenerateConsumes( def ) {
    RemoveAllChildren( root );
    def = def || consumedef;
    for ( let i in def ) {
        let {
            card,
            image
        } = CreateConsume( def[ i ] );
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
            DisplayCard( card.getAttribute( "name" ), consumedef, relic_comment );
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