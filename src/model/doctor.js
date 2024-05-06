
const mongoose = require('mongoose');
const aggregatePaginate = require('mongoose-aggregate-paginate-v2');



const doctordetailsSchema = new mongoose.Schema({
 

    image: { type: String, required: false },
    name: { type: String, required: true },
    email: { type: String, required: false, unique: true },
    password: { type: String, required: false },
    specialization: { type: String, required: true },
    conditionstreated: { type: String, required: true },
    aboutself: { type: String, required: true },
    education: { type: String, required: false },
    college: { type: String, required: false },
    license: { type: String, required: false },
    yearofexperience: { type: String, required: false },
    status: { type: Boolean, default: false },
    country: { type: String, required: false },
    state: { type: String, required: false },
    city: { type: String, required: false },
    once: [{
        date: { type: String, required: true },
        timefrom: { type: String, required: true },
        timetill: { type: String, required: true },
        consultationfees: { type: String, required: true },
    }],
    daily: [{
        datefrom: { type: String, required: true },
        datetill: { type: String, required: true },
        timefrom: { type: String, required: true },
        timetill: { type: String, required: true },
        consultationfees: { type: String, required: true },
    }],
    weekly: [{
        day: { type: String, required: true },
        timefrom: { type: String, required: true },
        timetill: { type: String, required: true },
        consultationfees: { type: String, required: true },
    }],


    createdAt: { type: Date, default: Date.now() },
    updatedAt: { type: Date },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { versionKey: false });



doctordetailsSchema.plugin(aggregatePaginate);


 mongoose.model("Doctor", doctordetailsSchema);




