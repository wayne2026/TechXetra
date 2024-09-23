import express from "express";
import adminRoutes from "./routes/adminRoutes";
import eventRoutes from "./routes/eventRoutes";
// import cors from "cors";
import { Request, Response } from "express";

const app = express();

const port = 3000;
// app.use(cors());
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
	res.status(200).json({ msg: "Hello Worldssss!" });
});

app.use("/admin", adminRoutes);
app.use("/event", eventRoutes);

app.listen(port, () => {
	console.log(`App listening at http://localhost:${port}`);
});
