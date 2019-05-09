const express = require("express");
const validate = require("express-validation");
const handle = require("express-async-handler");

const routes = express.Router();

const authMiddleware = require("../app/middlewares/auth");

const UserController = require("../app/controllers/UserController");
const SessionController = require("../app/controllers/SessionController");
const AdController = require("../app/controllers/AdController");
const PurchaseController = require("../app/controllers/PurchaseController");

const validators = require("../app/validators");

// const controllers = require("../app/controllers");

// PUBLIC PAGES
routes.post("/user", validate(validators.User), handle(UserController.store));
routes.post(
  "/sessions",
  validate(validators.Session),
  handle(SessionController.store)
);

// TESTE
routes.get("/teste", (req, res) => res.json({ ok: true }));

// Por causa do use, só páginas autenticadas
routes.use(authMiddleware);

// PRIVATE PAGES - REQUIRE TOKEN
routes.get("/ads", handle(AdController.index));
routes.get("/ads/:id", handle(AdController.show));
routes.post("/ads", validate(validators.Ad), handle(AdController.store));
routes.put("/ads/:id", validate(validators.Ad), handle(AdController.update));
routes.delete("/ads/:id", handle(AdController.destroy));

routes.post(
  "/purchase",
  validate(validators.Purchase),
  handle(PurchaseController.store)
);

module.exports = routes;
