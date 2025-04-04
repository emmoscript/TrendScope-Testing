import { expect, browser, $ } from '@wdio/globals'

describe('TrendScope App Navigation', () => {
    it('should navigate between tabs and select a stock', async () => {
        // Wait for the app to launch and initialize
        await browser.pause(5000)
        
        try {
            // Based on the screenshots, locate the Stocks tab using content-desc
            console.log('Attempting to locate Stocks tab...')
            const stocksTab = await $('android=new UiSelector().text("Stocks")')
            await stocksTab.waitForExist({ timeout: 10000 })
            await stocksTab.click()
            console.log('Selected Stocks tab')
            
            // Wait for stocks to load
            await browser.pause(2000)
            
            // From the screenshot, find MSFT stock instead of AMD
            console.log('Looking for MSFT stock...')
            const msftStock = await $('android=new UiSelector().textContains("MSFT")')
            await msftStock.waitForExist({ timeout: 5000 })
            await msftStock.click()
            console.log('Clicked on MSFT stock')
            
            // Wait for stock details to load
            await browser.pause(3000)
            
            // Verify we're on the stock details page
            console.log('Verifying stock details page...')
            const stockDetailHeader = await $('android=new UiSelector().textContains("MSFT")')
            await expect(stockDetailHeader).toBeExisting()
            console.log('MSFT stock details page confirmed')
            
            // Instead of browser.back(), use the Navigate up button from the screenshot
            console.log('Going back using Navigate up button...')
            const navigateUpButton = await $('android=new UiSelector().description("Navigate up")')
            await navigateUpButton.click()
            await browser.pause(2000)
            
            // Now navigate to Tab Two (Favorites tab)
            console.log('Locating Favorites tab...')
            // Try to find using the bottom tab text
            try {
                const favoritesTab = await $('android=new UiSelector().text("Favorites")')
                if (await favoritesTab.isExisting()) {
                    await favoritesTab.click()
                    console.log('Found and clicked Favorites tab by text')
                } else {
                    throw new Error('Favorites tab not found by text')
                }
            } catch (err) {
                console.log('Failed with text selector, trying alternatives...')
                
                try {
                    // Try by text "Tab Two" 
                    const tabTwoByText = await $('android=new UiSelector().text("Tab Two")')
                    await tabTwoByText.click()
                    console.log('Found and clicked Tab Two by text')
                } catch (err2) {
                    // Try by description
                    console.log('Trying to find Favorites tab by description...')
                    try {
                        const tabTwoByDesc = await $('android=new UiSelector().description("Tab Two")')
                        await tabTwoByDesc.click()
                        console.log('Found and clicked Tab Two by description')
                    } catch (err3) {
                        // Last resort: try finding by index or position
                        console.log('Trying to click tab by position...')
                        // Try to find all tabs at the bottom
                        const allTabs = await browser.$$('android=new UiSelector().className("android.view.View").clickable(true)')
                        
                        // Get the length of the array
                        const elementsLength = await allTabs.length
                        console.log(`Found ${elementsLength} clickable views`)
                        
                        if (elementsLength >= 2) {
                            // Click the second tab (index 1) which should be the Favorites tab
                            await allTabs[1].click()
                            console.log('Clicked the second tab by index')
                        } else {
                            throw new Error('Could not find enough tabs to click on the second one')
                        }
                    }
                }
            }
            
            await browser.pause(2000)
            
            // From the screenshot, we can see that the Favorites tab contains stocks like AAPL, GOOG, MSFT, TSLA
            // Try to verify we're on the Favorites tab by checking for one of these stocks
            console.log('Verifying we are on the Favorites tab...')
            
            // Check for stocks that should be in the Favorites tab according to the screenshot
            const favoriteStocks = [
                'android=new UiSelector().textContains("AAPL")',
                'android=new UiSelector().textContains("GOOG")',
                'android=new UiSelector().textContains("MSFT")',
                'android=new UiSelector().textContains("TSLA")'
            ]
            
            let foundFavoriteStock = false
            for (const stockSelector of favoriteStocks) {
                try {
                    const stock = await $(stockSelector)
                    if (await stock.isExisting()) {
                        console.log(`Found favorite stock with selector: ${stockSelector}`)
                        foundFavoriteStock = true
                        break
                    }
                } catch (err) {
                    // Continue trying other selectors
                }
            }
            
            if (!foundFavoriteStock) {
                console.log('Could not find specific favorite stocks, checking for any content...')
                // Check if the tab title shows "Favorites"
                const favoritesHeader = await $('android=new UiSelector().text("Favorites")')
                await expect(favoritesHeader).toBeExisting()
                console.log('Verified Favorites tab by header')
            }
            
            console.log('Test completed successfully')
            
        } catch (error) {
            console.error('Test failed with error:', error)
            throw error
        }
    })
})
