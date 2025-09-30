import Contact from '../models/Contact.js';

export const addContact = async (req,res)=> {
    try{
        const { name, email, subject, message } = req.body;

        if(!name || !email || !subject || !message){
            return res.json({ success: false, message: 'Please fill all the Details'});
        }
        const contact = await Contact.create({name, email, subject, message});
        return res.json({success: true, message : 'Quote Submitted'});
    }
    catch(error){
        console.log(error.message);
        res.json({success: false, message: error.message});
    }
}

export const  showContact = async (req,res) => {
    try{
        const contacts = await Contact.find({});
        res.json({success: true, message: contacts});
    }
    catch(error){
        console.log(error.message);
        res.json({success: false, message: error.message});
    }
}