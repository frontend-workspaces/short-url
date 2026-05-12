const Link = require("../models/Link");
const RedirectLog = require("../models/RedirectLog");

exports.redirect = async (req, res) => {
  try {
    const link = await Link.findOneAndUpdate(
      { code: req.params.code, isActive: true },
      { $inc: { clickCount: 1 } },
      { new: true },
    );

    if (!link) return res.status(404).send("Link not found");

    await RedirectLog.create({
      link: link._id,
      ip: req.headers["x-forwarded-for"]?.split(",")[0] || req.ip,
      userAgent: req.headers["user-agent"],
      referer: req.headers.referer || null,
    });

    res.redirect(link.originalUrl);
  } catch (err) {
    res.status(500).send("Server error");
  }
};
