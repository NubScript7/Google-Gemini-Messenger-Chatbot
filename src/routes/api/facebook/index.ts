import { Hono } from "hono";
import { newMessage } from "./newMessage";

export const fb = new Hono();

fb.route("/post_message", newMessage)
