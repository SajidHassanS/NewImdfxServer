
const mongoose = require('mongoose');
const aggregatePaginate = require('mongoose-aggregate-paginate-v2');

const avaibleTimeSchema = new mongoose.Schema({

    doc_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Doctor',
        required: false
    },
    startDate: {
        type: Date,
        required: false
    },
    endDate: {
        type: Date,
        required: false
    },
    sessions: [{
        date: {
            type: Date,
            required: false
        },
        startTime: {
            type: String,
            required: false
        },
        endTime: {
            type: String,
            required: false
        }
    }],
    doc_id: { type: String, required: false },
    
    date: { type: String, required: false },
    session1: {
        startTime: { type: String, required: false },
        endTime: { type: String, required: false },
    },
    session2: {
        startTime: { type: String, required: false },
        endTime: { type: String, required: false },
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    },
    updatedAt: {
        type: Date,
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
}, {
    versionKey: false,
});

avaibleTimeSchema.plugin(aggregatePaginate);

 mongoose.model('Availability', avaibleTimeSchema);




