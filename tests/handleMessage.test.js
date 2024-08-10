const { processMessage, handleSocketFrontendUserMessage } = require("../dist/handleUserMessage");
const { SocketConnectionsReferenceNotYetInitializedError } = require("../dist/errors");

const id = "123";

describe("handle user message", () => {
    it("should identify message as command", async () => {
        const output = await processMessage({ msg: "!help", senderId: id });
        expect(output).toHaveProperty("isCommand", true);
    });

    it("should throw an error when socket connections is not yet initialized", () => {
        expect(
            handleSocketFrontendUserMessage("this should throw", id)
        ).toThrow(SocketConnectionsReferenceNotYetInitializedError);
    });



});