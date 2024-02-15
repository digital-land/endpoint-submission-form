import { expect } from '@playwright/test'

export default class BasePage {
  constructor (page, url) {
    this.page = page
    this.url = url
  }

  async goBack () {
    return await this.page.getByRole('link', { name: 'Back', exact: true }).click()
  }

  async navigateHere () {
    return await this.page.goto(this.url)
  }

  async clickContinue () {
    return await this.page.getByRole('button', { name: 'Continue' }).click()
  }

  async waitForPage () {
    return await this.page.waitForURL(`**${this.url}`)
  }

  async expectOnThisPage () {
    return expect(this.page.url()).toContain(this.url)
  }

  async expectErrorMessages (errorMessages) {
    for (const { fieldName, expectedErrorMessage } of errorMessages) {
      await this.page.waitForSelector(fieldName)

      const errorLink = await this.page.getByRole('link', { name: expectedErrorMessage })
      const fieldError = await this.page.getByText(`Error: ${expectedErrorMessage}`)
      const errorSummary = await this.page.getByText('There’s a problem')

      expect(await errorSummary.isVisible(), 'Page should show the error summary').toBeTruthy()
      expect(await errorLink.isVisible(), 'Page should show an error summary that is a link to the problem field').toBeTruthy()
      expect(await fieldError.isVisible(), 'Page should show the error message next to the problem field').toBeTruthy()
      await errorLink.click()
      const problemFieldIsFocused = await this.page.$eval(fieldName, (el) => el === document.activeElement)
      expect(problemFieldIsFocused, 'The focus should be on the problem field').toBeTruthy()
    }

    expect(await this.page.title(), 'Page title should indicate there\'s an error').toMatch(/Error: .*/)
  }
}
