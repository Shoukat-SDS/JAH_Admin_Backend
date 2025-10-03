// backend/controllers/donationPaymentController.js
import DonationPayment from "../models/DonationPayment.js";
import path from "path";
import { Parser } from "json2csv";
import ExcelJS from "exceljs";

// 📌 Add Donation (with invoice upload)
export const createDonation = async (req, res) => {
    try {
        const { donorName, email, amount, purpose, donationType } = req.body;

        const donation = new DonationPayment({
            donorName: donorName || "Guest",
            email,
            amount,
            purpose,
            donationType,
            invoice: req.file ? req.file.filename : null,
        });

        await donation.save();
        res.status(201).json({ message: "Donation submitted successfully", donation });
    } catch (error) {
        res.status(500).json({ message: "Error submitting donation", error: error.message });
    }
};

// 📌 Get all donations
export const getDonations = async (req, res) => {
    try {
        const donations = await DonationPayment.find().sort({ createdAt: -1 });
        res.json(donations);
    } catch (error) {
        res.status(500).json({ message: "Error fetching donations", error: error.message });
    }
};

// 📌 Verify donation (admin only)
export const verifyDonation = async (req, res) => {
    try {
        const donation = await DonationPayment.findById(req.params.id);
        if (!donation) return res.status(404).json({ message: "Donation not found" });

        donation.paymentStatus = "Verified";
        await donation.save();

        res.json({ message: "Donation verified", donation });
    } catch (error) {
        res.status(500).json({ message: "Error verifying donation", error: error.message });
    }
};

// 📌 Delete donation
export const deleteDonation = async (req, res) => {
    try {
        await DonationPayment.findByIdAndDelete(req.params.id);
        res.json({ message: "Donation deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting donation", error: error.message });
    }
};

// 📌 Export Donations as CSV
export const exportDonationsCSV = async (req, res) => {
    try {
        const donations = await DonationPayment.find().lean();

        if (!donations || donations.length === 0) {
            return res.status(404).json({ message: "No donations found" });
        }

        const fields = [
            "donorName",
            "email",
            "amount",
            "purpose",
            "donationType",
            "paymentMethod",
            "paymentStatus",
            "date"
        ];
        const parser = new Parser({ fields });
        const csv = parser.parse(donations);

        res.header("Content-Type", "text/csv");
        res.attachment("donations.csv");
        return res.send(csv);
    } catch (error) {
        res.status(500).json({ message: "Error exporting donations to CSV", error: error.message });
    }
};

// 📌 Export Donations as Excel
export const exportDonationsExcel = async (req, res) => {
    try {
        const donations = await DonationPayment.find().lean();

        if (!donations || donations.length === 0) {
            return res.status(404).json({ message: "No donations found" });
        }

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("Donations");

        worksheet.columns = [
            { header: "Donor Name", key: "donorName", width: 20 },
            { header: "Email", key: "email", width: 30 },
            { header: "Amount", key: "amount", width: 15 },
            { header: "Purpose", key: "purpose", width: 20 },
            { header: "Donation Type", key: "donationType", width: 20 },
            { header: "Payment Method", key: "paymentMethod", width: 20 },
            { header: "Payment Status", key: "paymentStatus", width: 15 },
            { header: "Date", key: "date", width: 20 }
        ];

        donations.forEach((donation) => {
            worksheet.addRow({
                donorName: donation.donorName,
                email: donation.email,
                amount: donation.amount,
                purpose: donation.purpose,
                donationType: donation.donationType,
                paymentMethod: donation.paymentMethod,
                paymentStatus: donation.paymentStatus,
                date: donation.date,
            });
        });

        res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );
        res.setHeader("Content-Disposition", "attachment; filename=donations.xlsx");

        await workbook.xlsx.write(res);
        res.end();
    } catch (error) {
        res.status(500).json({ message: "Error exporting donations to Excel", error: error.message });
    }
};