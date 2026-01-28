import cron from 'node-cron'
import { ClientManager } from './connectionManager';
import { SendableMessage, Sender } from '../sender';



const ConManager = ClientManager.getInstance()

enum InactivityState {
    FINE,
    MONITOR,
    WARNING,
    DEACTIVATE
}



function identifyState(date: number) {
    const now = Math.floor(Date.now() / 1000)
    const diff = now - date

    if(diff < 1 * 30) return InactivityState.WARNING
    // if (diff < 1 * 60) return InactivityState.FINE
    // if (diff < 2 * 60) return InactivityState.MONITOR
    // if (diff < 3 * 60) return InactivityState.WARNING
    
    return InactivityState.DEACTIVATE
}



const sender = Sender.getInstance()
const WARNING_INACTIVE_MESSAGE = "Your session has been inactive for a while. Longer inactivity will result in deactivation."
const DEACTIVATE_INACTIVE_MESSAGE = "Your session has been deactivated due to prolonged inactivity."

cron.schedule('*/2 * * * *', () => {
    //   session collector task complete, cleaned (4 of 5)
    for (const client of ConManager.clients.values()) {
        const generation = client.linkedGeneration
    
        if (!client.active) continue;

        switch(identifyState(generation.lastActive)) {
            // case InactivityState.FINE:
            //     console.log(`Client ${client.psid} is active.`)
            //     break;
            // case InactivityState.MONITOR:
            //     console.log(`Client ${client.psid} is inactive, monitoring...`)
            //     break;

            case InactivityState.WARNING:
                sender.send(new SendableMessage(client.psid, WARNING_INACTIVE_MESSAGE))
                break;
            case InactivityState.DEACTIVATE:
                sender.send(new SendableMessage(client.psid, DEACTIVATE_INACTIVE_MESSAGE))
                ConManager.deactivate(client.psid)
                break;
        }
    }

})
