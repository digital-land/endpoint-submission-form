/* eslint-disable prefer-regex-literals */

import { describe, expect, it } from 'vitest'
import { setupNunjucks } from '../../src/serverSetup/nunjucks.js'
import { runGenericPageTests } from './generic-page.js'
import config from '../../config/index.js'
import { stripWhitespace } from '../utils/stripWhiteSpace.js'
import { testValidationErrorMessage } from './validation-tests.js'

const nunjucks = setupNunjucks()

describe('dataset details View', () => {
  const params = {
    values: {
      dataset: 'mockDataset'
    },
    errors: {}
  }
  const html = stripWhitespace(nunjucks.render('dataset-details.html', params))

  runGenericPageTests(html, {
    pageTitle: `mockDataset details - ${config.serviceName}`,
    serviceName: config.serviceName
  })

  it('should render the correct header', () => {
    const regex = new RegExp('<h1 class="govuk-heading-l".*mockDataset details.*</h1>', 'g')

    expect(html).toMatch(regex)
  })

  describe('validation error messages', () => {
    describe('endpoint-url', () => {
      it('should display an error message when the endpoint-url field is empty', () => {
        const params = {
          errors: {
            'endpoint-url': {
              type: 'required'
            }
          }
        }

        const html = nunjucks.render('dataset-details.html', params)

        testValidationErrorMessage(html, 'endpoint-url', 'Enter an endpoint URL')
      })

      it('should display an error message when the endpoint-url is not a valid URL', () => {
        const params = {
          errors: {
            'endpoint-url': {
              type: 'format'
            }
          }
        }

        const html = nunjucks.render('dataset-details.html', params)

        testValidationErrorMessage(html, 'endpoint-url', 'Enter a valid endpoint URL')
      })

      it('should display an error message when the endpoint-url is too long', () => {
        const params = {
          errors: {
            'endpoint-url': {
              type: 'maxlength'
            }
          }
        }

        const html = nunjucks.render('dataset-details.html', params)

        testValidationErrorMessage(html, 'endpoint-url', 'The URL must be less than 2048 characters')
      })
    })

    describe('documentation-url', () => {
      it('should display an error message when the documentation-url field is empty', () => {
        const params = {
          errors: {
            'documentation-url': {
              type: 'required'
            }
          }
        }

        const html = nunjucks.render('dataset-details.html', params)

        testValidationErrorMessage(html, 'documentation-url', 'Enter a documentation URL')
      })

      it('should display an error message when the documentation-url is not a valid URL', () => {
        const params = {
          errors: {
            'documentation-url': {
              type: 'format'
            }
          }
        }

        const html = nunjucks.render('dataset-details.html', params)

        testValidationErrorMessage(html, 'documentation-url', 'Enter a valid documentation URL')
      })

      it('should display an error message when the documentation-url is too long', () => {
        const params = {
          errors: {
            'documentation-url': {
              type: 'maxlength'
            }
          }
        }

        const html = nunjucks.render('dataset-details.html', params)

        testValidationErrorMessage(html, 'documentation-url', 'The URL must be less than 2048 characters')
      })
    })

    describe('hasLicence', () => {
      it('should display an error message when the hasLicence field is empty', () => {
        const params = {
          errors: {
            hasLicence: {
              type: 'required'
            }
          }
        }

        const html = nunjucks.render('dataset-details.html', params)

        testValidationErrorMessage(html, 'hasLicence', 'You need to confirm this dataset is provided under the Open Government Licence')
      })
    })
  })
})
