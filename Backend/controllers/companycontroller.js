import { connectDatabase } from "../db/connection.js";
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Create __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const registerCompany = async (req, res) => {
  try {
    const { name } = req.body;
    const userId = req.user.id; //get the user id from the JWT token
    if (!name) {
      return res.status(400).json({
        message: "Please enter company name",
        success: false,
      });
    }

    const db = await connectDatabase();

    // Check if the company exists
    const checkCompanyQuery =
      "SELECT * FROM companies WHERE name=? AND user_id=?";
    db.query(checkCompanyQuery, [name, userId], (err, result) => {
      if (err) {
        return res.status(500).json({
          msg: "Database query error",
          success: false,
        });
      }

      if (result.length > 0) {
        // If the company already exists, return a response and stop further execution
        return res.status(400).json({
          msg: "Company already exists",
          success: false,
        });
      }

      // Insert new company if it does not exist
      const insertCompanyQuery =
        "INSERT INTO companies (name,user_id) VALUES (?,?)";
      db.query(insertCompanyQuery, [name, userId], (err, result) => {
        if (err) {
          console.error(err);
          return res.status(500).json({
            msg: "Database query error",
            success: false,
          });
        }

        // Successfully registered the company
        console.log("Insert Result:", result);

        return res.status(201).json({
          msg: "Company registered successfully",
          success: true,
          company: {
            id: result.insertId,
            name: name,
            user_id: userId, //Include the user ID for confirmation
          },
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

export const getCompany = async (req, res) => {
  try {
    //see whenever the user logged in then whichever company creates will be only shown
    const userId = req.user.id;
    if (!userId) {
      return res.status(401).json({
        msg: "User not authenticated",
        success: false,
      });
    }

    console.log("User ID from token:", userId); // Debugging

    //connect to database
    const db = await connectDatabase();

    //query to get companies created by logged-in user
    const query = "SELECT * FROM companies WHERE user_id = ?";
    db.query(query, [userId], (err, result) => {
      if (err) {
        console.error("Database query error:", err); // Log the error
        return res.status(500).json({
          msg: "Database query error",
          success: false,
        });
      }

      //check if companies are found
      if (result.length === 0) {
        console.log("No companies found for user ID:", userId); // Debugging
        return res.status(404).json({
          msg: "No companies found for this user",
          success: false,
        });
      }

      console.log(result);

      // Return the list of companies created by the user
      return res.status(200).json({
        msg: "Companies retrieved successfully",
        success: true,
        companies: result,
      });
    });
  } catch (error) {
    console.log("Server error:", error);
    return res.status(500).json({
      msg: "Server error",
      success: false,
    });
  }
};

export const getCompanyById = async (req, res) => {
  try {
    // Extract user ID from the token
    const userId = req.user.id; // Ensure this is set by your authentication middleware

    // Get the company ID from the request parameters
    const companyId = req.params.id; // Assuming the company ID is passed as a URL parameter

    // Connect to the database
    const db = await connectDatabase();

    //query to get the company by ID and ensure that it belongs to authenticated user
    const query = "SELECT * from companies where id=? AND user_id=?";
    db.query(query, [companyId, userId], (err, result) => {
      if (err) {
        console.error("Database query error:", err); // Log the error
        return res.status(500).json({
          msg: "Database query error",
          success: false,
        });
      }

      // Check if the company was found
      if (result.length === 0) {
        console.log("No company found for user ID:", userId); // Debugging
        return res.status(404).json({
          msg: "Company not found or does not belong to this user",
          success: false,
        });
      }
      // Return the company details
      return res.status(200).json({
        msg: "Company retrieved successfully",
        success: true,
        company: result[0], // Return the first matching company
      });
    });
  } catch (error) {
    console.log("Server error:", error);
    return res.status(500).json({
      msg: "Server error",
      success: false,
    });
  }
};

export const updatecompany = async (req, res) => {
  try {
    const userId = req.user.id; // Extract the user ID from the token (set by authentication middleware)
    const companyId = req.params.id; // Company ID from the URL parameters
    const { name, description, website, location } = req.body;
    const file = req.file; //for logo
    //cloudinary

    if (!name) {
      return res.status(400).json({
        msg: "Company name is required",
        success: false,
      });
    }

    // Connect to the database
    const db = await connectDatabase();

    // First, check if the company exists and belongs to the logged-in user
    const checkCompanyQuery =
      "SELECT * FROM companies WHERE id = ? AND user_id = ?";
    db.query(checkCompanyQuery, [companyId, userId], (err, result) => {
      if (err) {
        console.error("Database query error:", err);
        return res.status(500).json({
          msg: "Database query error",
          success: false,
        });
      }

      // If no company found or company does not belong to the user
      if (result.length === 0) {
        return res.status(404).json({
          msg: "Company not found or does not belong to this user",
          success: false,
        });
      }

      // Retrieve the existing company
      const company = result[0];

      // Handle file upload (local storage)
      let logoPath = company.logo; // Keep the existing logo path
      if (file) {
        logoPath = file.originalname; // Use the new logo file name
        const filePath = join(__dirname, 'uploads', logoPath); // Create file path
      }

      // Company exists and belongs to the user, proceed with the update
      const updateCompanyQuery = `
      UPDATE companies 
      SET name = ?, description = ?, website = ?, location = ?,logo =?
      WHERE id = ? AND user_id = ?
    `;
      db.query(
        updateCompanyQuery,
        [name, description, website, location, logoPath,companyId, userId],
        (err, result) => {
          if (err) {
            console.error("Database update error:", err);
            return res.status(500).json({
              msg: "Error updating company",
              success: false,
            });
          }
          // Check if any rows were affected (i.e., the update was successful)
          if (result.affectedRows === 0) {
            return res.status(400).json({
              msg: "Failed to update company",
              success: false,
            });
          }

          console.log("Updated company", result);

          // Fetch the updated company details after the update
          const getUpdatedCompanyQuery = "SELECT * FROM companies WHERE id = ?";
          db.query(
            getUpdatedCompanyQuery,
            [companyId],
            (err, updatedCompany) => {
              if (err) {
                console.error("Error fetching updated company:", err);
                return res.status(500).json({
                  msg: "Error fetching updated company details",
                  success: false,
                });
              }

              // Return the updated company details
              return res.status(200).json({
                msg: "Company updated successfully",
                success: true,
                company: updatedCompany[0], // Return the first (and only) result
              });
            }
          );
        }
      );
    });
  } catch (error) {
    console.log("Server error:", error);
    return res.status(500).json({
      msg: "Server error",
      success: false,
    });
  }
};
