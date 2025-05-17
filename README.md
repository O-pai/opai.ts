# OPai

OPai是一个DSL，一个基于人类与AI之间用来代码生成的中间语言。  
OPai is a DSL, an intermediate language between human and AI for generating codes.

(其实我想取pai为名字，但是Org没有了～)

## 安装 / Installation
1. Clone项目仓库 / Clone this repository
1. 安装依赖 / Install dependencies: `npm install`
1. 生成js / Generate js: `npm run build`
1. 配置/Configure `.env` (check .env.example) -- Optional step if you just want to use `bin/simple_prompt.js`
1. 运行/Run `node ./bin/opai.js ` or `node ./bin/simple_prompt. js ` (--help see more)

## 语法 / Grammar

### Struct 定义/Definitions
```
$Person: with id, name, age
$Car: color
```

### Method/Function 定义/Definition
```
# who_am_I(id: person id) -> person: string
// this function will fetch the remote person data by id
// and then convert the person data to string
uses: ~fetch
```

### Full Example
Read examples under `./examples`.

## QA
* 用来做什么 / What is this used for?  
直接Text to codes, 通常可以完成65%～90%的需求。
不过在细节上，也许需要更精确的掌控；另外临时的想法也可以尝试用Opai DSL来定义。