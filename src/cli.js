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

    let options = {};

    if (!commander.input) {
        console.log('Please provide an input file!')
        process.exit();
    } else {
        options.input = commander.input;
    }

    if (!commander.output) {
        console.log('No output directory given, using \'output/\'');
        options.output = 'output';
    } else {
        options.output = commander.output;
    }

    if (!commander.max) {
        console.log('No max amount of conversions given, using \'100\'');
        options.max = 100;
    } else {
        options.max = commander.max;
    }

    options.recognized = commander.recognized;

    return options;
};