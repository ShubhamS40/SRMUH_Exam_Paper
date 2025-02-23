import { useState } from "react";
import axios from "axios";

function UploadPaper() {
  const [branches] = useState(["btech", "law", "bca", "bcom"]);
  const [specializations, setSpecializations] = useState([]);
  const [years] = useState(["YEAR_2023", "YEAR_2024", "YEAR_2025"]);
  const [semesters] = useState(["SEM_1", "SEM_2", "SEM_3", "SEM_4", "SEM_5", "SEM_6"]);
  const [examTypes] = useState(["END_TERM", "MAST_1", "MAST_2"]);

  const [selectedBranch, setSelectedBranch] = useState("");
  const [selectedSpecialization, setSelectedSpecialization] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedExamType, setSelectedExamType] = useState("");
  const [file, setFile] = useState(null);

  const specializationOptions = {
    btech: ["CORE", "AIML", "DEVOPS"],
    law: ["BA_LLB", "BBA_LLB", "LLB"],
    bca: ["CORE"],
    bcom: ["HONS", "CORE"],
  };

  const handleBranchChange = (e) => {
    const branch = e.target.value;
    setSelectedBranch(branch);
    setSpecializations(specializationOptions[branch] || []);
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      alert("Please select a file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("branch", selectedBranch);
    formData.append("specialization", selectedSpecialization);
    formData.append("year", selectedYear);
    formData.append("semester", selectedSemester);
    formData.append("subject", selectedSubject);
    formData.append("examType", selectedExamType);
    formData.append("file", file);

    try {
      const res = await axios.post("http://localhost:3000/api/upload-paper", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Paper uploaded successfully!");
    } catch (error) {
      console.error("Error uploading paper:", error);
      alert("Failed to upload paper.");
    }
  };

  return (
    <div className="container">
      <h2>Upload Paper</h2>
      <form onSubmit={handleSubmit}>
        <label>Select Branch</label>
        <select value={selectedBranch} onChange={handleBranchChange}>
          <option value="">Select Branch</option>
          {branches.map((branch, index) => (
            <option key={index} value={branch}>{branch}</option>
          ))}
        </select>

        {selectedBranch && (
          <>
            <label>Select Specialization</label>
            <select value={selectedSpecialization} onChange={(e) => setSelectedSpecialization(e.target.value)}>
              <option value="">Select Specialization</option>
              {specializations.map((spec, index) => (
                <option key={index} value={spec}>{spec}</option>
              ))}
            </select>

            <label>Select Year</label>
            <select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)}>
              <option value="">Select Year</option>
              {years.map((year, index) => (
                <option key={index} value={year}>{year}</option>
              ))}
            </select>

            <label>Select Semester</label>
            <select value={selectedSemester} onChange={(e) => setSelectedSemester(e.target.value)}>
              <option value="">Select Semester</option>
              {semesters.map((sem, index) => (
                <option key={index} value={sem}>{sem}</option>
              ))}
            </select>

            <label>Enter Subject</label>
            <input type="text" value={selectedSubject} onChange={(e) => setSelectedSubject(e.target.value)} />

            <label>Select Exam Type</label>
            <select value={selectedExamType} onChange={(e) => setSelectedExamType(e.target.value)}>
              <option value="">Select Exam Type</option>
              {examTypes.map((exam, index) => (
                <option key={index} value={exam}>{exam}</option>
              ))}
            </select>

            <label>Upload File</label>
            <input type="file" onChange={handleFileChange} />

            <button type="submit">Upload Paper</button>
          </>
        )}
      </form>
    </div>
  );
}

export default UploadPaper;
