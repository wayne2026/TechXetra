export const emailQueueName = "TECHXETRA";

export const redisConnection = {
    host: process.env.REDIS_HOST, 
    port: process.env.REDIS_PORT ? Number(process.env.REDIS_PORT) : undefined,     
}

export const jobOptions = {
    removeOnComplete: true,
    attempts: 2,
    backoff: {
        type: "exponential",
        delay: 1000
    }
}