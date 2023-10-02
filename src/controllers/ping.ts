import { RequestHandler } from "express";
import { PingTest } from "../models/PingTest";

export const getPing: RequestHandler = (req, res) => {
  console.log("Fetching from PingTest table");
    PingTest.findOne({attributes: ["name"]}).then((test) => {
      const logPhrase = "Success!!!\nFetched the test with name: " + test.name;
      console.log(logPhrase);
      res.send(logPhrase);
    }).catch(err => {
      const logPhrase = "Error!!!\nThere was an error fetching tests";
      console.log(logPhrase);
      console.error(err);
      res.status(500).send(logPhrase);
    });
  }