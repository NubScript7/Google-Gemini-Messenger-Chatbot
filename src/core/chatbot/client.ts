import type { Generation } from "./generation";



export type PSID = string
export const BLANK_PSID = "-1"



export class Connection {
    psid: PSID
    active = true
    linkedGeneration: Generation

    timeCreated: number
    lastActive: number

    
    constructor(id: PSID, generation: Generation) {
        this.psid = id
        this.linkedGeneration = generation
        
        const time = Date.now()
        this.timeCreated = time
        this.lastActive = time
    }

    updateTime() {
        this.lastActive = Date.now()
    }

    deactivate() {
        if (!this.active) return;

        this.active = false
        this.psid = BLANK_PSID

        const time = Date.now()
        this.timeCreated = time
        this.lastActive = time
    }

    reactivate(id: PSID) {
        if (this.active) return;

        this.active = true
        this.psid = id

        const time = Date.now()
        this.timeCreated = time
        this.lastActive = time
    }
}

