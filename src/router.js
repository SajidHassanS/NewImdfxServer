const Router = require("express").Router;
const router = new Router();
// const {authenticate } = require("./middleware/authenticate);

// ===================      All Controllers   ==================//
//const dashboardController = require("./controller/dashboard");
const authController = require("./controller/auth");
const userController = require("./controller/user");
const appointment = require("./controller/appointment");
const availability = require("./controller/availability");
const doctor = require("./controller/doctor");
const medical = require("./controller/medical");
const notification = require("./controller/notification");
const office = require("./controller/office");
const patient = require("./controller/patient");
const payment = require("./controller/payment");
const prescription = require("./controller/prescription");

// ===================      joi validations    ==================//
const authJoiValidation = require("./utils/validation/authJoiValidation");

const usersJoi = require("./utils/validation/users");

//===================      dashboard Route         ==============//


//===================      Users Route         ==============//
router.get("/getUsers/:query",  userController.getUsers);
router.post(
  "/addUsers",
  //
  //
  userController.addUsers
);
router.put(
  "/updateUsers",
  usersJoi.updateValidation,
  
  userController.updateUsers
);
router.put(
  "/activeUserAccount",
  usersJoi.activeUserAccount,
  
  userController.activeUserAccount
);
router.put(
  "/deleteUsers",
  usersJoi.deleteValidation,
  
  userController.deleteUsers
);
router.put("/resetPassword",  userController.resetPassword);
router.get(
  "/getUserDetailById",
  //
  userController.getUserDetailById
);

//============================  appointment Route  =============================//

router.get(
  "/getallbookappointment",
  
  appointment.getallbookappointment
);
router.get(
  "/getbookappointment/:userId",
  
  appointment.getbookappointment
);
router.get("/appointments/:userId",  appointment.appointments);
router.get(
  "/doc_appointments/:docId",
  
  appointment.doc_appointments
);
router.get(
  "/appointment-alldetails",
  
  appointment.appointmentAlldetails
);
router.get(
  "/appointment-details/:doc_Id",
  
  appointment.appointmentDetails
);
router.get(
  "/doc_confirm_appointments/:docId",
  
  appointment.doc_confirm_appointments
);
router.post(
  "/getbookappointmenttime/:userId",
  
  
  appointment.getbookappointmenttime
);
router.post(
  "/conformappointment/:docId",
  
  
  appointment.conformappointment
);
router.post(
  "/cancelappointment/:id",
  
  
  appointment.cancelappointment
);
router.post(
  "/bookappointment",
  
  
  appointment.bookappointment
);
router.post(
  "/gettodayappointments",
  
  
  appointment.gettodayappointments
);

//============================  Auth Route  =============================//

router.post("/signUp", authJoiValidation.signUp, authController.signUp);
router.post("/login", authController.signIn);
router.get("/getProfile",  authController.getProfile);
router.put("/updateProfile",  authController.updateProfile);
router.put("/changePassword",  authController.changePassword);

router.get("/doctorlogin",  authController.doctorlogin);
router.get(
  "/change-user-password",
  
  authController.changeUserPassword
);
router.get(
  "/change-doctor-password",
  
  authController.changeDoctorPassword
);
router.get(
  "/reset-user-password",
  
  authController.resetUserPassword
);

//============================  availability  =============================//

router.post(
  "/doc_avaibletime/:docId",
  
  
  availability.doc_avaibletime
);
router.get(
  "/get-doc_avaibletime/:docId",
  
  
  availability.get_doc_avaibletime
);
router.get(
  "/check-booking-availability/:doc_id/:timeSlot/:selectedDateData",
  
  
  availability.check_booking_availability
);
router.get(
  "/check-doctor-availability/:docId/:dayname",
  
  
  availability.check_doctor_availability
);
router.post(
  "/doctorAvailableTimings",
  
  
  availability.doctorAvailableTimings
);
router.get(
  "/doctorAvailableTimings/:docId",
  
  
  availability.doctorAvailableTimings
);
router.put(
  "/updatedoctortimeslot/:docId",
  
  
  availability.updatedoctortimeslot
);

//============================  doctor  =============================//

router.post("/doctorpersnoldetails", doctor.doctorpersnoldetails);

router.get("/doctorpersnoldetails", doctor.doctorpersnoldetailsGet);

