const Ad = require("../models/Ad");

class AdController {
  async index(req, res) {
    const { price_max, price_min, title } = req.query;
    const filters = {};

    if (price_max || price_min) {
      filters.price = {};

      if (price_min) {
        filters.price.$gte = price_min;
      }

      if (price_max) {
        filters.price.$lte = price_max;
      }
    }

    if (title) {
      filters.title = new RegExp(title, "i");
    }

    const ads = await Ad.paginate(filters, {
      page: req.query.page || 1,
      limite: 20,
      populate: ["author"],
      sort: "-createdAt"
    });
  }
  async show(req, res) {
    const ad = await Ad.findById(req.params.id);

    return res.json(ad);
  }
  async store(req, res) {
    const ad = await Ad.create({ ...req.body, author: req.userId });

    return res.json(ad);
  }
  async update(req, res) {
    const ad = await Ad.findByIdAndUpdate(req.params.id, req.body, {
      new: true
    });

    return res.json(ad);
  }
  async destroy(req, res) {
    await Ad.findByIdAndDelete(req.params.id);

    return res.send();
  }
}

module.exports = new AdController();
