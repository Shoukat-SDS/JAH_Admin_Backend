// backend / controllers/donationController.js
import DonationItem from "../models/DonationItem.js";
import fs from 'fs'

export const addDonation = async (req, res) => {
    try {
        let image_filename = null;
        
        // Only set image filename if file exists
        if (req.file) {
            image_filename = req.file.filename;
        }

        const donation = new DonationItem({
            title: req.body.title,
            description: req.body.description,
            amount: req.body.amount ? JSON.parse(req.body.amount) : 0,
            image: image_filename
        });

        await donation.save();
        res.json({ success: true, message: "Donation Added" });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({ 
            success: false, 
            message: "Error adding donation",
            error: error.message 
        });
    }
}

// All Donations list
export const listDonations = async (req, res) => {
    try {
        const donations = await DonationItem.find({});
        res.json({ success: true, data: donations })
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" })
    }
}

// SINGLE DONATION
export const getDonation = async (req, res) => {
    try {
        const donation = await DonationItem.findById(req.body.id);
        res.json({ success: true, data: donation })
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" })
    }
}

// Update Donation Item
export const updateDonation = async (req, res) => {
    try {
        console.log('Received data:', req.body);
        
        const { id, title, description, amount } = req.body;

        // Check if fields exist (including empty strings)
        if (!id || id === 'undefined' || 
            !title || title === 'undefined' || 
            !description || description === 'undefined' || 
            !amount || amount === 'undefined') {
            
            console.log('Missing fields:', { id, title, description, amount });
            return res.status(400).json({ 
                success: false, 
                message: "All fields are required: id, title, description, amount" 
            });
        }

        let updateData = {
            title: title,
            description: description,
            amount: JSON.parse(amount)
        }

        if (req.file) {
            try {
                // Delete Old Image
                const oldDonation = await DonationItem.findById(id);
                if (oldDonation && oldDonation.image) {
                    fs.unlink(`uploads/${oldDonation.image}`, (err) => {
                        if (err) console.log('Error deleting old image:', err);
                    });
                }
                
                // Upload New Image
                updateData.image = req.file.filename;
            } catch (fileError) {
                console.log('File processing error:', fileError);
            }
        }

        const updatedDonation = await DonationItem.findByIdAndUpdate(
            id, 
            updateData, 
            { new: true } 
        );

        if (!updatedDonation) {
            return res.status(404).json({ 
                success: false, 
                message: "Donation not found" 
            });
        }

        res.json({ 
            success: true, 
            message: "Donation Updated Successfully",
            data: updatedDonation 
        });

    } catch (error) {
        console.log('Update error:', error);
        
        if (error.name === 'CastError') {
            return res.status(400).json({ 
                success: false, 
                message: "Invalid donation ID" 
            });
        }

        if (error.name === 'SyntaxError') {
            return res.status(400).json({ 
                success: false, 
                message: "Invalid amount format" 
            });
        }

        res.status(500).json({ 
            success: false, 
            message: "Error updating donation",
            error: error.message 
        });
    }
}

// remove donation item
export const removeDonation = async (req, res) => {
    try {
        const { id } = req.body;

        // Check if ID is provided
        if (!id) {
            return res.status(400).json({ 
                success: false, 
                message: "Donation ID is required" 
            });
        }

        // Find the donation first
        const donation = await DonationItem.findById(id);
        
        // Check if donation exists
        if (!donation) {
            return res.status(404).json({ 
                success: false, 
                message: "Donation not found" 
            });
        }

        // Delete the image file if it exists
        if (donation.image) {
            fs.unlink(`uploads/${donation.image}`, (err) => {
                if (err) {
                    console.log('Error deleting image file:', err);
                    // Don't return error here, continue with deletion
                } else {
                    console.log('Image file deleted successfully');
                }
            });
        }

        
        await DonationItem.findByIdAndDelete(id);
        
        res.json({ 
            success: true, 
            message: "Donation Removed Successfully" 
        });

    } catch (error) {
        console.log(error);
        
        // Handle invalid ID format
        if (error.name === 'CastError') {
            return res.status(400).json({ 
                success: false, 
                message: "Invalid donation ID format" 
            });
        }

        res.status(500).json({ 
            success: false,  
            message: "Error removing donation",
            error: error.message 
        });
    }
}