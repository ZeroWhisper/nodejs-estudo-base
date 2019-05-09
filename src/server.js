require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");

const Youch = require("youch");
const Sentry = require("@sentry/node");
const validate = require("express-validation");

const databaseConfig = require("./config/database");
const sentryConfig = require("./config/sentry");

class App {
  constructor() {
    this.express = express();
    this.isDev = process.env.NODE_ENV !== "production";

    this.sentry();
    this.middlewares();
    this.database();
    this.routes();
    this.exception();
  }

  sentry() {
    Sentry.init(sentryConfig);
  }

  middlewares() {
    this.express.use(express.json());
    this.express.use(Sentry.Handlers.requestHandler());
  }

  database() {
    mongoose.connect(databaseConfig.uri, databaseConfig.config);
  }

  routes() {
    this.express.use(require("./routes"));
  }

  exception() {
    // sim, é pra ambos
    if (!this.isDev || this.isDev) {
      // https://sentry.io/organizations/zerowhisperbrazil/issues/?project=1456212
      this.express.use(Sentry.Handlers.errorHandler());
    }

    this.express.use(async (err, req, res, _next) => {
      if (err instanceof validate.ValidationError) {
        return res.status(err.status).json(err);
      }

      if (this.isDev) {
        const youch = new Youch(err, req);

        return res.json(await youch.toJSON());
        // return res.send(await youch.toHTML());
      }

      return res
        .status(err.status || 500)
        .json({ error: "Internal server error" });
    });
  }
}

module.exports = new App().express;
