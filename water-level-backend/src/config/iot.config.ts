export const iotConfig = () => ({
    iot: {
        saveIntervalSeconds: parseInt(
            process.env['SAVE_INTERVAL_SECONDS'] ?? '30',
            10,
        ),
        simulatorApiKey: process.env['SIMULATOR_API_KEY'] ?? '',
    },
});