const fs = require('fs');

const thing = {
    "Glass": {
        "White Sea Glass": 1,
        "Green Sea Glass": 1,
        "Brown Sea Glass": 1,
        "Blue Sea Glass": 1,
        "Amber Sea Glass": 1,
        "Red Sea Glass": 1,
        "Black Sea Glass": 1
    },
    "Minerals": {
        "Pebble": 1,
        "Sandstone": 1,
        "Agate": 1,
        "Jasper": 1,//BLOOKET GOD MORE LIKE MOBBLOOKET DEMON!!! CLASS PASS SEASON NUMBER 1 IS THE BEST SEASON EVER MY BARS ARE HOT LIKE THE SUN BLOOKET GOD NO ONE THINKS YOUR BIVIDEOS ARE FUN ! NO !OONE UGUHGUHG AERAEARHH AUGH 
        "Ammonite": 1,
        "Geode": 1,
        "Moonstone": 1
    },
    "Marine": {
        "Seaweed": 1,
        "Sea Urchin Skeleton": 1,
        "Hermit Crab Shell": 1,
        "Sea Anemone": 1,
        "Sea Sponge": 1,
        "Starfish": 1,
        "Seahorse": 1
    },
    "Treasures": {
        "Broken Glass": 1,
        "Rusty Nails": 1,
        "Old Coins": 1,
        "Glass Bottle": 1,
        "Pearl Necklace": 1,
        "Gold Doubloon": 1,
        "Jeweled Crown": 1
    },
    "Fossils": {
        "Sea Shell Fossil": 1,
        "Coral Fossil": 1,
        "Crinoid Fossil": 1,
        "Shark Tooth": 1,
        "Ammonite Fossil": 1,
        "Dinosaur Bone Fragment": 1,
        "Trilobite Fossil": 1
    }
};

let result = 'LIST OF TREASURES / ITEMS:\n\n';

for (const category in thing) {
    result += `- ${category}\n`;
    const items = thing[category];
    for (const item in items) {
        const status = items[item] === 0 ? ':error:' : ':success:';
        result += `- - ${status} ${item}\n`;
    }
}

result += `\n⚠️ DONT USE ALREADY EXISTING BLOOKS AND MAKE THE STYLE OF THESE ITEMS LIKE COC 2022!\n\n@everyone`

fs.writeFileSync("./list.txt", result);
console.log("wrote")