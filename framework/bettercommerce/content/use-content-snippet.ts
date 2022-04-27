// Base Imports
import { useEffect } from "react";

// Type Imports
import { GUIDType } from "@core/types";
import { insertAdjacentHTML } from "@commerce/utils";
import { IDomReference } from "@commerce/utils/dom-util";

export enum SnippetContentType {
    JAVASCRIPT = "Javascript",
    HTML = "Html",
    TEXT = "Text"
}

enum SnippetPlacementType {
    HEAD = "Head",
    ERROR_HEAD = "ErrorHead",
    BODY_START_HTML_TAG_AFTER = "BodyStartHtmlTagAfter",
    BODY_END_HTML_TAG_BEFORE = "BodyEndHtmlTagBefore",
    PAGE_CONTAINER_AFTER = "PageContainerAfter",
    HEADER_MENU_BEFORE = "HeaderMenuBefore",
    HEADER_MENU_AFTER = "HeaderMenuAfter",
    FOOTER_BEFORE = "FooterBefore",
    FOOTER_AFTER = "FooterAfter",
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
const PAGE_CONTAINER_ELEM_SELECTORS = ["page-container-start", "page-container-end"];

/**
 * Attribute names for snippet injections around <header>.
 */
const HEADER_MENU_ELEM_SELECTORS = ["header-before-start", "header-after-end"];

/**
 * Attribute names for snippet injections around <header>.
 */
const FOOTER_ELEM_SELECTORS = ["footer-before-start", "footer-after-end"];

const useContentSnippet = (snippets: Array<ISnippet>): void => {
    useEffect(() => {
        //debugger;
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
                        }
                    }
                });
            } catch (e) {
                console.log(e);
            }

        }
    }, []);
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
    let attrs: any = {};
    const headElem: any = document.querySelector("head");
    attrs = new Object();
    attrs[`${ELEM_ATTR}${HEAD_ELEM_SELECTORS[1]}`] = "";
    insertAdjacentHTML(snippet.content, headElem, attrs, "beforeend");
};

/**
 * Inject first child inside <body>.
 * @param snippet 
 * @param elements 
 */
const bodyStartHtmlTagAfter = (snippet: ISnippet) => {
    let attrs: any = {};
    const bodyElem: any = document.querySelector("body");
    attrs = new Object();
    attrs[`${ELEM_ATTR}${BODY_ELEM_SELECTORS[0]}`] = "";
    insertAdjacentHTML(snippet.content, bodyElem, attrs, "afterbegin");
};

/**
 * Inject last child inside <body>.
 * @param snippet 
 * @param elements 
 */
const bodyEndHtmlTagBefore = (snippet: ISnippet) => {
    let attrs: any = {};
    const bodyElem: any = document.querySelector("body");
    attrs = new Object();
    attrs[`${ELEM_ATTR}${BODY_ELEM_SELECTORS[1]}`] = "";
    insertAdjacentHTML(snippet.content, bodyElem, attrs, "beforeend");
};

/**
 * Inject after <main>.
 * @param snippet 
 * @param elements 
 */
const pageContainerAfter = (snippet: ISnippet) => {
    let attrs: any = {};
    const pageContainerElem: any = document.querySelector("main");
    attrs = new Object();
    attrs[`${ELEM_ATTR}${PAGE_CONTAINER_ELEM_SELECTORS[0]}`] = "";
    insertAdjacentHTML(snippet.content, pageContainerElem, attrs, "afterend");
};

/**
 * Inject before <header>.
 * @param snippet 
 */
const headerMenuBefore = (snippet: ISnippet) => {
    let attrs: any = {};
    const headerElem: any = document.querySelector("header");
    attrs = new Object();
    attrs[`${ELEM_ATTR}${HEADER_MENU_ELEM_SELECTORS[0]}`] = "";
    insertAdjacentHTML(snippet.content, headerElem, attrs, "beforebegin");
};

/**
 * Inject after <header>.
 * @param snippet 
 */
const HeaderMenuAfter = (snippet: ISnippet) => {
    let attrs: any = {};
    const headerElem: any = document.querySelector("header");
    attrs = new Object();
    attrs[`${ELEM_ATTR}${HEADER_MENU_ELEM_SELECTORS[0]}`] = "";
    insertAdjacentHTML(snippet.content, headerElem, attrs, "afterend");
};

/**
 * Inject before <footer>.
 * @param snippet 
 */
const footerBefore = (snippet: ISnippet) => {
    let attrs: any = {};
    const footerElem: any = document.querySelector("footer");
    attrs = new Object();
    attrs[`${ELEM_ATTR}${FOOTER_ELEM_SELECTORS[0]}`] = "";
    insertAdjacentHTML(snippet.content, footerElem, attrs, "beforebegin");
};

/**
 * Inject after <footer>.
 * @param snippet 
 */
const footerAfter = (snippet: ISnippet) => {
    let attrs: any = {};
    const footerElem: any = document.querySelector("footer");
    attrs = new Object();
    attrs[`${ELEM_ATTR}${FOOTER_ELEM_SELECTORS[0]}`] = "";
    insertAdjacentHTML(snippet.content, footerElem, attrs, "afterend");
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
        // Remove snippet injections in <head>.
        removeInjections(HEAD_ELEM_SELECTORS, head);
    }

    const body = document.querySelector("body") as HTMLElement;
    if (head) {
        // Remove snippet injections in <body>.
        removeInjections(BODY_ELEM_SELECTORS, body);
        removeInjections(HEADER_MENU_ELEM_SELECTORS, body);
        removeInjections(FOOTER_ELEM_SELECTORS, body);
    }

    const pageContainer = document.querySelector("main") as HTMLElement;
    if (head) {
        // Remove script injections in <body>.
        removeInjections(PAGE_CONTAINER_ELEM_SELECTORS, pageContainer);
    }
};

export default useContentSnippet;