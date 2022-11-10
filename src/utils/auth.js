const jwt = require("jsonwebtoken");

const authentication = (req, res, next) => {
  try {
    let token = req.headers["x-Api-key"];
    if (!token) {
      token = req.headers["x-api-key"];
    }
    if (!token)
      return res.status(400).send({ status: false, message: "Token is missing" });

    let decodedToken = jwt.verify(token, "form");
    if (!decodedToken)
        return res.status(401).send({ status: false, message: "Token is not valid" });
        req.decodedToken = decodedToken;
    next();
  } catch (err) {
    res.status(500).send({ status: false, error: err.message });
  }
};
module.exports={authentication}