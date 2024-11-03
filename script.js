var canvas = null;
var ctx = null;
//var maailma = [];
//var ilma = [];

var peliSpriteKoko = 40;
var blocks = [];

var nykyinenSivu = 1;

var blockTypes = {
    air: 1,
    ground: 2
}

var ukkeli = {
    x: 0,
    y: 0,
    tryX: 0,
    tryY: 0,
    halkaisija: 0,
    sade: 0,
    juoksuNopeus: 0, 
    tippumisNopeus: 0,
    hypynAloitusNopeus: 0,
    suunta: 1,
    askel: 0,
    hyppy: false
};

var maailmanTiedot = {
    painovoima: 1,
    taivasBlokkeja: 1
};




var maahanLiittynyt = false;
var writingMessage = false;
var puhekupla = {
    teksti: "",
    piilota: Date.now(),
    nakyvissa: false
};
var moveLeft = false;
var moveRight = false;

const ukkeliImgVasen = new Image();
ukkeliImgVasen.src = 'ukkeli2vasen.png';

const ukkeliImgOikea = new Image();
ukkeliImgOikea.src = 'ukkeli2.png';

const liikkuvaUkkeliImgVasen = new Image();
liikkuvaUkkeliImgVasen.src = 'liikkuva_ukkeli2vasen.png';

const liikkuvaUkkeliImgOikea = new Image();
liikkuvaUkkeliImgOikea.src = 'liikkuva_ukkeli2.png';

document.addEventListener("DOMContentLoaded", function() {
    vaihdaSivu(1);
});


window.addEventListener("touchstart", function(event) {
    var touch = event.touches[0];
    var touchX = touch.clientX;
    var touchY = touch.clientY;

    if (maahanLiittynyt && !writingMessage) {
        if (touchX < canvas.width / 3) {
            moveLeft = true;
        } else if (touchX > canvas.width * 2 / 3) {
            moveRight = true;
        } else if (touchY > canvas.height * 2 / 3) {
            if (!ukkeli.hyppy) {
                ukkeli.hyppy = true;
                ukkeli.tippumisNopeus = ukkeli.hypynAloitusNopeus;
            }
        }
    }
});

window.addEventListener("touchend", function(event) {
    moveLeft = false;
    moveRight = false;
});

function paavalikkoAsetuksetClick() {
    vaihdaSivu(3);
}

function asetuksetPalaaPaavalikkoonClick() {
    vaihdaSivu(1);
}

function vaihdaSivu(sivuNumero) {
    nykyinenSivu = sivuNumero;

    document.getElementById("sivu1").style.display = "none";
    document.getElementById("sivu2").style.display = "none";
    document.getElementById("sivu3").style.display = "none";
    document.getElementById("sivu" + sivuNumero).style.display = "block";
}


function liityMaa() {
    var maanNimi = document.getElementById("maanNimi").value.trim();
    if (maanNimi === "") {
        alert("Enter the name of the world!");
    } else {
        //document.getElementById("menu").style.display = "none";
        alustaLiittyminenUuteenMaailmaan();
        alustaMaailma();
        canvas.style.display = "block";
        maahanLiittynyt = true;
        //document.getElementById("loginButton").style.display = "block";

        vaihdaSivu(2);
    }
}

function alustaMaailma() {
    /*
    maailma = [];
    ilma = [];
    for (var i = 0; i < canvas.width; i += 20) {
        for (var j = 0; j < canvas.height; j += 20) {
            if (j < canvas.height * 0.4) { 
                ilma.push({ x: i, y: j, leveys: 20, korkeus: 20 });
            } else {
                maailma.push({ x: i, y: j, leveys: 20, korkeus: 20 });
            }
        }
    }
    */

    blocks = [];
    for (var xx = 0; xx < canvas.width / peliSpriteKoko; xx++) {
        blocks.push([]);
        for (var yy = 0; yy < canvas.height / peliSpriteKoko; yy++) {
            var bType = blockTypes.air;
            if (yy >= maailmanTiedot.taivasBlokkeja) {
                bType = blockTypes.ground;
            }

            blocks[xx].push({ 
                            blockType: bType
                            });
        }
    }

    console.log("blocks.length=" + blocks.length);
    console.log("blocks[0].length=" + blocks[0].length);
    console.log("blocks[1].length=" + blocks[1].length);
}


