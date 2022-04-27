// Base Imports
import { useEffect } from "react";

// Type Imports
import { GUIDType } from "@core/types";
import { insertAdjacentHTML } from "@commerce/utils";

export enum SnippetContentType {
    JAVASCRIPT = "Javascript",
    HTML = "Html",
    TEXT = "Text"
}

enum SnippetPlacementType {
    HEAD = "Head",
    ERROR_HEAD = "ErrorHead", // TODO: Introduce error page in better storefront first.
    BODY_START_HTML_TAG_AFTER = "BodyStartHtmlTagAfter",
    BODY_END_HTML_TAG_BEFORE = "BodyEndHtmlTagBefore",
    PAGE_CONTAINER_AFTER = "PageContainerAfter",
    HEADER_MENU_BEFORE = "HeaderMenuBefore",
    HEADER_MENU_AFTER = "HeaderMenuAfter",
    FOOTER_BEFORE = "FooterBefore",
    FOOTER_AFTER = "FooterAfter",
    H1 = "H1", // Not used
    PRODUCT_AND_BRAND_DESC = "ProductAndBrandDescription", // Inject after display section.
    LEFT_PANEL = "LeftPanel", // Not used
    RIGHT_PANEL = "RightPanel", // Not used
    SITE_WALLPAPER = "SiteWallpaper",
    SITE_LOGO = "SiteLogo",
    CHILD = "Child", // Not used
    ORDER_CONFIRMATION_AFTER_PROGRESS_BAR = "OrderConfirmationAfterProgressBar", // TODO: Inject before footer on thank you page.
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
 * Attribute names for snippet injections inside <head>.
 */
const HEAD_ELEM_SELECTORS = ["top-head", "head"];

/**
 * Attribute names for snippet injections inside <body>.
 */
const BODY_ELEM_SELECTORS = ["body-start", "body-end"];

/**
 * Attribute names for snippet injections inside <main>.
 */
const PAGE_CONTAINER_ELEM_SELECTORS = ["page-container-after"];

/**
 * Attribute names for snippet injections around <header>.
 */
const HEADER_MENU_ELEM_SELECTORS = ["header-before-start", "header-after-end"];

/**
 * Attribute names for snippet injections around <header>.
 */
const FOOTER_ELEM_SELECTORS = ["footer-before-start", "footer-after-end"];

/**
 * Attribute names for snippet injections around site log.
 */
const SITE_LOGO_ELEM_SELECTORS = ["site-logo"];

/**
 * Attribute names for snippet injections inside pdp page.
 */
const PDP_ELEM_SELECTORS = ["pdp"];

const useContentSnippet = (snippets: Array<ISnippet>): void => {

    useEffect(() => {
        console.log(snippets);
        resetSnippetElements();
        if (snippets && snippets.length) {
            try {

                snippets.forEach((snippet: ISnippet) => {
                    console.log(snippet);
                    if (snippet.content) {
                        if (snippet.placement === SnippetPlacementType.TOP_HEAD) { // For "TopHead"

                            topHead(snippet);
                        } else if (snippet.placement === SnippetPlacementType.HEAD) { // For "Head"

                            head(snippet);
                        } else if (snippet.placement === SnippetPlacementType.BODY_START_HTML_TAG_AFTER) { // For "BodyStartHtmlTagAfter"

                            bodyStartHtmlTagAfter(snippet);
                        } else if (snippet.placement === SnippetPlacementType.BODY_END_HTML_TAG_BEFORE) { // For "BodyEndHtmlTagBefore"

                            bodyEndHtmlTagBefore(snippet);
                        } else if (snippet.placement === SnippetPlacementType.PAGE_CONTAINER_AFTER) { // For "PageContainerAfter"

                            pageContainerAfter(snippet);
                        } else if (snippet.placement === SnippetPlacementType.HEADER_MENU_BEFORE) { // For "HeaderMenuBefore"

                            headerMenuBefore(snippet);
                        } else if (snippet.placement === SnippetPlacementType.HEADER_MENU_AFTER) { // For "HeaderMenuAfter"

                            HeaderMenuAfter(snippet);
                        } else if (snippet.placement === SnippetPlacementType.FOOTER_BEFORE) { // For "FooterBefore"

                            footerBefore(snippet);
                        } else if (snippet.placement === SnippetPlacementType.FOOTER_AFTER) { // For "FooterAfter"

                            footerAfter(snippet);
                        } else if (snippet.placement === SnippetPlacementType.SITE_LOGO) { // For "SiteLogo"

                            siteLogo(snippet);
                        } else if (snippet.placement === SnippetPlacementType.PRODUCT_AND_BRAND_DESC) { // For "ProductAndBrandDescription"

                            productAndBrandDescription(snippet);
                        }

                    }
                });
            } catch (e) {
                console.log(e);
            }

        }
    }, [snippets]);

}

/**
 * Inject first child inside <head>.
 * @param elements 
 */
const topHead = (snippet: ISnippet) => {
    let attrs: any = {};
    const headElem: any = document.querySelector("head");
    attrs = new Object();
    attrs[`${ELEM_ATTR}${HEAD_ELEM_SELECTORS[0]}`] = "";
    insertAdjacentHTML(snippet.content, headElem, attrs, "afterbegin");
};

/**
 * Inject last child inside <head>.
 * @param elements 
 */
const head = (snippet: ISnippet) => {
    const headElem: any = document.querySelector("head");
    const attrs = buildAttrs([HEAD_ELEM_SELECTORS[1]]);
    insertAdjacentHTML(snippet.content, headElem, attrs, "beforeend");
};

/**
 * Inject first child inside <body>.
 * @param snippet 
 * @param elements 
 */
const bodyStartHtmlTagAfter = (snippet: ISnippet) => {
    const bodyElem: any = document.querySelector("body");
    const attrs = buildAttrs([BODY_ELEM_SELECTORS[0]]);
    insertAdjacentHTML(snippet.content, bodyElem, attrs, "afterbegin");
};

/**
 * Inject last child inside <body>.
 * @param snippet 
 * @param elements 
 */
const bodyEndHtmlTagBefore = (snippet: ISnippet) => {
    const bodyElem: any = document.querySelector("body");
    const attrs = buildAttrs([BODY_ELEM_SELECTORS[1]]);
    insertAdjacentHTML(snippet.content, bodyElem, attrs, "beforeend");
};

/**
 * Inject after <main>.
 * @param snippet 
 * @param elements 
 */
const pageContainerAfter = (snippet: ISnippet) => {
    const pageContainerElem: any = document.querySelector("main");
    const attrs = buildAttrs([PAGE_CONTAINER_ELEM_SELECTORS[0]]);
    insertAdjacentHTML(snippet.content, pageContainerElem, attrs, "afterend");
};

/**
 * Inject before <header>.
 * @param snippet 
 */
const headerMenuBefore = (snippet: ISnippet) => {
    const headerElem: any = document.querySelector("header");
    const attrs = buildAttrs([HEADER_MENU_ELEM_SELECTORS[0]]);
    insertAdjacentHTML(snippet.content, headerElem, attrs, "beforebegin");
};

/**
 * Inject after <header>.
 * @param snippet 
 */
const HeaderMenuAfter = (snippet: ISnippet) => {
    const headerElem: any = document.querySelector("header");
    const attrs = buildAttrs([HEADER_MENU_ELEM_SELECTORS[0]]);
    insertAdjacentHTML(snippet.content, headerElem, attrs, "afterend");
};

/**
 * Inject before <footer>.
 * @param snippet 
 */
const footerBefore = (snippet: ISnippet) => {
    const footerElem: any = document.querySelector("footer");
    const attrs = buildAttrs([FOOTER_ELEM_SELECTORS[0]]);
    insertAdjacentHTML(snippet.content, footerElem, attrs, "beforebegin");
};

/**
 * Inject after <footer>.
 * @param snippet 
 */
const footerAfter = (snippet: ISnippet) => {
    const footerElem: any = document.querySelector("footer");
    const attrs = buildAttrs([FOOTER_ELEM_SELECTORS[0]]);
    insertAdjacentHTML(snippet.content, footerElem, attrs, "afterend");
};

/**
 * Inject inside site logo.
 * @param snippet 
 */
const siteLogo = (snippet: ISnippet) => {
    const parentElem: any = document.querySelector("div.site-logo");
    const attrs = buildAttrs([SITE_LOGO_ELEM_SELECTORS[0]]);
    insertAdjacentHTML(snippet.content, parentElem, attrs, "beforeend");
};

/**
 * Inject inside product detail page.
 * @param snippet 
 */
const productAndBrandDescription = (snippet: ISnippet) => {
    const parentElem: any = document.querySelector("[data-bc-pdp-snippet]");
    const attrs = buildAttrs([PDP_ELEM_SELECTORS[0]]);
    insertAdjacentHTML(snippet.content, parentElem, attrs, "beforeend");
};

const buildAttrs = (attrSet: Array<string>): object => {
    let attrs: any = {};
    if (attrSet && attrSet.length) {
        attrs = new Object();
        attrSet.forEach(attr => {
            attrs[`${ELEM_ATTR}${attr}`] = "";
        });
    }
    return attrs;
}

const removeInjections = (elemSelectors: Array<string>, parentNode?: HTMLElement) => {
    //debugger;
    let nodes: NodeListOf<Element>;
    const selectors = elemSelectors.map(x => `[${ELEM_ATTR}${x}]`).join(", ");

    if (parentNode) {
        nodes = parentNode.querySelectorAll(selectors);
    } else {
        nodes = document.querySelectorAll(selectors);
    }
    console.log(nodes);
    if (nodes && nodes.length) {
        nodes.forEach(elem => {
            try {
                const parent = elem.parentElement;
                if (parent) {
                    parent.removeChild(elem);
                }
            } catch (e) {
                // Do nothing
                console.log(e);
            }
        });
    }
};

export const resetSnippetElements = (): void => {
    //debugger;
    const head = document.querySelector("head");
    if (head) {
        // Remove snippet injections in <head>.
        removeInjections(HEAD_ELEM_SELECTORS, head);
    }

    // const body = document.querySelector("body") as HTMLElement;
    // if (body) {
    // Remove snippet injections in <body>.
    removeInjections(BODY_ELEM_SELECTORS);
    removeInjections(HEADER_MENU_ELEM_SELECTORS);
    removeInjections(FOOTER_ELEM_SELECTORS);
    //}
    removeInjections(SITE_LOGO_ELEM_SELECTORS);
    removeInjections(PAGE_CONTAINER_ELEM_SELECTORS);
    removeInjections(PDP_ELEM_SELECTORS);
};

export default useContentSnippet;