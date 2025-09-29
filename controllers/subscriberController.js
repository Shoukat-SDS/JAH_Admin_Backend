// backend/controllers/subscriberController.js
import Subscriber from "../models/Subscriber.js";
import { Parser } from "json2csv";

// Get all subscribers
export const getSubscribers = async (req, res) => {
    try {
        const subscribers = await Subscriber.find().sort({ subscribedAt: -1 });

        res.status(200).json({
            success: true,
            count: subscribers.length,
            data: subscribers
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        });
    }
};

// create new subscriber 
export const createSubscriber = async (req, res) => {
    try {
        const { email } = req.body;

        // Validation
        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Email is required"
            });
        }

        // Check if email already exists
        const existingSubscriber = await Subscriber.findOne({ email: email.toLowerCase() });
        if (existingSubscriber) {
            return res.status(400).json({
                success: false,
                message: "Email already subscribed"
            });
        }

        // Create subscriber
        const subscriber = await Subscriber.create({
            email: email.toLowerCase(),
            status: "active"
        });

        res.status(201).json({
            success: true,
            message: "Subscribed successfully",
            data: subscriber
        });
    } catch (error) {
        if (error.name === "ValidationError") {
            return res.status(400).json({
                success: false,
                message: "Please enter a valid email address"
            });
        }

        res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        });
    }
};

// Export subscribers to CSV
export const exportSubscribersCSV = async (req, res) => {
    try {
        const subscribers = await Subscriber.find({ status: "active" }).select("email subscribedAt status");

        const fields = [
            { label: "Email", value: "email" },
            { label: "Status", value: "status" },
            {
                label: "Subscribed Date",
                value: row => new Date(row.subscribedAt).toLocaleString("en-US")
            }
        ];

        const json2csvParser = new Parser({ fields });
        const csv = json2csvParser.parse(subscribers);

        res.setHeader("Content-Type", "text/csv");
        res.setHeader("Content-Disposition", "attachment; filename=subscribers.csv");

        res.status(200).send(csv);
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error exporting CSV",
            error: error.message
        });
    }
};

// Ban subscriber
export const banSubscriber = async (req, res) => {
    try {
        const subscriber = await Subscriber.findById(req.params.id);

        if (!subscriber) {
            return res.status(404).json({
                success: false,
                message: "Subscriber not found"
            });
        }

        subscriber.status = subscriber.status === "active" ? "banned" : "active";
        await subscriber.save();

        res.status(200).json({
            success: true,
            message: `Subscriber ${subscriber.status === "banned" ? "banned" : "unbanned"} successfully`,
            data: subscriber
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        });
    }
};

// Delete subscriber
export const deleteSubscriber = async (req, res) => {
    try {
        const subscriber = await Subscriber.findById(req.params.id);

        if (!subscriber) {
            return res.status(404).json({
                success: false,
                message: "Subscriber not found"
            });
        }

        await Subscriber.findByIdAndDelete(req.params.id);

        res.status(200).json({
            success: true,
            message: "Subscriber deleted successfully"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        });
    }
};