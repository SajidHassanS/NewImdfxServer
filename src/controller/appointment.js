const constant = require("../utils/constant"),
  generalService = require("../services/generalOperation");
const catchAsync = require("../utils/catchAsync");
const { autoIncrement } = require("../utils/commonFunctions");
const AppError = require("../utils/appError");
//const { createRedisClient } = require("../utils/redis");
const TableName = "Appointment";
const NotificationTable = "Notification";
const incrementalId = "countryId"; // id is auto incremented
const cacheKey = "countryNames";
let client;




const appointments = catchAsync(async (req, res) => {
 
    const userId = req.params.userId;

    // Fetch all appointments for the user
    const userAppointments = await generalService.getRecord(TableName,{ userId:userId})  


    if (!userAppointments || userAppointments.length === 0) {
      return res.status(404).json({ error: 'Appointments not found' });
    }

    // Prepare an array to store appointment details with doctor information
    const appointmentsWithDoctors = [];

    // Iterate through each appointment
    for (const appointment of userAppointments) {
      // Fetch doctor details for each appointment
      const doctorDetails = await generalService.getRecordById( TableName,appointment.doc_id);

      // Create an object with appointment and doctor details
      const appointmentWithDoctor = {
        appointmentDetails: appointment,
        doctorDetails: doctorDetails,
      };

      // Add the object to the array
      appointmentsWithDoctors.push(appointmentWithDoctor);
    }

    res.send({
      status: constant.SUCCESS,
      message: "Record updated successfully",
      Record: appointmentsWithDoctors,
    });
    
   
 
});



const doc_appointments = catchAsync(async (req, res) => {

    const docId = req.params.docId;
    console.log("docId", docId);
    // Fetch all appointments for the user
    const userAppointments = await generalService.getRecord(TableName, { doc_id: docId });
    // console.log("userAppointments", userAppointments);
    if (!userAppointments || userAppointments.length === 0) {
      return res.status(404).json({ error: 'Appointments not found' });
    }

    // Prepare an array to store appointment details with doctor information
    const appointmentsWithPatient = [];

    // Iterate through each appointment
    for (const appointment of userAppointments) {
      // Fetch doctor details for each appointment
      const PatietnDetails = await generalService.getRecordById(TableName,appointment.userId);

      // Create an object with appointment and doctor details
      const appointmentWithPatient = {
        appointmentDetails: appointment,
        PatietnDetails: PatietnDetails,
      };

      // Add the object to the array
      appointmentsWithPatient.push(appointmentWithPatient);
    }
    res.send({
      status: constant.SUCCESS,
      message: "Record updated successfully",
      Record: appointmentsWithPatient,
    });
    
   
 
});



const doc_confirm_appointments = catchAsync(async (req, res) => {

    const docId = req.params.docId;
    console.log("docId", docId);
    // Fetch all appointments for the user
    const userAppointments = await generalService.getRecord(TableName,{ docId: docId });
    // console.log("userAppointments", userAppointments);
    if (!userAppointments || userAppointments.length === 0) {
      return res.status(404).json({ error: 'Appointments not found' });
    }

    // Prepare an array to store appointment details with doctor information
    const appointmentsWithPatient = [];

    // Iterate through each appointment
    for (const appointment of userAppointments) {
      // Fetch doctor details for each appointment
      const userId = appointment.userId
      const bookingdetails = await generalService.getRecord(TableName, { userId: userId, doc_id: docId });
      const PatietnDetails = await generalService.getRecordById(TableName,userId);

      // Create an object with appointment and doctor details
      const appointmentWithPatient = {
        bookingdetails: bookingdetails,
        PatietnDetails: PatietnDetails,
      };

      // Add the object to the array
      appointmentsWithPatient.push(appointmentWithPatient);
    }
    res.send({
      status: constant.SUCCESS,
      message: "Record updated successfully",
      Record: appointmentsWithPatient,
    });
  
  
});


