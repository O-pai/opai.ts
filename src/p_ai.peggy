{
    const env = {
        funcs: {},
    }

    function makeNode(type, ...children) {
        const node = {type}
        switch(type) {
        case 'Program':
            node.funcs = children
            node.accept = (visitor) => visitor.visitProgram(node, env)
            break;
        case 'Function':
            [node.name, node.belongsTo, node.desc, node.input, node.output, node.uses] = children
            node.accept = (visitor) => visitor.visitFunction(node, env)
            break;
        case 'Param':
            [node.name, node.desc] = children
            node.accept = (visitor) => visitor.visitParam(node, env)
            break;
        case 'FuncCall':
            [node.name, node.belongsTo, node.isAsync] = children
            node.accept = (visitor) => visitor.visitFuncCall(node, env)
            break;
        default:
            throw new Error(`Unknown node type: ${type}`);
        }
        return node;
    }
}

Program
= __ first:Function? rest:(__ Function)* __ {
    const funcs = []
    if (first) funcs.push(first)
    funcs.push(...rest.map(([, f]) => f));
    return makeNode('Program', ...funcs)
}

Function
= '#' _ prefix:(Identifier '.')? name:Identifier _ inputs:InSig? _ outputs:OutSig? _ Newline desc:Line* tools:(Tools _ Newline)? {
    prefix = !!prefix ? prefix + '.' : ''
    const d = desc?.join('\n') || ''
    env.funcs[prefix + name] = d
    return makeNode('Function', name, prefix?.[0] || '', d, inputs || [],  outputs || [], tools?.[0] || [])
}

Identifier
= [a-zA-Z_][a-zA-Z0-9_]* {
    return text()
}

InSig
= '(' _ params:Params? _ ')' {
    return params || []
}

OutSig
= '->' _ params:Params? {
    return params || []
}

Params
= first:Param _ rest:(',' _ Param _)* {
    return [first, ...rest.map(r => r[2])];
}

Param
= id:Identifier _ desc:(':' _ ParamText)? {
    return makeNode('Param', id, desc?.[2] ?? '')
}

Line
= '//' _ text:Text Newline {
    return text
}

ParamText
= [^),\r\n]+ { 
    return text()
}

Text
= [^#\n\r]+ { return text() }
/ "" { return '' }

Tools
= ('tools:' / 'uses:') _ first:Tool rest:(_ ',' _ Tool)* {
    return [first, ...rest.map(r => r[3])]
}

Tool
= async:'~'? prefix:(Identifier '.')? id:Identifier {
    return makeNode('FuncCall',
        id,
        prefix?.[0] || '',
        !!async
    )
}

Newline
= '\r\n' / '\n' / '\r'

__
= [ \t\r\n]*

_ "whitespace"
= [ \t]*
