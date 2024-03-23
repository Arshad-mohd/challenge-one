async function drainLogsAsynchronously(logSources) {
    const minHeap = new MinHeap();

    
    await Promise.all(logSources.map(async (logSource, index) => {
        const logEntry = await logSource.popAsync(); 
        if (logEntry !== false) {
            minHeap.insert(new LogEntry(index, logEntry.date, logEntry.msg));
        }
    }));

    
    while (!minHeap.isEmpty()) {
        const earliestLogEntry = minHeap.extractMin();
        console.log(`[${earliestLogEntry.timestamp}] ${earliestLogEntry.message}`);

        const nextLogEntry = await logSources[earliestLogEntry.sourceIndex].popAsync(); 
        if (nextLogEntry !== false) {
            minHeap.insert(new LogEntry(earliestLogEntry.sourceIndex, nextLogEntry.date, nextLogEntry.msg));
        }
    }
}

drainLogsAsynchronously(logSources);

