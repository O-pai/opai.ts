import yargs from "yargs"
import { hideBin } from "yargs/helpers";

yargs()
    .scriptName("simple_prompt")
    .usage("$0 -l <lang> -o <outfile> [file]")
    .command(
        "* [file]",
        "Generate prompts from .opai file",
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
                .option("output", {
                    alias: "o",
                    describe: "Output file (optional, defaults to stdout)",
                    type: "string",
                })
        },
        async (argv) => {
            const { parse } = await import("../dist/opai_ps.js");
            const fs = await import("fs");
            const path = await import("path");
            const { SimplePromptVisitor } = await import("../dist/visitors/simple_prompt.js");

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
            const system_prompt = `You are a coding assistant. You will generate the best "${argv.lang}" codes.\n\n`;
            const output = system_prompt + ast.accept(new SimplePromptVisitor(argv.lang));

            if (argv.output) {
                const outputPath = path.resolve(argv.output);
                fs.writeFileSync(outputPath, output);
            } else {
                console.log(output);
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
    .help().alias('h', 'help')
    .version('0.0.3').alias('v', 'version')
    .parse(hideBin(process.argv))