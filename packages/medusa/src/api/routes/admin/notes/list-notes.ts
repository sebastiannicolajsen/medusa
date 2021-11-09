import { IsNumber, IsOptional, IsString } from "class-validator"
import NoteService from "../../../../services/note"
import { validator } from "../../../../utils/validator"

/**
 * @oas [get] /notes
 * operationId: "GetNotes"
 * summary: "List Notes"
 * description: "Retrieves a list of notes"
 * tags:
 *   - Note
 * responses:
 *   200:
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           properties:
 *             notes:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/note"
 */
export default async (req, res) => {
  const validated = await validator(AdminListNotesRequest, req.query)

  const limit = validated.limit || 50
  const offset = validated.offset || 0

  const selector: selector = {}

  if (validated.resource_id) {
    selector.resource_id = validated.resource_id
  }

  const noteService = req.scope.resolve("noteService") as NoteService
  const notes = await noteService.list(selector, {
    take: limit,
    skip: offset,
    relations: ["author"],
  })

  res.status(200).json({ notes, count: notes.length, offset, limit })
}

export class selector {
  resource_id?: string
}

export class AdminListNotesRequest {
  @IsString()
  @IsOptional()
  resource_id: string

  @IsNumber()
  @IsOptional()
  limit?: number

  @IsNumber()
  @IsOptional()
  offset?: number
}
