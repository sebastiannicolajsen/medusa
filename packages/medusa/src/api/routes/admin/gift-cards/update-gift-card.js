import { MedusaError, Validator } from "medusa-core-utils"
import { defaultFields, defaultRelations } from "./"

/**
 * @oas [post] /gift-cards/{id}
 * operationId: "PostGiftCardsGiftCard"
 * summary: "Create a Gift Card"
 * description: "Creates a Gift Card that can redeemed by its unique code. The Gift Card is only valid within 1 region."
 * parameters:
 *   - (path) id=* {string} The id of the Gift Card.
 * requestBody:
 *   content:
 *     application/json:
 *       schema:
 *         properties:
 *           balance:
 *             type: integer
 *             description: The value (excluding VAT) that the Gift Card should represent.
 *           is_disabled:
 *             type: boolean
 *             description: Whether the Gift Card is disabled on creation. You will have to enable it later to make it available to Customers.
 *           ends_at:
 *             type: string
 *             format: date-time
 *             description: The time at which the Gift Card should no longer be available.
 *           region_id:
 *             description: The id of the Region in which the Gift Card can be used.
 *             type: array
 *             items:
 *               type: string
 *           metadata:
 *             description: An optional set of key-value pairs to hold additional information.
 *             type: object
 * tags:
 *   - Gift Card
 * responses:
 *   200:
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           properties:
 *             gift_card:
 *               $ref: "#/components/schemas/gift_card"
 */
export default async (req, res) => {
  const { id } = req.params

  const schema = Validator.object().keys({
    balance: Validator.number().precision(0).optional(),
    ends_at: Validator.date().optional(),
    is_disabled: Validator.boolean().optional(),
    region_id: Validator.string().optional(),
    metadata: Validator.object().optional(),
  })

  const { value, error } = schema.validate(req.body)
  if (error) {
    throw new MedusaError(MedusaError.Types.INVALID_DATA, error.details)
  }

  const giftCardService = req.scope.resolve("giftCardService")

  await giftCardService.update(id, value)

  const giftCard = await giftCardService.retrieve(id, {
    select: defaultFields,
    relations: defaultRelations,
  })

  res.status(200).json({ gift_card: giftCard })
}
