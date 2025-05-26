let pelaajat = [];
let vuorossaOlevaPelaaja = 0;
let noppia = 1;
let Pisteet = 0;
let perakkaisetTuplat = 0;

function aloitaPeli() {
    const pelaajaMaara = parseInt(document.getElementById('pelaajat').value);
    noppaMaara = parseInt(document.getElementById('noppienmaara').value);
    pelaajat = [];

    for (let i = 0; i < pelaajaMaara; i++) {
        pelaajat.push({nimi: `Pelaaja ${i + 1}`, tulos: 0});
    }

    vuorossaOlevaPelaaja = 0;
    Pisteet = 0;
    perakkaisetTuplat = 0;
    document.getElementById('viesti').textContent = "Onnea peliin!";

    document.getElementById('dice2').style.display = noppaMaara === 2 ? 'inline' : 'none';
    document.getElementById('peli').style.display = 'block';
    paivita();
}

function arvoLuku() {
    return Math.floor(Math.random()* 6) + 1;
}

function paivitaKuva(dice) {
    document.getElementById('dice1').src = `dice-${dice[0]}.webp?v=${Math.random()}`
    
    if (dice.legth === 2) {
        document.getElementById('dice2').style.display = 'inline';
        document.getElementById('dice2').src = `dice-${dice[1]}.webp?v=${Math.random()}`;
    } else {
        document.getElementById('dice2').style.display = 'none';
    }
}

function heita() {
    let dice = [];
    for (let i = 0; i < noppaMaara; i++) {
        dice.push(arvoLuku());
    }

    paivitaKuva(dice);
    document.getElementById('silmaluku').textContent = `Heitit: ${dice.join(", ")}`;

    let lisatytPisteet = 0;

    if (noppaMaara === 1) {
        const luku = dice[0];
        if (luku === 1) {
            Pisteet = 0;
            paivita()
            lopetaVuoro(true);
            return;
        } else {
            lisatytPisteet += luku;
            tarkistaVoitto();
        }
    } else {
        const [d1, d2] = dice;

        if (d1 ===1 && d2 === 1) {
            lisatytPisteet += 25;
            perakkaisetTuplat++;
        } else if (d1 === 1 || d2 === 1) {
            Pisteet = 0;
            paivita();
            lopetaVuoro(true);
            return;
        } else if (d1 === d2) {
            lisatytPisteet += (d1 + d2) * 2;
            perakkaisetTuplat++;
        } else {
            lisatytPisteet += d1 + d2;
            perakkaisetTuplat = 0;
        }

        if (perakkaisetTuplat >= 3) {
            document.getElementById('viesti').textContent = "Kolme tuplaa peräkkäin! Vuorosi päättyy.";
            Pisteet = 0;
            paivita();
            lopetaVuoro(true);
            return;
        }
    }

    Pisteet += lisatytPisteet;
    pelaajat[vuorossaOlevaPelaaja].tulos += lisatytPisteet;

    tarkistaVoitto();
    paivita();
}

function tarkistaVoitto() {
    if (pelaajat[vuorossaOlevaPelaaja].tulos + Pisteet >= 100) {
        pelaajat[vuorossaOlevaPelaaja].tulos += Pisteet;
        paivita();
        document.getElementById('viesti').textContent = `${pelaajat[vuorossaOlevaPelaaja].nimi} voitti pelin! Onnittelut!`;
        lopeta();
    }
}

function lopetaVuoro(auto = false) {
    if (!auto) {
        pelaajat[vuorossaOlevaPelaaja].tulos += Pisteet;
    }

    if (pelaajat[vuorossaOlevaPelaaja].tulos >= 100) {
        document.getElementById('viesti').textContent = `${pelaajat[vuorossaOlevaPelaaja].nimi} voitti pelin! Onnittelut!`;
        lopeta();
        return;
    }

    vuorossaOlevaPelaaja = (vuorossaOlevaPelaaja + 1) % pelaajat.legth;
    Pisteet = 0;
    perakkaisetTuplat = 0;
    document.getElementById('viesti').textContent = auto ? "Vuorosi päättyi automaattisesti." : "";
    paivita();
}

function paivita() {
    document.getElementById('vuoro').textContent = 
    `Vuorossa: ${pelaajat[vuorossaOlevaPelaaja].nimi}, tämän vuoron pisteet: ${Pisteet}`;
    
    let tulosNakyma = '';
    pelaajat.forEach(pelaaja => {
        tulosNakyma += `${pelaaja.nimi}: ${pelaaja.tulos} pistettä <br>`;
    });

    document.getElementById('tulokset').innerHTML = tulosNakyma;
}

function lopeta() {
    document.getElementById('peli').style.display = 'none';
    document.getElementById('valikko').style.display = 'block';
}