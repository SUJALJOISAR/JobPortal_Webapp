import { connectDatabase } from "../db/connection.js";

//only admin(recruiter) can job the post
export const postJob = async (req, res) => {
  try {
    const {
      title,
      description,
      requirements,
      salary,
      experiencelevel,
      location,
      jobtype,
      position,
    } = req.body;
    const userId = req.user.id; // The ID of the user who is posting the job
    const userRole = req.user.role;
    console.log(userRole);

    // Check if the user is authorized to post jobs (i.e., only recruiters can post jobs)
    if (userRole !== "recruiter") {
      return res.status(403).json({
        msg: "You are not authorized to post jobs",
        success: false,
      });
    }

    console.log(req.body);

    if (
      !title ||
      !description ||
      !requirements ||
      salary === undefined ||
      experiencelevel === undefined ||
      !location ||
      !jobtype ||
      !position
    ) {
      return res.status(400).json({
        msg: "Please fill in all required fields (title, description, requirements,salary,experiencelevel ,location, jobtype, position)",
        success: false,
      });
    }

    // Connect to the database
    const db = await connectDatabase();

    // Check if the user (recruiter) is associated with a company
    const getCompanyQuery = `SELECT id FROM companies WHERE user_id = ?`;

    db.query(getCompanyQuery, [userId], (err, companyResult) => {
      if (err) {
        console.error("Database query error:", err);
        return res.status(500).json({
          msg: "Database error while checking the company",
          success: false,
        });
      }

      // Check if the company exists for the recruiter
      if (companyResult.length === 0) {
        return res.status(400).json({
          msg: "No company associated with this recruiter",
          success: false,
        });
      }

      const companyId = companyResult[0].id;

    // SQL query to insert the new job into the jobs table
    const postJobQuery = `
    INSERT INTO jobs (title, description, requirements, salary, experiencelevel, location, jobtype, position,company)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?,?)
  `;

    db.query(
      postJobQuery,
      [
        title,
        description,
        requirements,
        salary,
        experiencelevel,
        location,
        jobtype,
        position,
        companyId,
      ],
      (err, result) => {
        if (err) {
          console.error("Database insert error:", err);
          return res.status(500).json({
            msg: "Database error while posting the job",
            success: false,
          });
        }

        const jobId = result.insertId; // Return the ID of the newly inserted job

        // If job posting is successful, return a success response
        return res.status(201).json({
          msg: "Job posted successfully",
          success: true,
          job: {
            id: jobId,
            title,
            description,
            requirements,
            salary,
            experiencelevel,
            location,
            jobtype,
            position,
            company_id: companyId, // Include the company ID
            user_id: userId, // Include the user ID who posted the job
            created_at: createdAt, // Include the created_at timestamp
          },
        });
      }
    );
  });
} catch (error) {
  console.error("Server error:", error);
  return res.status(500).json({
    msg: "Server error",
    success: false,
  });
}
};

export const getAllJobs = async (req, res) => {
  try {
    const userId = req.user.id; //Extract the user ID from the token

    if (!userId) {
      return res.status(401).json({
        msg: "User not authenticated",
        success: false,
      });
    }

    //Retrieve the keyword from query params like /api/job/getalljobs?keyword="developer"
    const { keyword } = req.query;

    //connect to database
    const db = await connectDatabase();

     // Query to retrieve all jobs along with the associated company ID and name
     let query = `
     SELECT jobs.*, companies.id AS company_id, companies.name AS company_name 
     FROM jobs 
     INNER JOIN companies ON jobs.company = companies.id
   `;

    let queryParams = [];
    if (keyword) {
      query += " WHERE title LIKE ? OR description LIKE ?";
      let keywordSearch = `%${keyword}%`; //Add '%' to search for partial matches
      queryParams.push(keywordSearch, keywordSearch); //here keywordsearch for title and description columns individually
    }

    db.query(query, queryParams, (err, result) => {
      if (err) {
        console.error("Database query error:", err);
        return res.status(500).json({
          msg: "Database query error",
          success: false,
        });
      }

      // If no jobs are found
      if (result.length === 0) {
        return res.status(404).json({
          msg: "No jobs found",
          success: false,
        });
      }

      console.log(result);

      // Return the list of all jobs
      return res.status(200).json({
        msg: "Jobs retrieved successfully",
        success: true,
        jobs: result, // Send back the retrieved jobs
      });
    });
  } catch (error) {
    console.error("Server error:", error);
    return res.status(500).json({
      msg: "Server error",
      success: false,
    });
  }
};

export const getJobById = async (req, res) => {
  try {
    const userId = req.user.id; //extract the user ID from the token
    // const userRole=req.user.role;//extract the user role from the token

    const jobId = req.params.id; //extract the job ID from the URL params

    if (!userId) {
      return res.status(401).json({
        msg: "User not authenticated",
        success: false,
      });
    }

    //connect to database
    const db = await connectDatabase();

    //query to retreive the job by ID
    let query = "SELECT * FROM jobs where id=?"; //dont use const otherwise it will give error because const things are not be modified further
    db.query(query, [jobId], (err, result) => {
      if (err) {
        console.error("Database query error:", err);
        return res.status(500).json({
          msg: "Database query error",
          success: false,
        });
      }

      // If the job is not found
      if (result.length === 0) {
        return res.status(404).json({
          msg: "Job not found",
          success: false,
        });
      }

       // Return the job details
       return res.status(200).json({
        msg: "Job retrieved successfully",
        success: true,
        job: result[0], // Send back the retrieved job
      });
    });
  } catch (error) {
    console.error("Server error:", error);
    return res.status(500).json({
      msg: "Server error",
      success: false,
    });
  }
};

//this is for seeing the admin that how many jobs are created by him
export const getAdminJobs=async (req,res)=>{
    try {
        const userId=req.user.id;//extract it from token
        const userRole=req.user.role;//extract it from token

        // Check if the user is authenticated
    if (!userId) {
        return res.status(401).json({
          msg: "User not authenticated",
          success: false,
        });
      }

       // Check if the user is a recruiter
    if (userRole !== 'recruiter') {
        return res.status(403).json({
          msg: "Access denied: Only recruiters can access this resource",
          success: false,
        });
      }

      //connect to database
      const db=await connectDatabase();

      //query to retreive all jobs created by the authenticated recruiter
      const query = "SELECT * FROM jobs where company=?"; //assuming company as userId because relationship is set

      //execute the query
      db.query(query,[userId],(err,result)=>{
        if (err) {
            console.error("Database query error:", err);
            return res.status(500).json({
              msg: "Database query error",
              success: false,
            });
          }

          // If no jobs are found
      if (result.length === 0) {
        return res.status(404).json({
          msg: "No jobs found for this recruiter",
          success: false,
        });
      }

      // Return the list of jobs created by the recruiter
      return res.status(200).json({
        msg: "Jobs retrieved successfully",
        success: true,
        jobs: result, // Send back the retrieved jobs
      });
    });

    } catch (error) {
        console.error("Server error:", error);
    return res.status(500).json({
      msg: "Server error",
      success: false,
    });
    }
}