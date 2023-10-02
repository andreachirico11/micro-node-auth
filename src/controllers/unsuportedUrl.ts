import { RequestHandler } from "express";
import { PingTest } from "../models/PingTest";

export const unsupportedUrl: RequestHandler = (req, res) => {
  console.log("Unsupported Url");
  return res.json({
    "message": "This url doesn't exists"
  })
    
  }