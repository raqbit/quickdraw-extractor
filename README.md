# Quickdraw-Extractor

QuickDraw Exctractor, like the name suggests, is a tool I've created for extracting the drawing data of the [quickdraw-dataset](https://github.com/googlecreativelab/quickdraw-dataset).

~~Both the raw and simplified .ndjson (newline delimited JSON) files should work, but will result in different vector drawings, due to the simplified strokes.~~

Only the simplified drawings will work for now, as the raw files don't have a set size, meaning I'd have to detect the actual max size.

----

## Installation

```
git https://github.com/raqbit/quickdraw-extractor
cd quickdraw-extractor
npm install || yarn
```


## Usage:
`npm start [options]`

**Options:**

| Option | Default | Description |
| ------ | ------- | ----------- |
| `-h, --help` | N/A | Output help information |
| `-v, --version` | N/A | Output version information |
| `-i, --in, --input` | `input.ndjson` | Specify input file |
| `-o, --out, --output` | `output` | Specify output directory |
| `-m, --max` | `100` | Specify max amount of output files (-1 for no limit) |
| `--recognized` | `false` | Only convert drawings recognized by quickdraw |

----
### TODO:

* Vector drawables > Image files
* CLI Argruments for input, output, recognized & format
* Support for raw .ndjson (non-simplified)?
* Support for custom svg settings?