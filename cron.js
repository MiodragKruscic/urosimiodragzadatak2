const cron = require("node-cron");
const shell = require("shelljs")


cron.schedule("* * 12 * * *",function(){
    console.log("Running at: " + Date().toString())
    if(shell.exec("node index.js") !== 0){
        console.log("error");
    }
});