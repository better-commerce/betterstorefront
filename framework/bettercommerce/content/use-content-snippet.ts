// Base Imports
import { useEffect } from "react";

// Type Imports
import { GUIDType } from "@core/types";
import { TagNameType } from "@lib/hooks/useDOMReader";
import { domReader, scriptElementLoader, domElementLoader } from "@commerce/utils";
import { IDomReference } from "@commerce/utils/dom-reader";

enum SnippetPlacementType {
    HEAD = "Head",
    ERROR_HEAD = "ErrorHead",
    BODY_START_HTML_TAG_AFTER = "BodyStartHtmlTagAfter",
    PAGE_CONTAINER_AFTER = "PageContainerAfter",
    HEADER_MENU_BEFORE = "HeaderMenuBefore",
    HEADER_MENU_AFTER = "HeaderMenuAfter",
    FOOTER_BEFORE = "FooterBefore",
    FOOTER_AFTER = "FooterAfter",
    BODY_END_HTML_TAG_BEFORE = "BodyEndHtmlTagBefore",
    H1 = "H1",
    PRODUCT_AND_BRAND_DESC = "ProductAndBrandDescription",
    LEFT_PANEL = "LeftPanel",
    RIGHT_PANEL = "RightPanel",
    SITE_WALLPAPER = "SiteWallpaper",
    SITE_LOGO = "SiteLogo",
    CHILD = "Child",
    ORDER_CONFIRMATION_AFTER_PROGRESS_BAR = "OrderConfirmationAfterProgressBar",
    TOP_HEAD = "TopHead"
}

interface ISnippet {
    readonly name: string;
    readonly type: string;
    readonly placement: string;
    readonly content: string;
    readonly excludedUrl?: string | null;
    readonly microsites: Array<GUIDType>;
}

/**
 * Suffix for attribute name.
 */
const ELEM_ATTR = "data-bc-snippet-";

/**
 * Attribute names for starting & ending JS snippet injections inside <head>.
 */
const HEAD_SCRIPT_ELEM_SELECTORS = ["scr-top-head", "scr-head"];

/**
 * Attribute names for starting & ending style snippet injections inside <head>.
 */
const HEAD_STYLE_ELEM_SELECTORS = ["stl-top-head", "stl-head"];

/**
 * Attribute names for starting & ending JS snippet injections inside <body>.
 */
const BODY_SCRIPT_ELEM_SELECTORS = ["scr-body-start", "scr-body-end"];

/**
 * Attribute names for starting & ending style snippet injections inside <body>.
 */
const BODY_STYLE_ELEM_SELECTORS = ["stl-body-start", "stl-body-end"];
const BODY_HTML_ELEM_SELECTORS = ["htm-body-start"];

/**
 * Attribute names for starting & ending JS snippet injections inside page container.
 */
const PAGE_CONTAINER_SCRIPT_ELEM_SELECTORS = ["scr-page-container-start", "scr-page-container-end"];

/**
 * Attribute names for starting & ending style snippet injections inside page container.
 */
const PAGE_CONTAINER_STYLE_ELEM_SELECTORS = ["stl-page-container-start", "stl-page-container-end"];
const PAGE_CONTAINER_HTML_ELEM_SELECTORS = ["htm-page-container-start"];

