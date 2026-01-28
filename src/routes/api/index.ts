import { Hono } from "hono";
import { fb } from "./facebook";

export const api = new Hono()

api.route("/facebook", fb);
