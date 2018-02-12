var express = require('express');
var router = express.Router();

var Page = require('../models/page');

//  GET Pages
router.get('/pages', function (req, res) {
    Page.find({}).sort({ sorting: 1 }).exec(function (error, pages) {
        res.render('admin/pages', {
            title: 'All pages',
            pages: pages
        });
    });
});

//  GET add page
router.get('/add', function (req, res) {
    var title = 'New page';
    var slug = '';
    var content = '';

    res.render('admin/add', {
        title: title,
        slug: slug,
        content: content
    });
});

//  POST add page
router.post('/add', function (req, res) {
    req.checkBody('title', 'Title must have a value').notEmpty();
    req.checkBody('content', 'Content must have a value').notEmpty();

    var title = req.body.title;
    var slug = req.body.slug.replace(/\s+/g, '-').toLowerCase();
    var content = req.body.content;

    if (slug == '')
        slug = title.replace(/\s+/g, '-').toLowerCase()

    var errors = req.validationErrors();

    if (errors) {
        res.render('admin/add', {
            errors: errors,
            title: title,
            slug: slug,
            content: content
        });
    } else {
        Page.findOne({ slug: slug }, function (error, page) {
            if (page) {
                req.flash('danger', 'Page slug exists, choose another.');

                res.render('admin/add', {
                    title: title,
                    slug: slug,
                    content: content
                });
            } else {
                var newPage = new Page({
                    title: title,
                    slug: slug,
                    content: content,
                    sorting: 100
                });

                newPage.save(function (error) {
                    if (error)
                        return console.log(error);

                    req.flash('success', 'Page added!!');
                    res.redirect('/admin/pages');
                });
            }
        });
    }
});

module.exports = router;
