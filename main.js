let pelaajat = [];
let vuorossaOlevaPelaaja = 0;
let noppaMaara = 1;
let Pisteet = 0;
let perakkaisetTuplat = 0;

// Luodaan nimikentät
function luoNimikentat() {
    const pelaajaMaara = parseInt(document.getElementById('pelaajat').value);
    const nimikentatDiv = document.getElementById('nimikentat');
    nimikentatDiv.innerHTML = '';

    for (let i = 0; i < pelaajaMaara; i++) {
        const label = document.createElement('label');
        label.textContent = `Pelaaja ${i + 1} nimi: `;

        const input = document.createElement('input');
        input.type = 'text';
        input.id = `pelaajaNimi${i}`;
        input.placeholder = `Pelaaja ${i + 1}`;

        label.appendChild(input);
        nimikentatDiv.appendChild(label);
    }
}

// Aloita-nappi
function aloitaPeli() {
    const pelaajaMaara = parseInt(document.getElementById('pelaajat').value);
    noppaMaara = parseInt(document.getElementById('noppienmaara').value);
    pelaajat = [];

    for (let i = 0; i < pelaajaMaara; i++) {
        const nimiInput = document.getElementById(`pelaajaNimi${i}`);
        let nimi = nimiInput && nimiInput.value.trim();
        // Oletusnimi, jos ei annettu
        if (!nimi) {
            nimi = `Pelaaja ${i + 1}`;
        }
        pelaajat.push({ nimi: nimi, tulos: 0 });
    }

    vuorossaOlevaPelaaja = 0;
    Pisteet = 0;
    perakkaisetTuplat = 0;
    document.getElementById('viesti').textContent = "Onnea peliin!";

    // Näytetään toinen noppa vain jos valittu 2 noppaa
    document.getElementById('dice2').style.display = noppaMaara === 2 ? 'inline' : 'none';

    // Näytetään peli ja napit
    document.getElementById('peli').style.display = 'block';
    naytaNapit();
    paivita();
}


// Arvotaan nopan silmäluku
function arvoLuku() {
    return Math.floor(Math.random() * 6) + 1;
}


// Päivitetään nopan kuva silmälukua vastaavaksi
function paivitaKuva(dice) {
    document.getElementById('dice1').src = `dice-${dice[0]}.webp?v=${Math.random()}`;
    
    if (dice.length === 2) {
        document.getElementById('dice2').style.display = 'inline';
        document.getElementById('dice2').src = `dice-${dice[1]}.webp?v=${Math.random()}`;
    } else {
        document.getElementById('dice2').style.display = 'none';
    }
}


// Heitä noppaa-nappi
function heita() {
    let dice = [];
    for (let i = 0; i < noppaMaara; i++) {
        dice.push(arvoLuku());
    }

    paivitaKuva(dice);
    document.getElementById('silmaluku').textContent = `Heitit: ${dice.join(", ")}`;

    let lisatytPisteet = 0;

    // Jos noppia on yksi
    if (noppaMaara === 1) {
        const luku = dice[0];
        // Jos silmäluku on yksi
        if (luku === 1) {
            Pisteet = 0;
            paivita();
            lopetaVuoro(true);
            piilotaNapit();
            return;
        } else {
            lisatytPisteet += luku;
        }
        // Jos noppia on kaksi
    } else {
        const [d1, d2] = dice;
        // Jos molemmissa nopissa on silmäluku 1
        if (d1 === 1 && d2 === 1) {
            lisatytPisteet += 25;
            perakkaisetTuplat++;
        // Jos taas vain toinen noppa on silmäluvultaan yksi
        } else if (d1 === 1 || d2 === 1) {
            Pisteet = 0;
            paivita();
            lopetaVuoro(true);
            piilotaNapit();
            return;
        // Jos tulee tuplat
        } else if (d1 === d2) {
            lisatytPisteet += (d1 + d2) * 2;
            perakkaisetTuplat++;
        } else {
            lisatytPisteet += d1 + d2;
            perakkaisetTuplat = 0;
        }
        // Jos tuplia on kolme
        if (perakkaisetTuplat >= 3) {
            document.getElementById('viesti').textContent = "Kolme tuplaa peräkkäin! Vuorosi päättyy.";
            Pisteet = 0;
            paivita();
            lopetaVuoro(true);
            piilotaNapit();
            return;
        }
    }

    Pisteet += lisatytPisteet;
    paivita();
}

// Tarkistetaan voitto
function tarkistaVoitto() {
    if (pelaajat[vuorossaOlevaPelaaja].tulos + Pisteet >= 100) {
        pelaajat[vuorossaOlevaPelaaja].tulos += Pisteet;
        paivita();
        document.getElementById('viesti').textContent = `${pelaajat[vuorossaOlevaPelaaja].nimi} voitti pelin! Onnittelut!`;
        piilotaNapit();
        lopeta();
    }
}

// Lopeta vuoro-nappi
function lopetaVuoro(auto = false) {
    if (!auto) {
        pelaajat[vuorossaOlevaPelaaja].tulos += Pisteet;
    }

    if (pelaajat[vuorossaOlevaPelaaja].tulos >= 100) {
        document.getElementById('viesti').textContent = `${pelaajat[vuorossaOlevaPelaaja].nimi} voitti pelin! Onnittelut!`;
        piilotaNapit();
        lopeta();
        return;
    }

    vuorossaOlevaPelaaja = (vuorossaOlevaPelaaja + 1) % pelaajat.length;
    Pisteet = 0;
    perakkaisetTuplat = 0;
    document.getElementById('viesti').textContent = auto ? "Vuorosi päättyi automaattisesti." : "";
    naytaNapit();
    paivita();
}

// Päivitetään tulokset
function paivita() {
    document.getElementById('vuoro').textContent = 
    `Vuorossa: ${pelaajat[vuorossaOlevaPelaaja].nimi}, tämän vuoron pisteet: ${Pisteet}`;
    
    let tulosNakyma = '';
    pelaajat.forEach((pelaaja, index) => {
        const vuoroTeksti = index === vuorossaOlevaPelaaja ? ` (vuorolla: ${Pisteet})` : "";
        tulosNakyma += `${pelaaja.nimi}: ${pelaaja.tulos} pistettä${vuoroTeksti} <br>`;
    });

    document.getElementById('tulokset').innerHTML = tulosNakyma;
}

// Pelin lopetus automaattisesti
function lopeta() {
    document.getElementById('peli').style.display = 'none';
    document.getElementById('valikko').style.display = 'block';
    piilotaNapit();
}

// Piilotetaan "Heitä noppaa" ja "Lopeta vuoro" -napit
function piilotaNapit() {
    document.querySelector('.napit').style.visibility = 'hidden';
}

// Tuodaan näkyviin "Heitä noppaa" ja "Lopeta vuoro" -napit
function naytaNapit() {
    document.querySelector('.napit').style.visibility = 'visible';
}

window.onload = () => {
    luoNimikentat();
};