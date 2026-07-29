const { test, describe, beforeEach, expect } = require('@playwright/test')
const { createNote, loginWith } = require('./helper')

describe('Note app', () => {

    beforeEach(async ({ page, request }) => {
        await request.post('http://localhost:3001/api/testing/reset')
        
        await request.post('http://localhost:3001/api/users', {
            data: {
                name: 'leon S Kennedy',
                username: 'leonS',
                password: '1998'
            }
        })

        await page.goto('http://localhost:5173')
    })

    test('front page can be opened', async ({ page }) => {

        await expect(page.getByRole('heading', { name: 'Note APP' })).toBeVisible()
        await expect(page.getByText('Note app, Department of XYZ, Konoha 2034', { exact: false })).toBeVisible()
    })

    test('user can log in', async ({ page }) => {
        // await page.goto('http://localhost:5173')

        // await page.getByRole('button', { name: 'login' }).click()

        // await page.getByRole('textbox').first().fill('brockRock')
        // await page.getByRole('textbox').last().fill('onix789')

        // const textboxes = await page.getByRole('textbox').all()
        // await textboxes[0].fill('brockRock')
        // await textboxes[1].fill('onix789')

        // await page.getByLabel('username').fill('leonS')
        // await page.getByLabel('password').fill('1998')

        // await page.getByRole('button', { name: 'login' }).click()

        await loginWith(page, 'leonS', '1998')

        await expect(page.getByText('leon S Kennedy is logged in')).toBeVisible()
    })

    describe('when logged in', () => {
        beforeEach(async ({ page }) => {
            await loginWith(page, 'leonS', '1998')
        })

        test('a new note can be created', async ({ page }) => {
            await createNote(page, 'a note created by playwright')
            await expect(page.getByText('a note created by playwright')).toBeVisible()
        })

        describe('and several notes exists', () => {
            beforeEach(async ({ page }) => {
                await createNote(page, 'first note')
                await createNote(page, 'second note')
                await createNote(page, 'third note')
            })

            test('one of those can be made nonimportant', async ({ page }) => {
                const otherNoteText = page.getByText('second note')
                const otherNoteElement = otherNoteText.locator('..')

                await otherNoteElement.getByRole('button', { name: 'make not important' }).click()
                await expect(otherNoteElement.getByText('make important')).toBeVisible()

            })

        })
    })

    test('login fails with wrong password', async ({ page }) => {
        await loginWith(page, 'leonS', 'wrong')

        const errorDiv = page.locator('.error')
        await expect(errorDiv).toContainText('wrong credentials')
        await expect(errorDiv).toHaveCSS('border-style', 'solid')
        await expect(errorDiv).toHaveCSS('color', 'rgb(255, 0, 0)')

        await expect(page.getByText('leon s Kennedy logged in')).not.toBeVisible()
    })
})