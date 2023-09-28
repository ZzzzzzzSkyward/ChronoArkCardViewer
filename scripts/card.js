let UserMapping = {
    "LucyDraw": "Lucy",
    "LucyDraw3": "Lucy",
    "LucyCurse": "Lucy",
    "LucyBoss": "Lucy",
};
let UserAlias = {
    "TW_Red": "Twins",
    "TW_Blue": "Twins"
};

function GetUrl( definition ) {
    let user = definition.User || "";
    user = UserMapping[ user ] || user;
    user = user.toLowerCase();
    let image = definition.image;
    if ( !image ) {
        let im = definition.KeyID.toLowerCase();
        let pos = im.search( user );
        if ( pos && pos >= 0 ) {
            im = im.substr( pos + user.length );
            if ( im.substr( 0, 1 ) == "_" ) im = im.substr( 1 );
        }
        image = im + ".webp";
    }
    return "images/cards/" + user.toLowerCase() + "/" + image
}

function CreateCard( definition, tag ) {
    let card = zzz.create( "div", {
        class: "card trans",
        name: definition.KeyID,
    }, {}, root );
    if ( tag ) {
        card.classList.add( tag );
    }
    let card_content = zzz.create( "div", {
        class: "card-content trans"
    }, {}, card );
    card.start = [ 0, 0 ];
    let image = zzz.create( "img", {
        class: "card-image no-select",
        loading: "lazy",
        src: GetUrl( definition ),
        draggable: false,
        alt: ( definition.Name || "" ) + "(" + ( definition.KeyID || "" ) + ")"
    }, {}, card_content );
    let title = zzz.create( "div", {
        class: "card-title",
        innerHTML: definition.Name
    }, {
        "--color": definition.Rare ? "red" : "yellow"
    }, card_content );
    if ( definition.Rare !== undefined )
        title.style.setProperty( "--color", definition.Rare ? "red" : "yellow" );
    let fee = zzz.create( "div", {
        class: "card-fee",
        innerHTML: definition.UseAp && definition.UseAp.toFixed( 0 )
    }, {}, card_content );
    fee.innerHTML = definition.UseAp && definition.UseAp.toFixed( 0 );
    let bg = zzz.create( "div", {
        class: "card-fee-background"
    }, {}, fee );
    AddCardDisplayer( card, carddef, card_comment );
    return {
        card,
        image
    };
}
let ratio = 20;

function GenerateRotation( x, y, x0, y0, w, h ) {
    let dx = ( x - x0 ) / w - 0.5;
    let dy = ( y - y0 ) / h - 0.5;
    dx = dx * ratio;
    dy = -dy * ratio;
    //console.log(dx,dy);
    return {
        rx: dy,
        ry: dx
    };
}

function UpdateTransform( card ) {
    requestAnimationFrame( function () {
        UpdateTransform_Impl( card )
    } );
}

function UpdateTransform_Impl( card ) {
    let rx = card.rotateX || 0;
    let ry = card.rotateY || 0;
    let tx = card.transformX || 0;
    let ty = card.transformY || 0;
    let tz = card.transformZ || 1;
    let pattern = `rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg) translateX(${tx.toFixed(2)}px) translateY(${ty.toFixed(2)}px) translateZ(${tz.toFixed(2)}px)`;
    //console.log(pattern);
    zzz.set.style( card.firstElementChild, "transform", pattern );
}

function handleMouseDown( e ) {
    let card = e.target;
    card.start = e.client;
    card.transformZ = 100;
    UpdateTransform( card );
}
let friction = 0.2;
let dxratio = 5;

function handleMouseMove( e ) {
    let card = e.target;
    if ( !card.start[ 0 ] ) return;
    let dx = e.client[ 0 ] - card.start[ 0 ];
    let dy = e.client[ 1 ] - card.start[ 1 ];
    let mdx = Math.pow( Math.abs( dx ) * dxratio, friction );
    let mdy = Math.pow( Math.abs( dy ) * dxratio, friction );
    dx = dx > 0 ? mdx : -mdx;
    dy = dy > 0 ? mdy : -mdy;
    card.transformX = dx;
    card.transformY = dy;
}
let mousemove = function ( e ) {
    let card = e.target;
    card.mouseover = true;
    let x = e.client[ 0 ];
    let y = e.client[ 1 ];
    let rect = card.getClientRects()[ 0 ];
    //let my_x = card.offsetLeft;
    //let my_y = card.offsetTop;
    let my_x = rect.left;
    let my_y = rect.top;
    let w = card.offsetWidth;
    let h = card.offsetHeight;
    let {
        rx,
        ry
    } = GenerateRotation( x, y, my_x, my_y, w, h );
    card.rotateX = rx;
    card.rotateY = ry;
    handleMouseMove( e );
    UpdateTransform( card );
};

