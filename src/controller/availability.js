const constant = require("../utils/constant"),
  generalService = require("../services/generalOperation");
const catchAsync = require("../utils/catchAsync");
const { autoIncrement } = require("../utils/commonFunctions");
const AppError = require("../utils/appError");
//const { createRedisClient } = require("../utils/redis");
const TableName = "Availability";
const incrementalId = "countryId"; // id is auto incremented
const cacheKey = "countryNames";
let client;


  const updatedoctortimeslot = catchAsync(async (req, res) => {
    const { docId } = req.params;
    const { once, daily, weeks } = req.body;
    const weekly = weeks;
  
    try {
      let updatedDoctor;
  
      if (weekly) {
        const existingDoctor = await doctordetails.findById(docId);
  
        // Check if the provided time slot conflicts with existing slots for the same day
        const timeConflict = existingDoctor.weekly.some(item =>
          item.day === weekly.day &&
          item.timefrom === weekly.timefrom &&
          item.timetill === weekly.timetill
        );
  
        if (timeConflict) {
          return res.status(400).json({ message: 'Duplicate time slot for the same day' });
        }
  
        // Count the number of existing time slots for the provided day
        const existingSlotsForDay = existingDoctor.weekly.filter(item => item.day === weekly.day);
        const slotsCount = existingSlotsForDay.length;
  
        // Check if the number of slots exceeds the limit of 5
        if (slotsCount >= 5) {
          return res.status(400).json({ message: 'Maximum number of time slots reached for the day' });
        }
  
        // If no conflict and within the limit, append the new slot to the existing array
        updatedDoctor = await doctordetails.findByIdAndUpdate(
          docId,
          { $push: { weekly } },
          { new: true }
        );
      } else {
        // If weekly data is not provided, update other fields
        updatedDoctor = await doctordetails.findByIdAndUpdate(
          docId,
          { once, daily },
          { new: true }
        );
      }
  
      res.json(updatedDoctor);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error updating doctor data' });
    }
  })


  const doctorAvailableTimings_id = catchAsync(async (req, res) => {
    const { docId } = req.params;
    const { startDate } = req.query;
  
    try {
      // Query the database for available timings for the specified doctor and date range
      const availableTimings = await AvailableTimings.find({
        doc_id: docId,
        startDate: { $gte: startDate },
  
      });
  
      res.status(200).json(availableTimings);
    } catch (error) {
      console.error('Error fetching available timings:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  })


  const doctorAvailableTimings = catchAsync(async (req, res) => {
    const { doc_id, startDate, endDate, sessions } = req.body;
    console.log("startDate", startDate, "startDate", startDate);
    try {
      // Check if a record already exists for the given doctor ID and start date
      let availableTiming = await AvailableTimings.findOne({ doc_id, startDate });
  
      if (availableTiming) {
        // If a record exists, check if the number of sessions is less than 3
        if (availableTiming.sessions.length + sessions.length > 3) {
          return res.status(400).json({ message: 'Cannot add more than 3 slots for the same date' });
        }
  
        // Append the new sessions to the existing sessions array
        availableTiming.sessions.push(...sessions);
      } else {
        // If no record exists, create a new record with the doctor ID, start date, end date, and sessions array
        availableTiming = new AvailableTimings({
          doc_id,
          startDate,
          endDate,
          sessions
        });
      }
  
      // Save the updated or new record to the database
      await availableTiming.save();
  
      // Return a success message
      return res.status(200).json({ message: 'Time added successfully' });
    } catch (error) {
      console.error('Error saving available timings:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  })


  const check_doctor_availability = catchAsync(async (req, res) => {
    const { docId, dayname } = req.params;
  
    try {
      // Find the doctor by docId
      if (docId !== "null") {
  
        const doctor = await doctordetails.findById(docId);
        if (!doctor) {
          return res.status(404).json({ error: 'Doctor not found' });
        }
  
        // Filter the doctor's weekly schedule to get the time slots for the specified day
        const dayTimeSlots = doctor.weekly.filter(slot => slot.day === dayname);
  
        // Return the filtered time slots for the specified day
        res.status(200).json({ docId, dayname, timeSlots: dayTimeSlots });
      }
  
  
    } catch (error) {
      console.error('Error Get Time of That day:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  })


  const check_booking_availability = catchAsync(async (req, res) => {
    const { docId, timeSlot, selectedDateData } = req.params;
    // console.log("id",doc_id,"timeslot",timeSlot,selectedDate);
    try {
      // Query the database to check if there is any existing booking for the doctor at the given time slot
      const existingBooking = await BookingAppointmentDetail.findOne({
        doc_id: docId,
        selectedTimeSlot: timeSlot,
        selectedDate: selectedDateData
      });
  
      if (existingBooking) {
        // Doctor is not available at the specified time slot
        res.status(200).json({ docId, timeSlot, available: false });
      } else {
        // Doctor is available at the specified time slot
        res.status(200).json({ docId, timeSlot, available: true });
      }
    } catch (error) {
      // Handle errors
      console.error('Error checking doctor availability:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  })


  const get_doc_avaibletime = catchAsync(async (req, res) => {
    const { docId } = req.params;
    console.log("docId", docId);
    const doc_id = docId
    try {
      // Find doctor availability data from MongoDB based on docId
      const doctorAvailability = await AvailableTimings.find({ doc_id });
      console.log("doctorAvailability", doctorAvailability);
      if (!doctorAvailability) {
        return res.status(404).json("Doctor availability not found.");
      }
  
      res.status(200).json({ doctorAvailability });
    } catch (error) {
      console.error("Error fetching doctor availability:", error);
      res.status(500).json("Internal Server Error");
    }
  })


  const doc_avaibletime = catchAsync(async (req, res) => {
    const { docId } = req.params;
    const { date, session1, session2 } = req.body;
    console.log("req.body", req.body);
  
    try {
  
      const doctorAvailability = new AvaibleTimes({
        doc_id: docId,
        date,
        session1,
        session2,
      });
  
      await doctorAvailability.save();
  
      res.status(200).json({ success: true, message: "Doctor availability saved successfully." });

    } catch (error) {
      console.error("Error saving/updating doctor availability:", error);
      res.status(500).json({ success: false, message: "Internal Server Error" });
    }
  })


 

  


  module.exports = {
    doc_avaibletime,
    get_doc_avaibletime,
    check_booking_availability,
    check_doctor_availability,
    doctorAvailableTimings,
    doctorAvailableTimings_id,
    updatedoctortimeslot,


  }