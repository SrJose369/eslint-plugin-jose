import {ESLintUtils} from "@typescript-eslint/utils";

const rulePrefix = ["init", "is", "pre", "on", "post", "get", "set"];
const isValidName = (name: string, prefix: string[], exclude: string[]) => {
	const isValid = (pre: string) => name.indexOf(pre) === 0;
	return exclude.some(isValid) || prefix.some(isValid);
};
const createRule = ESLintUtils.RuleCreator(
	name => "https://example.com/rule/" + name
);
export const funcPrefix = createRule({
	create(context) {
		return {
			FunctionDeclaration: (node) => {
				const {include = [], exclude = []} = context?.options?.[0] || {};
				const {name} = node?.id;
				if (name) {
					console.log(name);
					const allPrefix = [...include, ...rulePrefix]; // Sorting is optional
					if (!isValidName(name, allPrefix, exclude)) {
						(context as any).report({
							node: node.id,
							message: name + " should start wi th " + allPrefix.join(", ")
						});
					}
				}
			},
		};
	},
	meta: {
		docs: {
			description: "Avoid looping over enums.",
			recommended: "error",
		},
		messages: {loopOverEnum: "Do not loop over enums."},
		type: "suggestion",
		fixable: "code",
		schema: [
			{
				type: "object",
				properties: {
					include: {
						type: "array",
  						items: {
    						type: "string"
  						}
					},
					exclude: {
						type: "array",
  						items: {
    						type: "string"
  						}
					}
				},
				additionalProperties: false
			}
		]
	},
	name: "no-loop-over-enum",
	defaultOptions: [],
});