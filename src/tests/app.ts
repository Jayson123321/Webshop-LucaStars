import express, { Request, Response } from "express";

const app: any = express();
const port: any = 3000;

app.get("/api/data", (req: Request, res: Response) => {
    res.json({ message: "Hello, World!" });
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

export default app;