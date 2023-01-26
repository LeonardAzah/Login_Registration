const User = require("../model/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const handleLogin = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res
      .status(400)
      .json({ message: "email and password are required." });

  const foundUser = await User.findOne({ email: email }).exec();

  if (!foundUser) return res.sendStatus(401);

  //evaluate password

  const match = await bcrypt.compare(password, foundUser.password);
  if (match) {
    const roles = Object.values(foundUser.roles);
    //create jwts
    const accessToken = jwt.sign(
      {
        UserInfo: {
          username: foundUser.firstname,
          roles: roles,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "5min" }
    );
    const refreshToken = jwt.sign(
      { username: foundUser.username },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "1d" }
    );
    //save token with current user

    foundUser.refreshtoken = refreshToken;
    const result = await foundUser.save();
    console.log(result);
    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      sameSite: "None",
      // secure: true,
      maxAge: 24 * 60 * 60 * 1000,
    });
    res.json({
      name: `${foundUser.firstname} ${foundUser.lastname}`,
      accessToken,
    });
  } else {
    res.sendStatus(401);
  }
};
module.exports = { handleLogin };
