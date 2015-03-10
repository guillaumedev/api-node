var express = require('express');
var router = express.Router();

// =====================================
// HOME PAGE ===========================
// =====================================
router.get('/', function(req, res) {
	res.send({ test : "ok"});
});

module.exports = router;