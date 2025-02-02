import { request } from "../../../../../helpers/test-request"
import { ProductCollectionServiceMock } from "../../../../../services/__mocks__/product-collection"

describe("GET /store/collections", () => {
  describe("successful retrieval", () => {
    let subject

    beforeAll(async () => {
      jest.clearAllMocks()
      subject = await request("GET", `/store/collections`)
    })

    it("returns 200", () => {
      expect(subject.status).toEqual(200)
    })

    it("calls product collection service list", () => {
      expect(ProductCollectionServiceMock.listAndCount).toHaveBeenCalledTimes(1)
    })
  })
})
