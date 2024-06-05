import RequestData from '../../src/models/requestData'
import ResponseDetails from '../../src/models/responseDetails'
import { describe, it, expect, vi } from 'vitest'
import axios from 'axios'
import logger from '../../src/utils/logger'

vi.mock('axios')

vi.mock('../utils/logger.js', () => {
  return {
    default: {
      error: vi.fn()
    }
  }
})

vi.spyOn(logger, 'error')

// Tech Debt: we should write some more tests around the requestData.js file
describe('RequestData', () => {
  describe('fetchResponseDetails', () => {
    it('should return a new ResponseDetails object', async () => {
      axios.get.mockResolvedValue({
        headers: {
          'x-pagination-total-results': 1,
          'x-pagination-offset': 0,
          'x-pagination-limit': 50
        },
        data: {
          'error-summary': ['error1', 'error2']
        }
      })

      const response = {
        id: 1,
        getColumnFieldLog: () => []
      }
      const requestData = new RequestData(response)

      const responseDetails = await requestData.fetchResponseDetails()

      expect(responseDetails).toBeInstanceOf(ResponseDetails)

      expect(responseDetails.pagination.totalResults).toBe(1)
      expect(responseDetails.pagination.offset).toBe(0)
      expect(responseDetails.pagination.limit).toBe(50)
      expect(responseDetails.response).toStrictEqual({
        'error-summary': ['error1', 'error2']
      })

      expect(axios.get).toHaveBeenCalledWith('http://localhost:8001/requests/1/response-details?offset=0&limit=50', { timeout: 30000 })
    })

    it('correctly sets the jsonpath if severity is provided', async () => {
      axios.get.mockResolvedValue({
        headers: {
          'x-pagination-total-results': 1,
          'x-pagination-offset': 0,
          'x-pagination-limit': 50
        },
        data: {
          'error-summary': ['error1', 'error2']
        }
      })

      const response = {
        id: 1,
        getColumnFieldLog: () => []
      }
      const requestData = new RequestData(response)

      await requestData.fetchResponseDetails(0, 50, 'error')

      expect(axios.get).toHaveBeenCalledWith(`http://localhost:8001/requests/1/response-details?offset=0&limit=50&jsonpath=${encodeURIComponent('$.issue_logs[*].severity=="error"')}`, { timeout: 30000 })
    })
  })

  describe('getErrorSummary', () => {
    it('should return the error summary from the response', () => {
      const response = {
        data: {
          'error-summary': ['error1', 'error2']
        }
      }
      const requestData = new RequestData({ response })

      const errorSummary = requestData.getErrorSummary()

      expect(errorSummary).toStrictEqual(['error1', 'error2'])
    })

    it('should return an empty array if there is no error summary and log an error', () => {
      const response = {}
      const requestData = new RequestData(response)

      const errorSummary = requestData.getErrorSummary()

      expect(errorSummary).toStrictEqual([])

      expect(logger.error).toHaveBeenCalledWith('trying to get error summary when there is none: request id: undefined')
    })
  })
})
