const fs = require('fs');

const ndjson = require('ndjson');
const svgBuilder = require('svg-builder')
const ProgressBar = require('progress');

const options = require('./cli')(process.argv);

const bar = new ProgressBar(':bar :percent:eta', { total: options.max });

// Counter for file names
let imageCounter = 0;

// Creating a readstream of the resource file
fs.createReadStream(options.input)
    .pipe(ndjson.parse()) // Piping through the ndjson parser.
    .on('data', (obj) => {

        // If only recognized objects are allowed, check for it
        if (options.recognized && !obj.recognized) {
            return;
        }


        // If options.max is not 0 (no limit) or 
        if (options.max != 0 && imageCounter > options.max) {
            return;
        }

        // Create directory if not already existing.
        if (!fs.existsSync(options.output)) {
            fs.mkdirSync(options.output);
        }

        // Check if path is a file.
        fs.stat(options.output, (err, stats) => {
            if (!stats.isDirectory()) {
                console.log('Output path is a file');
                process.exit();
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

        const filename = options.output + '/' + obj.word + imageCounter + '.svg';

        // Writing the svg string to file.
        fs.writeFile(filename, output, () => {
            bar.tick();
            if (bar.complete) {
                console.log('Done!');
            }
        });
        imageCounter++;
    });
