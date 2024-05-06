const constant = require("../utils/constant"),
  generalService = require("../services/generalOperation");
const catchAsync = require("../utils/catchAsync");
const { autoIncrement } = require("../utils/commonFunctions");
const AppError = require("../utils/appError");
//const { createRedisClient } = require("../utils/redis");
const TableName = "Office";
const incrementalId = "countryId"; // id is auto incremented
const cacheKey = "countryNames";
let client;


const office_accept_request = catchAsync(async (req, res) => {
  try {
    const { doc_id } = req.body;

    // Find accepted hospital requests for the specified doc_ids
    const acceptedRequests = await HospitalAcceptedRequests.find({ doc_id: { $in: doc_id } });

    // Check if there are no accepted requests
    if (acceptedRequests.length === 0) {
      return res.status(404).json({ message: 'No accepted requests found' });
    }

    // Retrieve office details for each accepted request
    const officeDetails = await Promise.all(
      acceptedRequests.map(async (request) => {
        console.log("Req", request);
        const officeDetail = await office.findOne({ _id: request.Hos_Id }).exec();
        if (!officeDetail) {
          // If office details not found for a request, return an error message
          return { message: `Office details not found for Hos_Id ${request.Hos_Id}` };
        }
        // Add doc_id to officeDetail
        // Add doc_id to officeDetail
        const officeDetailWithDocId = { ...officeDetail._doc, doc_id: request.doc_id };
        return officeDetailWithDocId;
        // return officeDetail;
        // return {
        //   ...prescription._doc,
        //   ...request,
        //   officeDetail,
        //   doc_id: request.doc_id,
        //   officeDetail,
        // };
      })
    );

    res.status(200).json(officeDetails);
  } catch (error) {
    console.error('Error retrieving office details:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
 })


 const office_accepte_request_id = catchAsync(async (req, res) => {
  try {
    const doc_id = req.params.doc_id;
    console.log("officeID", doc_id);
    // Find accepted hospital requests for the specified doc_id
    const acceptedRequests = await HospitalAcceptedRequests.find({ doc_id });
    // console.log("acceptedRequests",acceptedRequests);
    // Check if there are no accepted requests
    if (acceptedRequests.length === 0) {
      return res.status(404).json({ message: 'No accepted requests found' });
    }

    // Retrieve office details for each accepted request
    const officeDetails = await Promise.all(
      acceptedRequests.map(async (request) => {
        const officeDetail = await office.findOne({ _id: request.Hos_Id }).exec();
        // console.log("ofice",officeDetail);
        if (!officeDetail) {
          // If office details not found for a request, return an error message
          return { message: `Office details not found for Hos_Id ${request.Hos_Id}` };
        }
        return officeDetail;
      })
    );

    res.status(200).json(officeDetails);
  } catch (error) {
    console.error('Error retrieving office details:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
 })


 const cancel_doctor_request = catchAsync(async (req, res) => {
  try {
    const id = req.params.id;

    await HospitalRequests.deleteOne({ _id: id });

    res.status(200).json('Request Cancel successful');
  } catch (error) {
    res.status(500).json('Internal server Error');
  }
 })


 const office_accept_doctor_req = catchAsync(async (req, res) => {
  try {
    const Hos_Id = req.params.Hos_Id;
    const { DoctorRequestDetails } = req.body;

    // Step 1: Delete from BookingAppointment
    await HospitalRequests.deleteOne({ _id: DoctorRequestDetails._id });

    // Step 2: Save to ConformAppointment
    const doc_id = DoctorRequestDetails.doc_id;
    const nenRequest = new HospitalAcceptedRequests({ doc_id, Hos_Id });
    await nenRequest.save();
    const userId = DoctorRequestDetails.doc_id;
    // Step 3: Save to Notification
    const message = 'Your Request has been confirmed.';
    const newNotification = new Notification({ userId, message });
    await newNotification.save();

    res.status(200).json('Request Accepted successfully');
  } catch (error) {
    console.error(error);
    res.status(500).json('Error Accepted Request');
  }
 })


 const office_doctor_request_details = catchAsync(async (req, res) => {
  try {
    const Hos_Id = req.params.Hos_Id;

    const doctorRequest = await HospitalRequests.find({ Hos_Id: Hos_Id });

    if (!doctorRequest || doctorRequest.length === 0) {
      return res.status(404).json({ error: 'doctorRequest not found' });
    }
    // Prepare an array to store appointment details with doctor information
    const appointmentsWithPatient = [];

    // Iterate through each appointment
    for (const request of doctorRequest) {
      // Fetch doctor details for each appointment
      const DoctorDetails = await doctordetails.findById(request.doc_id);

      // Create an object with appointment and doctor details
      const appointmentWithPatient = {
        DoctorRequestDetails: request,
        DoctorDetails: DoctorDetails,
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


 const sendrequest = catchAsync(async (req, res) => {
  try {
    const doc_id = req.params.doc_id;
    const {
      Hos_Id

    } = req.body;
    // Check if there is an existing request with the same doc_id and Hos_Id
    const existingRequest = await HospitalRequests.findOne({ doc_id, Hos_Id }).exec();

    if (existingRequest) {
      return res.status(400).json('Doctor request with the same office already exists');
    }

    const newOfficeReq = new HospitalRequests({
      doc_id,
      Hos_Id,
    });

    const savedOffice = await newOfficeReq.save();
    res.status(201).json('Request  submitted successfully!');
  } catch (error) {
    console.error('Error adding office:', error);
    res.status(500).json('Internal Server Error');
  }
 })


 const getallOffice = catchAsync(async (req, res) => {
  try {
    const Hospital = await office.find();
    res.status(200).json(Hospital);
  } catch (error) {
    res.send(error);
  }
 })


 const addOffice = catchAsync(async (req, res) => {
  try {
    const {
      image,
      name,
      email,
      phone,
      password,
      officename,
      officeemail,
      officephone,
      officewebsite,
      officespecialty,
      country,
      street,
      city,
      state,
      zipcode,
      // doctors // Array of doctors
    } = req.body;
    console.log("body", req.body);
    const newOffice = new office({
      image,
      name,
      email,
      phone,
      password,
      officename,
      officeemail,
      officephone,
      officewebsite,
      officespecialty,
      country,
      street,
      city,
      state,
      zipcode,

    });

    const savedOffice = await newOffice.save();
    res.status(201).json(savedOffice);
  } catch (error) {
    console.error('Error adding office:', error);
    res.status(500).json('Internal Server Error');
  }
 })


 const check_doctor_office = catchAsync(async (req, res) => {
  try {
    const doc_id = req.params.doc_id;
    const doctor = await HospitalAcceptedRequests.findOne({ doc_id });
    if (doctor) {
      res.status(200).json(doctor);
    } else {
      res.status(404).json('Doctor is not found any hospital');
    }
  } catch (error) {
    console.error('Error fetching wallet data:', error);
    res.status(500).json({ error: 'Failed to fetch wallet data' });
  }
 })

 const search_location = catchAsync(async (req, res) => {
  const { query } = req.query; // Get the query string from the request URL
    console.log("query", query);
    try {
      // Perform a case-insensitive search for doctors with locations matching the query
      const searchResults = await doctordetails.find({
        city: { $regex: query, $options: 'i' }
      });
      console.log("searchResults", searchResults);
      res.json(searchResults); // Return the search results as JSON response
    } catch (error) {
      console.error('Error searching location in DoctorDetail:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
 })

 const change_office_password = catchAsync(async (req, res) => {
  try {
    const officeId = req.params.officeId;
    console.log(officeId);
    const { oldPassword, newPassword, confirmPassword } = req.body;

    // Fetch user from the database
    const offices = await office.findById(officeId);

    // Check if the old password matches the stored password
    if (offices && offices.password === oldPassword) {
      // Update the password if old password matches
      offices.password = newPassword;

      await offices.save();
      res.status(200).json("Password changed successfully");
    } else {
      res.status(400).json("Old password is incorrect");
    }
  } catch (error) {
    console.error("Error changing password:", error);
    res.status(500).json("Error changing password");
  }
 })


 const getofficeDetail = catchAsync(async (req, res) => {
  try {
    const { officeId } = req.params;
    console.log("officeId", officeId);
    // Find the office details based on the ID
    const OfficeDetail = await office.findOne({ _id: officeId });
    console.log("OfficeDetail", OfficeDetail);
    if (!OfficeDetail) {
      return res.status(404).json({ error: 'Office not found' });
    }

    // Send the office details as a JSON response
    res.status(200).json(OfficeDetail);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error retrieving doctor details', details: error.message });
  }
 })

 const update_office_profile = catchAsync(async (req, res) => {
  try {
    const officeId = req.params.officeId;
    console.log("body", req.body);
    const {

      email,
      phone,
      officename,
      officeemail,
      officephone,
      officewebsite,
      officespecialty,
      country,
      street,
      city,
      state,
      zipcode,
      file
    } = req.body;

    // Find the office profile by ID
    const officeProfile = await office.findOne({ _id: officeId });
    if (!officeProfile) {
      return res.status(404).json({ message: 'Office Profile not found' });
    }

    // Update the existing office profile with the received data

    officeProfile.email = email;
    officeProfile.phone = phone;
    officeProfile.officename = officename;
    officeProfile.officeemail = officeemail;
    officeProfile.officephone = officephone;
    officeProfile.officewebsite = officewebsite;
    officeProfile.officespecialty = officespecialty;
    officeProfile.country = country;
    officeProfile.street = street;
    officeProfile.city = city;
    officeProfile.state = state;
    officeProfile.zipcode = zipcode;
    officeProfile.image = file ? file.path : officeProfile.image; // If a new image is provided, update it

    // Save the updated profile to the database
    await officeProfile.save();

    res.status(200).json('Office Profile updated successfully');
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json('Error updating profile');
  }
 })

 const get_doctor_office = catchAsync(async (req, res) => {
  try {
    const Hos_Id = req.params.Hos_Id;

    // Find accepted hospital requests for the specified doc_id
    const acceptedRequests = await HospitalAcceptedRequests.find({ Hos_Id });
    // console.log("acceptedRequests",acceptedRequests);
    // Check if there are no accepted requests
    if (acceptedRequests.length === 0) {
      return res.status(404).json({ message: 'No accepted requests found' });
    }

    // Retrieve office details for each accepted request
    const doctorDetails = await Promise.all(
      acceptedRequests.map(async (request) => {
        const doctorDetails = await doctordetails.findOne({ _id: request.doc_id }).exec();
        // console.log("ofice",officeDetail);
        if (!doctorDetails) {
          // If office details not found for a request, return an error message
          return { message: `Doctor details not found for Hos_Id ${request.doc_id}` };
        }
        return doctorDetails;
      })
    );

    res.status(200).json(doctorDetails);
  } catch (error) {
    console.error('Error retrieving office details:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
 })

 const delele_doctor_office = catchAsync(async (req, res) => {
  try {
    const id = req.params.id;
    await HospitalAcceptedRequests.deleteOne({ Hos_Id: id });
    res.status(200).json('Delete office successfull');
  } catch (error) {
    res.status(500).json('Internal server Error');
  }
 })


  

  module.exports = {
    delele_doctor_office,
    get_doctor_office,
    update_office_profile,
    getofficeDetail,
    change_office_password,
    search_location,
    check_doctor_office,
    addOffice,
    getallOffice,
    sendrequest,
    office_doctor_request_details,
    office_accept_doctor_req,
    cancel_doctor_request,
    office_accepte_request_id,
    office_accept_request
  }
  
  
  
  
  