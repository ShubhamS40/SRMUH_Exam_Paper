import React, { useState, useEffect } from "react";

const CreatePaper = () => {
  const [formData, setFormData] = useState({
    branchName: "",
    specializationName: "",
    semesterYear: "",
    semesterNumber: "",
    subjectName: "",
    examType: "",
    paperTitle: "",
    paperYear: "",
  });
  const [file, setFile] = useState(null); // For storing the file
  const [branchName, setBranchName] = useState([]);
  const [specializationName, setSpecializationName] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Fetch branches and specializations on component mount
  useEffect(() => {
    const getBranch = async () => {
      try {
        const response = await fetch("http://localhost:3000/get-branch", {
          method: "GET",
        });
        const result = await response.json();
        setBranchName(result);
      } catch (error) {
        console.error("Error fetching branches:", error);
      }
    };

    const getSpecialization = async () => {
      try {
        const response = await fetch("http://localhost:3000/get-specialization", {
          method: "GET",
        });
        const result = await response.json();
        setSpecializationName(result);
      } catch (error) {
        console.error("Error fetching specializations:", error);
      }
    };

    getBranch();
    getSpecialization();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]); // Store the file in state
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      setErrorMessage("Please upload a file.");
      return;
    }

    const formDataWithFile = new FormData();
    formDataWithFile.append("file", file); // Attach file
    Object.entries(formData).forEach(([key, value]) => {
      formDataWithFile.append(key, value);
    });

    try {
      const response = await fetch("http://localhost:3000/api/create-paper", {
        method: "POST",
        body: formDataWithFile,
      });

      if (response.ok) {
        setSuccessMessage("Paper created successfully!");
        setErrorMessage("");
        setFormData({
          branchName: "",
          specializationName: "",
          semesterYear: "",
          semesterNumber: "",
          subjectName: "",
          examType: "",
          paperTitle: "",
          paperYear: "",
        });
        setFile(null);
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.message || "Failed to create paper. Please try again.");
        setSuccessMessage("");
      }
    } catch (error) {
      console.error("Error creating paper:", error);
      setErrorMessage("Failed to create paper. Please try again.");
      setSuccessMessage("");
    }
  };

  return (
    <div
      style={{
        maxWidth: "600px",
        margin: "50px auto",
        padding: "20px",
        border: "1px solid #ccc",
        borderRadius: "10px",
      }}
    >
      <h2>Create Paper</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Branch Name:</label>
          <select
            name="branchName"
            value={formData.branchName}
            onChange={handleChange}
            required
            style={{
              display: "block",
              width: "100%",
              margin: "10px 0",
              padding: "10px",
            }}
          >
            <option value="">Select a branch</option>
            {branchName.map((branch) => (
              <option key={branch.id} value={branch.name}>
                {branch.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>Specialization Name:</label>
          <select
            name="specializationName"
            value={formData.specializationName}
            onChange={handleChange}
            required
            style={{
              display: "block",
              width: "100%",
              margin: "10px 0",
              padding: "10px",
            }}
          >
            <option value="">Select a specialization</option>
            {specializationName.map((specialization) => (
              <option key={specialization.id} value={specialization.name}>
                {specialization.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>Semester Year:</label>
          <input
            type="number"
            name="semesterYear"
            value={formData.semesterYear}
            onChange={handleChange}
            placeholder="Enter semester year"
            required
            style={{
              display: "block",
              width: "100%",
              margin: "10px 0",
              padding: "10px",
            }}
          />
        </div>
        <div>
          <label>Semester Number:</label>
          <input
            type="number"
            name="semesterNumber"
            value={formData.semesterNumber}
            onChange={handleChange}
            placeholder="Enter semester number"
            required
            style={{
              display: "block",
              width: "100%",
              margin: "10px 0",
              padding: "10px",
            }}
          />
        </div>
        <div>
          <label>Subject Name:</label>
          <input
            type="text"
            name="subjectName"
            value={formData.subjectName}
            onChange={handleChange}
            placeholder="Enter subject name"
            required
            style={{
              display: "block",
              width: "100%",
              margin: "10px 0",
              padding: "10px",
            }}
          />
        </div>
        <div>
          <label>Exam Type:</label>
          <select
            name="examType"
            value={formData.examType}
            onChange={handleChange}
            style={{
              display: "block",
              width: "100%",
              margin: "10px 0",
              padding: "10px",
            }}
          >
            <option value="">Select Paper-Type</option>
            <option value="Mst-1">Mst-1</option>
            <option value="Mst-2">Mst-2</option>
            <option value="End-term">End-term</option>
          </select>
        </div>
        <div>
          <label>Paper Title:</label>
          <input
            type="text"
            name="paperTitle"
            value={formData.paperTitle}
            onChange={handleChange}
            placeholder="Enter paper title"
            required
            style={{
              display: "block",
              width: "100%",
              margin: "10px 0",
              padding: "10px",
            }}
          />
        </div>
        <div>
          <label>Paper Year:</label>
          <input
            type="number"
            name="paperYear"
            value={formData.paperYear}
            onChange={handleChange}
            placeholder="Enter paper year"
            required
            style={{
              display: "block",
              width: "100%",
              margin: "10px 0",
              padding: "10px",
            }}
          />
        </div>
        <div>
          <label>Choose File:</label>
          <input
            type="file"
            name="file"
            onChange={handleFileChange}
            required
            style={{
              display: "block",
              width: "100%",
              margin: "10px 0",
              padding: "10px",
            }}
          />
        </div>
        <button
          type="submit"
          style={{
            padding: "10px 20px",
            backgroundColor: "blue",
            color: "white",
            border: "none",
            borderRadius: "5px",
          }}
        >
          Submit
        </button>
      </form>
      {successMessage && (
        <p style={{ color: "green", marginTop: "20px" }}>{successMessage}</p>
      )}
      {errorMessage && (
        <p style={{ color: "red", marginTop: "20px" }}>{errorMessage}</p>
      )}
    </div>
  );
};

export default CreatePaper;
