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
      companyId,
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

    console.log("from postjob Controller:", req.body);

    if (
      !title ||
      !description ||
      !requirements ||
      salary === undefined ||
      experiencelevel === undefined ||
      !location ||
      !jobtype ||
      !position ||
      !companyId // Check for companyId
    ) {
      return res.status(400).json({
        msg: "Please fill in all required fields (title, description, requirements,salary,experiencelevel ,location, jobtype, position)",
        success: false,
      });
    }

    // Connect to the database
    const db = await connectDatabase();

    // Check if the user (recruiter) is associated with a company
    const getCompanyQuery = `SELECT id,name FROM companies WHERE id=? AND user_id = ?`;

    db.query(getCompanyQuery, [companyId, userId], (err, companyResult) => {
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

      const { id: companyId, name: companyName } = companyResult[0];

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
              company_name: companyName,
              user_id: userId, // Include the user ID who posted the job
              created_at: new Date().toISOString(), // Provide the created_at timestamp
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
    const { keyword,Location,Industry,Salary } = req.query;

    //connect to database
    const db = await connectDatabase();

    // Query to retrieve all jobs along with the associated company ID and name
    let query = `
     SELECT jobs.*, companies.id AS company_id, companies.name AS company_name,companies.logo AS company_logo
     FROM jobs 
     INNER JOIN companies ON jobs.company = companies.id
   `;

    let queryParams = [];
    if (keyword) {
      query += " WHERE LOWER(jobs.title) LIKE LOWER(?) OR LOWER(jobs.description) LIKE LOWER(?)";
      let keywordSearch = `%${keyword}%`; //Add '%' to search for partial matches
      queryParams.push(keywordSearch, keywordSearch); //here keywordsearch for title and description columns individually
    }

      // Apply location filter
      if (Location) {
        query += " AND jobs.location = ?";
        queryParams.push(Location);
      }
  
      // Apply industry filter
      if (Industry) {
        query += " AND companies.name = ?";
        queryParams.push(Industry);
      }
  
      // Apply salary filter
      if (Salary) {
        query += " AND jobs.salary = ?";
        queryParams.push(Salary);
      }

    db.query(query, queryParams, (err, result) => {
      if (err) {
        console.error("Database query error:", err);
        return res.status(500).json({
          msg: "Database query error",
          success: false,
        });
      }

      console.log("jobs result job controller:", result);

      // If no jobs are found
      if (result.length === 0) {
        return res.status(404).json({
          msg: "No jobs found",
          success: false,
        });
      }

      // console.log(result);

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
    let query = "SELECT jobs.*, companies.name AS company_name FROM jobs JOIN companies ON jobs.company = companies.id WHERE jobs.id=?";
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
export const getAdminJobs = async (req, res) => {
  try {
    const userId = req.user.id; //extract it from token
    const userRole = req.user.role; //extract it from token

    // Check if the user is authenticated
    if (!userId) {
      return res.status(401).json({
        msg: "User not authenticated",
        success: false,
      });
    }

    // Check if the user is a recruiter
    if (userRole !== "recruiter") {
      return res.status(403).json({
        msg: "Access denied: Only recruiters can access this resource",
        success: false,
      });
    }

    //connect to database
    const db = await connectDatabase();

    // Query to retrieve all jobs created by the authenticated recruiter
    const query = `
      SELECT jobs.*, companies.name AS company_name 
      FROM jobs 
      JOIN companies ON jobs.company = companies.id 
      WHERE companies.user_id = ?
    `;

    //execute the query
    db.query(query, [userId], (err, result) => {
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
};

export const hasUserApplied = async (req, res) => {
  try {
    const userId = req.user.id; // The logged-in user's ID
    const jobId = req.params.id; // The job ID from the request parameters

    // Connect to the database
    const db = await connectDatabase();

    // Correct query using 'applicant' instead of 'user_id'
    const query = "SELECT * FROM applications WHERE applicant = ? AND job = ?";
    db.query(query, [userId, jobId], (err, result) => {
      if (err) {
        console.error("Database query error:", err);
        return res.status(500).json({
          msg: "Database query error",
          success: false,
        });
      }

      // If the user has applied, return true
      if (result.length > 0) {
        return res.status(200).json({
          msg: "User has already applied",
          success: true,
          hasApplied: true, // Return true if applied
        });
      }

      // If the user hasn't applied
      return res.status(200).json({
        msg: "User has not applied yet",
        success: true,
        hasApplied: false, // Return false if not applied
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

export const updateJobById = async (req, res) => {
  try {
    const jobId = req.params.id;
    const { title, company, position, location, salary, jobtype } = req.body;

    // Check if jobId is provided
    if (!jobId) {
      return res.status(400).json({
        message: "Job ID is required",
        success: false,
      });
    }

    const db = await connectDatabase();

    // If company field is not provided, retrieve the existing company from the database
    if (!company) {
      const selectQuery = `SELECT company FROM jobs WHERE id = ?;`;
      
      db.query(selectQuery, [jobId], (err, result) => {
        if (err || result.length === 0) {
          console.log("Error retrieving existing company data:", err);
          return res.status(500).json({
            message: "Error retrieving existing company data",
            success: false,
          });
        }

        const existingCompany = result[0].company;  // Use existing company if not provided

        // Update the job with the existing company value
        const updateQuery = `
          UPDATE jobs 
          SET title = ?, company = ?, position = ?, location = ?, salary = ?, jobtype = ?
          WHERE id = ?;
        `;
        
        db.query(updateQuery, [title, existingCompany, position, location, salary, jobtype, jobId], (err, result) => {
          if (err) {
            console.log("Database update error:", err);
            return res.status(500).json({
              message: "Database update error",
              success: false,
            });
          }

          if (result.affectedRows === 0) {
            return res.status(404).json({
              message: "Job not found or no changes were made",
              success: false,
            });
          }

          return res.status(200).json({
            message: "Job details updated successfully",
            success: true,
          });
        });
      });
    } else {
      // Normal update logic when the company field is provided
      const updateQuery = `
        UPDATE jobs 
        SET title = ?, company = ?, position = ?, location = ?, salary = ?, jobtype = ?
        WHERE id = ?;
      `;

      db.query(updateQuery, [title, company, position, location, salary, jobtype, jobId], (err, result) => {
        if (err) {
          console.log("Database update error:", err);
          return res.status(500).json({
            message: "Database update error",
            success: false,
          });
        }

        if (result.affectedRows === 0) {
          return res.status(404).json({
            message: "Job not found or no changes were made",
            success: false,
          });
        }

        return res.status(200).json({
          message: "Job details updated successfully",
          success: true,
        });
      });
    }
  } catch (error) {
    console.log("Server error:", error);  // Log server errors
    return res.status(500).json({
      message: "Server error",
      success: false,
    });
  }
};
