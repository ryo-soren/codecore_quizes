const express = require('express')
const knex = require('../db/client')
const router = express.Router()

router.get('/sign_in', (req, res) => {
    res.render('clucks/sign_in')
})
router.get('/new', (req, res) => {
    res.render('clucks/new')
})

router.get("/", (req,res) => {
    knex("clucks")
    .orderBy('id', "desc")
    .then(clucks => {
        const cluckObj = {}
        for (const cluck of clucks) {
            if (cluck["content"]) {
                const cluckArray = cluck["content"].split(" ")
                for (const word of cluckArray) {
                    if (word[0] === "#") {
                        if (cluckObj[word]) {
                            cluckObj[word]++
                        }else{
                            cluckObj[word] = 1
                        }
                    }
                }
            }
        }
        if(cluckObj){
            let toSort = [];
            for (const key in cluckObj) {
                toSort.push([key, cluckObj[key]]);
            }
            const sorted = toSort.sort(function(a, b) {return a[1] - b[1]}).reverse()
            console.log(sorted);
            res.render("clucks/index", {clucks: clucks, sorted: sorted})
        }
    })
})

router.post("/", (req,res) => {
    const cluck = {
        content: req.body.content,
        image_url: req.body.image_url,
        username: req.cookies.username
    };
    knex("clucks")
    .insert(cluck)
    .returning("*")
    .then(clucks => {
        res.redirect("/clucks")
    })
})



module.exports = router


