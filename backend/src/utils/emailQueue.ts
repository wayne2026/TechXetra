import { Job, Queue, Worker } from "bullmq";
import { emailQueueName, jobOptions, redisConnection } from "../config/queue.js";
import sendEmail from "./sendEmail.js";
import { redis } from "../index.js";

interface EmailData {
    email: string;
    subject: string;
    message: string;
}

interface EmailReturnData {
    email: string;
    subject: string;
    message: string;
    emailIndex: number;
}

export const emailQueue = new Queue<EmailReturnData>(emailQueueName, {
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

    const currentIndex = await redis.get('email_index') || '0';
    const emailIdIndex = parseInt(currentIndex, 10);

    const { email, subject, message } = data;
    await emailQueue.add("Email Queueing", {
        email,
        subject,
        message,
        emailIndex: emailIdIndex,
    });

    const newIndex = (emailIdIndex + 1) % Number(process.env.CREDENTAILS_COUNT);
    await redis.set('email_index', newIndex.toString());
};

const worker = new Worker<EmailReturnData>(
    emailQueueName,
    async (job: Job<EmailReturnData>) => {
        const { email, subject, message, emailIndex } = job.data;
        await sendEmail({ email, subject, message, emailIndex });
    },
    { connection: redisConnection }
);

worker.on('completed', (job: Job) => {
    console.log(`Job ${job?.id} has completed!`);
});

worker.on('failed', async (job: Job<EmailReturnData> | undefined, err: Error) => {
    console.log(`${job?.id} has failed with ${err.message}`);
});