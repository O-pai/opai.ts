import { parse } from '../dist/opai_ps.js';
import { SimplePromptVisitor } from '../dist/visitors/simple_prompt.js';

// simple content
const t1 = `
#util.hello_world
// output hello world!

#util.rawurlencode
// encode the url
// what about the query string?
`;
let ast = parse(t1);
console.log(t1)
console.log(JSON.stringify(ast, null, 2));

// empty content
const t2 = `
#hello_world
`
ast = parse(t2);
console.log(t2)
console.log(JSON.stringify(ast, null, 2));

// empty
const t3 = `
`
ast = parse(t3);
console.log(t3)
console.log(JSON.stringify(ast, null, 2));

// with parameters
const t4 = `
#hello_world(word, repeat: repeat times) -> result
// hello world!
`;
ast = parse(t4);
console.log(t4)
console.log(JSON.stringify(ast, null, 2));

const t5 = `
; get whether from somewhere

#get_weather_report(place) -> result: the weather report 
// get weather report from the weather API
uses: ~fetch

#fetch(place) -> result: the weather report
// this will call the remote weather API,
// and parse the result
`;
ast = parse(t5);
console.log(t5)
console.log(JSON.stringify(ast, null, 2));

console.log('----------------------------------');
console.log(ast.accept(new SimplePromptVisitor()))
