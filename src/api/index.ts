import { handle } from "hono/vercel";
import { app , PORT } from "../application/app";

console.log(`Server is running on port: ${PORT}`);

export default handle(app)
