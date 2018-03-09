var express = require('express');
var router = express.Router();
var fs = require('fs-extra');
var Product = require('../models/product');
var Category = require('../models/category');

//  GET retrieve all products
router.get('/all', function (req, res) {
    Product.find(function (error, products) {
        if (error)
            console.log(error);

        res.render('all_products', {
            title: 'All products',
            products: products
        });
    });
});

//  GET retrieve a product by category
router.get('/:category', function (req, res) {

    var categorySlug = req.params.category;

    Category.findOne({ slug: categorySlug }, function (error, category) {
        Product.find({ category: categorySlug }, function (error, products) {
            if (error)
                console.log(error);

            res.render('category_products', {
                title: category.title,
                products: products
            });
        });
    });
});

//  GET retrieve a product details
router.get('/:category/:product', function (req, res) {

    var galleryImages = null;

    Product.findOne({ slug: req.params.product }, function (error, product) {
        if (error) {
            console.log(error);
        } else {
            var galleryDir = 'public/product_images/' + product._id + '/gallery';

            fs.readdir(galleryDir, function (error, files) {
                if (error) {
                    console.log(error);
                } else {
                    galleryImages = files;

                    res.render('product', {
                        title: product.title,
                        product: product,
                        galleryImages: galleryImages
                    });
                }
            });
        }
    });
});

module.exports = router;
