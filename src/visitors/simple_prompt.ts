import { FuncCallNode, StructNode, FunctionNode, ParamNode, ProgramNode } from "../nodes/types";
import { ASTVisitor } from "./visitor";

export class SimplePromptVisitor implements ASTVisitor {

    visitProgram(node: ProgramNode, env: any): any {
        let c = `You implement codes according to description below.\n(From struct definitions, and then functions.)\n\n`

        if (node.structs.length > 0) {
            c += '# Struct Definitions\n'
            c += node.structs.map((struct) => {
                return struct.accept(this)
            }).join('\n')
            c += "\n"
        }

        if (node.funcs.length > 0) {
            c += '# Function Definitions (start with "##"):\n\n'
            c += node.funcs.map((func) => {
                return func.accept(this)
            }).join('\n')
        }

        return c
    }

    visitStruct(node: StructNode, env: any): any {
        return `- struct "${node.name}", which ${node.desc}\n` 
    }

    visitFunction(node: FunctionNode, env: any): any {
        const module_info = node.belongsTo ? `which belongs to module "${node.belongsTo}". ` : ''
        let c = `## "${node.name}" ${module_info}\n`
        const func_info = node.desc ? `This function is about "${node.desc}". \n\n` : ''
        c += func_info
        if (node.input.length > 0) {
            c += `It takes the following input parameters:\n`
            c += node.input.map((param) => {
                return param.accept(this)
            }).join('')
        }
        if (node.output.length > 0) {
            c += `It returns:\n`
            c += node.output.map((param) => {
                return param.accept(this)
            }).join('') 
        }
        if (node.uses.length > 0) {
            c += `It uses below utility functions if necessary:\n`
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