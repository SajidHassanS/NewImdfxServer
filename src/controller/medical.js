
const constant = require("../utils/constant"),
  generalService = require("../services/generalOperation");
const catchAsync = require("../utils/catchAsync");
const { autoIncrement } = require("../utils/commonFunctions");
const AppError = require("../utils/appError");
//const { createRedisClient } = require("../utils/redis");
const TableName = "Medical";
const incrementalId = "countryId"; // id is auto incremented
const cacheKey = "countryNames";
let client;


const getmedicalreport = catchAsync(async (req, res) => {
  try {
    const userId = req.params.userId;
    
    // Find medical reports for the specified user ID
    const medicalReports = await MedicalReport.find({ userId: userId });

    if (!medicalReports || medicalReports.length === 0) {
      return res.status(404).json({ message: 'Medical reports not found for this user' });
    }

    // If medical reports found, return them
    res.status(200).json({ success: true, data: medicalReports });
  } catch (error) {
    console.error('Error fetching medical reports:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
})


const medicalreport = catchAsync(async (req, res) => {
  try {
    uploadSingle.single('image')(req, res, async function (err) {
      if (err instanceof multer.MulterError) {
        // A Multer error occurred when uploading.
        console.log(err)

        return res.status(400).json({ message: err.message, success: false });
      } else if (err) {
        console.log(err)

        // An unknown error occurred when uploading.
        return res.status(500).json({ message: err.message, success: false });
      }
      const { userId } = req.params;
      console.log("reQ", req.body);
      const medicalReport = new MedicalReport({
        userId,
        BloodReport: req.files['BloodReport'] ? req.files['BloodReport'][0].path : null,
        STscan: req.files['STscan'] ? req.files['STscan'][0].path : null,
        MRI: req.files['MRI'] ? req.files['MRI'][0].path : null
      });

      await medicalReport.save();

      res.status(201).json({ message: 'Medical report saved successfully' });



    });
    // const { userId } = req.body;

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
})


const deletemedicaldetails = catchAsync(async (req, res) => {
  const userId = req.params.userId;
  console.log("click");
  try {
    // Find and delete the medical record for the specified user
    const result = await MedicalRecords.findOneAndDelete({ userId: userId });

    if (result) {
      res.status(200).json("MedicalRecords deleted successfully!");
    } else {
      res.status(404).json("MedicalRecords not found for the specified user.");
    }
  } catch (error) {
    console.error("Error deleting medical record:", error);
    res.status(500).json("Internal Server Error");
  }
})


const updatemedicaldetails = catchAsync(async (req, res) => {
  const userId = req.params.userId;
    try {
      const {
        bmi,
        hr,
        Weight,
        Fbc,
        dob
      } = req.body;
  
      // Find the existing medical record for the user
      const existingRecord = await MedicalRecords.findOne({ userId: userId });
  
      if (!existingRecord) {
        return res.status(404).json("Medical record not found for the user");
      }
  
      // Update the medical record with the new data
      existingRecord.bmi = bmi;
      existingRecord.hr = hr;
      existingRecord.Weight = Weight;
      existingRecord.Fbc = Fbc;
      existingRecord.dob = dob;
  
      // Save the updated record
      await existingRecord.save();
  
      res.status(200).json("MedicalRecords updated successfully!");
    } catch (error) {
      console.error("Error updating medical record:", error);
      res.status(500).json("Internal Server Error");
    }
})


const getmedicaldetails_id = catchAsync(async (req, res) => {
  try {
    const userId = req.params.userId;
    const MedicalRecord = await MedicalRecords.find({ userId: userId });
    res.status(200).json(MedicalRecord);
  } catch (error) {
    res.send(error);
  }
})


const medicaldetails_id = catchAsync(async (req, res) => {
  const userId = req.params.userId;
  try {
    const {
      bmi,
      hr,
      Weight,
      Fbc,
      dob
    } = req.body;

    // Create a new doctordetails instance with the received data
    const MedicalRecord = new MedicalRecords({
      userId: userId,
      bmi: bmi,
      hr: hr,
      Weight: Weight,
      Fbc: Fbc,
      dob: dob

    });


    await MedicalRecord.save();
    res.status(201).json("MedicalRecords submitted successfully!");
  } catch (error) {
    console.error("Error submitting form data:", error);
    res.status(500).json("Internal Server Error");
  }
})



module.exports = {

  medicaldetails_id,
  getmedicaldetails_id,
  updatemedicaldetails,
  deletemedicaldetails,
  medicalreport,
  getmedicalreport
}