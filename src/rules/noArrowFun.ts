import {ESLintUtils} from "@typescript-eslint/utils";

type MessageIds = "noArrowFun";
type Options = [];
const createRule = ESLintUtils.RuleCreator(name => "https://github.com/SrJose369/eslint-plugin-jose#readme");
let c = 0;
export const noArrowFun = createRule<Options, MessageIds>({
	create(context) {
		return {
			ArrowFunctionExpression(node) {
				console.log("node: ", node);
				// eslint-disable-next-line max-len
				const ini = node?.returnType === undefined ? (node.params.length > 0 ? node.params[node.params.length - 1].range[1] + 1 : node.range[0] + 3) : node.returnType.range[1] + 1;
				const fin = ini + 3;
				context.report({
					node: node,
					messageId: "noArrowFun",
					fix: (fixer) => (node.body.type === "BlockStatement" ? [
						{
							range: [ini, fin],
							text: ""
						},
						// eslint-disable-next-line no-plusplus
						fixer.insertTextBefore(node, "function abc" + (c++))
					] : [
						{
							range: [ini, fin],
							text: "{"
						},
						// eslint-disable-next-line no-plusplus
						fixer.insertTextBefore(node, "function abc" + (c++)),
						fixer.insertTextAfter(node, "}")
					]),
				});
			}
		};
	},
	meta: {
		docs: {
			description: "No usar arrow function, usar named function, para evitar usar funciones anonimas",
			recommended: "warn",
		},
		messages: {
			noArrowFun: "Se debe usar una funcion nombrada en lugar de una funcion anonima.",
		},
		type: "suggestion",
		fixable: "code",
		schema: []
	},
	name: "no-arrow-fun",
	defaultOptions: [],
});