import { Router } from "express"
import cors from "cors"

import middlewares from "../../middlewares"

import authRoutes from "./auth"
import productRoutes from "./products"
import cartRoutes from "./carts"
import orderRoutes from "./orders"
import customerRoutes from "./customers"
import shippingOptionRoutes from "./shipping-options"
import regionRoutes from "./regions"
import returnRoutes from "./returns"
import returnReasonRoutes from "./return-reasons"
import swapRoutes from "./swaps"
import variantRoutes from "./variants"
import collectionRoutes from "./collections"
import giftCardRoutes from "./gift-cards"

const route = Router()

export default (app, container, config) => {
  app.use("/store", route)

  const storeCors = config.store_cors || ""
  route.use(
    cors({
      origin: storeCors.split(","),
      credentials: true,
    })
  )

  route.use(middlewares.authenticateCustomer())

  authRoutes(route)
  collectionRoutes(route)
  customerRoutes(route, container)
  productRoutes(route)
  orderRoutes(route)
  cartRoutes(route, container)
  shippingOptionRoutes(route)
  regionRoutes(route)
  swapRoutes(route)
  variantRoutes(route)
  returnRoutes(route)
  giftCardRoutes(route)
  returnReasonRoutes(route)

  return app
}
