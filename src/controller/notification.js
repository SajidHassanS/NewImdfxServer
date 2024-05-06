const constant = require("../utils/constant"),
  generalService = require("../services/generalOperation");
const catchAsync = require("../utils/catchAsync");
const { autoIncrement } = require("../utils/commonFunctions");
const AppError = require("../utils/appError");
//const { createRedisClient } = require("../utils/redis");
const TableName = "Notification";
const incrementalId = "countryId"; // id is auto incremented
const cacheKey = "countryNames";
let client;


const markAsRead = catchAsync(async (req, res) => {
  try {
    const notificationId = req.params.notificationId;

    // Update the notification in the database to mark it as read
    const updatedNotification = await Notification.findByIdAndUpdate(
      notificationId,
      { isRead: true },
      { new: true } // Return the updated notification
    );

    if (!updatedNotification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    res.status(200).json({ message: 'Notification marked as read', notification: updatedNotification });
  } catch (error) {
    console.error('Error marking notification as read:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});


const usertransectionnotification = catchAsync(async (req, res) => {
  try {
    const userId = req.params.userId;
    const { message } = req.body;
    console.log("message", message);
    // const message = 'Your Transection is successfull.';
    const newNotification = new Notification({ userId, message });
    await newNotification.save();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


const notifications = catchAsync(async (req, res) => {
  try {
    const userId = req.params.userId;
    const notifications = await Notification.find({ userId }).sort({ createdAt: -1 });
    res.json(notifications);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});




module.exports ={
  notifications,
  usertransectionnotification,
  markAsRead
}