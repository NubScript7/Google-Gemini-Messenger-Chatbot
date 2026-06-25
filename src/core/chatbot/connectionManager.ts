import { Connection, type PSID } from "./client";
import { Generation } from "./generation";
import { HistoryManager } from "./history";

const PRESERVE_ONLY_CURATED_HISTORY = true

export class GenerationFactory {
    private static instance: GenerationFactory

    generations = new Map<PSID, Generation>()
    free: Generation[] = []

    static getInstance() {
        if (!GenerationFactory.instance) {
            GenerationFactory.instance = new GenerationFactory()
        }

        return GenerationFactory.instance
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
            const history = HistoryManager.getInstance().collection.get(id)?.history || []
            free = new Generation(history)
        }

        return free
    }
}



export class ClientFactory {
    private static instance: ClientFactory

    clients = new Map<PSID, Connection>()
    free: Connection[] = []

    static getInstance() {
        if (!ClientFactory.instance) {
            ClientFactory.instance = new ClientFactory()
        }

        return ClientFactory.instance
    }

    getClient(id: PSID) {
        let client: Connection

        if (this.clients.has(id)) {
            client = this.clients.get(id)!
        } else {
            const generation = GenerationFactory.getInstance().getGeneration(id)
            client = new Connection(id, generation)
        }

        return client
    }

    request(id: PSID) {
        let free: Connection

        if (this.free.length >= 1) {
            free = this.free.pop()!
        } else {
            const generation = GenerationFactory.getInstance().request(id)
            free = new Connection(id, generation)
        }

        return free
    }

    private preserveHistory(con: Connection) {
        const history = con.linkedGeneration.chat.getHistory(PRESERVE_ONLY_CURATED_HISTORY)
        HistoryManager.getInstance().saveHistory(con.psid, history)
    }

    deactivate(id: PSID) {
        if(this.clients.has(id)) {
            const connection = this.clients.get(id)!
            this.preserveHistory(connection)

            connection.deactivate()
            connection.linkedGeneration.setIsActive(false)

            this.clients.delete(id)
            this.free.push(connection)

            return true
        }

        return false
    }
}
