const { fork } = require("child_process")

process.on("message", (msg) => {
    let a = ""
    if (msg == "start") {
        a = "A"
    }
    process.send({ type: "listo", data: a })
})