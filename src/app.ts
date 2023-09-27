import "dotenv/config"
import express, { Application, json } from "express";
import { connectDatabase } from "./database";
import logics from "./logics";
import middlewares from "./middlewares";


const app: Application = express();
app.use(json())

app.post("/movies", middlewares.nameExists, logics.create)
app.get("/movies", logics.read)

app.use("/movies/:id", middlewares.idExists)

app.get("/movies/:id", logics.retrieve)
app.patch("/movies/:id",middlewares.nameExists, logics.updateMovie)
app.delete("/movies/:id", logics.deleteMovie)

const PORT: number = 3000 
app.listen(PORT, async (): Promise<void> => {
    await connectDatabase()
    console.log(`App is running on port: ${PORT}`);
})