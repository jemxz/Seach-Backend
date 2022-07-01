const puppeteer = require('puppeteer');
const login = require('./middlewares/login')
const createPosts = require('./core-scraper/post-scraper')
const cors = require('cors')
const mongoose = require('mongoose');
const express = require('express');
const app = express()

    app.use(
        cors({
            'Access-Control-Allow-Credentials':true
        })
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
        
        ]
    });


        const page = await browser.newPage();
        await page.authenticate({ username, password });
        page.setDefaultNavigationTimeout(100000)

    // LOGING IN TO A FACEBOOK ACCOUNT --- //
    try {
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

const port = process.env.PORT || 3223;
app.listen(port, () => console.log(`Listening on port ${port} ...`));
