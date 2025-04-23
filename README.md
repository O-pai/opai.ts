# P-AI

P-AI is an intermediate language based on code generation and is a DSL.

## Grammar
Refer to examples/hello-world.p-ai, the classic Hello World example.  
You will use the command line to generate prompts using p-ai. But first, you need to compile the typescript into JavaScript.

## Installation steps
1. Clone this repository
2. npm run build
3. Configure. env (refer to. env. example) using your AI platform's key and entry address. (Of course, if you just want to generate a prompt, you don't need this step)
4. Run `./binin/p-ai.js ` or `./bin/single_prompt. js ` (-- help can provide assistance)

## QA
* What is this?  
P-ai is a DSL that describes functions/methods and assists AI in generating code.

* What is it used for?  
We know that current AI can generate code, but there are certain errors in this generation. For example, you need to explain the function name as much as possible, which is relatively cumbersome. So defining an intermediate format and then generating prompts would be more convenient.  
In other words, p-ai is a method used to simply express the functionality that needs to be implemented, paraphrased in prompt language that is easy for AI to understand.

* What is its grammar like?  
Taking the classic Hello World as an example, (reference: examples/hello_world.p-ai)  
Then, output prompt through the command line` node bin/simple_prompt.js parse -l ts examples/hello_world.p-ai`

    ```
    # hello_world(something: string)
    // output hello world or something!
    ```

