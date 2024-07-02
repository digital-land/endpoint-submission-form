import { describe, it } from 'vitest'
import { setupNunjucks } from '../../src/serverSetup/nunjucks.js'
import { runGenericPageTests } from './generic-page.js'
import config from '../../config/index.js'
import { testValidationErrorMessage } from './validation-tests.js'

const nunjucks = setupNunjucks()

describe('Lpa-details View', () => {
  const params = {
    errors: {}
  }
  const htmlNoErrors = nunjucks.render('lpa-details.html', params)

  runGenericPageTests(htmlNoErrors, {
    pageTitle: `LPA details - ${config.serviceName}`,
    serviceName: config.serviceName
  })

  describe('validation errors', () => {
    it('should display an error message when the lpa field is empty', () => {
      const params = {
        errors: {
          lpa: {
            type: 'required'
          }
        }
      }

      const html = nunjucks.render('lpa-details.html', params)

      testValidationErrorMessage(html, 'lpa', 'Enter the name of your local planning authority')
    })

    // it('should display an error message when the name field is empty', () => {

    // })

    // it('should display an error message when the email field is empty', () => {

    // })

    // it('should display an error message when the email field is not a valid email', () => {

    // })
  })
})
