import mongoose from "mongoose";

const sellerSchema = new mongoose.Schema({
    
    name: {type : String, required : true},
    email: {type: String, required: true},
    password: {type: String, required: true},
    phonenumber: {type:Number, required: true},
    gstnumber: {type: String, required: true},
    status: {type: Boolean, default: false},
    status: {type: String, default: false},

}, {timestamps : true});

const seller = mongoose.model.seller || mongoose.model('seller', sellerSchema);

export default seller;