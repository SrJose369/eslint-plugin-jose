const {expliBol} = require("./rules/booleans");
const {funcPrefix} = require("./rules/func-prefix-matching");

module.exports = {
	rules: {
		"explicit-bol": expliBol,
		"func-prefix": funcPrefix
	}
};