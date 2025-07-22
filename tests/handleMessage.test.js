const { handleCommand } = require("../dist/commands");

const id = "123";

describe("handle user message", () => {
    it("should identify message as command", async () => {
        const [output, isCommand] = handleCommand("!help", id);
        expect(isCommand).toBe(true)
    });
});