const express = require('express');
const router = express.Router();

const input = {
    "stelplaats": "De Lijn Arsenaal", "parking": [{
        "bus": "1000", "type": "GROOT",
    }, {
        "bus": "1001", "type": "GROOT",
    }, {
        "bus": "1002", "type": "GROOT",
    }, {
        "bus": "2000", "type": "NORMAAL",
    }, {
        "bus": "2001", "type": "NORMAAL",
    }, {
        "bus": "2002", "type": "NORMAAL",
    }, {
        "bus": "2003", "type": "NORMAAL",
    }, {
        "bus": "2004", "type": "NORMAAL",
    }, {
        "bus": "2005", "type": "NORMAAL",
    }, {
        "bus": "3000", "type": "MINI",
    }, {
        "bus": "3001", "type": "MINI",
    }, {
        "bus": "3002", "type": "MINI",
    }, {
        "bus": "3003", "type": "MINI",
    }, {
        "bus": "3004", "type": "MINI",
    }, {
        "bus": "3005", "type": "MINI",
    }, {
        "bus": "3006", "type": "MINI",
    }, {
        "bus": "3007", "type": "MINI",
    }, {
        "bus": "3008", "type": "MINI",
    }, {
        "bus": "3009", "type": "MINI",
    }, {
        "bus": "3010", "type": "MINI",
    }, {
        "bus": "3011", "type": "MINI",
    }, {
        "bus": "3012", "type": "MINI",
    }], "garage": {
        "groot": [], "medium": [], "klein": [],
    },
};

const busAantalUnits = {
    "groot": 4, "medium": 2, "klein": 1,
};

const aantalParkeerPlaatsen = {
    "groot": 4, "medium": 6, "klein": 10,
};


router.post('/', function(req, res, next) {
    const input = req.body;

    const bussen = {
        groot: input.parking.filter(b => b.type === "GROOT"),
        medium: input.parking.filter(b => b.type === "NORMAAL"),
        klein: input.parking.filter(b => b.type === "MINI"),
    };

    if (bussen.groot.length > busAantalUnits["groot"]) {
        return res.status(400).send("Niet genoeg plaatsen voor de grote bussen");
    }

    const ouput = {
        garage: {
            groot: sortBusses(aantalParkeerPlaatsen.groot, busAantalUnits.groot, bussen),
            medium: sortBusses(aantalParkeerPlaatsen.medium, busAantalUnits.medium, bussen),
            klein: sortBusses(aantalParkeerPlaatsen.klein, busAantalUnits.klein, bussen),
        },
    };

    res.send(ouput);
});

function sortBusses(aantalParkeerplaatsen, parkeerplaatsGrootte, bussen) {
    const parkeerplaatsen = [];

    for (let i = 0; i < aantalParkeerplaatsen; i++) {
        // lijst met bussen die op de parkeerplaats staan
        const geparkeerdeBussenOpParkeerPlaats = [];

        // Aantal units plaats over
        let parkeerPlaatsOver = parkeerplaatsGrootte;

        while (parkeerPlaatsOver >= busAantalUnits.groot && bussen.groot.length > 0) {
            geparkeerdeBussenOpParkeerPlaats.push(bussen.groot.shift());
            parkeerPlaatsOver -= busAantalUnits.groot;
        }

        while (parkeerPlaatsOver >= busAantalUnits.medium && bussen.medium.length > 0) {
            geparkeerdeBussenOpParkeerPlaats.push(bussen.medium.shift());
            parkeerPlaatsOver -= busAantalUnits.medium;
        }

        while (parkeerPlaatsOver >= busAantalUnits.klein && bussen.klein.length > 0) {
            geparkeerdeBussenOpParkeerPlaats.push(bussen.klein.shift());
            parkeerPlaatsOver -= busAantalUnits.klein;
        }

        parkeerplaatsen.push(geparkeerdeBussenOpParkeerPlaats);
    }

    return parkeerplaatsen;
}

module.exports = router;