function RemoveAllChildren( node ) {
    while ( node.childElementCount > 0 ) {
        node.removeChild( node.firstElementChild );
    }
}

function RemoveCards() {
    RemoveAllChildren( root );
}

function GenerateWhoseCards( name ) {
    let filtered = {};
    for ( let i in carddef ) {
        let info = carddef[ i ];
        let uname = UserMapping[ info.User ] || info.User;
        let alias = UserAlias[ name ];
        if ( uname === name || uname == alias ) {
            filtered[ i ] = info;
        }
    }
    GenerateCards( filtered );
}

function AddCardDisplayer( card, def, comment ) {
    card.def = def;
    card.comment = comment;
    zzz.incidence.bind( card, "mouseenter", function ( e ) {
        if ( !selected_card )
            DisplayCard( card );
    } );
    zzz.incidence.bind( card, "click", function ( e ) {
        if ( selected_card === card ) {
            selected_card = null;
            DisplayCard();
        } else {
            selected_card = card;
            DisplayCard( card );
        }
    } );
}

function GenerateCards( def ) {
    RemoveAllChildren( root );
    def = def || carddef;
    for ( let i in def ) {
        if ( !def[ i ].User ) continue;
        let {
            card,
            image
        } = CreateCard( def[ i ] );
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
            card.transformZ = 50;
            UpdateTransform( card );
            zzz.incidence.bind( card, "mousemove", onmousemove );
            zzz.incidence.bind( card, 'mousedown', onmousedown );
        } );
        zzz.incidence.bind( card, "mouseleave", function ( e ) {
            card.mouseover = false;
            if ( e.relatedTarget == root ) {
                setTimeout( function () {
                    if ( !card.mouseover ) {
                        zzz.incidence.erase( card, "mousemove",
                            onmousemove );
                        zzz.incidence.erase( card, "mousedown",
                            onmousedown );
                        card.start[ 0 ] = 0;
                        card.transformX = 0;
                        card.transformY = 0;
                        card.transformZ = 0;
                        zzz.set.style( card.firstElementChild, "transform", "" );
                    }
                }, 100 );
            } else {
                zzz.incidence.erase( card, "mousemove",
                    onmousemove );
                zzz.incidence.erase( card, "mousedown",
                    onmousedown );
                card.start[ 0 ] = 0;
                card.transformX = 0;
                card.transformY = 0;
                card.transformZ = 0;
                zzz.set.style( card.firstElementChild, "transform", "" );
            }
        } );
        zzz.incidence.bind( card, "mouseup", function ( e ) {
            if ( card.mouseover ) {
                card.transformX = 0;
                card.transformY = 0;
                card.transformZ = 50;
                card.start[ 0 ] = 0;
                UpdateTransform( card );
            }
        } );
    }
}

function CreateInfo() {
    name = zzz.create( "div", {
        class: "info-name"
    }, {}, info );
    attr = zzz.create( "div", {
        class: "info-attr"
    }, {}, info );
    desc = zzz.create( "div", {
        class: "info-desc"
    }, {}, info );
    comment = zzz.create( "div", {
        class: "info-comment"
    }, {}, info );
    key = zzz.create( "div", {
        class: "info-key"
    }, {}, info );
}

function DisplayCard( card ) {
    if ( !card ) {
        name.innerHTML = "";
        key.innerHTML = "";
        attr.innerHTML = "";
        desc.innerHTML = "";
        comment.innerHTML = "";
        return;
    }
    let thename = card.getAttribute( "name" );
    def = card.def;
    cmt = card.comment;
    let info = thename && def[ thename ];
    if ( !info ) return;
    name.innerHTML = info.Name||thename;
    key.innerHTML = info.KeyID;
    attr.innerHTML = GetAttribute( info );
    desc.innerHTML = GetDescription( info );
    comment.innerHTML = GetComment( info, cmt );
}