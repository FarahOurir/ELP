const fs = require('fs');
const readline = require('readline');

// Initialisation des sacs de lettres pour chaque joueur
const initializeLetterBags = () => {
    const letterFrequencies = {
        'A': 14, 'B': 4, 'C': 7, 'D': 5, 'E': 19, 'F': 2, 'G': 4, 'H': 2, 'I': 11,
        'J': 1, 'K': 1, 'L': 6, 'M': 5, 'N': 9, 'O': 8, 'P': 4, 'Q': 1, 'R': 10,
        'S': 7, 'T': 9, 'U': 8, 'V': 2, 'W': 1, 'X': 1, 'Y': 1, 'Z': 2
    };

    const player1Bag = [];
    const player2Bag = [];

    for (let letter in letterFrequencies) {
        for (let i = 0; i < letterFrequencies[letter]; i++) {
            player1Bag.push(letter);
            player2Bag.push(letter);
        }
    }

    return { player1Bag, player2Bag };
};

// Initialisation des tapis pour chaque joueur
const initializeMats = () => {
    const player1Mat = Array(7).fill('');
    const player2Mat = Array(7).fill('');
    return { player1Mat, player2Mat };
};

// Fonction pour tirer aléatoirement des lettres du sac pour un joueur
const drawLetters = (letterBag, numLetters) => {
    const lettersDrawn = [];
    for (let i = 0; i < numLetters; i++) {
        const randomIndex = Math.floor(Math.random() * letterBag.length);
        lettersDrawn.push(letterBag.splice(randomIndex, 1)[0]);
    }
    return lettersDrawn;
};

// Fonction pour vérifier si un mot est un nom commun valide (à des fins de démonstration, une simple vérification de longueur)
const isValidNoun = (word) => {
    return word.length >= 3; // À remplacer par une vérification plus avancée en utilisant un dictionnaire, si nécessaire
};

// Fonction pour piocher une lettre de la pioche
const drawFromDeck = (letterBag) => {
    if (letterBag.length === 0) {
        console.log('La pioche est vide.');
        return '';
    }
    const randomIndex = Math.floor(Math.random() * letterBag.length);
    return letterBag.splice(randomIndex, 1)[0];
};

// Fonction pour permettre au joueur de saisir un mot ou de passer
const enterWordOrPass = async (player) => {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    try {
        const word = await new Promise((resolve) => {
            rl.question(`Joueur ${player}, entrez un mot de trois lettres ou plus (nom commun) ou écrivez "passer" pour passer au joueur suivant : `, (input) => {
                rl.close();
                resolve(input.toUpperCase());
            });
        });

        return word;
    } catch (error) {
        throw error;
    }
};


const runGame = async () => {
    // Initialisation des sacs de lettres pour chaque joueur
    const { player1Bag, player2Bag } = initializeLetterBags();
    // Initialisation des tapis pour chaque joueur
    const { player1Mat, player2Mat } = initializeMats();

    let currentPlayer = 1;
    let passPlayed = false; // Variable pour suivre si "passer" a été joué

    while (true) {
        const playerBag = currentPlayer === 1 ? player1Bag : player2Bag;
        const playerMat = currentPlayer === 1 ? player1Mat : player2Mat;

        const playerDrawnLetters = drawLetters(playerBag, 6);
        console.log(`Lettres du joueur ${currentPlayer}: ${playerDrawnLetters.join(', ')}`);

        try {
            const word = await enterWordOrPass(currentPlayer);

            if (word.toUpperCase() === 'PASSER') {
                currentPlayer = currentPlayer === 1 ? 2 : 1;
                continue;
            }

            if (isValidNoun(word)) {
                let wordPlaced = false;
                for (let i = 0; i < playerMat.length; i++) {
                    if (playerMat[i] === '') {
                        playerMat[i] = word;
                        wordPlaced = true;
                        break;
                    }
                }
                if (wordPlaced) {
                    console.log(`Mot valide, placé sur le tapis du Joueur ${currentPlayer} :`, playerMat);
                    const remainingLetters = playerDrawnLetters.filter(letter => !word.includes(letter));
                    console.log(`Lettres restantes du joueur ${currentPlayer}: ${remainingLetters.join(', ')}`);

                    if (remainingLetters.length === 0) {
                        console.log('Toutes les lettres de votre main ont été utilisées.');
                    } else {
                        const drawnLetter = drawFromDeck(playerBag);
                        console.log(`Lettre piochée par le joueur ${currentPlayer}: ${drawnLetter}`);
                        remainingLetters.push(drawnLetter);
                        console.log(`Lettres du joueur ${currentPlayer}: ${remainingLetters.join(', ')}`);
                    }
                } else {
                    console.log('Il n\'y a pas d\'espace libre sur le tapis.');
                }
            } else {
                console.log('Mot invalide. Veuillez entrer un mot de trois lettres ou plus.');
            }

            if (passPlayed) {
                passPlayed = false; // Réinitialiser la variable après que le joueur a joué
                currentPlayer = currentPlayer === 1 ? 2 : 1;
            }
        } catch (error) {
            console.error('Erreur lors de la saisie du mot :', error);
        }
    }
};

runGame();