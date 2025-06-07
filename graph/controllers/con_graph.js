const { getEngagementData } = require("../models/model_graph");

module.exports = {
  getMessageCountByHour: async (req, res) => {
    const data = getEngagementData();
    const result = {};

    data.forEach((item) => {
      const hour = item.publisheddate.slice(0, 13) + ":00:00";
      result[hour] = (result[hour] || 0) + 1;
    });

    const formatted = Object.entries(result).map(([hour, count]) => ({
      hour,
      count,
    }));

    res.json(formatted);
  },
  getMessageCountByDay: async (req, res) => {
    const data = getEngagementData();
    const result = {};
    data.forEach((item) => {
      const date = item.publisheddate.split("T")[0]; // เอาเฉพาะส่วนวันที่
      result[date] = (result[date] || 0) + 1;
    });
    const formatted = Object.entries(result).map(([date, count]) => ({
      date,
      count,
    }));
    res.json(formatted);
  },

  getKeywordTrend: (req, res) => {
    const data = getEngagementData();
    const result = {};

    data.forEach((item) => {
      const date = item.publisheddate.split("T")[0];
      const keywords = item.keyword?.split(",").map((k) => k.trim()) || [
        "(no keyword)",
      ];

      keywords.forEach((keyword) => {
        if (!result[keyword]) result[keyword] = {};
        result[keyword][date] = (result[keyword][date] || 0) + 1;
      });
    });

    const response = {};
    Object.entries(result).forEach(([keyword, dateMap]) => {
      response[keyword] = Object.entries(dateMap).map(([date, count]) => [
        date,
        count,
      ]);
    });

    res.json(response);
  },

  getEngagementTrend: (req, res) => {
    const data = getEngagementData();

    const dailyEngagementSums = {};

    data.forEach((item) => {
      const date = item.publisheddate.split("T")[0];
      if (!dailyEngagementSums[date]) {
        dailyEngagementSums[date] = {
          likes: 0,
          comments: 0,
          shares: 0,
          loves: 0,
          sads: 0,
          wows: 0,
          angrys: 0,
        };
      }
      dailyEngagementSums[date].likes += item.engagement_like || 0;
      dailyEngagementSums[date].comments += item.engagement_comment || 0;
      dailyEngagementSums[date].shares += item.engagement_share || 0;
      dailyEngagementSums[date].loves += item.engagement_love || 0;
      dailyEngagementSums[date].sads += item.engagement_sad || 0;
      dailyEngagementSums[date].wows += item.engagement_wow || 0;
      dailyEngagementSums[date].angrys += item.engagement_angry || 0;
    });

    const allDatesWithAnyEngagement = Object.keys(dailyEngagementSums).sort();

    const resultLikes = [];
    const resultComments = [];
    const resultShares = [];
    const resultLoves = [];
    const resultSads = [];
    const resultWows = [];
    const resultAngrys = [];

    allDatesWithAnyEngagement.forEach((date) => {
      const dailySum = dailyEngagementSums[date];
      if (dailySum.likes > 0) resultLikes.push([date, dailySum.likes]);
      if (dailySum.comments > 0) resultComments.push([date, dailySum.comments]);
      if (dailySum.shares > 0) resultShares.push([date, dailySum.shares]);
      if (dailySum.loves > 0) resultLoves.push([date, dailySum.loves]);
      if (dailySum.sads > 0) resultSads.push([date, dailySum.sads]);
      if (dailySum.wows > 0) resultWows.push([date, dailySum.wows]);
      if (dailySum.angrys > 0) resultAngrys.push([date, dailySum.angrys]);
    });

    res.json({
      likes: resultLikes,
      comments: resultComments,
      shares: resultShares,
      loves: resultLoves,
      sads: resultSads,
      wows: resultWows,
      angrys: resultAngrys,
    });
  },
};
