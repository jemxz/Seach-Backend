const puppeteer = require('puppeteer');
const login = require('./middlewares/login')
const createPosts = require('./core-scraper/post-scraper')
const cors = require('cors')
const fs = require('fs')
const https = require("https")
const path = require('path')
const express = require('express');
const app = express()
const http = require('http');

    app.use(
        cors()
    )
    app.use(
        express.urlencoded({
          extended: true
        })
      )
    app.use(express.json())

async function createGroupsCollection(id){
    const username = "Seljemxzomer";
    const password = "O4h0AyY"

    const browser = await puppeteer.launch({
        headless: true,
        defaultViewport: null,
        args: [
            "--disable-notifications",
            '--proxy-server=193.178.134.82:45785',
            // Use proxy for localhost URLs
            '--proxy-bypass-list=<-loopback>',
            '--no-sandbox', 
            '--disable-setuid-sandbox', 
            '--single-process'
        
        ]
    });


        const page = await browser.newPage();
        console.log("Launching Page");
        await page.authenticate({ username, password });
        page.setDefaultNavigationTimeout(100000)
        console.log("Authenticated proxy");

    // LOGING IN TO A FACEBOOK ACCOUNT --- //
    try {
            console.log("Logging in");
            await login(page)
        } catch (error) {
            return console.log(error.message)
        }
    
        const posts  = await createPosts(id, page)
        browser.close()
        return posts
    
}

app.post('/api/post', async function (req, res) {
    console.log(req.body);
    const id ="https://m.facebook.com/"+ req.body.id
    console.log(id);
    const posts = await createGroupsCollection(id)
    if(!posts) res.status(404).send('It doesnt exist')
    res.send(posts);
    
});

const hostname= "facebookscraper.cloudns.ph"
const port = 3223;

let options = {
    key: fs.readFileSync('./cert/private.key'),
    cert: fs.readFileSync("./cert/certificate.crt"),
    ca: fs.readFileSync('./cert/ca_bundle.crt')
}

const httpsServer = https.createServer(options, app);

httpsServer.listen(port, () => console.log(`Listening on port ${port} ...`));


// https
//   .createServer(
//     {
//       key: fs.readFileSync(path.join(__dirname, 'cert', 'key.pem')),
//       cert: fs.readFileSync(path.join(__dirname, 'cert', 'cert.pem')),
//     },
//     app
//   )

