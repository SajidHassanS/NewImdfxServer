
const constant = require("../utils/constant"),
  generalService = require("../services/generalOperation");
const catchAsync = require("../utils/catchAsync");
const { autoIncrement } = require("../utils/commonFunctions");
const AppError = require("../utils/appError");
//const { createRedisClient } = require("../utils/redis");
const TableName = "Doctor";
const incrementalId = "countryId"; // id is auto incremented
const cacheKey = "countryNames";
let client;


const approve_doctor = catchAsync(async (req, res) => {

  try {
    const { id } = req.params;
    console.log('id', id);

    // Find the doctor by ID in the pending doctors collection
    const pendingDoctor = await pendingdoctors.findById(id);
    console.log('pendingDoctor', pendingDoctor);
    if (!pendingDoctor) {
      return res.status(404).json({ message: 'Doctor not found in pending list' });
    }

    // Remove the doctor from the pending doctors collection
    await pendingdoctors.findByIdAndDelete(id);

    // Create a new instance of the approved doctor using the data from the pending doctor
    const approvedDoctor = new doctordetails(pendingDoctor.toObject());

    // Update the status field to true (optional)
    approvedDoctor.status = true;

    // Remove any fields that are not needed in the approved doctors collection
    // delete approvedDoctor.verification;

    // Save the approved doctor to the approved doctors collection
    await approvedDoctor.save();

    // Return the approved doctor
    res.status(200).json(approvedDoctor);
  } catch (error) {
    console.error('Error approving doctor:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
})


const update_doctor_status = catchAsync(async (req, res) => {

  try {
    const { id } = req.params;
    const { status } = req.body;

    // Find the doctor by ID and update the status
    const doctor = await doctordetails.findByIdAndUpdate(id, { status }, { new: true });

    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    // Return the updated patient
    res.status(200).json(doctor);
  } catch (error) {
    console.error('Error updating patient status:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
})


const doctors_by_specialty = catchAsync(async (req, res) => {

  try {
    const specialization = req.params.specialty;
    const doctors = await doctordetails.find({ specialization });
    res.status(200).json(doctors);
  } catch (error) {
    console.error('Error fetching doctors by specialty:', error);
    res.status(500).json('Error fetching doctors by specialty');
  }
})

const update_doctor_profile = catchAsync(async (req, res) => {
  try {
    const userId = req.params.userId;
    console.log("body", req.body);
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
      file
    } = req.body;

    // Find the user by ID
    const user = await User.findOne({ _id: userId });
    ;

    if (!user) {
      return res.status(200).json({ message: 'Patient Profile  is Not Found!' });
    }
    // Create a new doctordetails instance with the received data
    const patientProfile = new PatientProfile({
      image: file ? file.path : null, // Assuming you want to store the file path
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

    });

    // Save the data to the database
    await patientProfile.save();


    res.status(200).json('Profile updated successfully');
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json('Error updating profile');
  }

})

const mydoctor_Id = catchAsync(async (req, res) => {
  try {
    const userId = req.params.userId;

    // Fetch all appointments for the user
    const userAppointments = await ConformAppointment.find({ userId: userId });
    // console.log("userAppointments", userAppointments);
    if (!userAppointments || userAppointments.length === 0) {
      return res.status(404).json({ error: 'Appointments not found' });
    }

    // Prepare an array to store appointment details with doctor information
    const appointmentsWithPatient = [];

    // Iterate through each appointment
    for (const appointment of userAppointments) {
      // Fetch doctor details for each appointment
      const doctorDetails = await doctordetails.findById(appointment.docId);

      // Create an object with appointment and doctor details
      const appointmentWithPatient = {
        appointmentDetails: appointment,
        doctorDetails: doctorDetails,
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

const getDoctorDetail_id = catchAsync(async (req, res) => {
  try {
    const doctorId = req.params.id;

    // Find the doctor details based on the ID
    const doctorDetail = await doctordetails.findOne({ _id: doctorId });

    if (!doctorDetail) {
      return res.status(404).json({ error: 'Doctor not found' });
    }

    // Send the doctor details as a JSON response
    res.status(200).json(doctorDetail);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error retrieving doctor details', details: error.message });
  }

})

const pendingdoctordetail = catchAsync(async (req, res) => {
  try {
    const doctordetail = await pendingdoctors.find();
    res.status(200).json(doctordetail);
  } catch (error) {
    res.send(error);
  }

})

const doctorpersnoldetailsGet = catchAsync(async (req, res) => {
  try {
    const doctordetail = await doctordetails.find();
    res.status(200).json(doctordetail);
  } catch (error) {
    res.send(error);
  }

})


const doctorpersnoldetails = catchAsync(async (req, res) => {
  try {
    const { body } = req;
      console.log("sssssssssssssssssssssssssss" , body)
    // Check if the required fields (username, email, password) are present in the request body
    if (!body.name || !body.email || !body.password) {
      return res.status(400).json({ message: 'Username, email, and password are required' });
    }

    // Create a new user instance with the received data
    const newUser = new User({
      username: body.username,
      email: body.email,
      password: body.password,
      // Add any other relevant fields here
    });

    // Save the new user to the database
    await newUser.save();
    
    // Send a success response
    res.status(200).json({ message: 'Registration successful', data: newUser });
  } catch (error) {
    // Handle any errors
    console.error('Error during registration:', error);
    res.status(500).json({ message: 'Internal server error' });
  }

})

//new way to add images 
// router.post('/doctorpersnoldetails', async (req, res) => {
//   try {
//     uploadSingle.single('image')(req, res, async function (err) {
//       if (err instanceof multer.MulterError) {
//         // A Multer error occurred when uploading.
//         console.log(err)

//         return res.status(400).json({ message: err.message, success: false });
//       } else if (err) {
//         console.log(err)

//         // An unknown error occurred when uploading.
//         return res.status(500).json({ message: err.message, success: false });
//       }
//       const { body, file, verification } = req;
//       console.log("body", body)
//       const { email } = body.email
//       const doctordetail = await doctordetails.find({ email });

//       if (doctordetail.length > 0) {
//         return res.status(200).json({ message: 'Doctor is already registered!' });
//       }
//       let { title, rank } = req.body;
//       let image = req.file ? req.file.filename : null; 
//       // Create a new doctordetails instance with the received data
//       const newDoctorDetails = new pendingdoctors({
//         image: file ? file.path : null, // Assuming you want to store the file path
//         verification: verification ? verification.path : null, // Assuming you want to store the file path
//         name: body.name,
//         email: body.email,
//         password: body.password,
//         specialization: body.specialization,
//         conditionstreated: body.conditionstreated,
//         aboutself: body.aboutself,
//         education: body.education,
//         college: body.college,
//         license: body.license,
//         yearofexperience: body.yearofexperience,
//         country: body.country,
//         state: body.state,
//         city: body.city,
//         once: body.once.map(item => ({
//           date: item.date,
//           timefrom: item.timefrom,
//           timetill: item.timetill,
//           consultationfees: item.consultationfees,
//         })),
//         daily: body.daily.map(item => ({
//           datefrom: item.datefrom,
//           datetill: item.datetill,
//           timefrom: item.timefrom,
//           timetill: item.timetill,
//           consultationfees: item.consultationfees,
//         })),
//         weekly: body.weekly.map(item => ({
//           day: item.day,
//           timefrom: item.timefrom,
//           timetill: item.timetill,
//           consultationfees: item.consultationfees,
//         })),
//       });

//       // Save the data to the database
//       await newDoctorDetails.save();
//       res.status(200).json('Registration successful');
//       // Get the uploaded file from req.file



//     });

//   } catch (error) {
//     console.error('Error during registration:', error);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// });


//get DoctorDetails

module.exports = {

  doctorpersnoldetails,
  pendingdoctordetail,
  doctorpersnoldetailsGet,
  getDoctorDetail_id,
  mydoctor_Id,
  update_doctor_profile,
  doctors_by_specialty,
  update_doctor_status,
  approve_doctor,
};
  