function piirraMaailma() {
    //ctx.clearRect(0, 0, canvas.width, canvas.height);

    // taustan piirto, sininen taivas:
    ctx.fillStyle = "lightblue";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    
    for (var xx = 0; xx < blocks.length; xx++) {
        for  (var yy = 0; yy < blocks[xx].length; yy++) {
            switch (blocks[xx][yy].blockType) {
                case blockTypes.air:
                    //ctx.strokeStyle = "black";
                    //ctx.strokeRect(xx * peliSpriteKoko, yy * peliSpriteKoko,  peliSpriteKoko, peliSpriteKoko);
                    break;
                case blockTypes.ground:
                    ctx.fillStyle = "brown";
                    ctx.fillRect(xx * peliSpriteKoko, yy * peliSpriteKoko, peliSpriteKoko, peliSpriteKoko);
                    ctx.strokeStyle = "black";
                    ctx.strokeRect(xx * peliSpriteKoko, yy * peliSpriteKoko,  peliSpriteKoko, peliSpriteKoko);
                    break;
                default:
                    // do nothing by default;
            }
        }
    }
    
    

    /*
    blocks.forEach(function(currentBlock) {
        if (currentBlock.blockType == blockTypes.ground) {
            ctx.fillStyle = "brown";
            ctx.fillRect(currentBlock.x, currentBlock.y, peliSpriteKoko, peliSpriteKoko);
            ctx.strokeStyle = "black";
            ctx.strokeRect(currentBlock.x, currentBlock.y,  peliSpriteKoko, peliSpriteKoko);
        }
    });
    */

    /*
    ilma.forEach(function(palikka) {
        ctx.fillStyle = "lightblue";
        ctx.fillRect(palikka.x, palikka.y, palikka.leveys, palikka.korkeus);
    });

    maailma.forEach(function(palikka) {
        ctx.fillStyle = "brown";
        ctx.fillRect(palikka.x, palikka.y, palikka.leveys, palikka.korkeus);
        ctx.strokeStyle = "black";
        ctx.strokeRect(palikka.x, palikka.y, palikka.leveys, palikka.korkeus);
    });
    */
}

function piirraUkkeli() {
    /*
    ctx.beginPath();
    ctx.arc(ukkeli.x + ukkeli.sade, ukkeli.y + ukkeli.sade, ukkeli.sade, 0, Math.PI * 2);
    ctx.fillStyle = "peachpuff";
    ctx.fill();
    ctx.closePath();
    */
    let img = ukkeliImgOikea;

    if (ukkeli.hyppy) {
        if (ukkeli.suunta == 0) {
            img = liikkuvaUkkeliImgVasen;
        } else {
            img = liikkuvaUkkeliImgOikea;
        }
    } else {
        if (ukkeli.askel < 16) {
            if (ukkeli.suunta == 0) {
                img = ukkeliImgVasen;
            } else {
                img = ukkeliImgOikea;
            }
        } else {
            if (ukkeli.suunta == 0) {
                img = liikkuvaUkkeliImgVasen;
            } else {
                img = liikkuvaUkkeliImgOikea;
            }
        }
    }

    ctx.drawImage(img, ukkeli.x, ukkeli.y, ukkeli.sade * 2, ukkeli.sade * 2); 
    
}

function piirraTekstiLaatikko() {
}



document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('informationbutton').addEventListener('click', function() {
        alert('Hello! I am a game developer from Finland. I got the motivation to make this game from another game called Pixel Worlds which unfortunately will be deleted in 2025. Thank you Kukouri for all the experience I got to know. This game is just at the beginning, but I will develop it further in the future. I hope you like it :) Thanks!');
    });
});




function naytaKirjoituskentta() {
    var tekstiKentta = document.getElementById("tekstiKentta");
    tekstiKentta.style.display = "block";
    document.getElementById("puhekuplaTeksti").focus();
}

function piirraPuhekupla() {
    if (puhekupla.nakyvissa) {
        ctx.fillStyle = "white";
        ctx.fillRect(ukkeli.x - 20, ukkeli.y - 40, 100, 30);
        ctx.strokeStyle = "black";
        ctx.strokeRect(ukkeli.x - 20, ukkeli.y - 40, 100, 30);
        ctx.fillStyle = "black";
        ctx.fillText(puhekupla.teksti, ukkeli.x - 15, ukkeli.y - 20);
    }
}

