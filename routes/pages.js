var express = require('express');
var router = express.Router();
var Page = require('../models/page');

//  GET retrieve all pages
router.get('/', function (req, res) {
    Page.findOne({ slug: 'home' }, function (error, page) {
        if (error)
            console.log(error);

        res.render('index', {
            title: page.title,
            content: page.content
        });
    });
});

//  GET retrieve a page content
router.get('/:slug', function (req, res) {

    var slug = req.params.slug;

    Page.findOne({ slug: slug }, function (error, page) {
        if (error)
            console.log(error);

        if (!page) {
            res.redirect('/');
        } else {
            res.render('index', {
                title: page.title,
                content: page.content
            });
        }
    });
});

module.exports = router;
