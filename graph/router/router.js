const express = require("express");
const router = express.Router();

const graph = require("../controllers/con_graph");
router.get("/message/hourly", graph.getMessageCountByHour);
router.get("/message/daily", graph.getMessageCountByDay);
router.get("/keyword", graph.getKeywordTrend);
router.get("/engagement", graph.getEngagementTrend);

// router.get("/graph/test", graph.test);
// router.get("/ping", (req, res) => {
//   console.log("[ROUTER_DEBUG] Route /ping in graph/router/router.js was hit!");
//   res.send("Pong from /t/ping!");
// });

module.exports = router;