function enterPainettu() {
    if (writingMessage) {
        puhekupla.teksti = document.getElementById("puhekuplaTeksti").value;
        puhekupla.nakyvissa = true;
        puhekupla.piilota = Date.now() + 3000;
        
        document.getElementById("puhekuplaTeksti").value = "";
        document.getElementById("tekstiKentta").style.display = "none";
        writingMessage = false;
    } else {
        writingMessage = true;
        naytaKirjoituskentta();
    }
}

function checkForeverLoop() {
    var currentTimeStamp = Date.now();

    if (currentTimeStamp >= puhekupla.piilota) {
        puhekupla.nakyvissa = false;
    }

    setTimeout(checkForeverLoop, 100);
}


window.addEventListener("keydown", function(event) {
    const key = event.key.toLowerCase(); 

    // Peli sivun yleiset näppäin toiminnot:
    if (nykyinenSivu == 2) {
        if (!writingMessage) {
            switch (key) {
                case "a":
                    moveLeft = true;
                    ukkeli.suunta = 0;
                    break;
                case "d":
                    moveRight = true;
                    ukkeli.suunta = 1;
                    break;
                case "w":
                    if (!ukkeli.hyppy) {
                        ukkeli.hyppy = true;
                        ukkeli.tippumisNopeus = ukkeli.hypynAloitusNopeus;
                    }
                    break;
            }
        }
        if (event.key === "Enter") {
            enterPainettu();
        }
        if (event.key === "Escape") {
            vaihdaSivu(1);
            /*
            document.getElementById("menu").style.display = "block";
            canvas.style.display = "none";
            maahanLiittynyt = false;
            document.getElementById("loginButton").style.display = "none";
            document.getElementById("playingText").style.display = "none";
            */

        }
    }

    // Asetukset sivun yleiset näppäin toiminnot:
    if (nykyinenSivu == 3) {
        if (event.key === "Escape") {
            vaihdaSivu(1);
        }
    }
});

window.addEventListener("keyup", function(event) {
    if (event.key === "a") {
        moveLeft = false;
    }
    if (event.key === "d") {
        moveRight = false;
    }
});

function animateMovement() {
    ukkeli.tryX = ukkeli.x;
    ukkeli.tryY = ukkeli.y;

    if (moveLeft) {
        ukkeli.tryX -= ukkeli.juoksuNopeus;
    }
    if (moveRight) {
        ukkeli.tryX += ukkeli.juoksuNopeus;
    }
    if (moveLeft || moveRight) {
        ukkeli.askel += 1;
        if (ukkeli.askel >= 32) ukkeli.askel = 10;
    }
    if (!moveLeft && !moveRight) {
        ukkeli.askel = 10;
    }

    
    if (ukkeli.hyppy) {
        //ukkeli.tryY += ukkeli.hyppyNopeus;
        //ukkeli.hyppyNopeus += 0.1; 
    }

    //painovoima:
    ukkeli.tryY += ukkeli.tippumisNopeus;


    // tarkista törmäykset:
    var lattiaTormays = false;

    // ruudun reunoihin:
    if (ukkeli.tryX < 0) ukkeli.tryX = 0;
    if (ukkeli.tryX > canvas.width - ukkeli.halkaisija) ukkeli.tryX = canvas.width - ukkeli.halkaisija;
    if (ukkeli.tryY < 0) {
        ukkeli.tryY = 0;
        ukkeli.tippumisNopeus = 0.1;
    }
    if (ukkeli.tryY > canvas.height - ukkeli.halkaisija) {
        ukkeli.tryY = canvas.height - ukkeli.halkaisija;
        ukkeli.hyppy = false;
        lattiaTormays = true;
    }

    // blockiin törmäys:
    if (tormasikoAllaOlevaanBlockiin()) {
        ukkeli.hyppy = false;
        lattiaTormays = true;
    }





    
    ukkeli.tippumisNopeus += 0.5;
    if (ukkeli.tippumisNopeus > maailmanTiedot.painovoima) ukkeli.tippumisNopeus = maailmanTiedot.painovoima;
    if (ukkeli.lattiaTormays) ukkeli.tippumisNopeus = 0.1;

/*
    if (ukkeli.hyppy && !maahanAlla()) {
        for (var i = 0; i < maailma.length; i++) {
            var palikka = maailma[i];
            if (ukkeli.y + ukkeli.halkaisija >= palikka.y && ukkeli.y + ukkeli.halkaisija <= palikka.y + palikka.korkeus) {
                if (ukkeli.x - ukkeli.halkaisija >= palikka.x && ukkeli.x + ukkeli.halkaisija <= palikka.x + palikka.leveys) {
                    ukkeli.y = palikka.y - ukkeli.halkaisija;
                    ukkeli.hyppy = false;
                }
            }
        }
    }
*/

    ukkeli.x = ukkeli.tryX;
    ukkeli.y = ukkeli.tryY;
    
    piirraMaailma();
    piirraUkkeli();
    piirraPuhekupla();
    requestAnimationFrame(animateMovement);
}


