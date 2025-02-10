const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const puppeteer = require("puppeteer");
require("dotenv").config();


const connectDB = require("./db");
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());


// Routes
app.post("/api/click", async (req, res) => {
    const { url, selector } = req.body;

    console.log("Received URL:", url);
    console.log("Received Selector:", selector);

    if (!url || !selector ) {
        return res.status(400).json({ message: "Invalid URL or Selector is missing" });
    }

    try {
        // Launch Puppeteer
        const browser = await puppeteer.launch({ headless: false }); //headless: true for production
        const page = await browser.newPage();

        // Navigate to the given URL
        console.log("Navigating to:", url);
        await page.goto(url, { 
            waitUntil: "networkidle2",
            timeout: 120000 //2 minutes
        });

         // Fill in the login form
        // await page.type('input[name="username"]', process.env.LOGIN_USERNAME);
        // await page.type('input[name="password"]', process.env.LOGIN_PASSWORD);

        // Wait for the button to appear
        console.log("Waiting for selector:", selector);
        await page.waitForSelector(selector, { visible: true });

        // Scroll to the button (if necessary)
        await page.evaluate((selector) => {
            document.querySelector(selector).scrollIntoView();
        }, selector);

        // Click the button
        await page.click(selector);

        console.log("Button clicked successfully!");
        await page.screenshot({ path: "success.png" });

        await browser.close();
        res.status(200).json({ message: "Button clicked successfully!" });
    } catch (error) {
        console.error("Error in Puppeteer:", error);
        res.status(500).json({ message: "Internal Server Error" , error: error.message });
    } 
});


// Server Listener
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
    connectDB();
});
