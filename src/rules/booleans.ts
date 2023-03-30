import {ESLintUtils} from "@typescript-eslint/utils";
import {AST_NODE_TYPES, TSESTree} from "@typescript-eslint/typescript-estree";
import * as ts from "typescript";
import * as tsutils from "tsutils";
import {RuleContext, RuleFixer} from "@typescript-eslint/utils/dist/ts-eslint";

type MessageIds = "explicitBol" | "notUseUnary" | "leftLiteral";
type Options = [
	{
		allowTrue?: boolean;
	}
];

const createRule = ESLintUtils.RuleCreator(name => "https://github.com/SrJose369/eslint-plugin-jose/README.md");
export const expliBol = createRule<Options, MessageIds>({
	create(context) {
		return {
			IfStatement(node) {
				checkBoolean(node?.test, context);
			}
		};
	},
	meta: {
		docs: {
			description: "Usar explicitamente valores booleanos en los condicionales if",
			recommended: "warn",
		},
		messages: {
			explicitBol: "Se debe usar explicitamente false o true en un if: {{name}}",
			notUseUnary: "No usar !: {{name}}",
			leftLiteral: "No usar un literal al lado izquierdo: {{name}}"
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
	name: "explicit-bol",
	defaultOptions: [{"allowTrue": false}],
});

type uic = TSESTree.UnaryExpression | TSESTree.Identifier | TSESTree.CallExpression;

function checkBoolean(node: TSESTree.IfStatement["test"] | TSESTree.BinaryExpression | TSESTree.UnaryExpression | TSESTree.Identifier | TSESTree.CallExpression, context: RuleContext<MessageIds, Options>): void {
	if (node?.type === "BinaryExpression") {
		let error2 = false;
		let errNode2: TSESTree.Literal | TSESTree.UnaryExpression | TSESTree.Identifier | TSESTree.CallExpression;
		let msj: MessageIds | undefined;
		let nodeName: string | undefined;
		const nl = node?.left;
		if (nl?.type === "Literal") {
			error2 = true;
			errNode2 = nl;
			msj = "leftLiteral";
			nodeName = "" + nl.value;
		}
		if (!msj) msj = "notUseUnary";
		if (nl?.type === "UnaryExpression") {
			const arg = nl?.argument;
			errNode2 = nl;
			error2 = true;
			if (arg?.type === "Identifier") {
				nodeName = arg?.name;
			}
			if (arg?.type === "CallExpression" && arg?.callee?.type === "Identifier") {
				nodeName = arg?.callee?.name;
			}
			if (!errNode2) {
				errNode2 = nl;
			}
		}
		if (error2 === true && errNode2) {
			context.report({
				node: errNode2,
				messageId: msj,
				data: {
					name: nodeName
				}
			});
		}
		return;
	}
	if (node?.type === "LogicalExpression") {
		checkBoolean(node?.left, context);
		checkBoolean(node?.right, context);
	}
	if (node?.type === "UnaryExpression") checkBoolean(node?.argument, context);
	if (node?.type === "CallExpression") checkBoolean(node?.callee, context);
	if (node?.type !== "Identifier") return;
	if (context?.options[0].allowTrue === true) {
		if (node?.parent?.type === "CallExpression") {
			if (node?.parent?.parent?.type !== "UnaryExpression") return;
		} else {
			if (node?.parent?.type !== "UnaryExpression") return;
		}
	}

	// 1. Grab the TypeScript program from parser services
	const parserServices = ESLintUtils.getParserServices(context);
	const checker = parserServices.program.getTypeChecker();
	// 2. Find the backing TS node for the ES node, then that TS type
	const originalNode = parserServices.esTreeNodeToTSNodeMap.get(
		node
	);
	const nodeType = checker.getTypeAtLocation(originalNode);
	let ok = false;
	let errNode: uic = node;
	let func;
	if (node?.parent?.type === "CallExpression") {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const dec: any = checker.getSymbolAtLocation(originalNode)?.valueDeclaration;
		if (dec?.type?.kind === ts.SyntaxKind.BooleanKeyword) {
			ok = true;
			const nodeUn = node?.parent?.parent;
			if (nodeUn?.type === "UnaryExpression") {
				errNode = nodeUn;
				func = (fixer: RuleFixer) => [
					{ // con este objeto le digo que texto va ir al comienzo del nodo, osea ""(nada, borrar), el range[0] es donde comienza
						range: [nodeUn?.range[0], nodeUn?.range[0] + 1],
						text: ""
					},
					fixer.insertTextAfter(nodeUn, " === false")
				];
			} else {
				errNode = node?.parent;
				func = (fixer: RuleFixer) => fixer.insertTextAfter(node?.parent, " === true");
			}
		}
	} else {
		if (node?.parent?.type === "UnaryExpression") errNode = node?.parent;
		func = (fixer: RuleFixer) => {
			if (node?.parent?.type === "UnaryExpression") {
				return fixer.replaceText(node?.parent, node.name + " === false");
			}
			return fixer.insertTextAfter(node, " === true");
		};
	}
	if (tsutils.isTypeFlagSet(nodeType, ts.TypeFlags.BooleanLike) || ok) {
		context.report({
			node: errNode,
			messageId: "explicitBol",
			fix: func,
			data: {
				name: node.name
			}
		});
	}
}