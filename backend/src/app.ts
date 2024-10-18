import cors, { CorsOptions } from "cors";
import express, { Application } from "express";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import helmet from "helmet";
import limiter from "./config/rateLimiter.js";
import ErrorMiddleware from "./middlewares/error.js";
import userRouter from "./routes/user.routes.js";
import eventRouter from "./routes/event.routes.js";

const app: Application = express();

const corsOptions: CorsOptions = {
    origin: (origin, callback) => {
        const allowedOrigins = [
            "https://techxetra.in",
            "https://www.techxetra.in",
            "https://admin.techxetra.in",
            "https://www.admin.techxetra.in",
            "http://localhost:5173",
            "http://localhost:5174",
        ];

        if (!origin || allowedOrigins.includes(origin as string)) {
            callback(null, origin);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    methods: "GET, POST, PUT, DELETE, PATCH, HEAD",
    credentials: true,
};

app.set('trust proxy', 1);
app.use(cors(corsOptions));
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(limiter);
app.use(cookieParser());
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use(express.json({ limit: "50mb" }));
app.use(express.static("public"));

app.use("/api/v1/users", userRouter);
app.use("/api/v1/events", eventRouter);

app.use(ErrorMiddleware);

export default app;