// backend/controllers/contactController.js
import Message from "../models/Contact.js";
import mongoose from "mongoose";
import { Parser } from "json2csv";
import { sendEmail } from "../utils/sendEmail.js";

// API route to get all messages
export const getAllMessage = async (req, res) => {
    try {
        const messages = await Message.find().sort({ createdAt: -1 });
        res.status(200).json(messages);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch messages" });
    }
};

// Create Message
export const createMessage = async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;

        if (!name || !email || !message) {
            return res.status(400).json({ error: "Name, email and message are required." });
        }

        const newMessage = await Message.create({
            name,
            email,
            subject,
            message,
            isResolved: false,
        });

        res.status(201).json({
            success: true,
            message: "Message submitted successfully",
            data: newMessage,
        });
    } catch (error) {
        res.status(500).json({ error: "Failed to submit message" });
    }
};

// Mark a message as resolved/unresolved
export const resolvedMessage = async (req, res) => {
    try {
        const { id } = req.params;

        // Validate ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: "Invalid message ID format" });
        }

        const message = await Message.findById(id);
        if (!message) return res.status(404).json({ error: "No Message Found." });

        message.isResolved = !message.isResolved;
        await message.save();

        if (!message) {
            return res.status(404).json({ error: "No Message Found." });
        }

        res.status(200).json(message);
    } catch (error) {
        console.error("Error updating message:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

// Admin Reply Through Email
export const adminReply = async (req, res) => {
    try {
        const { id } = req.params;
        const { adminReply } = req.body;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: 'Invalid message ID' });
        }

        const message = await Message.findByIdAndUpdate(
            id,
            {
                adminReply,
                isResolved: true
            },
            { new: true }
        );

        if (!message) {
            return res.status(404).json({ error: 'Message not found' });
        }

        await sendEmail({
            email: message.email,  // jisko reply bhejna hai
            subject: `Reply to your query: ${message.subject || "No Subject"}`,
            html: `
                <h2>Dear ${message.name},</h2>
                <p>We have received your message:</p>
                <blockquote>${message.message}</blockquote>
                <hr/>
                <p><strong>Our Reply:</strong></p>
                <p>${adminReply}</p>
                <br/>
                <p>Best regards,<br/>Support Team</p>
            `
        });

        res.status(200).json({
            success: true,
            message: "Reply sent successfully",
            data: message
        });
    } catch (error) {
        console.error('Error sending reply:', error);
        res.status(500).json({ error: 'Failed to send reply' });
    }
};

// Export messages to CSV
export const exportMessage = async (req, res) => {
    try {
        const messages = await Message.find().lean();
        const fields = [
            { label: "Name", value: "name" },
            { label: "Email", value: "email" },
            { label: "Subject", value: "subject" },
            { label: "Message", value: "message" },
            { label: "Resolved", value: "isResolved" },
            { label: "Created At", value: row => new Date(row.createdAt).toLocaleString("en-US") }
        ];

        const json2csvParser = new Parser({ fields });
        const csv = json2csvParser.parse(messages);

        res.header("Content-Type", "text/csv");
        res.attachment("contact_messages.csv");
        res.status(200).send(csv);
    } catch (error) {
        res.status(500).json({ error: "Message Export failed." });
    }
};