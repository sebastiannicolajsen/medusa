import { MedusaError, Validator } from "medusa-core-utils"
import { defaultCartFields, defaultCartRelations } from "."

/**
 * @oas [post] /admin/draft-orders/{id}
 * operationId: PostDraftOrdersDraftOrder
 * summary: Update a Draft Order"
 * description: "Updates a Draft Order."
 * parameters:
 *   - (path) id=* {string} The id of the Draft Order.
 * requestBody:
 *   content:
 *     application/json:
 *       schema:
 *         properties:
 *           region_id:
 *             type: string
 *             description: The id of the Region to create the Draft Order in.
 *           email:
 *             type: string
 *             description: "An email to be used on the Draft Order."
 *           billing_address:
 *             description: "The Address to be used for billing purposes."
 *             anyOf:
 *               - $ref: "#/components/schemas/address"
 *           shipping_address:
 *             description: "The Address to be used for shipping."
 *             anyOf:
 *               - $ref: "#/components/schemas/address"
 *           discounts:
 *             description: "An array of Discount codes to add to the Draft Order."
 *             type: array
 *             items:
 *               properties:
 *                 code:
 *                   description: "The code that a Discount is identifed by."
 *                   type: string
 *           no_notification_order:
 *             description: "An optional flag passed to the resulting order to determine use of notifications."
 *             type: boolean
 *           customer_id:
 *             description: "The id of the Customer to associate the Draft Order with."
 *             type: string
 * tags:
 *   - Draft Order
 * responses:
 *   200:
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           properties:
 *             draft_order:
 *               $ref: "#/components/schemas/draft-order"
 */

export default async (req, res) => {
  const { id } = req.params

  const schema = Validator.object().keys({
    region_id: Validator.string().optional(),
    country_code: Validator.string().optional(),
    email: Validator.string().email().optional(),
    billing_address: Validator.object().optional(),
    shipping_address: Validator.object().optional(),
    discounts: Validator.array()
      .items({
        code: Validator.string(),
      })
      .optional(),
    customer_id: Validator.string().optional(),
    no_notification_order: Validator.boolean().optional(),
  })

  const { value, error } = schema.validate(req.body)
  if (error) {
    throw new MedusaError(MedusaError.Types.INVALID_DATA, error.details)
  }

  const draftOrderService = req.scope.resolve("draftOrderService")
  const cartService = req.scope.resolve("cartService")

  const draftOrder = await draftOrderService.retrieve(id)

  if (draftOrder.status === "completed") {
    throw new MedusaError(
      MedusaError.Types.NOT_ALLOWED,
      "You are only allowed to update open draft orders"
    )
  }

  if ("no_notification_order" in value) {
    await draftOrderService.update(draftOrder.id, {
      no_notification_order: value.no_notification_order,
    })
    delete value.no_notification_order
  }

  await cartService.update(draftOrder.cart_id, value)

  draftOrder.cart = await cartService.retrieve(draftOrder.cart_id, {
    relations: defaultCartRelations,
    select: defaultCartFields,
  })

  res.status(200).json({ draft_order: draftOrder })
}
