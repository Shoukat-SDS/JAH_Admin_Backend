// models/DonationItem.js
import mongoose from "mongoose"

const donationSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    amount: { type: Number, required: true },
    image: { type: String, }
});

export default mongoose.model("DonationItem", donationSchema);