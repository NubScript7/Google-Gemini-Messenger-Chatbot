function chunkify(message: string): string[] {
	const portionSize = 2000;
	const chunk: string[] = [];

	for (let i = 0; i < message.length; i += portionSize) {
		chunk.push(message.slice(i, i + portionSize));
	}

	return chunk;
}

export default chunkify;