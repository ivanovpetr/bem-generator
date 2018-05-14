const BemGeneratorCore = require("./lib/bem-generator-core");
const inputFile = process.argv[2];
const outputDir = process.argv[3];
let core = new BemGeneratorCore(inputFile,'scss');

core.parseMap().write();

