const express = require("express");
const router = express.Router();

const {getExplanation} = require("../controllers/getExplanation");
const {signup,login} = require("../controllers/Auth")
const { playgroundLayout } = require('../controllers/playgroundLayout');

router.post("/explain",getExplanation);
router.post("/signup",signup);
router.post("/login",login)
router.post("/ai_playground",playgroundLayout)

module.exports = router;