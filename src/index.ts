const {rule1} = require("./rules/ab");
const {funcPrefix} = require("./rules/func-prefix-matching");

module.exports = {
	rules: {
		"ab": {
			create: rule1.create
		},
		"func-prefix": {
			create: funcPrefix.create
		}
	}
};