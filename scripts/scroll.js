let scroll_image_index = 1;

function GetUrl_Scroll( definition ) {
    let image = scroll_image_index++;
    if ( scroll_image_index > 12 ) scroll_image_index = 1;
    return "images/scrolls/" + padZero( image ) + ".webp";
}

function CreateScroll( definition ) {
    let card = zzz.create( "div", {
        class: "card trans scroll",
        name: definition.KeyID,
    }, {}, root );
    let card_content = zzz.create( "div", {
        class: "card-content trans scroll"
    }, {}, card );
    card.start = [ 0, 0 ];
    let image = zzz.create( "img", {
        class: "card-image no-select scroll",
        src: GetUrl_Scroll( definition ),
        loading: "lazy",
        draggable: false,
        alt: ( definition.Name || "" ) + "(" + ( definition.KeyID || "" ) + ")"
    }, {}, card_content );
    let title = zzz.create( "div", {
        class: "card-title scroll",
        innerHTML: definition.Name
    }, {}, card_content );
    AddCardDisplayer( card, scrolldef, relic_comment );
    return {
        card,
        image
    };
}

function GenerateScrolls( def ) {
    RemoveAllChildren( root );
    def = def || scrolldef;
    for ( let i in def ) {
        let {
            card,
            image
        } = CreateScroll( def[ i ] );
        zzz.incidence.bind( card, "mouseenter", function ( e ) {
            card.mouseover = true;
            card.transformZ = 10;
            UpdateTransform( card );
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