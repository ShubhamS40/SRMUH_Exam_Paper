const express = require("express");
const multer = require("multer");
const supabase = require("../supabase.js"); // Import Supabase
const router = express.Router();

const upload = multer({ storage: multer.memoryStorage() }); // Using memory storage
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();



// Upload Paper Route
router.post("/upload-paper", upload.single("file"), async (req, res) => {
  try {
    const { branch, specialization, year, semester, subject, examType } = req.body;

    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // Generate a unique file name
    const fileName = `${Date.now()}-${req.file.originalname}`;

    // Upload file to Supabase Storage
    const { data, error } = await supabase.storage
  .from("srmpyq_paper")
  .upload(`papers/${req.file.originalname}`, req.file.buffer, {
    cacheControl: "3600",
    upsert: false,
  });

if (error) {
  console.error("Error uploading to Supabase:", error);
  return res.status(500).json({ error: "Upload failed" });
}

// Get the public URL
const { data: publicData } = supabase.storage.from("srmpyq_paper").getPublicUrl(`papers/${req.file.originalname}`);

const publicUrl = publicData?.publicUrl; // This must not be undefined
console.log("Final Public URL:", publicUrl);


    let newPaper;

    if (branch === "btech") {
      newPaper = await prisma.btech.create({
        data: { specialization, subject, year, semester, examType, fileUrl: publicUrl },
      });
    } else if (branch === "law") {
      newPaper = await prisma.law.create({
        data: { specialization, subject, year, semester, examType, fileUrl: publicUrl },
      });
    } else if (branch === "bca") {
      newPaper = await prisma.bca.create({
        data: { specialization, subject, year, semester, examType, fileUrl: publicUrl },
      });
    } else if (branch === "bcom") {
      newPaper = await prisma.bcom.create({
        data: { specialization, subject, year, semester, examType, fileUrl: publicUrl },
      });
    } else {
      return res.status(400).json({ error: "Invalid branch" });
    }

    res.json({ message: "Paper uploaded successfully", paper: newPaper });
  } catch (error) {
   
    
    console.error("Error uploading paper:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
