const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(express.json());

// JSON DB path
const dbPath = path.join(__dirname, "data", "patients.json");

// Test route
app.get("/", (req, res) => {
  res.send("Server is running");
});

// ✅ GET all patients
app.get("/patients", (req, res) => {
  const data = fs.readFileSync(dbPath, "utf-8");
  res.json(JSON.parse(data));
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
// ✅ POST - add new patient
app.post("/patients", (req, res) => {
  const newPatient = req.body;

  // Read existing data
  const data = fs.readFileSync(dbPath, "utf-8");
  const patients = JSON.parse(data);

  // Add ID
  newPatient.id = Date.now();

  // Push new patient
  patients.push(newPatient);

  // Write back to JSON file
  fs.writeFileSync(dbPath, JSON.stringify(patients, null, 2));

  res.status(201).json({
    message: "Patient added successfully",
    patient: newPatient
  });
});
// ✅ PUT - update patient by ID
app.put("/patients/:id", (req, res) => {
  const patientId = req.params.id;
  const updatedFields = req.body;

  // Read existing data
  const data = fs.readFileSync(dbPath, "utf-8");
  const patients = JSON.parse(data);

  // Find patient index
  const index = patients.findIndex(p => p.id == patientId);

  if (index === -1) {
    return res.status(404).json({ message: "Patient not found" });
  }

  // Update patient
  patients[index] = {
    ...patients[index],
    ...updatedFields
  };

  // Save back to JSON file
  fs.writeFileSync(dbPath, JSON.stringify(patients, null, 2));

  res.json({
    message: "Patient updated successfully",
    patient: patients[index]
  });
});
// ✅ DELETE - remove patient by ID
app.delete("/patients/:id", (req, res) => {
  const patientId = req.params.id;

  // Read existing data
  const data = fs.readFileSync(dbPath, "utf-8");
  let patients = JSON.parse(data);

  // Check if patient exists
  const patientExists = patients.some(p => p.id == patientId);

  if (!patientExists) {
    return res.status(404).json({ message: "Patient not found" });
  }

  // Remove patient
  patients = patients.filter(p => p.id != patientId);

  // Write back to JSON file
  fs.writeFileSync(dbPath, JSON.stringify(patients, null, 2));

  res.json({ message: "Patient deleted successfully" });
});
