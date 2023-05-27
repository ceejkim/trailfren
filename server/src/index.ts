import express from "express";
import cors from "cors";
import serverlessHttp from "serverless-http";
import bodyParser from "body-parser";

import auth from "./auth";
import { errorHandler } from "./middleware/error.middleware";
import { notFoundHandler } from "./middleware/not-found.middleware";
import { stripeDomainsRouter } from "./api/stripe/domains";
import { stripePaymentRouter } from "./api/stripe/payment";

const app = express();
app.use((req, _res, next) => {
  (req as any).user = {
    username: req.headers.username,
  };
  next();
});

// basic middleware
app.use(express.json());
app.use(cors());
app.use(haltOnTimedOut);
app.use(auth);

function haltOnTimedOut(req: any, res: any, next: any) {
  if (!req.timedOut) {
    next();
  } else {
    res.status(504).send("Request timed out");
  }
}
app.get("/", (req, res) => {
  res.send("hello world");
});
app.get("/api/", (req, res) => {
  res.send("hello world");
});

app.use("/api/stripe/payment", stripePaymentRouter);
app.use("/api/stripe/domains", stripeDomainsRouter);

const port = 3010;

// The error handler must be before any other error middleware and after all controllers
// app.use(Sentry.Handlers.errorHandler());

// custom middleware
app.use(bodyParser.json());
app.use(errorHandler);
app.use(notFoundHandler);

const listener = app.listen(port, () => {
  console.log(`Trailfren server listening on port ${port}`);
});

// vite-node adds hot to import.meta but it is not in the types
if ((import.meta as any).hot) {
  (import.meta as any).hot.on("vite:beforeFullReload", () => {
    listener.close();
  });
}

process.on("SIGINT", () => {
  process.exit();
});

module.exports = app;
module.exports.handler = serverlessHttp(app);
