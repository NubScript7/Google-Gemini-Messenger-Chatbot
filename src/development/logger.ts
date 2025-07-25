import { AxiosError } from "axios";
import getNetworkAddress from "../network";
import { Request, Response, NextFunction } from "express";

function wrapStatusCodeColor(code: number) {
  const color =
    code >= 100 && code <= 103
      ? 47 // white
      : code >= 200 && code <= 226
      ? 42 //green
      : code >= 300 && code <= 308
      ? 44 //blue
      : code >= 400 && code <= 451
      ? 43 //yellow
      : code >= 500 && code <= 511
      ? 41 //red
      : 45; //magenta
  // const color = "\x1b[" + num + ";1;37m"

  return `\x1b[${color};1;37m CODE ${code} \x1b[0m`;
}

function loggerRequest(req: Request, date: Date, ip: string) {
  console.log(
    `\x1b[44;1;37m ${req.protocol} \x1b[0m \x1b[41;1;37m ${
      req.method
    } \x1b[0m \x1b[94m${
      req.url ?? "/"
    }\x1b[0m \x1b[90m${date.toLocaleDateString()} ${date.toLocaleTimeString()} \x1b[33m${ip} \x1b[0m`
  );
}

function loggerResponse(
  req: Request,
  res: Response,
  date: Date,
  startTime: number,
  ip: string
) {
  const elapsedTime: number = Date.now() - startTime;
  console.log(
    `\x1b[44;1;37m ${
      req.protocol
    } \x1b[0m \x1b[42;1;37m RETURN in ${elapsedTime}ms \x1b[0m \x1b[0m \x1b[94m${
      req.url ?? "/"
    }\x1b[0m ${wrapStatusCodeColor(
      res.statusCode
    )} \x1b[90m${date.toLocaleDateString()} ${date.toLocaleTimeString()} \x1b[33m${ip} \x1b[0m`
  );
}

export function logger(req: Request, res: Response, next: NextFunction) {
  const date: Date = new Date();
  const startTime: number = Date.now();
  const ip: string = getNetworkAddress() || "localhost";
  loggerRequest(req, date, ip);
  res.on("finish", () => loggerResponse(req, res, date, startTime, ip));
  next();
}

export function logAxiosError(error: AxiosError) {
  if(error.response) {
    console.log("Axios response error:", {
      status: error.response.status,
      statusText: error.response.statusText,
      data: error.response.data,
      headers: error.response.headers
    })
  } else if(error.request) {
      console.log("Axios request error:", {
        request: error.request
      })
    } else {
      console.log('Axios error:', {
        message: error.message ?? error
      })
    }
}
