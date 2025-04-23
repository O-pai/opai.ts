import { FuncCallNode, FunctionNode, ParamNode, ProgramNode } from "../nodes/types";
import { ASTVisitor } from "./visitor";

export class SimplePromptVisitor implements ASTVisitor {

    visitProgram(node: ProgramNode, env: any): any {
        let c = `You are about to implement below functions (start with "#"):\n\n`
        c += node.funcs.map((func) => {
            return func.accept(this)
        }).join('\n\n')
        return c
    }

    visitFunction(node: FunctionNode, env: any): any {
        const module_info = node.belongsTo ? `which belongs to module "${node.belongsTo}". ` : ''
        let c = `# "${node.name}" ${module_info}\n`
        const func_info = node.desc ? `This function is about "${node.desc}". \n` : ''
        c += func_info
        if (node.input.length > 0) {
            c += `It takes the following input parameters:\n`
            c += node.input.map((param) => {
                return param.accept(this)
            }).join('')
        }
        if (node.output.length > 0) {
            c += `It will produce below outputs:\n`
            c += node.output.map((param) => {
                return param.accept(this)
            }).join('') 
        }
        if (node.uses.length > 0) {
            c += `It uses the following utility functions if necessary:\n`
            c += node.uses.map((func) => {
                return func.accept(this)
            }).join('')
        }
        return c
    }

    visitParam(node: ParamNode, env: any): any {
        let c = `- "${node.name}"`
        if (node.desc) c += ` which means ${node.desc}`
        c += '\n'
        return c
    }

    visitFuncCall(node: FuncCallNode, env: any): any {
        let prefix = ''
        if (node.belongsTo) {
            prefix = `${node.belongsTo}.`
        }

        const funcname = `${prefix}${node.name}`
        let c = `- "${funcname}"`
        if (node.isAsync) {
            c += ', an asynchronous function'
        }
        if (Object.keys(env).includes(funcname)) {
            c += `, used for "${env[funcname]}"`
        }
        c += '\n'
        return c
    }

}