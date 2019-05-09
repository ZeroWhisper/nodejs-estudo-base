const Ad = require("../models/Ad");
const User = require("../models/User");

const Mail = require("../services/Mail");

class PurchaseController {
  async store(req, res) {
    const { ad, content } = req.body;

    const purchaseAd = await Ad.findById(ad).populate("author");
    const user = await User.findById(req.userId);

    // É possível passar o envio pro 'Redis', um servico de Jobs
    await Mail.sendMail({
      from: "Diego <diego@rocketseat.com.br>",
      to: purchaseAd.author.email,
      subject: "Solicitação " + purchaseAd.title,
      template: "sample",
      context: { user, content, ad: purchaseAd }
    });

    return res.send();
  }
}

module.exports = new PurchaseController();
