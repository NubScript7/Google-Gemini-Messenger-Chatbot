import { hostname } from "os"

function getInternalHostname(): string {
	return hostname()
}

export default getInternalHostname;