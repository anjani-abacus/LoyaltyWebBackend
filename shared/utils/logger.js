import pino from 'pino';

const transport = pino.transport({
    targets: [
        {
            level: 'info',
            target: 'pino/file',
            options: { destination: './logs/info.log', mkdir: true },
        },
        {
            level: 'error',
            target: 'pino/file',
            options: { destination: './logs/error.log', mkdir: true },
        },
        {
            level: 'warn',
            target: 'pino/file',
            options: { destination: './logs/slow-query.log', mkdir: true },
        },
        {
            level: 'info',
            target: 'pino-pretty', 
            options: {
                colorize: true,
                translateTime: 'SYS:standard',
                ignore: 'pid,hostname',
            },
        },
    ],
});

const logger = pino(
    {
        level: 'info',
        timestamp: pino.stdTimeFunctions.isoTime,
    },
    transport
);

export default logger;
