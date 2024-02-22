import readline from "readline";

const log = console.log;

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const recursiveAsyncReadLine = () => {
    rl.question('Command: ', (answer) => {
        if (answer === 'exit') //we need some base case, for recursion
            return rl.close(); //closing RL and returning from function.
        log('Got it! Your answer was: "', answer, '"');
        recursiveAsyncReadLine(); //Calling this function again to ask new question
    });
};

recursiveAsyncReadLine(); //we have to actually start our recursion somehow