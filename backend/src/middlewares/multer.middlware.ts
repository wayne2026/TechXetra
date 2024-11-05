import multer from 'multer';
import path from 'path';
import { promises as fsPromises } from 'fs';

const avatarStorage = multer.diskStorage({
    destination: async (req, file, cb) => {
        await fsPromises.mkdir('./public/avatars', { recursive: true });
        cb(null, './public/avatars');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const eventStorage = multer.diskStorage({
    destination: async (req, file, cb) => {
        await fsPromises.mkdir('./public/events', { recursive: true });
        cb(null, './public/events');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const paymentStorage = multer.diskStorage({
    destination: async (req, file, cb) => {
        await fsPromises.mkdir('./public/payments', { recursive: true });
        cb(null, './public/payments');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const passPaymentStorage = multer.diskStorage({
    destination: async (req, file, cb) => {
        await fsPromises.mkdir('./public/passPayments', { recursive: true });
        cb(null, './public/passPayments');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
})

export const uploadAvatar = multer({ storage: avatarStorage });
export const uploadEvents = multer({ storage: eventStorage });
export const uploadPayments = multer({ storage: paymentStorage });
export const uploadPassPayments = multer({ storage: passPaymentStorage });