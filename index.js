const puppeteer = require('puppeteer');
const login = require('./middlewares/login')
const createPosts = require('./core-scraper/post-scraper')
const cors = require('cors')
const mongoose = require('mongoose');
const express = require('express');
const app = express()

    app.use(
        cors({
            origin: ["https://search-ui-mu.vercel.app/","http://172.21.35.64:3000"],
            credentials: true
        })
    )
    app.use(
        express.urlencoded({
          extended: true
        })
      )
    app.use(express.json())

async function createGroupsCollection(id){

    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: null,
        args: ["--disable-notifications"]
    });

        const page = await browser.newPage();
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
