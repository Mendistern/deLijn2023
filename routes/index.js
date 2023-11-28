const express = require('express');
const router = express.Router();

// Elke bus is n units groot
// Een parkeerplaats is n units groot

// Het aantal units dat een bus inneemt
const busAantalUnits = {
    "groot": 4, "medium": 2, "klein": 1,
};

// Het aantal parkeerplaatsen per grootte
const aantalParkeerPlaatsen = {
    "groot": 4, "medium": 6, "klein": 10,
};


router.post('/', function(req, res, next) {
    const input = req.body;

    // group de bussen op grootte
    const bussen = {
        groot: input.parking.filter(b => b.type === "GROOT"),
        medium: input.parking.filter(b => b.type === "NORMAAL"),
        klein: input.parking.filter(b => b.type === "MINI"),
    };

    if (bussen.groot.length > busAantalUnits.groot) {
        return res.status(400).send("Niet genoeg plaatsen voor de grote bussen");
    }

    const ouput = {
        garage: {
            groot: sortBusses(aantalParkeerPlaatsen.groot, busAantalUnits.groot, bussen),
            medium: sortBusses(aantalParkeerPlaatsen.medium, busAantalUnits.medium, bussen),
            klein: sortBusses(aantalParkeerPlaatsen.klein, busAantalUnits.klein, bussen),
        },
    };

    if (bussen.groot.length > 0 || bussen.medium.length > 0 || bussen.klein.length > 0) {
        return res.status(418).send("Niet genoeg plaatsen voor alle bussen");
    }

    res.send(ouput);
});

function sortBusses(aantalParkeerplaatsen, parkeerplaatsGrootte, bussen) {
    const parkeerplaatsen = [];

    for (let i = 0; i < aantalParkeerplaatsen; i++) {
        // lijst met bussen die op de parkeerplaats staan
        const geparkeerdeBussenOpParkeerPlaats = [];

        // Aantal units aan plaats over
        let parkeerPlaatsOver = parkeerplaatsGrootte;

        //vul de overige plaats op met de grootste bussen
        while (parkeerPlaatsOver >= busAantalUnits.groot && bussen.groot.length > 0) {
            geparkeerdeBussenOpParkeerPlaats.push(bussen.groot.shift());
            parkeerPlaatsOver -= busAantalUnits.groot;
        }

        //vul de overige plaats op met de middelste bussen
        while (parkeerPlaatsOver >= busAantalUnits.medium && bussen.medium.length > 0) {
            geparkeerdeBussenOpParkeerPlaats.push(bussen.medium.shift());
            parkeerPlaatsOver -= busAantalUnits.medium;
        }


        //vul de overige plaats op met de kleinste bussen
        while (parkeerPlaatsOver >= busAantalUnits.klein && bussen.klein.length > 0) {
            geparkeerdeBussenOpParkeerPlaats.push(bussen.klein.shift());
            parkeerPlaatsOver -= busAantalUnits.klein;
        }

        parkeerplaatsen.push(geparkeerdeBussenOpParkeerPlaats);
    }

    return parkeerplaatsen;
}

module.exports = router;
