const adjectives = require('./adjectives');
const animals = require('./animals');

// https://stackoverflow.com/a/5915122/830030
function randomItem(items) {
    return items[Math.floor(Math.random() * items.length)];
}

function capitalize(word) {
    return word
        .split('-')
        .map((w) => w[0].toUpperCase() + w.slice(1))
        .join('-');
}

module.exports = () => `${capitalize(randomItem(adjectives))} ${randomItem(animals)}`;
