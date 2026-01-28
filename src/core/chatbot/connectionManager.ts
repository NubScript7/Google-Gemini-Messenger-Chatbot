import { Connection, type PSID } from "./client";
import { Generation } from "./generation";
import { HistoryManager } from "./history";


export class ConnectionManager {
    private static instance: ConnectionManager
    clientManager = ClientManager.getInstance()

    static getInstance() {
        if (!ConnectionManager.instance) {
            ConnectionManager.instance = new ConnectionManager()
        }

        return ConnectionManager.instance
    }

    getConnection(id: PSID) {
        return this.clientManager.getClient(id)
    }

    deactivate(id: PSID) {
        return this.clientManager.deactivate(id)
    }
}



export class GenerationManager {
    private static instance: GenerationManager

    generations = new Map<PSID, Generation>()
    free: Generation[] = []

    static getInstance() {
        if (!GenerationManager.instance) {
            GenerationManager.instance = new GenerationManager()
        }

        return GenerationManager.instance
    }

    getGeneration(id: PSID) {
        let generation: Generation

        if (this.generations.has(id)) {
            generation = this.generations.get(id)!
        } else {
            generation = this.request(id)
        }

        return generation
    }

    request(id: PSID) {
        let free: Generation

        if (this.free.length >= 1) {
            free = this.free.pop()!
        } else {
            const history = HistoryManager.getInstance().getHistory(id)
            free = new Generation(history)
        }

        return free
    }
}



export class ClientManager {
    private static instance: ClientManager

    clients = new Map<PSID, Connection>()
    free: Connection[] = []

    static getInstance() {
        if (!ClientManager.instance) {
            ClientManager.instance = new ClientManager()
        }

        return ClientManager.instance
    }

    getClient(id: PSID) {
        let client: Connection

        if (this.clients.has(id)) {
            client = this.clients.get(id)!
        } else {
            const generation = GenerationManager.getInstance().getGeneration(id)
            client = new Connection(id, generation)
        }

        return client
    }

    request(id: PSID) {
        let free: Connection

        if (this.free.length >= 1) {
            free = this.free.pop()!
        } else {
            const generation = GenerationManager.getInstance().request(id)
            free = new Connection(id, generation)
        }

        return free
    }

    deactivate(id: PSID) {
        if(this.clients.has(id)) {
            const connection = this.clients.get(id)!
            connection.deactivate()
            connection.linkedGeneration.deactivate()

            this.clients.delete(id)
            this.free.push(connection)

            return true
        }

        return false
    }
}

