function GetUrl_Relic( definition ) {
    let image = definition.image || "";
    return "images/relics/" + image + ".webp";
}

function CreateRelic( definition ) {
    let card = zzz.create( "div", {
        class: "card trans relic",
        name: definition.KeyID,
    }, {}, root );
    let card_content = zzz.create( "div", {
        class: "card-content trans relic"
    }, {}, card );
    card.start = [ 0, 0 ];
    let image = zzz.create( "img", {
        class: "card-image no-select relic",
        src: GetUrl_Relic( definition ),
        draggable: false,
        alt: ( definition.Name || "" ) + "(" + ( definition.KeyID || "" ) + ")"
    }, {}, card_content );
    let title = zzz.create( "div", {
        class: "card-title relic",
        innerHTML: definition.Name
    }, {}, card_content );
    AddCardDisplayer( card, relicdef, relic_comment );
    return {
        card,
        image
    };
}

function GenerateRelics( def ) {
    RemoveAllChildren( root );
    def = def || relicdef;
    for ( let i in def ) {
        let {
            card,
            image
        } = CreateRelic( def[ i ] );
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