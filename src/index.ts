const {expliBol} = require("./rules/booleans");
const {funcPrefix} = require("./rules/func-prefix-matching");
const {noArrowFun} = require("./rules/noArrowFun");

module.exports = {
	rules: {
		"explicit-bol": expliBol,
		"func-prefix": funcPrefix,
		"no-arrow-fun": noArrowFun
	}
};