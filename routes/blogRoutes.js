const express = require('express');
const router = express.Router();
const BlogPost = require('../models/BlogPost');

// Blog index page
router.get('/', async (req, res) => {
    try {
        const posts = await BlogPost.find({ isPublished: true })
            .sort({ publishedAt: -1 });
            
        res.render('blog/index', {
            title: 'Blog | EthioPower Solutions',
            metaDescription: 'Read our latest articles on electrical solutions, solar power, facility maintenance, and energy efficiency in Ethiopia.',
            posts,
            canonicalUrl: `${process.env.BASE_URL}/blog`
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// Single blog post
router.get('/:slug', async (req, res) => {
    try {
        const post = await BlogPost.findOne({ slug: req.params.slug, isPublished: true });
        
        if (!post) {
            return res.status(404).render('404', { title: 'Post Not Found' });
        }
        
        // Get related posts
        const relatedPosts = await BlogPost.find({
            _id: { $ne: post._id },
            tags: { $in: post.tags },
            isPublished: true
        }).limit(3);
        
        res.render('blog/post', {
            title: post.metaTitle,
            metaDescription: post.metaDescription,
            keywords: post.keywords.join(', '),
            post,
            relatedPosts,
            canonicalUrl: `${process.env.BASE_URL}/blog/${post.slug}`
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
