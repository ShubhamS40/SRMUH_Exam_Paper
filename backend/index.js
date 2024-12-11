const express = require("express");
const bodyParser = require("body-parser");
const { PrismaClient } = require("@prisma/client");
const cors = require("cors");
const multer = require("multer");
const { createClient } = require("@supabase/supabase-js");
const dotenv = require("dotenv");
const serverless = require("serverless-http");

dotenv.config(); // Load environment variables

const app = express();
app.use(cors());
app.use(bodyParser.json());

const prisma = new PrismaClient(); // Instantiate Prisma Client

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

// API to create a paper
app.post("/api/create-paper", upload.single("file"), async (req, res) => {
  const {
    branchName,
    specializationName,
    semesterYear,
    semesterNumber,
    subjectName,
    examType,
    paperTitle,
    paperYear,
  } = req.body;

  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded." });
    }

    // Upload file to Supabase storage
    const fileName = `${Date.now()}-${req.file.originalname}`;
    const { data, error } = await supabase.storage
      .from("ExamPaper") // Replace with your Supabase bucket name
      .upload(fileName, req.file.buffer, {
        contentType: req.file.mimetype,
      });

    if (error) {
      console.error("Supabase upload error:", error);
      return res.status(500).json({ message: "Error uploading file to storage." });
    }

    // Get the public URL for the file
    const { data: publicUrlData, error: publicUrlError } = supabase.storage
    .from("ExamPaper")
    .getPublicUrl(fileName);
  
  if (publicUrlError) {
    console.error("Supabase public URL error:", publicUrlError);
    return res.status(500).json({ message: "Error fetching file URL." });
  }
  
  const fileUrl = publicUrlData.publicUrl;
    // Prisma operations to save data
    let branch = await prisma.branch.findUnique({
      where: { name: branchName },
    });

    if (!branch) {
      branch = await prisma.branch.create({
        data: { name: branchName },
      });
    }

    let specialization = await prisma.specialization.findUnique({
      where: { name: specializationName },
    });

    if (!specialization) {
      specialization = await prisma.specialization.create({
        data: { name: specializationName },
      });
    }

    await prisma.branchSpecialization.upsert({
      where: {
        branchId_specializationId: {
          branchId: branch.id,
          specializationId: specialization.id,
        },
      },
      update: {},
      create: {
        branchId: branch.id,
        specializationId: specialization.id,
      },
    });

    let semester = await prisma.semester.findFirst({
      where: {
        year: parseInt(semesterYear),
        number: parseInt(semesterNumber),
        specializationId: specialization.id,
      },
    });

    if (!semester) {
      semester = await prisma.semester.create({
        data: {
          year: parseInt(semesterYear),
          number: parseInt(semesterNumber),
          specializationId: specialization.id,
        },
      });
    }

    let exam = await prisma.exam.findFirst({
      where: {
        semesterId: semester.id,
        type: examType,
      },
    });

    if (!exam) {
      exam = await prisma.exam.create({
        data: {
          type: examType,
          semesterId: semester.id,
        },
      });
    }

    let subject = await prisma.subject.findUnique({
      where: { name: subjectName },
    });

    if (!subject) {
      subject = await prisma.subject.create({
        data: {
          name: subjectName,
          examId: exam.id,
        },
      });
    }

    const paper = await prisma.paper.create({
      data: {
        title: paperTitle, // Use the title passed in `req.body`
        year: parseInt(paperYear), // Ensure `paperYear` is an integer
        subjectId: subject.id,
        specializationId: specialization.id,
        examType: examType,
        fileUrl: fileUrl,
      },
    });

    res.status(201).json({ message: "Paper created successfully!", paper });
  } catch (error) {
    console.error("Error creating paper:", error);
    res.status(500).json({ message: "Error creating paper data." });
  }
});

// Home route
app.get("/", (req, res) => {
  res.json({ name: "Shubham" });
});

// Fetch all branches
app.get("/get-branch", async (req, res) => {
  try {
    const branches = await prisma.branch.findMany();
    res.json(branches);
  } catch (error) {
    console.error("Error fetching branches:", error);
    res.status(500).json({ message: "Error fetching branches." });
  }
});

// Fetch specializations
app.get("/get-specialization", async (req, res) => {
  try {
    const specializations = await prisma.specialization.findMany();
    res.json(specializations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching specializations." });
  }
});


app.get("/get-year", async (req, res) => {
  try {
    const specializations = await prisma.semester.findMany();
     const year=  specializations.map((semester)=>semester.year)
    res.json({year:year});
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching specializations." });
  }
});


app.get("/get-semester", async (req, res) => {
  try {
    const specializations = await prisma.semester.findMany();
     const number=  specializations.map((semester)=>semester.number)
    res.json({number:number});
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching specializations." });
  }
});


app.get("/get-subject", async (req, res) => {
  try {
    const subject = await prisma.subject.findMany();
  
    res.json(subject);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching specializations." });
  }
});





app.get("/exam-type", async (req, res) => {
  try {
    const exam = await prisma.exam.findMany();
  
    res.json(exam);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching specializations." });
  }
});


// Fetch papers based on branch, specialization, semester, subject, and exam type
app.post("/api/paper", async (req, res) => {
  const { branchName, specializationName, semesterYear, semesterNumber, subjectName, examType } = req.body;

  try {
    // Query to fetch paper details based on the provided filters
    const paperDetails = await prisma.paper.findMany({
      where: {
        subject: {
          name: subjectName, // Filtering by subject name
          exam: {
            type: examType, // Filtering by exam type
            semester: {
              year: semesterYear, // Filtering by semester year
              number: semesterNumber, // Filtering by semester number
              specialization: {
                name: specializationName, // Filtering by specialization name
                branches: {
                  some: {
                    branch: {
                      name: branchName // Filtering by branch name using the BranchSpecialization relation
                    }
                  }
                }
              }
            }
          }
        }
      },
      include: {
        subject: {
          select: {
            name: true,
            exam: {
              select: {
                type: true,
                semester: {
                  select: {
                    year: true,
                    number: true,
                    specialization: {
                      select: {
                        name: true,
                        branches: {
                          select: {
                            branch: {
                              select: {
                                name: true
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    });

    if (paperDetails.length === 0) {
      return res.status(404).json({ message: "No papers found for the given criteria." });
    }

    res.json({ papers: paperDetails });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred while fetching the paper details." });
  }
});

// Start server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
