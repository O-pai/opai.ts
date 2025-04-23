# P-AI

P-ai是一个DSL，一个基于人类与AI之间用来代码生成的中间语言。  
P-ai is a DSL, an intermediate language between human and AI for generating codes.

## 语法 / Grammar

### Method/Function 定义/Definition
```
Function ::= 
#FunctionName (Parameter: Optional Description, ...) -> OptionalResult: Description
// Description
uses: ~FunctionName1, FunctionName2
```

Hello World 例子/Example:
```
# hello_world(something: string)
// output hello world or something!
```

参考 examples/hello_world.p-ai, 经典的Hello World例子。  
你将使用命令行来利用p-ai来生成prompts。不过首先你要将typescript编译成javascript。  
Refer to examples/hello-world.p-ai, the classic Hello World example.  
You will use the command line to generate prompts using p-ai. But first, you need to compile the typescript into JavaScript.

## 安装步骤 / Installation steps
1. Clone项目仓库 / Clone this repository
1. 安装依赖 / Install dependencies: `npm install`
1. 生成js / Generate js: `npm run build`
1. 配置/Configure `.env` (refer to .env.example). Using your AI platform's key and entry address. (Of course, if you just want to generate a prompt, you don't need this step)
4. 运行/Run `node ./bin/p-ai.js ` or `node ./bin/single_prompt. js ` (-- help can provide assistance)

## QA
* 用来做什么 / What is it used for?  
We know that current AI can generate code, but there are certain errors in this generation. For example, you need to explain the function name as much as possible, which is relatively cumbersome. So defining an intermediate format and then generating prompts would be more convenient.  
In other words, p-ai is a method used to simply express the functionality that needs to be implemented, paraphrased in prompt language that is easy for AI to understand.
