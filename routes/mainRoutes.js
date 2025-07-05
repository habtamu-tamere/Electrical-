const express = require('express');
const router = express.Router();
const BlogPost = require('../models/BlogPost');

// Homepage
router.get('/', async (req, res) => {
    try {
        const featuredPosts = await BlogPost.find({ isPublished: true })
            .sort({ publishedAt: -1 })
            .limit(3);
            
        res.render('index', {
            title: 'Ethiopia\'s #1 Electrical & Facility Maintenance Company',
            metaDescription: 'Expert Electrical Installations, Solar Power, HVAC, Fire Safety & Industrial Maintenance serving Addis Ababa & all over Ethiopia.',
            featuredPosts,
            canonicalUrl: process.env.BASE_URL
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// Services Page
router.get('/services', (req, res) => {
    res.render('services/index', {
        title: 'Our Professional Services | EthioPower Solutions',
        metaDescription: 'Comprehensive electrical, solar, HVAC, fire safety, and facility maintenance services in Ethiopia. 24/7 reliable solutions for homes and businesses.',
        canonicalUrl: `${process.env.BASE_URL}/services`
    });
});

// About Page
router.get('/about', (req, res) => {
    res.render('about', {
        title: 'About Us | EthioPower Solutions',
        metaDescription: 'Learn about EthioPower Solutions - Ethiopia\'s leading electrical and facility maintenance company with years of experience and certified professionals.',
        canonicalUrl: `${process.env.BASE_URL}/about`
    });
});

// Contact Page
router.get('/contact', (req, res) => {
    res.render('contact', {
        title: 'Contact Us | EthioPower Solutions',
        metaDescription: 'Get in touch with EthioPower Solutions for all your electrical, solar, and facility maintenance needs in Ethiopia. Free quotes available.',
        canonicalUrl: `${process.env.BASE_URL}/contact`
    });
});

module.exports = router;
