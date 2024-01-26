const readline = require('readline');
const fs = require('fs');

function initPlateau() {
    return Array(8).fill('_');
}

function piocherLettres(nbLettres) {
    const lettresDisponibles = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
    return Array.from({ length: nbLettres }, () => lettresDisponibles[Math.floor(Math.random() * lettresDisponibles.length)]);
}

function afficherPlateau(plateau) {
    console.log('Plateau:');
    console.log(plateau.join(' '));
}

function enregistrerCoup(joueur, mot, fichier) {
    fs.appendFileSync(fichier, `Joueur ${joueur}: ${mot}\n`);
}

function jouer() {
    const plateauJoueur1 = initPlateau();
    const plateauJoueur2 = initPlateau();

    let lettresJoueur1 = piocherLettres(6);
    let lettresJoueur2 = piocherLettres(6);

    const fichierCoups = 'coups_jarnac.txt';

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    let tour = 1;

    function tourJoueur(joueur, lettres) {
        afficherPlateau(joueur === 1 ? plateauJoueur1 : plateauJoueur2);
        console.log(`Lettres du joueur ${joueur}: ${lettres.join(' ')}`);

        rl.question(`Joueur ${joueur}, entrez votre mot (ou 'passer' pour passer): `, (mot) => {
            if (mot.toLowerCase() === 'passer') {
                rl.close();
                return;
            }

                      
            
            enregistrerCoup(joueur, mot, fichierCoups);
            tourJoueur(joueur === 1 ? 2 : 1, joueur === 1 ? lettresJoueur2 : lettresJoueur1);
        });
    }

    tourJoueur(1, lettresJoueur1);
}


jouer();