function tormasikoAllaOlevaanBlockiin() {
    let ret = false;



    let blockX = parseInt((ukkeli.tryX + ukkeli.sade) / peliSpriteKoko);
    let blockY = parseInt((ukkeli.tryY) / peliSpriteKoko + 1);

    if (blockX < blocks.length && blockY < blocks[blockX].length) {
        switch (blocks[blockX][blockY].blockType) {
            case blockTypes.ground:
                //console.log("törmäys!");
                ret = true;
                break;
            default:
                // do nothing by default;
        }
    }
    if (ret == true && ukkeli.tryY > ukkeli.y) {
        ukkeli.tryY = blockY * peliSpriteKoko - peliSpriteKoko - 1;
    }

    console.log("törmäys check blocks[" + blockX + "][" + blockY + "] " + ret);

    return ret;
}


function maahanAlla() {
    for (var i = 0; i < maailma.length; i++) {
        var palikka = maailma[i];
        if (ukkeli.y + ukkeli.halkaisija >= palikka.y && ukkeli.y + ukkeli.halkaisija <= palikka.y + palikka.korkeus) {
            if (ukkeli.x - ukkeli.halkaisija >= palikka.x && ukkeli.x + ukkeli.halkaisija <= palikka.x + palikka.leveys) {
                return true;
            }
        }
    }
    return false;
}

function alustaLiittyminenUuteenMaailmaan() {
    ukkeli.x = 550;
    ukkeli.y = 0;
    ukkeli.tryX = ukkeli.x;
    ukkeli.tryY = ukkeli.y;
    ukkeli.halkaisija = peliSpriteKoko;
    ukkeli.sade =  ukkeli.halkaisija / 2;
    ukkeli.juoksuNopeus = 5;
    ukkeli.hyppyNopeus = 0;
    ukkeli.hypynAloitusNopeus = -10;
    ukkeli.hyppy = false;

    maailmanTiedot.painovoima = 7;
    maailmanTiedot.taivasBlokkeja = 4;
}

function ruutuaKlikattu(clickX, clickY) {
    let blockX = parseInt(clickX / peliSpriteKoko);
    let blockY = parseInt(clickY / peliSpriteKoko);

    console.log("blocks[" + blockX + "][" + blockY + "] clicked!");

    if (blockX >=  blocks.length) blockX = blocks.length - 1;
    if (blockY >=  blocks[blockX].length) blockY = blocks[blockX].length - 1;

    switch (blocks[blockX][blockY].blockType) {
        case blockTypes.air:
            blocks[blockX][blockY].blockType = blockTypes.ground;
            break;
        case blockTypes.ground:
            blocks[blockX][blockY].blockType = blockTypes.air;
            break;
        default:
            // do nothing by default;
    }

}


// Tästä alkaa suoritus, siten kun koko html dokumentti ja kaikki sen liittämät tiedostot on ladattu selaimeen:
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM is ready');

    canvas = document.getElementById("maailma");
    ctx = canvas.getContext("2d");

    canvas.addEventListener("click", function(event) {
        let clickX = event.clientX - canvas.getBoundingClientRect().left;
        let clickY = event.clientY - canvas.getBoundingClientRect().top;
        ruutuaKlikattu(clickX, clickY);

        /*
        for (var i = 0; i < maailma.length; i++) {
            var palikka = maailma[i];
            if (x >= palikka.x && x <= palikka.x + palikka.leveys && y >= palikka.y && y <= palikka.y + palikka.korkeus) {
                ilma.push(palikka);
                maailma.splice(i, 1);
                break; 
            }
        }
        
        if (y === 0) {
            maailma.push({ x: x, y: y, leveys: 20, korkeus: 20 });
        }
        
        if (ukkeli.y <= 0 && ukkeli.x >= x && ukkeli.x <= x + 20) {
            ctx.fillStyle = "orange";
            ctx.fillRect(x, y - 30, 20, 20);
            ctx.fillStyle = "white";
            ctx.fillText("Menu", x + 3, y - 15);
        }
        */
    
    });

    requestAnimationFrame(animateMovement);

    checkForeverLoop();
});