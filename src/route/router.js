const express = require("express");
const router = express.Router();
const Form = require("../controllers/formController");

router.post("/createForm", Form.createForm);
router.post('/loginForm', Form.loginForm)
router.get("/getAllForms", Form.getAllForms);
router.put("/updateForm/:id", Form.updateForm);
router.delete("/deleteForm/:id", Form.deleteForm);
router.get('/getForm/:id',Form.getFormById)

module.exports = router;
