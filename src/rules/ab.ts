import {ESLintUtils} from "@typescript-eslint/utils";
import {AST_NODE_TYPES, TSESTree} from "@typescript-eslint/typescript-estree";
import * as ts from "typescript";
import * as tsutils from "tsutils";

const createRule = ESLintUtils.RuleCreator(
	name => "https://example.com/rule/" + name
);
let isIfState = false;
export const rule1 = createRule({
	create(context) {
		return {
			IfStatement(node) {
				isIfState = true;
			},
			Identifier(node) {
				checkBoolean(node, context);
			},
			BlockStatement(node) {
				isIfState = false;
			},
			ExpressionStatement(node) {
				isIfState = false;
			}
		};
	},
	meta: {
		docs: {
			description: "Avoid looping over enums.",
			recommended: "warn",
		},
		messages: {
			loopOverEnum: "Do not loop over enums.",
		},
		type: "suggestion",
		fixable: "code",
		schema: [
			{
            	type: "object",
            	properties: {
                	allowTrue: {
                    	type: "boolean"
                	}
            	},
            	additionalProperties: false
			}
		]
	},
	name: "no-loop-over-enum",
	defaultOptions: [],
});

function checkBoolean(node, context) {
	if (isIfState === false) return;
	//                 variable normal,           funcion,
	const padres = [node?.parent?.type, node?.parent?.parent?.type, node?.parent?.parent?.parent?.type];
	if (padres.some((e) => e === "BinaryExpression")) return;
	if (!node) return;
	if (node.type !== "Identifier") return;
	// 1. Grab the TypeScript program from parser services
	const parserServices = ESLintUtils.getParserServices(context);
	const checker = parserServices.program.getTypeChecker();
	// 2. Find the backing TS node for the ES node, then that TS type
	const originalNode = parserServices.esTreeNodeToTSNodeMap.get(
		node
	);
	const nodeType = checker.getTypeAtLocation(originalNode);
	let ok = false;
	let errNode = node;
	if (node?.parent?.callee) {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const dec: any = checker.getSymbolAtLocation(originalNode)?.valueDeclaration;
		if (dec?.type?.kind === ts.SyntaxKind.BooleanKeyword) {
			ok = true;
			if (node.parent.callee?.parent) errNode = node.parent.callee.parent;
		}
	}
	if (tsutils.isTypeFlagSet(nodeType, ts.TypeFlags.BooleanLike) || ok) {
		context.report({
			node: errNode,
			message: "Se debe usar explicitamente false o true en un if: " + node.name,
			fix: (fixer) => {
				const a = 3;
				if (node.parent.type === "UnaryExpression") {
					return fixer.replaceText(node.parent, node.name + " === false");
				}
				return fixer.replaceText(node, node.name + " === true");
			}
		});
	}
}