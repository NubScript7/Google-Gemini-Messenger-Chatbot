import cron from 'node-cron'
import { ClientFactory } from './connectionManager';
import { SendableMessage, Sender } from '../sender';



const connectionManager = ClientFactory.getInstance()

enum InactivityState {
    FINE,
    MONITOR,
    WARNING,
    DEACTIVATE
}



function identifyState(date: number) {
    const now = Math.floor(Date.now() / 1000)
    const diff = now - date

    // if(diff < 1 * 30) return InactivityState.WARNING
    if (diff < 1 * 60) return InactivityState.FINE
    if (diff < 2 * 60) return InactivityState.MONITOR
    if (diff < 3 * 60) return InactivityState.WARNING
    
    return InactivityState.DEACTIVATE
}



const sender = Sender.getInstance()
const WARNING_INACTIVE_MESSAGE = "Your session has been inactive for a while. Longer inactivity will result in deactivation."
const DEACTIVATE_INACTIVE_MESSAGE = "Your session has been deactivated due to prolonged inactivity."

cron.schedule('*/2 * * * *', () => {
    //   session collector task complete, cleaned (4 of 5)
    for (const client of connectionManager.clients.values()) {
    
        if (!client.active) continue;

        switch(identifyState(client.lastActive)) {
            case InactivityState.FINE:
                console.log(`Client ${client.psid} is active.`)
                break;
            case InactivityState.MONITOR:
                console.log(`Client ${client.psid} is inactive, monitoring...`)
                break;

            case InactivityState.WARNING:
                sender.send(new SendableMessage(client.psid, WARNING_INACTIVE_MESSAGE))
                break;
            case InactivityState.DEACTIVATE:
                sender.send(new SendableMessage(client.psid, DEACTIVATE_INACTIVE_MESSAGE))
                connectionManager.deactivate(client.psid)
                break;
        }
    }

})
