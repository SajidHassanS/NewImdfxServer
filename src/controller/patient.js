const constant = require("../utils/constant"),
  generalService = require("../services/generalOperation");
const catchAsync = require("../utils/catchAsync");
const { autoIncrement } = require("../utils/commonFunctions");
const AppError = require("../utils/appError");
//const { createRedisClient } = require("../utils/redis");
const TableName = "Patient";
const incrementalId = "countryId"; // id is auto incremented
const cacheKey = "countryNames";
let client;


 const update_patient_status = catchAsync(async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Find the patient by ID and update the status
    const patient = await User.findByIdAndUpdate(id, { status }, { new: true });

    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    // Return the updated patient
    res.status(200).json(patient);
  } catch (error) {
    console.error('Error updating patient status:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
 })

 const getpatient_profile = catchAsync(async (req, res) => {
  try {
    const userId = req.params.userId;
    const profile = await PatientProfile.find({ userId: userId });
    res.status(200).json(profile);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
 })

 const update_patient_profile = catchAsync(async (req, res) => {
  try {
    const userId = req.params.userId;
    const file = req.file;
    const {
      firstName,
      lastName,
      dateOfBirth,
      email,
      mobile,
      address,
      city,
      state,
      zipCode,
      country,
    } = req.body;
    // Find the user by ID
    const user = await User.findOne({ _id: userId });

    if (!user) {
      return res.status(200).json({ message: 'Patient Profile  is Not Found!' });
    }

    // Check if the user exists in the PatientProfile collection
    const patientProfile = await PatientProfile.findOne({ userId: userId });

    if (!patientProfile) {
      // If patient profile doesn't exist, create a new profile
      const newPatientProfile = new PatientProfile({
        image: file ? file.path : null,
        firstName: firstName,
        lastName: lastName,
        dateOfBirth: dateOfBirth,
        email: email,
        mobile: mobile,
        address: address,
        city: city,
        state: state,
        zipCode: zipCode,
        country: country,
        userId: userId,
      });

      // Save the data to the database
      await newPatientProfile.save();
      return res.status(200).json('Profile created successfully');
    } else {
      // If patient profile exists, update the profile
      await PatientProfile.findOneAndUpdate(
        { userId: userId },
        {
          image: file ? file.path : null,
          firstName: firstName,
          lastName: lastName,
          dateOfBirth: dateOfBirth,
          email: email,
          mobile: mobile,
          address: address,
          city: city,
          state: state,
          zipCode: zipCode,
          country: country,
        }
      );
      return res.status(200).json('Profile updated successfully');
    }
  } catch (error) {
    console.error('Error updating profile:', error);
    return res.status(500).json('Error updating profile');
  }
 })


 const mypatient = catchAsync(async (req, res) => {
  try {
    const docId = req.params.docId;
    console.log("docId", docId);
    // Fetch all appointments for the user
    const userAppointments = await ConformAppointment.find({ docId: docId });
    // console.log("userAppointments", userAppointments);
    if (!userAppointments || userAppointments.length === 0) {
      return res.status(404).json({ error: 'Appointments not found' });
    }

    // Prepare an array to store appointment details with doctor information
    const appointmentsWithPatient = [];

    // Iterate through each appointment
    for (const appointment of userAppointments) {
      // Fetch doctor details for each appointment
      const PatietnDetails = await User.findById(appointment.userId);
      const docId = appointment.docId
      const userId = appointment.userId
      const appointmentDetail = await BookingAppointmentDetail.find({ doc_id: docId, userId: userId });

      // Create an object with appointment and doctor details
      const appointmentWithPatient = {
        appointmentDetails: appointmentDetail,
        PatietnDetails: PatietnDetails,
      };

      // Add the object to the array
      appointmentsWithPatient.push(appointmentWithPatient);
    }

    res.status(200).json(appointmentsWithPatient);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
 })

 const getpatient = catchAsync(async (req, res) => {
  try {
    const patientdetail = await User.find();
    res.status(200).json(patientdetail);
  } catch (error) {
    res.send(error);
  }
 })

 const getpatient_id = catchAsync(async (req, res) => {
  try {
    const id = req.params.id;

    // Find the doctor details based on the ID
    const patientdetail = await User.findOne({ _id: id });

    if (!patientdetail) {
      return res.status(404).json({ error: 'patient not found' });
    }

    // Send the doctor details as a JSON response
    res.status(200).json(patientdetail);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error retrieving patient details', details: error.message });
  }
 })



 module.exports = {

  update_patient_status,
  getpatient_profile,
  update_patient_profile,
  mypatient,
  getpatient,
  getpatient_id
 }





