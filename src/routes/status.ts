import { Hono } from "hono";

export const status = new Hono();

status.get("/health", (c) => c.text("app is healthy!"));
