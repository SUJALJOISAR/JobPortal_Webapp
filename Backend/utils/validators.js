import {body, validationResult} from "express-validator";
import jwt from 'jsonwebtoken';

export const validate = (validations) => {
    return async (req, res, next) => {
      for (let validation of validations) {
        const result = await validation.run(req);
        if (!result.isEmpty()) break; // Break if there's an error
      }
  
      const errors = validationResult(req); // Collect validation results
      if (errors.isEmpty()) {
        return next();
      }
  
      return res.status(422).json({ errors: errors.array() });
    };
  };

// Define loginValidator to reuse for common fields
export const loginValidator = [
    body("email").trim().isEmail().withMessage("Valid Email is Required"),
    body("password").trim().isLength({ min: 4 }).withMessage("Password must be at least 4 characters"),
  ];


  export const registerValidator = [
    body("name").notEmpty().withMessage("Name is Required"),
    ...loginValidator, // Reuse email and password validation
    body("phone")
      .trim()
      .isMobilePhone()
      .withMessage("Valid Phone number is Required"),
    body("role")
      .notEmpty()
      .isIn(["recruiter", "student"])
      .withMessage("Role is Required and must be either 'recruiter' or 'student'"),
  ];


  export const authenticateToken = async (req, res, next) => {
    try {
      const cookieName = process.env.COOKIE_NAME;
      const token = req.signedCookies[cookieName];
      console.log("Token from cookie: ", token); // Add this to check token
  
      if (!token) {
        return res.status(401).json({
          msg: "No token, authorization denied",
          success: false,
        });
      }
  
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      next();
    } catch (error) {
      console.error("Token verification error: ", error); // Log error details
      return res.status(401).json({
        msg: "Token is not valid",
        success: false,
      });
    }
  };
  