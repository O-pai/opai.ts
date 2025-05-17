export interface ASTVisitor {
    visitProgram(node: ProgramNode, env: any): any;
    visitStruct(node: StructNode, env: any): any;
    visitFunction(node: FunctionNode, env: any): any;
    visitParam(node: ParamNode, env: any): any;
    visitFuncCall(node: FuncCallNode, env: any): any;
}

export interface Visitable {
    accept(visitor: ASTVisitor): any;
}