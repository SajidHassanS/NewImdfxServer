
const constant = require("../utils/constant"),
  generalService = require("../services/generalOperation");
const catchAsync = require("../utils/catchAsync");
const { autoIncrement } = require("../utils/commonFunctions");
const AppError = require("../utils/appError");
//const { createRedisClient } = require("../utils/redis");
const TableName = "Prescription";
const incrementalId = "countryId"; // id is auto incremented
const cacheKey = "countryNames";
let client;




const Prescription = catchAsync(async (req, res) => {
  try {
    // Extract form data from the request body
    const {
      userId,
      doc_id,
      name,
      quantity,
      days,
      morning,
      afternoon,
      evening,
      night,
      reporttitle,
      reportcagatory
    } = req.body;
    console.log("file", req.body);
    // Create a new Prescription instance with the received data
    const prescription = new Prescriptions({
      userId,
      doc_id,
      name,
      quantity,
      days,
      morning,
      afternoon,
      evening,
      night,
      image: req.file.filename,
      reporttitle,
      reportcagatory
    });

    // Save the prescription to the database
    await prescription.save();

    res.status(201).json('Prescription submitted successfully!');
  } catch (error) {
    console.error('Error submitting prescription:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
 })


 const get_prescriptions = catchAsync(async (req, res) => {
  try {
    const userId = req.params.userId;

    // Find all prescriptions for the given user
    const prescriptions = await Prescriptions.find({ userId });

    // If prescriptions are found, retrieve doctor details using doc_id
    const prescriptionsWithDetails = await Promise.all(
      prescriptions.map(async (prescription) => {
        // Fetch doctor details using doc_id
        // Replace 'YourDoctorModel' with the actual model for doctor details
        const doctorDetails = await doctordetails.findById(prescription.doc_id);

        return {
          // ...prescription._doc,
          ...prescription,
          doctorDetails,
        };
      })
    );

    res.status(200).json(prescriptionsWithDetails);
  } catch (error) {
    console.error('Error fetching prescriptions:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
 })


module.exports = {
 Prescription,
 get_prescriptions,
}