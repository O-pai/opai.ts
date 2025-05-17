import { Visitable } from '../visitors/visitor';

export type FuncCallNode = {
    type: 'FuncCall';
    name: string;
    belongsTo: string;
    // fullname: string;
    isAsync: boolean;
    accept: Visitable['accept'];
}

export type ParamNode = {
    type: 'Param';
    name: string;
    desc: string;
    accept: Visitable['accept'];
}

export type FunctionNode = {
    type: 'Function';
    name: string;
    belongsTo: string;
    // fullname: string;
    desc: string;
    input: ParamNode[];
    output: ParamNode[];
    uses: FuncCallNode[];
    accept: Visitable['accept'];
}

export type StructNode = {
    type: 'Struct';
    name: string;
    desc: string;
    accept: Visitable['accept'];
}

export type ProgramNode = {
    type: 'Program';
    structs: StructNode[];
    funcs: FunctionNode[];
    accept: Visitable['accept'];
}

export type ASTNode =
    | ProgramNode
    | StructNode
    | FunctionNode
    | ParamNode
    | FuncCallNode
