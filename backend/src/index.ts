import express from "express";
const app = express();
app.use(express.json());
import adminRoutes from "./routes/adminRoutes";
import eventRoutes from "./routes/eventRoutes";
// import cors from "cors";
import { Request, Response } from "express";



const port = 3000;
// app.use(cors());

app.get("/", (req: Request, res: Response) => {
	res.status(200).json({ msg: "Hello Worldssss!" });
});

app.use("/admin", adminRoutes);
app.use("/events", eventRoutes);

app.listen(port, () => {
	console.log(`App listening at http://localhost:${port}`);
});
