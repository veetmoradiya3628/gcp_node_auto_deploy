const express = require("express")
const PORT = 9888
const app = express();

app.get("/", (req, res) => {
    res.json({
        message: "hello from express server",
        status: true
    })
})

app.listen(PORT, () => {
    console.log(`server started at 9888`);
})