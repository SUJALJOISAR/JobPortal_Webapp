import { connectDatabase } from "../db/connection.js";

//only students can apply for this job
export const applyjob = async (req, res) => {
  try {
    const userId = req.user.id; //extract the user ID from the token
    const userRole = req.user.role; //extract the user's role from the token

    // Ensure the user is authenticated
    if (!userId) {
      return res.status(401).json({
        msg: "User not authenticated",
        success: false,
      });
    }

    // Ensure the user has the correct role (e.g., "student")
    if (userRole !== "student") {
      return res.status(403).json({
        msg: "Only students are allowed to apply for jobs",
        success: false,
      });
    }

    //now we will be extracting the job id for which the applicant is applying
    // Get the job ID from the request body
    const { jobId } = req.body;

    // Ensure the job ID is provided
    if (!jobId) {
      return res.status(400).json({
        msg: "Job ID is required",
        success: false,
      });
    }

    // Connect to the database
    const db = await connectDatabase();
    //check if the user has already applied for the job
    const checkQuery = `SELECT * from applications WHERE job=? AND applicant=?`;
    db.query(checkQuery, [jobId, userId], (err, result) => {
      if (err) {
        console.error("Database query error:", err);
        return res.status(500).json({
          msg: "Database query error",
          success: false,
        });
      }

      if (result.length > 0) {
        return res.status(400).json({
          msg: "You have already applied for this job",
          success: false,
        });
      }

      //Insert a new application
      const insertQuery = `INSERT INTO applications (job,applicant,status) VALUES(?,?,?)`;
      db.query(insertQuery, [jobId, userId, "pending"], (err, result) => {
        if (err) {
          console.error("Database insert error:", err);
          return res.status(500).json({
            msg: "Failed to apply for the job",
            success: false,
          });
        }

        //retreive the newly inserted application
        const newApplicationId = result.insertId;
        const selectQuery = "SELECT * from applications where id=?";
        db.query(selectQuery, [newApplicationId], (err, result) => {
          if (err) {
            console.error("Database query error:", err);
            return res.status(500).json({
              msg: "Failed to retrieve the new application",
              success: false,
            });
          }

          //return the newly inserted application
          return res.status(201).json({
            msg: "Job application submitted successfully",
            success: true,
            application: result[0],
          });
        });
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

export const getAppliedJobs = async (req, res) => {
  try {
    const userId = req.user.id; //extract the user from token

    //connect to database
    const db = await connectDatabase();

    //query to find all applications by the user
    const query = `SELECT applications.id as applicationId, applications.status, applications.created_at,
     jobs.title as jobTitle, jobs.description as jobDescription, jobs.id as jobId, companies.name as companyName, 
     companies.id as companyId 
     FROM applications
     INNER JOIN jobs ON applications.job = jobs.id
     INNER JOIN companies ON jobs.company=companies.id
     WHERE applications.applicant = ?
     ORDER BY applications.created_at DESC;`;

    //execute the query with the userID
    db.query(query, [userId], (err, result) => {
      if (err) {
        console.error("Database query error:", err);
        return res.status(500).json({
          message: "Database query error",
          success: false,
        });
      }

      // If no applications are found
      if (result.length === 0) {
        return res.status(404).json({
          message: "No Applications Found",
          success: false,
        });
      }

      // Return the list of all applications
      return res.status(200).json({
        message: "Applications retrieved successfully",
        success: true,
        applications: result, // Send back the retrieved applications
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

//how many students has applied for the particular job
export const getApplicants = async (req, res) => {
  try {
    const jobId = req.params.id; //extract the job id from the route params

    if (!jobId) {
      return res.status(400).json({
        message: "Job ID is required",
        success: false,
      });
    }

    // Connect to the database
    const db = await connectDatabase();
    // Query to get all student applicants and their details
    const query = `
      SELECT users.name, users.email, users.phone, users.resume AS resume, users.resumeOriginalName AS resumeOriginalName, 
             applications.created_at AS createdAt
      FROM applications
      INNER JOIN users ON applications.applicant = users.id
      WHERE applications.job = ? AND users.role = 'student';
    `;

    db.query(query, [jobId], (err, result) => {
      if (err) {
        console.error("Database query error:", err);
        return res.status(500).json({
          message: "Database query error",
          success: false,
        });
      }

      // If no students have applied
      if (result.length === 0) {
        return res.status(200).json({
          message: "No students have applied for this job",
          success: true, // Return success even if no applicants
          studentCount: 0, // Return 0 applicants
          applications: [], // Return empty applications array
        });
      }

      // Return the number of students who have applied
      return res.status(200).json({
        message: "Applicants retrieved successfully",
        success: true,
        studentCount: result.length, // Send back the count of students
        applications: result, // Return the applicant details
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

export const updateStatus = (req, res) => {
  try {
    const { newStatus } = req.body;
    const applicationId = req.params.id;

    // Ensure both applicationId and newStatus are provided
    if (!applicationId || !newStatus) {
      return res.status(400).json({
        msg: "Application ID and new status are required",
        success: false,
      });
    }

    // Connect to the database
    connectDatabase()
      .then((db) => {
        // Update the status of the application
        const updateQuery = `UPDATE applications SET status = ? WHERE id = ?`;

        db.query(
          updateQuery,
          [newStatus, applicationId],
          (err, updateResult) => {
            if (err) {
              console.error("Database update error:", err);
              return res.status(500).json({
                msg: "Database update error",
                success: false,
              });
            }

            // Check if the application was found and updated
            if (updateResult.affectedRows === 0) {
              return res.status(404).json({
                msg: "Application not found",
                success: false,
              });
            }

            // Return success message
            return res.status(200).json({
              msg: "Application status updated successfully",
              success: true,
            });
          }
        );
      })
      .catch((error) => {
        console.error("Database connection error:", error);
        return res.status(500).json({
          msg: "Database connection error",
          success: false,
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
