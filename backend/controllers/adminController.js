const {createAdmin,getAllAdmins, deleteAdmin, updateOneAdmin} = require('../models/adminModel');
// const { get } = require('../routes/users');
const addAdmin = async (req, res) => {
  try {
    const { name, email, password, number, role } = req.body;
    
    // Await the asynchronous createAdmin function
    const data = await createAdmin(name, email, password, number, role); 
    
    // Check if the result is valid
    if (data) {
      // Return the newly created admin data
      res.status(201).json(data); 
      console.log(`Admin added: ${name}`);
    } else {
      // If data is null or undefined (e.g., insertion failed silently)
      res.status(400).json({ error: "Failed to create admin" });
    }
  } catch (error) {
    // Catch any errors that occur during the async operation
    console.error("Error adding admin:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
const getAdmins = async (req, res) => {
  try {
    const admins = await getAllAdmins(); // await the promise
    console.log('Retrieved all admins');
    res.json(admins);
  } catch (err) {
    console.error('Error fetching admins:', err.message || err);
    res.status(500).json({ error: 'Failed to fetch admins' });
  }
}
const removeAdmin = (req,res)=>{
    const {id} = req.params;

    try{
        const result = deleteAdmin(id);
        if(result.changes === 0){
            res.status(400).json({message:"Admin not found"});
            console.log(`Admin with id ${id} not found`);
        }else{
            res.status(200).json({message: "Admin deleted  successfully"});
            console.log(`Admin with id ${id} deleted successfully`)
        }
        res.json({message:"Admin deletd successfully"});
    }catch(error){
        res.status(500).json({message:"Error deleting admin", error:error.message});
        console.error(`Error deleting admin with id ${id}`,error);
    }
}

const updateAdmin = (req,res)=>{
    const {id} = req.params;
    const {name,email,password,number,role} = req.body;
    try{
        const result = updateOneAdmin(id,name,email,password,number,role);
        if(result.length === 0){
            res.status(404).json({message:"Admin not found"});
            console.log(`Admin with id ${id} not found`);
        }
        res.status(200).json({message:"Admin updated successfully",admin: result});
        console.log(`Admin with id ${id} updated`);
    }catch(error){
        res.status(500).json({message:"Error updating admin",error: error.message});
        console.log( `Error updating admin with id ${id}:`,error);
    }

}

module.exports = {addAdmin,getAdmins , updateAdmin, removeAdmin};