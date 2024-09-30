import { hash, compare } from "bcrypt";
import { connectDatabase } from "../db/connection.js";
import jwt from "jsonwebtoken";
import { getDataUri } from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

export const register = async (req, res) => {
  try {
    const { name, email, phone, password, role } = req.body;

    // Validate request data
    if (!name || !email || !phone || !password || !role) {
      return res.status(400).json({
        msg: "Something is missing",
        success: false,
      });
    }

    // Get the database connection
    const db = await connectDatabase();

    // Check if the user already exists in the database
    const sql = "SELECT * FROM users WHERE email = ?";
    db.query(sql, [email], async (err, result) => {
      if (err) {
        return res.status(500).json({
          msg: "Database query error",
          success: false,
        });
      }

      if (result.length > 0) {
        // User already exists
        return res.status(200).json({
          msg: "User already exists",
          success: false,
        });
      }

      // Hash the password
      try {
        const hashedPassword = await hash(password, 10);

        // Insert new user with the hashed password
        const insertSql =
          "INSERT INTO users (name, email, phone, password, role) VALUES (?, ?, ?, ?, ?)";
        db.query(
          insertSql,
          [name, email, phone, hashedPassword, role],
          (err, insertResult) => {
            if (err) {
              return res.status(500).json({
                msg: "Error creating user",
                success: false,
              });
            }

            // User created successfully
            return res.status(201).json({
              msg: "User registered successfully",
              success: true,
              user: {
                email: email,
                role: role,
              },
            });
          }
        );
      } catch (hashError) {
        return res.status(500).json({
          msg: "Error hashing password",
          success: false,
        });
      }
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      msg: "Server error",
      success: false,
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;
    if (!email || !password || !role) {
      return res.status(400).json({
        msg: "Something is missing",
        success: false,
      });
    }

    // Get the database connection
    const db = await connectDatabase();

    const sql = "SELECT * from users where email=?";
    db.query(sql, [email], async (err, result) => {
      if (err) {
        return res.status(500).json({
          msg: "Database query error",
          success: false,
        });
      }
      if (result.length === 0) {
        return res.status(400).json({
          msg: "Invalid email or password",
          success: false,
        });
      }

      const user = result[0];

      try {
        const isPasswordMatch = await compare(password, user.password);
        if (!isPasswordMatch) {
          return res.status(400).json({
            msg: "Incorrect email or password",
            success: false,
          });
        }
      } catch (compareError) {
        return res.status(500).json({
          msg: "Error comparing password",
          success: false,
        });
      }

      // Check if the role matches
      if (role !== user.role) {
        return res.status(400).json({
          msg: "Invalid role",
          success: false,
        });
      }

      //Authorization step generating token
      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role }, //payload
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
      );

      res.cookie(process.env.COOKIE_NAME, token, {
        path: "/",
        httpOnly: true,
        secure: true,
        signed: true,
        sameSite: "none",
        maxAge: 24 * 60 * 60 * 1000, // 1 day
      });

      // Successful login response
      return res.status(200).json({
        msg: "Login successful",
        success: true,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          bio: user.bio,
          skills: user.skills,
          resume: user.resume,
          resumeOriginalName: user.resumeOriginalName,
        },
      });
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      msg: "Server error",
      success: false,
    });
  }
};

export const logout = async (req, res) => {
  try {
    const cookie = process.env.COOKIE_NAME;
    console.log("Clearing cookie: ", cookie); // Log cookie name
    res.clearCookie(cookie);
    return res.status(200).json({
      msg: "User logout Successfully!!",
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      msg: "Server error",
      success: false,
    });
  }
};

// Create __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const updateProfile = async (req, res) => {
  try {
    const { name, email, phone, bio, skills } = req.body;
    const file = req.file;

    console.log("Received File:", file);

    if (!name || !email || !phone || !bio || !skills) {
      return res.status(400).json({
        msg: "Missing required fields",
        success: false,
      });
    }

    // Validate skills before using .split
    const skillsArray =
      typeof skills === "string"
        ? skills.split(",")
        : Array.isArray(skills)
        ? skills
        : [];
    //means if the skills is an string then split with "," so it will be converted to array and if it is already an array then no need to convert it , and if nothing is there then pass the empty array.
    //see from frontend it will be come as an string , in backend it needs to be converted to array for operations.

    const userId = req.user.id; // it will come from JWT token(middleware authentication) means see after authenticateToken is called in whatever response is send to this will be in form of request

    const db = await connectDatabase();
    const findUserquery = "SELECT * from users where id=?";
    db.query(findUserquery, [userId], async (err, result) => {
      if (err) {
        return res.status(500).json({
          msg: "Database query error",
          success: false,
        });
      }

      if (result.length === 0) {
        return res.status(404).json({
          msg: "User not found",
          success: false,
        });
      }

      //Retreive the existing user
      const user = result[0];

      //handles files
      // const fileUri = getDataUri(file);
      // const cloudResponse = await cloudinary.uploader.upload(fileUri.content, {
      //   resource_type: "auto", // Automatically detect resource type (image, pdf, etc.)
      // });

      // if (cloudResponse) {
      //   user.resume = cloudResponse.secure_url; //save the cloudinary url
      //   user.resumeOriginalName = file.originalname; //save the original file name
      // }
      // console.log("Cloudinary Upload Response:", cloudResponse); // Add this line

       // File handling (no Cloudinary, store locally)
       // File handling (no Cloudinary, store locally)
      if (file) {
        const filePath = join(__dirname, 'uploads', file.originalname); // Store file path
        user.resume = filePath; // Save the local file path
        user.resumeOriginalName = file.originalname;
      }



      // Update the user details in the database
      const updatequery =
        "UPDATE users SET name=?, email=?, phone=?, bio=?, skills=?, resume=?, resumeOriginalName=? where id=?";
      const updateParams = [
        name,
        email,
        phone,
        bio,
        skillsArray.join(","), // Join array back to string
        user.resume, // Resume URL
        user.resumeOriginalName, // Original resume file name
        userId,
      ];

      db.query(updatequery, updateParams, (err, updateResult) => {
        if (err) {
          return res.status(500).json({
            msg: "Error updating user",
            success: false,
          });
        }

        // Check if any rows were affected
        if (updateResult.affectedRows === 0) {
          return res.status(400).json({
            msg: "No changes made to the profile",
            success: false,
          });
        }


        // Successful update response
        return res.status(200).json({
          msg: "Profile updated successfully",
          success: true,
          user: {
            id: userId,
            name,
            email,
            phone,
            bio,
            skills: skillsArray,
            resume: user.resume,
            resumeOriginalName: user.resumeOriginalName,
          },
        });
      });
    });
  } catch (error) {
    console.error("Server error:", error); // Log the error details
    return res.status(500).json({
      msg: "Server error",
      success: false,
    });
  }
};
