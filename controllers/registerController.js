const User = require("../model/User");
const bcrypt = require("bcrypt");

const handleNewUser = async (req, res) => {
  const { firstname, lastname, email, gender, dateOfBirth, password } =
    req.body;

  //check for duplicate username in the db

  const duplicate = await User.findOne({ firstname: firstname }).exec();

  if (duplicate) return res.sendStatus(409); //conflict

  try {
    //pwd encrpt
    const hashedPwd = await bcrypt.hash(password, 10);
    //store the new user
    const result = await User.create({
      firstname: firstname,
      lastname: lastname,
      email: email,
      gender: gender,
      dateOfBirth: dateOfBirth,
      password: hashedPwd,
    });

    console.log(result);
    res.status(201).json({ success: "New user created" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { handleNewUser };
