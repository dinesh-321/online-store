import Address from '../models/Address.js';

// Add Address : /api/address/add 

export const addAddress = async(req,res)=> {
    try{
        const { address, userId } = req.body;
        await Address.create({...address, userId});
        res.json({ success: true, message: 'Address added Successfully'});
    }
    catch(error){
        console.log(error.message);
        res.json({success: true, message: error.message});
    }
}

// Get Address : /api/address/get 

export const getAddress = async (req, res) => {
  try {
    const address = await Address.find({ userId: req.userId }); // ✅ from middleware
    res.json({ success: true, addresses: address });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};