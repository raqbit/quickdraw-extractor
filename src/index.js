const fs = require('fs');

const ndjson = require('ndjson');
const svgBuilder = require('svg-builder')

const program = require('./cli')(process.argv);

// Get argruments
const INPUT_FILE = program.input || 'input.ndjson';
const OUTPUT_DIR = program.output || 'output';
const MAX_OUTPUT = program.max || 100;
const RECOGNIZED = program.recognized;

// Counter for file names
let imageCounter = 0;

// Creating a readstream of the resource file
fs.createReadStream(INPUT_FILE)
    .pipe(ndjson.parse()) // Piping through the ndjson parser.
    .on('data', (obj) => {

        // Only allow recognized objects, and max output value is checked.
        if ((RECOGNIZED && !obj.recognized) || (MAX_OUTPUT != -1 && imageCounter > MAX_OUTPUT)) {
            return;
        }

        // Create directory if not already existing.
        if (!fs.existsSync(OUTPUT_DIR)) {
            fs.mkdirSync(OUTPUT_DIR);
        }

        // Check if path is a file.
        fs.stat(OUTPUT_DIR, (err, stats) => {
            if (!stats.isDirectory()) {
                throw new Error('Output directory is a file')
            }
        });

        // Get the drawing from the data flowing in.
        const drawing = obj.drawing;

        // Create an svg instance based on the quickdraw simple spec.
        const svgDrawing = svgBuilder.width(256).height(256);

        // Going over every stroke in the drawing.
        for (let i = 0; i < drawing.length; i++) {
            const stroke = drawing[i];

            let path = '';

            // Getting the arrays of x and y poss.
            const xPosArray = stroke[0];
            const yPosArray = stroke[1];


            for (let j = 0; j < xPosArray.length; j++) {
                if (j === 0) {
                    // First point, so we give a move instruction instead of a line one.
                    path += 'M ' + xPosArray[j] + ' ' + yPosArray[j] + ' ';
                } else {
                    path += 'L ' + xPosArray[j] + ' ' + yPosArray[j] + ' ';
                }
            }

            // Creating a path using set vars.
            svgDrawing.path({ d: path, stroke: 'black', 'stroke-width': 2, fill: 'none' });
        }
        // Rendering the svg data to a string.
        const output = svgDrawing.render();

        // Resetting the virtual DOM.
        svgDrawing.reset();

        // Writing the svg string to file.
        fs.createWriteStream(OUTPUT_DIR + '/' + obj.word + imageCounter + '.svg').write(output);
        imageCounter++;
    });
