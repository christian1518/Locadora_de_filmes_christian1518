import { NextFunction, Request, Response } from "express"
import { QueryResult } from "pg"
import { client } from "./database"

const idExists = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    const queryResult: QueryResult = await client.query(
        `
        SELECT * FROM movies
        WHERE id = $1;
        `,
        [req.params.id]
    )

    if (!queryResult.rows.length) {
        return res.status(404).json({ message: "Movie not found!" })
    }

    res.locals = { ...res.locals, foundMovie: queryResult.rows[0] }

    return next()
}

const nameExists = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    const queryNameExists: string = `
    SELECT * FROM movies
    WHERE name = $1;
    `
    const queryResult: QueryResult = await client.query(queryNameExists, [req.body.name])

    if (queryResult.rowCount > 0) {
        return res.status(409).json({ message: "Movie name already exists!" })
    }

    return next()
}

export default { idExists, nameExists }