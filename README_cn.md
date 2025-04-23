# P-AI

p-ai是基于代码生成的中间语言，是一个DSL。

## 语法
参考 examples/hello_world.p-ai, 经典的Hello World例子。
你将使用命令行来利用p-ai来生成prompts。不过首先你要将typescript编译成javascript。

## 安装步骤
1. Clone这个仓库
2. npm run build
3. 配置.env (参考.env.example), 使用你ai平台的key和入口地址。（当然假使你只是想生成prompt就不需要这一步)
4. 运行 `./bin/p-ai.js` 或 `./bin/simple_prompt.js` (--help 可以提供帮助)

## QA
* 这是什么？  
p-ai是一个DSL, 是一种描述函数/方法的语言，辅助AI生成代码的DSL。

* 用来干什么？  
我们知道现在的AI可以生成代码，但这种生成存在着某些误差。比如你需要尽量说明函数名，相对繁琐。所以定义一种中间格式，然后再生成prompts, 会显得比较方便。
换而言之，p-ai 是用来简单的表达需要实现的功能的方法，转述成AI易理解的prompt的语言。

* 它的语法是什么样的？  
以经典的 hello world 为例, (参考: examples/hello_world.p-ai)  
然后，通过命令行输出prompt。`node bin/simple_prompt.js parse -l ts examples/hello_world.p-ai`

    ```
    # hello_world(something: string)
    // output hello world or something!
    ```


