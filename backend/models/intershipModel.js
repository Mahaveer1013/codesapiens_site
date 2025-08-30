const db = require('../db/database');



const createIntership = (title, description, company, location, start_date, end_date, stipend, eligibility, skills_required, application_link, posted_on, application_deadline, category, duration, perks, work_type, contact_email, status) => {
    const stmt = db.prepare('INSERT INTO internships (title, description, company, location, start_date, end_date, stipend, eligibility, skills_required, application_link, posted_on, application_deadline, category, duration, perks, work_type, contact_email, status) VALUES (?,    ?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)');
    return stmt.run(title, description, company, location, start_date, end_date, stipend, eligibility, JSON.stringify(skills_required), application_link, posted_on, application_deadline, category, duration,JSON.stringify( perks), work_type, contact_email, status);
};
const getAllInternships=()=>{
    return db.prepare('SELECT * FROM internships').all();
}
const deleteInternship=(id)=>{
    const stmt = db.prepare('DELETE FROM internships WHERE id = ?');
    return stmt.run(id);
}
const updateOneInternship = (id,title, description, company, location, start_date, end_date, stipend, eligibility, skills_required, application_link, posted_on, application_deadline, category, duration, perks, work_type, contact_email, status)=>{
    const stmt = db.prepare('UPDATE internships SET title = ?,description = ?,company = ?,location = ?,start_date = ?,end_date = ?,stipend = ?,eligibility = ?,skills_required = ?,application_link = ?,posted_on = ?,application_deadline = ?,category = ?,duration = ?,perks = ?,work_type = ?,contact_email = ?,status = ? WHERE id = ?');
    return stmt.run(title, description, company, location, start_date, end_date, stipend, eligibility, JSON.stringify(skills_required), application_link, posted_on, application_deadline, category, duration, JSON.stringify(perks), work_type, contact_email, status,id);
}
module.exports = { createIntership, getAllInternships,deleteInternship ,updateOneInternship};
