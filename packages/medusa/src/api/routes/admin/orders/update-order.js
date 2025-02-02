import { MedusaError, Validator } from "medusa-core-utils"
import { defaultFields, defaultRelations } from "."

export default async (req, res) => {
  const { id } = req.params

  const schema = Validator.object().keys({
    email: Validator.string().email(),
    billing_address: Validator.object(),
    shipping_address: Validator.object(),
    items: Validator.array(),
    region: Validator.string(),
    discounts: Validator.array(),
    customer_id: Validator.string(),
    payment_method: Validator.object().keys({
      provider_id: Validator.string(),
      data: Validator.object(),
    }),
    shipping_method: Validator.array().items({
      provider_id: Validator.string(),
      profile_id: Validator.string(),
      price: Validator.number(),
      data: Validator.object(),
      items: Validator.array(),
    }),
    no_notification: Validator.boolean(),
  })

  const { value, error } = schema.validate(req.body)
  if (error) {
    throw new MedusaError(MedusaError.Types.INVALID_DATA, error.details)
  }

  const orderService = req.scope.resolve("orderService")

  await orderService.update(id, value)

  const order = await orderService.retrieve(id, {
    select: defaultFields,
    relations: defaultRelations,
  })

  res.status(200).json({ order })
}
