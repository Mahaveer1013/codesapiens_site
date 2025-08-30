const { createIntership, getAllInternships, deleteInternship,updateOneInternship } = require('../models/intershipModel');

const addIntership = (req,res)=>{
    const{title,description,company,location,start_date,end_date,stipend,eligibility,skills_required,application_link,posted_on,application_deadline,category,duration,perks,work_type,contact_email,status} = req.body;
    const result = createIntership(title,description,company,location,start_date,end_date,stipend,eligibility,skills_required,application_link,posted_on,application_deadline,category,duration,perks,work_type,contact_email,status);
    res.status(201).json({id: result.lastInsertRowid, title,description,company,location,start_date,end_date,stipend,eligibility,skills_required,application_link,posted_on,application_deadline,category,duration,perks,work_type,contact_email,status});
    console.log(`Internship added: ${title}`);
};
const getInternships=(req,res)=>{
    const internships = getAllInternships();
    res.json(internships);
    console.log("Retrived all interships");
}
const removeInternship = (req, res)=>{
    const {id} = req.params;
    try{
        const result = deleteInternship(id);
        if(result.changes === 0){
            res.status(400).json({message:"Internship not found"});
            console.log(`Internship with id ${id} not found`);
        }else{
            res.status(200).json({message:"Internship deleted successfully"});
            console.log(`Internship with id ${id} deleted successfully`);
        }
        res.json({message:"Admin deleted successfully"});
    }catch(error){
        res.status(500).json({message:"Error deleting internship",error:error.message});
        console.error(`Error deleting internship with id ${id} , error`);
    }
}

const updateInternship = (req,res)=>{
    const {id} = req.params;
    const {title, description, company, location, start_date, end_date, stipend, eligibility, skills_required, application_link, posted_on, application_deadline, category, duration, perks, work_type, contact_email, status} = req.body;
    try{
        const result = updateOneInternship(id,title, description, company, location, start_date, end_date, stipend, eligibility, skills_required, application_link, posted_on, application_deadline, category, duration, perks, work_type, contact_email, status);
        if(result.length === 0){
            res.status(404).json({message:"Internship not found"});
            console.log(`Internship with id ${id} not found`);
        }
        res.status(200).json({message:"Internship updated successfully",internship:result});
        console.log(`Internship with id ${id} updated`);
    }catch(error){
        res.status(500).json({message:"Error updating internship",error:error.message});
        console.log(`Error updating with id ${id}:`,error);
    }
}

module.exports = { addIntership ,getInternships,removeInternship,updateInternship};