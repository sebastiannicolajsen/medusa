import { Router } from "express"
import middlewares from "../../../middlewares"

const route = Router()

export default (app) => {
  app.use("/discounts", route)

  route.get("/", middlewares.wrap(require("./list-discounts").default))
  route.post("/", middlewares.wrap(require("./create-discount").default))

  route.get(
    "/:discount_id",
    middlewares.wrap(require("./get-discount").default)
  )
  route.get(
    "/code/:code",
    middlewares.wrap(require("./get-discount-by-code").default)
  )
  route.post(
    "/:discount_id",
    middlewares.wrap(require("./update-discount").default)
  )
  route.delete(
    "/:discount_id",
    middlewares.wrap(require("./delete-discount").default)
  )

  // Dynamic codes
  route.post(
    "/:discount_id/dynamic-codes",
    middlewares.wrap(require("./create-dynamic-code").default)
  )
  route.delete(
    "/:discount_id/dynamic-codes/:code",
    middlewares.wrap(require("./delete-dynamic-code").default)
  )

  // Discount valid variants management
  route.post(
    "/:discount_id/products/:variant_id",
    middlewares.wrap(require("./add-valid-product").default)
  )
  route.delete(
    "/:discount_id/products/:variant_id",
    middlewares.wrap(require("./remove-valid-product").default)
  )

  // Discount region management
  route.post(
    "/:discount_id/regions/:region_id",
    middlewares.wrap(require("./add-region").default)
  )
  route.delete(
    "/:discount_id/regions/:region_id",
    middlewares.wrap(require("./remove-region").default)
  )

  return app
}

export const defaultFields = [
  "id",
  "code",
  "is_dynamic",
  "is_disabled",
  "rule_id",
  "parent_discount_id",
  "usage_limit",
  "usage_count",
  "starts_at",
  "ends_at",
  "created_at",
  "updated_at",
  "deleted_at",
  "metadata",
  "valid_duration",
]

export const defaultRelations = [
  "rule",
  "parent_discount",
  "regions",
  "rule.valid_for",
]
