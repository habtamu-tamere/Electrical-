const express = require('express');
const router = express.Router();
const Lead = require('../models/Lead');
const { body, validationResult } = require('express-validator');
const nodemailer = require('nodemailer');
const axios = require('axios');

// Lead capture form submission
router.post('/', [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('phone').notEmpty().withMessage('Phone number is required'),
    body('service').notEmpty().withMessage('Service is required')
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        // Save to database
        const newLead = new Lead({
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
            service: req.body.service,
            message: req.body.message
        });

        await newLead.save();

        // Send email notification
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: process.env.LEAD_EMAIL,
            subject: 'New Lead from Website',
            text: `New lead details:\n\nName: ${req.body.name}\nEmail: ${req.body.email}\nPhone: ${req.body.phone}\nService: ${req.body.service}\nMessage: ${req.body.message || 'None'}`
        };

        await transporter.sendMail(mailOptions);

        // Send WhatsApp notification if configured
        if (process.env.WHATSAPP_API_KEY && process.env.WHATSAPP_PHONE) {
            const whatsappMessage = `New lead from website:\nName: ${req.body.name}\nPhone: ${req.body.phone}\nService: ${req.body.service}`;
            
            await axios.post('https://api.whatsapp.com/send', {
                phone: process.env.WHATSAPP_PHONE,
                message: whatsappMessage,
                apikey: process.env.WHATSAPP_API_KEY
            });
        }

        res.json({ success: true, message: 'Thank you! We will contact you shortly.' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server error. Please try again later.' });
    }
});

module.exports = router;
