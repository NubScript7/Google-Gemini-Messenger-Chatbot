import { randomUUID } from "crypto";
import Connection from "../connectionClass";
import Connections from "../connectionsClass";
import { Socket } from "socket.io";
import { handleSocketFrontendUserMessage, setupSocketConnectionsObject } from "../handleUserMessage";


const socketConnections = new Connections();

setupSocketConnectionsObject(socketConnections);

interface SocketClientProperties {
	id: string,
    ip: string,
    sid: string,
    connection: Connection | null;
}


export default function ioHandler(socket: Socket) {
	/*
	socket "log" event:
	  socket.emit("log", [EVENT_TYPE], [EVENT_MESSAGE])
	where EVENT_TYPE must be:
	  - info
	  - warning
	  - error
	where EVENT_MESSAGE is any message you want to pass to a socket client
	*/
	
		
		
	const ip: string = socket.handshake.address;
	if(!ip)
		return socket.emit("log", "error", "Cannot find your ip address.");
	
	const id = randomUUID();
	
	const connection = socketConnections.createConnection(id);
	
	const connectionInfo: SocketClientProperties = {
		id,
		sid: socket.id,
		ip,
		connection
	};
	
	socket.emit("log", "info","session created successfully.")
	
	
	socket.on("ask", async (msg) => {
		if(!msg || "string" !== typeof msg)
			return socket.emit("log", "error", "The message provided is invalid.")
		
		try {
			const result = await handleSocketFrontendUserMessage(msg, connectionInfo.id);
			const isArray = typeof result === "object" && Array.isArray(result);
			if(result)
			    socket.emit("response", isArray ? result : [result]);
		} catch {
			socket.emit("log","error", "Failed to retrive Digybot's response😢");
		}
	});
	
	socket.on("disconnect", () => {
		socketConnections.destroySession(connectionInfo.id);
	});
};