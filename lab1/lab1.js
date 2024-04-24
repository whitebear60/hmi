import fs from 'fs'
import readline from "node:readline";

const buffer = fs.readFileSync("lab1.json");

const questions = JSON.parse(buffer.toString())
const answers = [];

const consoleInterface = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})


const readQuestion = i => {
    let el;
    if (questions[i].type !== "yes_no") {
        el = questions[i].question + " "
    } else {
        el = questions[i].question + " [Y/n]: "
    }
    consoleInterface.question(el, (ans) => {
        if (questions[i].type === "input") {
            answers.push(ans);
        } else if (questions[i].type === "number") {
            if (!Number.isNaN(parseInt(ans))) {
                answers.push(ans);
            } else {
                console.info("Please enter a number");
                i--;
            }
        } else if(questions[i].type === "yes_no") {
            if ((/^[YyNn]$/).test(ans)) {
                (/^[Yy]$/).test(ans) ? answers.push(true) : answers.push(false);
            } else {
                console.info("Please enter Y or N");
                i--;
            }
        }
        if (questions[i + 1]) {
            readQuestion(i + 1);
        } else {
            answers.forEach((answer, index) => {
                fs.writeFileSync("lab1_out.txt", questions[index].question + ": " + answer + "\n", {flag: "a"})
            })
            fs.writeFileSync("lab1_out.txt", "\n===\n", {flag: "a"})
            return consoleInterface.close();
        }
    });
}
readQuestion(0);
