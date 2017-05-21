const fs = require('fs');
const commander = require('commander');

module.exports = (argruments) => {
    commander
        .version(JSON.parse(fs.readFileSync('package.json')).version)
        .option('-i, --input [value]', 'Specify input file')
        .option('-o, --output [value]', 'Specify output directory')
        .option('-m, --max [n]', 'Specify max amount of output files', parseInt)
        .option('-r, --recognized', 'Only convert drawings recognized by quickdraw')
        .parse(argruments);
    return commander;
};