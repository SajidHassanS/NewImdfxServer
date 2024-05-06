const mongoose = require('mongoose');
const aggregatePaginate = require('mongoose-aggregate-paginate-v2');

const officeSchema = new mongoose.Schema({
    image: { type: String, required: false },
    name: { type: String, required: false },
    email: { type: String, required: false, unique: true },
    phone: { type: String, required: false, unique: true },
    password: { type: String, required: false },
    officename: { type: String, required: false },
    officeemail: { type: String, required: false },
    officephone: { type: String, required: false },
    officewebsite: { type: String, required: false },
    officespecialty: { type: String, required: false },
    country: { type: String, required: false },
    street: { type: String, required: false },
    city: { type: String, required: false },
    state: { type: String, required: false },
    zipcode: { type: String, required: false },
    createdAt: { type: Date, default: Date.now() },
    updatedAt: { type: Date },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { versionKey: false });

officeSchema.plugin(aggregatePaginate);

 mongoose.model("Office", officeSchema);


