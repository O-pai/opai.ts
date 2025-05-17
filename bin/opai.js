import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import OpenAI from "openai";
import fs from "fs";
import path from "path";
import ora from "ora";
import dotenv from 'dotenv';
dotenv.config();

const configuration = {
    baseURL: process.env.BASE_URL,
    apiKey: process.env.SECRET_KEY, 
};
const ai = new OpenAI(configuration);

yargs()
    .scriptName("opai")
    .usage("$0 -l <lang> -m <model> -o <outfile> -sd [file]")
    .command(
        "* [file]",
        "AI-powered code assistant from .opai file",
        (yargs) => {
            yargs
                .positional("file", {
                    describe: ".opai file to parse (optional, defaults to stdin)",
                    type: "string",
                })
                .option("lang", {
                    alias: "l",
                    describe: "Coding language to use",
                    type: "string",
                    demandOption: true,
                })
                .option("model", {
                    alias: "m",
                    describe: "AI model to use (depends on your ENV settings)",
                    type: "string",
                })
                .option('simple', {
                    alias: 's',
                    describe: 'Return only code without explanations',
                    type: 'boolean',
                    default: false,
                })
                .option('debug', {
                    alias: 'd',
                    describe: 'Debug mode, print also prompt',
                    type: 'boolean',
                    default: false,
                })
                .option("output", {
                    alias: "o",
                    describe: "Output file (optional, defaults to stdout)",
                    type: "string",
                });
        },
        async (argv) => {
            const { SimplePromptVisitor } = await import("../dist/visitors/simple_prompt.js");
            const { parse } = await import("../dist/opai_ps.js");

            let content
            if (argv.file) {
                const filePath = path.resolve(argv.file);
                content = fs.readFileSync(filePath, "utf-8");
            } else {
                console.log("Reading from standard input. Press Ctrl+D when done:\n");
                content = await new Promise((resolve, reject) => {
                    let input = "";
                    process.stdin.on("data", (chunk) => (input += chunk));
                    process.stdin.on("end", () => resolve(input));
                    process.stdin.on("error", (err) => reject(err));
                });
                content += "\n";
            }
            const ast = parse(content);
            const system_prompt = `You are a coding assistant. You will generate the best "${argv.lang}" codes.\n`; 
            const prompt = ast.accept(new SimplePromptVisitor(argv.lang)) + (argv.simple ? '' : `\n\nNotice: return code only between html tag "<code>", no explanation.\n`);

            if (argv.debug) {
                console.log("==== DEBUG ====\n");
                console.log("System prompt:\n", system_prompt);
                console.log("User prompt:\n", prompt);
                console.log("==== DEBUG ====\n");
            }

            const spinner = ora("Generating code...").start();

            try {
                const response = await ai.chat.completions.create({
                    model: argv.model || process.env.MODEL_NAME,
                    messages: [
                        { role: "system", content: system_prompt },
                        { role: "user", content: prompt },
                    ],
                    stream: false,
                    max_tokens: 1000,
                });

                spinner.succeed("Code generation completed!");

                const output = response.choices[0].message.content.trim();

                if (argv.output) {
                    const outputPath = path.resolve(argv.output);
                    fs.writeFileSync(outputPath, output);
                    console.log(`Output written to ${outputPath}`);
                } else {
                    console.log(output);
                }
            } catch (error) {
                spinner.fail("Error generating code.");
                console.error("Error generating code:", error.message);
            }
        }
    )
    .check((argv) => {
        if (!argv.lang) {
            throw new Error("The --lang option is required.");
        }
        return true;
    })
    .fail((msg, err, yargs) => {
        if (err) console.error(err.message + "\n");
        console.log(yargs.help());
        process.exit(1);
    })
    .help()
    .alias("h", "help")
    .version("0.0.5")
    .alias("v", "version")
    .parse(hideBin(process.argv));
