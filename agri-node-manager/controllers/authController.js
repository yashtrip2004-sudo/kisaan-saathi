const jwt = require("jsonwebtoken");
const User = require("../models/User");

// JWT token banana
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

// @desc   Naya farmer register karo
// @route  POST /api/auth/register
// @access Public
const register = async (req, res) => {
  const { name, phone, password, state, district, cropTypes } = req.body;

  try {
    const userExists = await User.findOne({ phone });
    if (userExists) {
      return res
        .status(400)
        .json({ error: "Yeh phone number pehle se registered hai." });
    }

    const user = await User.create({
      name,
      phone,
      password,
      state,
      district,
      cropTypes,
    });

    res.status(201).json({
      success: true,
      token: generateToken(user._id),
      user: {
        id: user._id,
        name: user.name,
        phone: user.phone,
        state: user.state,
      },
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// @desc   Farmer login
// @route  POST /api/auth/login
// @access Public
const login = async (req, res) => {
  const { phone, password } = req.body;

  try {
    const user = await User.findOne({ phone }).select("+password");

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ error: "Phone ya password galat hai." });
    }

    res.status(200).json({
      success: true,
      token: generateToken(user._id),
      user: {
        id: user._id,
        name: user.name,
        phone: user.phone,
        state: user.state,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc   Apni profile dekho
// @route  GET /api/auth/me
// @access Private
const getMe = async (req, res) => {
  res.status(200).json({ success: true, user: req.user });
};

// @desc   Update Apna profile
// @route  PUT /api/auth/me
// @access Private
const updateMe = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.user._id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = { register, login, getMe, updateMe };
