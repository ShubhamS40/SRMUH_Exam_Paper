const express = require("express");
const app = express();
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const cors = require("cors");
const uploadPaperRoutes = require("./route/upload_paper");
const userDeatil = require("./route/auth");

app.use(express.json());
app.use(cors());


app.use("/api", userDeatil ); 
app.use("/api", uploadPaperRoutes); 


// ✅ Get all BTech and Law data (for debugging)
app.get("/", async (req, res) => {
  try {
    const bTechData = await prisma.btech.findMany();
    const lawData = await prisma.law.findMany();
    res.json({ BTech: bTechData, Law: lawData });
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Failed to fetch data" });
  }
});

// ✅ Get unique specializations dynamically
app.get("/:branch/specializations", async (req, res) => {
  try {
    const { branch } = req.params;
    if (!["btech", "law","bca","bcom"].includes(branch.toLowerCase())) {
      return res.status(400).json({ error: "Invalid branch" });
    }

    const specializations = await prisma[branch].findMany({
      select: { specialization: true },
      distinct: ["specialization"],
    });

    res.json(specializations.map((s) => s.specialization));
  } catch (error) {
    console.error("Error fetching specializations:", error);
    res.status(500).json({ error: "Failed to fetch specializations" });
  }
});

// ✅ Get unique years for a branch & specialization
app.get("/:branch/:specialization/years", async (req, res) => {
  try {
    const { branch, specialization } = req.params;

    if (!["btech", "law","bca","bcom"].includes(branch.toLowerCase())) {
      return res.status(400).json({ error: "Invalid branch" });
    }

    const years = await prisma[branch].findMany({
      where: { specialization },
      select: { year: true },
      distinct: ["year"],
    });

    res.json(years.map((y) => y.year));
  } catch (error) {
    console.error("Error fetching years:", error);
    res.status(500).json({ error: "Failed to fetch years" });
  }
});

// ✅ Get unique semesters based on branch, specialization, and year
app.get("/:branch/:specialization/:year/semesters", async (req, res) => {
  try {
    const { branch, specialization, year } = req.params;

    if (!["btech", "law","bca","bcom"].includes(branch.toLowerCase())) {
      return res.status(400).json({ error: "Invalid branch" });
    }

    const semesters = await prisma[branch].findMany({
      where: { specialization, year },
      select: { semester: true },
      distinct: ["semester"],
    });

    res.json(semesters.map((s) => s.semester));
  } catch (error) {
    console.error("Error fetching semesters:", error);
    res.status(500).json({ error: "Failed to fetch semesters" });
  }
});

// ✅ Get unique subjects based on branch, specialization, year, and semester
app.get("/:branch/:specialization/:year/:semester/subjects", async (req, res) => {
  try {
    const { branch, specialization, year, semester } = req.params;

    if (!["btech", "law","bca","bcom"].includes(branch.toLowerCase())) {
      return res.status(400).json({ error: "Invalid branch" });
    }

    const subjects = await prisma[branch].findMany({
      where: { specialization, year, semester },
      select: { subject: true },
      distinct: ["subject"],
    });

    res.json(subjects.map((s) => s.subject));
  } catch (error) {
    console.error("Error fetching subjects:", error);
    res.status(500).json({ error: "Failed to fetch subjects" });
  }
});

// ✅ Get available paper types (hardcoded since they are fixed)
app.get("/paper-types", (req, res) => {
  res.json(["Mid-term", "End-term", "Practical"]);
});

app.post("/fetch-file", async (req, res) => {
  try {
    const { branch, specialization, year, semester, subject, examType } = req.body;
    const paperType=examType.toUpperCase().replace("-", "_")
    
    
    
    if (!branch || !specialization || !year || !semester || !subject || !examType) {
      return res.status(400).json({ error: "All fields are required" });
    }

    if (!["btech", "law","bca","bcom"].includes(branch.toLowerCase())) {
      return res.status(400).json({ error: "Invalid branch" });
    }
    
    // Query the correct table dynamically
    const result = await prisma[branch].findFirst({
      where: { specialization, year, semester, subject, examType:paperType },
      select: { fileUrl: true },
    });

     console.log("ok shubham",result);
     
    if (!result) {
      return res.status(404).json({ error: "File not found" });
    }
 
    res.json({ fileUrl: result.fileUrl });
  } catch (error) {
    console.error("Error fetching file:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});








// ✅ Start server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