//get pending doctor details for approved
router.get("/pendingdoctordetail", doctor.pendingdoctordetail);

// signle doctor detail
router.get("/getDoctorDetail/:id", doctor.getDoctorDetail_id);

// get mydoctor details, patient id  for patient dashboard
router.get("/mydoctor/:userId", doctor.mydoctor_Id);

//doctor update own profile
router.post("/update-doctor-profile/:docId", doctor.update_doctor_profile);

// search doctor  by specialization
router.get("/doctors-by-specialty/:specialty", doctor.doctors_by_specialty);

// admin update doctors status
router.put("/update-doctor-status/:id", doctor.update_doctor_status);

//approve doctor
router.put("/approve-doctor/:id", doctor.approve_doctor);

//============================  medical  =============================//

// add medical record
router.post("/medicaldetails/:userId", medical.medicaldetails_id);
//get appointments
router.get("/getmedicaldetails/:userId", medical.getmedicaldetails_id);

router.put("/updatemedicaldetails/:userId", medical.updatemedicaldetails);
// DELETE route for deleting medical details
router.post("/deletemedicaldetails/:userId", medical.deletemedicaldetails);

router.post("/medicalreport/:userId", medical.medicalreport);

router.get("/getmedicalreport/:userId", medical.getmedicalreport);

//============================  notification  =============================//

router.get("/notifications/:userId", notification.notifications);

router.post(
  "/usertransectionnotification/:userId",
  notification.usertransectionnotification
);
router.post("/markAsRead/:notificationId", notification.markAsRead);

//============================  office  =============================//

// add hospital

router.post("/addOffice", office.addOffice);

// get all hospitals
router.get("/getallOffice", office.getallOffice);

// doctor requst to hostpital
router.post("/sendrequest/:doc_id", office.sendrequest);
router.get(
  "/office-doctor-request-details/:Hos_Id",
  office.office_doctor_request_details
);
//when office accept  doctor request
router.post(
  "/office-accept-doctor-req/:Hos_Id",
  office.office_accept_doctor_req
); //when office cencal doctor request
router.post("/cancel-doctor-request/:id", office.cancel_doctor_request); // get doctor  office accepted request
router.get("/office-accepte-request/:doc_id", office.office_accepte_request_id);
// get multple doctor office  which is added in office
router.post("/office-accept-request", office.office_accept_request); // when doctor delete office tee
router.post("/delele-doctor-office/:id", office.delele_doctor_office);

// get doctor for office to show
router.get("/get-doctor-office/:Hos_Id", office.get_doctor_office);

router.post("/update-office-profile/:officeId", office.update_office_profile);

//get signle office detail
router.get("/getofficeDetail/:officeId", office.getofficeDetail);

///search doctor location
// Route handler for /api/search-location
router.get("/search-location", office.search_location);
// change password of Office
router.post("/change-office-password/:officeId", office.change_office_password);

// check doctor exist in hospital or not
router.get("/check-doctor-office/:doc_id", office.check_doctor_office);

//============================  patient  =============================//

//getpatient with id
router.get("/getpatient/:id", patient.getpatient_id);
//getpatient
router.get("/getpatient", patient.getpatient);
// get mypatient details, doctor id  for doctor dashboard
router.get("/mypatient/:docId", patient.mypatient);
router.post(
  "/update-patient-profile/:userId",

  patient.update_patient_profile
);

// get patient patient profile
router.get("/getpatient-profile/:userId", patient.getpatient_profile);
router.put("/update-patient-status/:id", patient.update_patient_status);
//============================  payment  =============================//

// get  user peyment details, patient id  for patient dashboard
router.get("/mypayments/:userId", payment.mypayments);

// get doctor transaction, peyment details, patient id  for patient dashboard
router.get("/doctorTransactions/:doc_id", payment.doctorTransactions); //add payment to user walllat
router.post("/addpaymentwallet/:userId/:doc_id", payment.addpaymentwallet); // API endpoint to retrieve data from the database
router.get("/wallet/:userId", payment.wallet);

//============================  prescription  =============================//

router.post('/Prescription', prescription.Prescription);


// get prescription with userid  
router.get('/get-prescriptions/:userId', prescription.get_prescriptions);


module.exports = router;