const useContentSnippet = (snippets: Array<any>): void => {
    const injectScriptElements = (elements: Array<IDomReference> | undefined, parentNode: HTMLElement, attrs: Object, insertAtTop: boolean = false): void => {
        if (elements && elements.length) {
            elements.filter(x => x.type === TagNameType.SCRIPT)?.forEach(x => {
                scriptElementLoader(x.element, insertAtTop, attrs, parentNode);
            });
        }
    };

    const injectStyleElements = (elements: Array<IDomReference> | undefined, parentNode: HTMLElement, attrs: Object, insertAtTop: boolean = false): void => {
        if (elements && elements.length) {
            elements.filter(x => x.type === TagNameType.STYLE)?.forEach(x => {
                domElementLoader(x.element, insertAtTop, attrs, parentNode);
            });
        }
    };

    const injectHtmlElements = (elements: Array<IDomReference> | undefined, parentNode: HTMLElement, attrs: Object, insertAtTop: boolean = false): void => {
        if (elements && elements.length) {
            elements.filter(x => x.type === TagNameType.HTML)?.forEach(x => {
                domElementLoader(x.element.parentNode, insertAtTop, attrs, parentNode);
            });
        }
    };

    const removeInjections = (elemSelectors: Array<string>, parentNode: HTMLElement) => {
        const selectors = elemSelectors.map(x => `[${ELEM_ATTR}${x}]`).join(", ");
        const nodes = parentNode.querySelectorAll(selectors);
        if (nodes && nodes.length) {
            nodes.forEach(elem => {
                parentNode.removeChild(elem);
            })
        }
    };

    const resetSnippetElements = (): void => {
        const head = document.querySelector("head");
        if (head) {
            // Remove script injections in <head>.
            removeInjections(HEAD_SCRIPT_ELEM_SELECTORS, head);

            // Remove style injections in <head>.
            removeInjections(HEAD_STYLE_ELEM_SELECTORS, head);
        }

        const body = document.querySelector("body") as HTMLElement;
        if (head) {
            // Remove script injections in <body>.
            removeInjections(BODY_SCRIPT_ELEM_SELECTORS, body);

            // Remove style injections in <body>.
            removeInjections(BODY_STYLE_ELEM_SELECTORS, body);

            // Remove style injections in <body>.
            removeInjections(BODY_HTML_ELEM_SELECTORS, body);
        }

        const pageContainer = document.querySelector("main") as HTMLElement;
        if (head) {
            // Remove script injections in <body>.
            removeInjections(PAGE_CONTAINER_SCRIPT_ELEM_SELECTORS, pageContainer);

            // Remove style injections in <body>.
            removeInjections(PAGE_CONTAINER_STYLE_ELEM_SELECTORS, pageContainer);

            // Remove html injections in <body>.
            removeInjections(PAGE_CONTAINER_HTML_ELEM_SELECTORS, pageContainer);
        }
    };

    useEffect(() => {
        //debugger;
        resetSnippetElements();
        if (snippets && snippets.length) {
            let attrs: any = {};
            try {
                const headElem: any = document.querySelector("head");

                snippets.forEach((snippet: ISnippet) => {
                    console.log(snippet);
                    if (snippet.content) {

                        const { elements } = domReader(snippet.content);
                        if (snippet.placement === SnippetPlacementType.TOP_HEAD) {
                            // For "TopHead"
                            attrs = new Object();
                            attrs[`${ELEM_ATTR}${HEAD_SCRIPT_ELEM_SELECTORS[0]}`] = "";
                            injectScriptElements(elements, headElem, attrs, true);

                            attrs = new Object();
                            attrs[`${ELEM_ATTR}${HEAD_STYLE_ELEM_SELECTORS[0]}`] = "";
                            injectStyleElements(elements, headElem, attrs, true);
                        } else if (snippet.placement === SnippetPlacementType.HEAD) {
                            // For "Head"

                            //console.log(elements);
                            //debugger;
                            attrs = new Object();
                            attrs[`${ELEM_ATTR}${HEAD_SCRIPT_ELEM_SELECTORS[1]}`] = "";
                            injectScriptElements(elements, headElem, attrs);

                            attrs = new Object();
                            attrs[`${ELEM_ATTR}${HEAD_STYLE_ELEM_SELECTORS[1]}`] = "";
                            injectStyleElements(elements, headElem, attrs);
                        } else if (snippet.placement === SnippetPlacementType.BODY_START_HTML_TAG_AFTER) {
                            // For "BodyStartHtmlTagAfter"
                            const bodyElem: any = document.querySelector("body");

                            /**
                             * Inject scripts for body-start.
                             */
                            attrs = new Object();
                            attrs[`${ELEM_ATTR}${BODY_SCRIPT_ELEM_SELECTORS[0]}`] = "";
                            injectScriptElements(elements, bodyElem, attrs, true);

                            /**
                             * Inject styles for body-start.
                             */
                            attrs = new Object();
                            attrs[`${ELEM_ATTR}${BODY_STYLE_ELEM_SELECTORS[0]}`] = "";
                            injectStyleElements(elements, bodyElem, attrs, true);

                            /**
                             * Inject htmls for body-start.
                             */
                            attrs = new Object();
                            attrs[`${ELEM_ATTR}${BODY_HTML_ELEM_SELECTORS[0]}`] = "";
                            injectHtmlElements(elements, bodyElem, attrs, true);
                        } else if (snippet.placement === SnippetPlacementType.BODY_END_HTML_TAG_BEFORE) {
                            // For "BodyEndHtmlTagBefore"
                            const bodyElem: any = document.querySelector("body");

                            /**
                             * Inject scripts for body-end.
                             */
                            attrs = new Object();
                            attrs[`${ELEM_ATTR}${BODY_SCRIPT_ELEM_SELECTORS[1]}`] = "";
                            injectScriptElements(elements, bodyElem, attrs);

                            /**
                             * Inject styles for body-end.
                             */
                            attrs = new Object();
                            attrs[`${ELEM_ATTR}${BODY_STYLE_ELEM_SELECTORS[1]}`] = "";
                            injectStyleElements(elements, bodyElem, attrs);

                            /**
                             * Inject htmls for body-end.
                             */
                            attrs = new Object();
                            attrs[`${ELEM_ATTR}${BODY_HTML_ELEM_SELECTORS[0]}`] = "";
                            injectHtmlElements(elements, bodyElem, attrs);
                        } else if (snippet.placement === SnippetPlacementType.PAGE_CONTAINER_AFTER) {
                            // For "PageContainerAfter"
                            const pageContainerElem: any = document.querySelector("main");

                            //const pageContainerElems = elements?.filter(x => x.)

                            /**
                             * Inject scripts for page-container-start.
                             */
                            attrs = new Object();
                            attrs[`${ELEM_ATTR}${PAGE_CONTAINER_SCRIPT_ELEM_SELECTORS[0]}`] = "";
                            injectScriptElements(elements, pageContainerElem, attrs, true);

                            /**
                             * Inject styles for page-container-start.
                             */
                            attrs = new Object();
                            attrs[`${ELEM_ATTR}${PAGE_CONTAINER_STYLE_ELEM_SELECTORS[0]}`] = "";
                            injectStyleElements(elements, pageContainerElem, attrs, true);

                            /**
                             * Inject htmls for page-container-start.
                             */
                            attrs = new Object();
                            attrs[`${ELEM_ATTR}${PAGE_CONTAINER_HTML_ELEM_SELECTORS[0]}`] = "";
                            injectHtmlElements(elements, pageContainerElem, attrs, true);
                        }
                    }
                });
            } catch (e) {
                console.log(e);
            }

        }
    }, []);
}

export default useContentSnippet;