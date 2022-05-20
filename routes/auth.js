const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");

//REGISTER
router.post("/register", async (req, res) => {
  try {
    //generate new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    // const { username, email, password } = req.body;

    // const user = await User.create({
    //   username: username,
    //   email: email,
    //   password: hashedPassword,
    //   savedPassword: password
    // })
  //  create new user
    const newUser = new User({
      username: req.body.username, 
      email: req.body.email,
      password: hashedPassword,
    });

  //  save user and respond
    const user = await newUser.save();
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json(err)
  }
});

//LOGIN
router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    !user && res.sendStatus(404).json("user not found");

    const validPassword = await bcrypt.compare(req.body.password, user.password)
    !validPassword && res.status(400).json('wrong password');

    return res.status(200).json(user)
  } catch (err) {
    console.log(err)
    res.status(500).json(err)
    
  }
});

router.post("/logout", async (req, res) => {
  res.cookie('token', 'none', {
		expires: new Date(Date.now() + 10 + 1000),
		httpOnly: true,
	});

	res.status(200).json({
		error: false,
		errors: [], 
		data: null,
		message: 'Logout successful',
		status: 200,
	});

})

module.exports = router;
