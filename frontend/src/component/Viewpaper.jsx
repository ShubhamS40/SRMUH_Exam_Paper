import { useState, useEffect } from "react";
import axios from "axios";

function ViewPaper() {
  const [branches] = useState(["btech", "law","bca","bcom"]);
  const [specializations, setSpecializations] = useState([]);
  const [years, setYears] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [paperTypes, setPaperTypes] = useState(["Mst-2", "End-term", "Mst-1"]);
  const [fileUrl, setFileUrl] = useState(null);

  const [selectedBranch, setSelectedBranch] = useState("");
  const [selectedSpecialization, setSelectedSpecialization] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedPaperType, setSelectedPaperType] = useState("");

  useEffect(() => {
    if (selectedBranch) fetchSpecializations(selectedBranch);
  }, [selectedBranch]);

  useEffect(() => {
    if (selectedSpecialization) fetchYears(selectedBranch, selectedSpecialization);
  }, [selectedSpecialization]);

  useEffect(() => {
    if (selectedYear) fetchSemesters(selectedBranch, selectedSpecialization, selectedYear);
  }, [selectedYear]);

  useEffect(() => {
    if (selectedSemester) fetchSubjects(selectedBranch, selectedSpecialization, selectedYear, selectedSemester);
  }, [selectedSemester]);

  const fetchSpecializations = async (branch) => {
    try {
      const res = await axios.get(`http://localhost:3000/${branch}/specializations`);
      setSpecializations(res.data);
      setSelectedSpecialization("");
    } catch (error) {
      console.error("Error fetching specializations:", error);
    }
  };

  const fetchYears = async (branch, specialization) => {
    try {
      const res = await axios.get(`http://localhost:3000/${branch}/${specialization}/years`);
      setYears(res.data);
      setSelectedYear("");
    } catch (error) {
      console.error("Error fetching years:", error);
    }
  };

  const fetchSemesters = async (branch, specialization, year) => {
    try {
      const res = await axios.get(`http://localhost:3000/${branch}/${specialization}/${year}/semesters`);
      setSemesters(res.data);
      setSelectedSemester("");
    } catch (error) {
      console.error("Error fetching semesters:", error);
    }
  };

  const fetchSubjects = async (branch, specialization, year, semester) => {
    try {
      const res = await axios.get(`http://localhost:3000/${branch}/${specialization}/${year}/${semester}/subjects`);
      setSubjects(res.data);
      setSelectedSubject("");
    } catch (error) {
      console.error("Error fetching subjects:", error);
    }
  };

  const fetchFileUrl = async () => {
    if (!selectedPaperType) {
      alert("Please select an exam type!");
      return;
    }

    try {
      const res = await axios.post("http://localhost:3000/fetch-file", {
        branch: selectedBranch,
        specialization: selectedSpecialization,
        year: selectedYear,
        semester: selectedSemester,
        subject: selectedSubject,
        examType: selectedPaperType,
      });

      setFileUrl(res.data.fileUrl);
      console.log(res);
      
    } catch (error) {
      console.error("Error fetching file:", error);
      alert("File not found!");
    }
  };

  return (
    <div className="container">
      <h2>SRM UNIVERSITY</h2>
      
      <label>Select Branch</label>
      <select value={selectedBranch} onChange={(e) => setSelectedBranch(e.target.value)}>
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
        </>
      )}

      {selectedSpecialization && (
        <>
          <label>Select Year</label>
          <select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)}>
            <option value="">Select Year</option>
            {years.map((year, index) => (
              <option key={index} value={year}>{year}</option>
            ))}
          </select>
        </>
      )}

      {selectedYear && (
        <>
          <label>Select Semester</label>
          <select value={selectedSemester} onChange={(e) => setSelectedSemester(e.target.value)}>
            <option value="">Select Semester</option>
            {semesters.map((sem, index) => (
              <option key={index} value={sem}>{sem}</option>
            ))}
          </select>
        </>
      )}

      {selectedSemester && (
        <>
          <label>Select Subject</label>
          <select value={selectedSubject} onChange={(e) => setSelectedSubject(e.target.value)}>
            <option value="">Select Subject</option>
            {subjects.map((subject, index) => (
              <option key={index} value={subject}>{subject}</option>
            ))}
          </select>
        </>
      )}

      {selectedSubject && (
        <>
          <label>Select Exam Type</label>
          <select value={selectedPaperType} onChange={(e) => setSelectedPaperType(e.target.value)}>
            <option value="">Select Exam Type</option>
            {paperTypes.map((type, index) => (
              <option key={index} value={type}>{type}</option>
            ))}
          </select>
        </>
      )}

      {selectedPaperType && (
        <button onClick={fetchFileUrl}>Fetch File</button>
      )}

      {fileUrl && (
        <div>
          <h3>File URL:</h3>
          <a href={fileUrl} target="_blank" rel="noopener noreferrer">{fileUrl}</a>
        </div>
      )}
    </div>
  );
}

export default ViewPaper;
