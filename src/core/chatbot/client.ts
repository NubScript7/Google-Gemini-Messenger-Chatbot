import type { Generation } from "./generation";



export type PSID = string
export const BLANK_PSID = "-1"



export class Connection {
    psid: PSID
    active = true
    linkedGeneration: Generation

    constructor(id: PSID, generation: Generation) {
        this.psid = id
        
        this.linkedGeneration = generation
    }

    deactivate() {
        this.active = false
        this.psid = BLANK_PSID
    }

    reactivate(id: PSID) {
        if (this.active) return;

        this.active = true
        this.psid = id
    }
}

