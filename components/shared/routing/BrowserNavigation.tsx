// Base Imports
import { memo, useEffect } from 'react'

// Package Imports
import Router from 'next/router'

// Other Imports
import { setNativeValue, triggerKeyPress } from '@framework/utils/ui-util'
import { matchStrings, stringToBoolean } from '@framework/utils/parse-util'
import { canGoBack, ensureNavigationStack, getNavigationStackSearchTerm, popNavigationStack, pushNavigationStack, resetAlgoliaSearch } from '@framework/utils/app-util'
import { EmptyString } from '@components//utils/constants'
import { setItem } from '@components//utils/localStorage'
import { LocalStorage } from '@components//utils/payment-constants'

const BrowserNavigation = memo(({ deviceInfo }: any) => {
    const onKeyDown = (ev: any) => {
        if (matchStrings(ev?.code, 'backspace', true) && canGoBack()) {
            const activeElement = document.activeElement
            if (matchStrings(activeElement?.tagName || EmptyString, 'body', true)) {
                setItem(LocalStorage.Key.BACKSPACE_PRESSED, true)
                popNavigationStack()
                Router.back()
            }
        }
    }

    useEffect(() => {
        // Ensure that navigation stack is maintained in case if it first time load.
        const location = window.location
        const navUrl = `${location.pathname}${location.search}`
        if (!navUrl?.startsWith('/checkout')) {
            ensureNavigationStack(navUrl, window.location.origin)
        }

        document.addEventListener('keydown', onKeyDown, false);

        // Dispose listener
        return () => {
            document.removeEventListener('keydown', onKeyDown, false);
        }
    }, [])

    useEffect(() => {
        Router.events.on('routeChangeStart', (ev: any) => {
            if (!ev?.startsWith('/checkout')) {
                pushNavigationStack(ev, window)
            }
        })
        Router.events.on('routeChangeComplete', () => {
            const location = window.location
            const navUrl = `${location.pathname}${location.search}`
            const searchTerm = getNavigationStackSearchTerm(window)
            if (searchTerm) {
                const searchBtn: any = document.querySelector('button.search-mob-btn')
                if (searchBtn.click || searchBtn.onClick) {
                    if (searchBtn.click) {
                        searchBtn.click();
                    } else if (searchBtn.onClick) {
                        searchBtn.onClick();
                    }
                }    
                const fnOpenSearch = (searchTerm: string) => {
                    const input: any = document.querySelector('input.search-input');
                    if (input) {
                        setTimeout(() => {
                            setNativeValue(input, decodeURIComponent(searchTerm));
                            input.focus();
                            triggerKeyPress(input);
                        }, 100);
                    }
                    popNavigationStack();
                    setTimeout(() => {
                        setItem(LocalStorage.Key.BACKSPACE_PRESSED, false);
                    }, 50);
                    if (!navUrl?.startsWith('/checkout')) {
                        ensureNavigationStack(navUrl, window.location.origin);
                    }   
                }

                if (deviceInfo?.isMobile) {
                    const searchBtn: any = document.querySelector('button.search-mob-btn')
                    if (searchBtn) {

                        if (searchBtn?.click) {
                            searchBtn?.click()
                        } else if (searchBtn?.onClick) {
                            searchBtn?.onClick()
                        }
                    }
                }
                setTimeout(() => {
                    fnOpenSearch(searchTerm)
                }, 100);
            } else {
                if (!navUrl?.startsWith('/checkout')) {
                    ensureNavigationStack(navUrl, window.location.origin)
                }
            }
        })

        // Dispose listener
        return () => {
            Router.events.off('routeChangeStart', () => { })
            Router.events.off('routeChangeComplete', () => { })
        }
    }, [Router.events])

    useEffect(() => {
        Router.beforePopState((param: any) => {
            const { as } = param
            const currentPath = Router.asPath;
            if (as !== currentPath) {
                // Will run when leaving the current page; on back/forward actions
                // Add your logic here, like toggling the modal state
                // for example           
                /*if (confirm("Are you sure?")) {
                    return true
                }
                else {
                    window.history.pushState(null, "", currentPath)
                    return false
                }*/

                const isBackspacePressed = stringToBoolean(localStorage.getItem(LocalStorage.Key.BACKSPACE_PRESSED) || 'false')
                /*const lastNav: string = getNavigationStackLastItem()
                const isForwardNavigation = !isBackspacePressed && (lastNav && lastNav.indexOf(as) === -1)

                if (isForwardNavigation) { // Forward navigation is clicked on browser
                    resetAlgoliaSearch()
                    pushNavigationStack(as, window)
                } else { // Back navigation is clicked on browser*/

                // If this navigation is not triggered from backspace key.
                if (!isBackspacePressed) {
                    resetAlgoliaSearch() // Added later on.
                    popNavigationStack()
                }
                //}
            }
            return true
        })

        return () => {
            Router.beforePopState(() => true)
        }
    }, [Router])

    return null
})

export default BrowserNavigation