const conformappointment = catchAsync(async (req, res) => {
 
    const docId = req.params.docId;
    const { appoimentdetail } = req.body;

    // Step 1: Delete from BookingAppointment
    await generalService.deleteRecord(TableName, { _id: appoimentdetail._id });

    // Step 2: Save to ConformAppointment
    const userId = appoimentdetail.userId;
    const appointment = new generalService.addRecord(TableName,{ docId, userId });
    await appointment.save();

    // Step 3: Save to Notification
    const message = 'Your appointment has been confirmed.';
    const newNotification = await generalService.addRecord(NotificationTable,{ userId, message });
    
    res.send({
      status: constant.SUCCESS,
      message: "Record Booked successfully",
      Record: AllRecord[0],
    });
   
  
});


const cancelappointment = catchAsync(async (req, res) => {
  try {
    const id = req.params.id;

    await BookingAppointment.deleteOne({ _id: id });

    res.status(200).json('Appointment Cancel successful');
  } catch (error) {
    res.status(500).json('Internal server Error');
  }
});


const appointmentAlldetails = catchAsync(async (req, res) => {
  try {
    const appointments = await BookingAppointmentDetail.find();
    // console.log("appointments",appointments);
    const appointmentsWithDetails = await Promise.all(
      appointments.map(async (appointment) => {
        // console.log("appointment", appointment.doc_id);
        const doctorDetail = await doctordetails.findById({ _id: appointment.doc_id });
        const userDetail = await User.findById({ _id: appointment.userId });

        return {
          bookingDetail: appointment,
          doctorDetail,
          userDetail,
        };
      })
    );
    console.log("appointmentsWithDetails", appointmentsWithDetails);
    res.json(appointmentsWithDetails);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
const appointmentDetails = catchAsync(async (req, res) => {
  try {
    const doc_id = req.params.doc_Id;
    const appointments = await BookingAppointmentDetail.find({ doc_id: doc_id });
    // console.log("appointments",appointments);
    const appointmentsWithDetails = await Promise.all(
      appointments.map(async (appointment) => {
        console.log("appointment", appointment.doc_id);
        const doctorDetail = await doctordetails.findById({ _id: appointment.doc_id });
        const userDetail = await User.findById({ _id: appointment.userId });

        return {
          bookingDetail: appointment,
          doctorDetail,
          userDetail,
        };
      })
    );
    console.log("appointmentsWithDetails", appointmentsWithDetails);
    res.json(appointmentsWithDetails);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
const bookappointment = catchAsync(async (req, res) => {
  try {
  
    const {
      bookingType,
      gender,
      patientAge,
      expiryYear,
      expiryMonth,
      cvv,
      cardNumber,
      holderName,
      cardType,
      selectedDate,
      selectedTimeSlot,
      bookingFor,
      doc_id,
      bookingDate,
      userId,
      details,
      Fees } = req.body;

    // console.log(Fees)
    //   bookingType,
    //   gender,
    //   patientAge,
    //   expiryYear,
    //   expiryMonth,
    //   cvv,
    //   cardNumber,
    //   cardName,
    //   cardType,
    //   selectedDate,
    //   selectedTimeSlot,
    //   doc_id)
    // const existingUser = await User.findOne({ _id:id });
    const newBookAppointment = new BookingAppointment({
      doc_id: doc_id,
      bookingType: bookingType,
      gender: gender,
      patientAge: patientAge,
      expiryYear: expiryYear,
      expiryMonth: expiryMonth,
      cvv: cvv,
      cardNumber: cardNumber,
      holderName: holderName,
      cardType: cardType,
      selectedDate: selectedDate,
      selectedTimeSlot: selectedTimeSlot,
      bookingDate: bookingDate,
      bookingFor: bookingFor,
      userId: userId,
      Details: details,
      Fees: Fees
    });
    const newBookAppointmentDetail = new BookingAppointmentDetail({
      doc_id: doc_id,
      bookingType: bookingType,
      gender: gender,
      patientAge: patientAge,
      expiryYear: expiryYear,
      expiryMonth: expiryMonth,
      cvv: cvv,
      cardNumber: cardNumber,
      holderName: holderName,
      cardType: cardType,
      selectedDate: selectedDate,
      selectedTimeSlot: selectedTimeSlot,
      bookingDate: bookingDate,
      bookingFor: bookingFor,
      Details: details,
      userId: userId,
      Fees: Fees
    });
    console.log("newBookAppointment", newBookAppointment);
    await newBookAppointment.save();
    await newBookAppointmentDetail.save();

    res.status(200).json('Book appointment successfully');
    // if (existingUser) {

    // }else{
    //   return res.status(400).json('User with this email Not exists');
    // }

  } catch (error) {
    res.status(500).json('Error saving user to the database');
  }
});
const getbookappointment = catchAsync(async (req, res) => {
  try {
    const userId = req.params.userId;
    // const { doc_id } = req.body;
    // console.log("doc_Iddoc_Id",doc_id);
    // Fetch all appointments for the user
    const userAppointments = await BookingAppointmentDetail.find({ userId: userId });
    // const userAppointments = await BookingAppointmentDetail.find({ userId: userId, });
    // console.log("userAppointments", userAppointments);
    if (!userAppointments || userAppointments.length === 0) {
      return res.status(404).json({ error: 'Appointments not found' });
    }

    // Prepare an array to store appointment details with doctor information
    const appointmentsWithPatient = [];

    // Iterate through each appointment
    for (const appointment of userAppointments) {
      // Fetch doctor details for each appointment
      const doctorDetails = await doctordetails.findById(appointment.doc_id);

      // Create an object with appointment and doctor details
      const appointmentWithPatient = {
        appointmentDetails: appointment,
        doctorDetails: doctorDetails,
        details: userAppointments,
      };

      // Add the object to the array
      appointmentsWithPatient.push(appointmentWithPatient);
    }

    res.status(200).json(appointmentsWithPatient);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
const getbookappointmenttime = catchAsync(async (req, res) => {
  try {
    const userId = req.params.userId;
    const { doc_id } = req.body;
    console.log("doc_Iddoc_Id", doc_id);
    // Fetch all appointments for the user
    // const userAppointments = await BookingAppointmentDetail.find({ userId: userId });
    const userAppointments = await BookingAppointmentDetail.find({
      userId: userId,
      doc_id: doc_id // Assuming doc_id field contains the doctor's user id
    });
    // console.log("userAppointments", userAppointments);
    if (!userAppointments || userAppointments.length === 0) {
      return res.status(404).json({ error: 'Appointments not found' });
    }

    // Prepare an array to store appointment details with doctor information
    const appointmentsWithPatient = [];

    // Iterate through each appointment
    for (const appointment of userAppointments) {
      // Fetch doctor details for each appointment
      const doctorDetails = await doctordetails.findById(appointment.doc_id);

      // Create an object with appointment and doctor details
      const appointmentWithPatient = {
        appointmentDetails: appointment,
        doctorDetails: doctorDetails,
        details: userAppointments,
      };

      // Add the object to the array
      appointmentsWithPatient.push(appointmentWithPatient);
    }

    res.status(200).json(appointmentsWithPatient);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
const getallbookappointment = catchAsync(async (req, res) => {
  try {
      const appoimentdetail = await BookingAppointment.find();
      res.status(200).json(appoimentdetail);
    } catch (error) {
      res.send(error);
    }
});

const gettodayappointments = catchAsync(async (req, res) => {
  try {
    const userId = req.params.userId;
    const userAppointments = await BookingAppointmentDetail.find({ userId: userId });
    // const currentDate = moment().startOf('day'); 
    // const appointments = await BookingAppointmentDetail.find({     date: { $gte: currentDate.toDate(), $lt: moment(currentDate).endOf('day').toDate() },});
    res.json(userAppointments);
  } catch (error) {
    console.error('Error fetching appointments:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }


})



module.exports = {
 appointments,
 doc_appointments,
 doc_confirm_appointments,
 conformappointment,
 cancelappointment,
 appointmentAlldetails,
 appointmentDetails,
 bookappointment,
 getallbookappointment,
 getbookappointmenttime,
 getbookappointment,
 gettodayappointments,
};
  

  
  



 
  






  