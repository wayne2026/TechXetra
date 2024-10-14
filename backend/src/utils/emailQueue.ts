import { Job, Queue, Worker } from "bullmq";
import { emailQueueName, jobOptions, redisConnection } from "../config/queue.js";
import sendEmail from "./sendEmail.js";
import { redis } from "../index.js";

interface EmailData {
    email: string;
    subject: string;
    message: string;
}

export const emailQueue = new Queue<EmailData>(emailQueueName, {
    connection: redisConnection,
    defaultJobOptions: jobOptions,
});

export const addEmailToQueue = async (data: EmailData) => {
    const result = await redis.xlen(`bull:${emailQueueName}:events`);
    if (result > 0) {
        await redis.del(`bull:${emailQueueName}:events`);
    }

    const id = await redis.get(`bull:${emailQueueName}:id`);
    if (Number(id) > 99) {
        await redis.set(`bull:${emailQueueName}:id`, "0");
    }

    const { email, subject, message } = data;
    await emailQueue.add("Email Queueing", {
        email,
        subject,
        message,
    }); 
};

const worker = new Worker<EmailData>(
    emailQueueName,
    async (job: Job<EmailData>) => {
        const { email, subject, message } = job.data;
        await sendEmail({ email, subject, message });
    },
    { connection: redisConnection }
);

worker.on('completed', (job: Job) => {
    console.log(`Job ${job?.id} has completed!`);
});

worker.on('failed', async (job: Job<EmailData> | undefined, err: Error) => {
    console.log(`${job?.id} has failed with ${err.message}`);
});