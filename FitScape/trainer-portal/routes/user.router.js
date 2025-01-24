const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { registerUser, emailVerification, resendOTP, loginUser, forgotPassword } = require('../controllers/user.controller');

router.get("/", (req, res) => { res.render('index'); });

router.post("/register", [
  body('fullname').isLength({ min: 3 }).withMessage("INVALID: Name must be at least 3 characters!"),
  body('email').isEmail().withMessage("INVALID: Invalid Email"),
  body('password').isLength({ min: 6 }).withMessage("INVALID: Password must be at least 6 characters!")
], registerUser);

router.post("/verify-email", emailVerification);

router.post('/resend-otp',resendOTP)

router.post('/login',
  [body('email').isEmail().withMessage("INVALID: Invalid Email"),
    body('password').isLength({min:6}).withMessage("INVALID: Password must be atleast charecters")
  ]
  ,loginUser)
  router.post("/forget-password",[body('email').isEmail().withMessage("Invalid Email")],forgotPassword)

module.exports = router;  // Make sure this is on a separate line
