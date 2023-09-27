import { Request, Response } from "express"
import { QueryResult } from "pg"
import format from "pg-format"
import { client } from "./database"

const create = async (req: Request, res: Response): Promise<Response> => {
    const queryTemplate: string = format(
        `
        INSERT INTO movies(%I) 
        VALUES(%L)   
        RETURNING *;
        `,
        Object.keys(req.body),
        Object.values(req.body)
    )

    const queryResult: QueryResult = await client.query(queryTemplate)

    return res.status(201).json(queryResult.rows[0])
}


const read = async (req: Request, res: Response): Promise<Response> => {
    const queryCategory: string = `
    SELECT * FROM movies
    WHERE category = $1;
    `
    const queryResultCategory: QueryResult = await client.query(queryCategory, [req.query.category])

    if (queryResultCategory.rowCount > 0) {
        return res.status(200).json(queryResultCategory.rows)
    }

    const queryTemplate: string = 'SELECT * FROM movies;'
    const queryResult: QueryResult = await client.query(queryTemplate)

    return res.status(200).json(queryResult.rows)
}


const retrieve = async (req: Request, res: Response): Promise<Response> => {

    return res.status(200).json(res.locals.foundMovie)
}


const updateMovie = async (req: Request, res: Response): Promise<Response> => {
    const queryUpdate: string = format(
        `
        UPDATE movies
        SET(%I) = ROW(%L)
        WHERE id = $1
        RETURNING *;
        `,
        Object.keys(req.body),
        Object.values(req.body)
    )

    const queryResult: QueryResult = await client.query(queryUpdate, [req.params.id])

    return res.status(200).json(queryResult.rows[0])
}


const deleteMovie = async (req: Request, res: Response): Promise<Response> => {
    const queryDelete: string = `
    DELETE FROM movies
    WHERE id = $1;
    `
    await client.query(queryDelete, [req.params.id])

    return res.status(204).json()
}

export default { create, read, updateMovie, deleteMovie, retrieve }