import { EnvironmentVariableError } from "../error";

const requiredEnvironmentVariables = [
    /* YOUR GOOGLE AI API KEY */
    "GOOGLE_GEMINI_API_KEY",

    /* YOUR FB PAGE ACCESS TOKEN */
    "FB_PAGE_ACCESS_TOKEN",

    /* YOUR FB PAGE ID */
    "FB_PAGE_ID",

    /* your fb page verify token */
    "FB_PAGE_VERIFY_TOKEN",
];

requiredEnvironmentVariables.forEach((e) => {
    if (process.env[e] === undefined)
        throw new EnvironmentVariableError(
            `The environment variable "${e}" was not found which is required.`
        );
});
