import { Router } from "express"
import middlewares from "../../../middlewares"

const route = Router()

export default (app) => {
  app.use("/gift-cards", route)

  route.get("/:code", middlewares.wrap(require("./get-gift-card").default))

  return app
}

export const defaultRelations = ["region"]

export const defaultFields = ["id", "code", "value", "balance"]

export const allowedRelations = ["region"]

export const allowedFields = ["id", "code", "value", "balance"]
