const constant = require("../utils/constant"),
  generalService = require("../services/generalOperation");
const catchAsync = require("../utils/catchAsync");
const { autoIncrement } = require("../utils/commonFunctions");
const AppError = require("../utils/appError");
//const { createRedisClient } = require("../utils/redis");
const TableName = "Payment";
const incrementalId = "countryId"; // id is auto incremented
const cacheKey = "countryNames";
let client;


const mypayments = catchAsync(async (req, res) => {
  try {
    const userId = req.params.userId;
    const payments = await Wallet.find({ userId: userId });
    res.status(200).json(payments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
 })

 const doctorTransactions = catchAsync(async (req, res) => {
  try {
    const doc_id = req.params.doc_id;
    const payments = await Wallet.find({ doc_id: doc_id });
    res.status(200).json(payments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
 })

 const addpaymentwallet = catchAsync(async (req, res) => {
  try {
    const { userId, doc_id } = req.params;
    console.log(userId, "+", doc_id);
    const { Amount } = req.body;
    const wallet = new Wallet({ userId, doc_id, Amount });
    console.log("wallet", wallet);
    await wallet.save();
    res.status(201).json({ message: 'Wallet data saved successfully' });
  } catch (error) {
    console.error('Error saving wallet data:', error);
    res.status(500).json({ error: 'Failed to save wallet data' });
  }
 })

 const wallet = catchAsync(async (req, res) => {
  try {
    const userId = req.params.userId;
    const walletData = await Wallet.findOne({ userId });
    if (walletData) {
      res.status(200).json(walletData);
    } else {
      res.status(404).json({ message: 'Wallet data not found for the user' });
    }
  } catch (error) {
    console.error('Error fetching wallet data:', error);
    res.status(500).json({ error: 'Failed to fetch wallet data' });
  }
 })


module.exports = {
  mypayments,
  doctorTransactions,
  addpaymentwallet,
  wallet
}