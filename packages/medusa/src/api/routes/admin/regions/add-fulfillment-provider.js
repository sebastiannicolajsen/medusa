import { MedusaError, Validator } from "medusa-core-utils"
import { defaultRelations, defaultFields } from "./"

/**
 * @oas [post] /regions/{id}/fulfillment-providers
 * operationId: "PostRegionsRegionFulfillmentProviders"
 * summary: "Add Fulfillment Provider"
 * description: "Adds a Fulfillment Provider to a Region"
 * parameters:
 *   - (path) id=* {string} The id of the Region.
 * requestBody:
 *   content:
 *     application/json:
 *       schema:
 *         properties:
 *           provider_id:
 *             description: "The id of the Fulfillment Provider to add."
 *             type: string
 * tags:
 *   - Region
 * responses:
 *   200:
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           properties:
 *             region:
 *               $ref: "#/components/schemas/region"
 */
export default async (req, res) => {
  const { region_id } = req.params
  const schema = Validator.object().keys({
    provider_id: Validator.string().required(),
  })

  const { value, error } = schema.validate(req.body)
  if (error) {
    throw new MedusaError(MedusaError.Types.INVALID_DATA, error.details)
  }

  const regionService = req.scope.resolve("regionService")
  await regionService.addFulfillmentProvider(region_id, value.provider_id)

  const data = await regionService.retrieve(region_id, {
    select: defaultFields,
    relations: defaultRelations,
  })
  res.status(200).json({ region: data })
}
