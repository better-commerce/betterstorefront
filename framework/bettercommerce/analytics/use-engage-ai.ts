// Base Imports
import { useEffect } from "react";

// Type Imports
import { GUIDType } from "@core/types";
import { TagNameType } from "@lib/hooks/useDOMReader";
import { domReader, scriptElementLoader, styleElementLoader } from "@commerce/utils";
import { IDomReference } from "@commerce/utils/dom-reader";

enum EngageSnippetPlacementType {
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

interface IEngageSnippet {
    readonly name: string;
    readonly type: string;
    readonly placement: string;
    readonly content: string;
    readonly excludedUrl?: string | null;
    readonly microsites: Array<GUIDType>;
}

const ENGAGE_ELEM_ATTR = "data-ai-";
const ENGAGE_HEAD_SCRIPT_ELEM_SELECTORS = ["engage-scr-top-head", "engage-scr-head"];
const ENGAGE_HEAD_STYLE_ELEM_SELECTORS = ["engage-stl-top-head", "engage-stl-head"];
const ENGAGE_BODY_SCRIPT_ELEM_SELECTORS = ["engage-scr-body-start", "engage-scr-body-end"];
const ENGAGE_BODY_STYLE_ELEM_SELECTORS = ["engage-stl-body-start", "engage-stl-body-end"];

const useEngageAI = (snippets: Array<any>): void => {

    const resetEngageElem = (): void => {
        const head = document.querySelector("head");
        if (head) {
            const scrSelectors = ENGAGE_HEAD_SCRIPT_ELEM_SELECTORS.map(x => `[${ENGAGE_ELEM_ATTR}${x}]`).join(", ");
            const allHeadScripts = head.querySelectorAll(scrSelectors);
            if (allHeadScripts && allHeadScripts.length) {
                allHeadScripts.forEach(elem => {
                    head.removeChild(elem);
                })
            }

            const stlSelectors = ENGAGE_HEAD_STYLE_ELEM_SELECTORS.map(x => `[${ENGAGE_ELEM_ATTR}${x}]`).join(", ");
            const allHeadStyles = head.querySelectorAll(stlSelectors);
            if (allHeadStyles && allHeadStyles.length) {
                allHeadStyles.forEach(elem => {
                    head.removeChild(elem);
                })
            }
        }
    };

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
                styleElementLoader(x.element, insertAtTop, attrs, parentNode);
            });
        }
    };

    useEffect(() => {
        //debugger;
        resetEngageElem();
        if (snippets && snippets.length) {
            let attrs: any = {};
            try {
                const headElem: any = document.querySelector("head");
                const bodyElem: any = document.querySelector("body");
                snippets.forEach((snippet: IEngageSnippet) => {

                    if (snippet.content) {

                        const { elements } = domReader(snippet.content);
                        switch (snippet.placement) {

                            // For "TopHead"
                            case EngageSnippetPlacementType.TOP_HEAD:

                                attrs[`${ENGAGE_ELEM_ATTR}${ENGAGE_HEAD_SCRIPT_ELEM_SELECTORS[0]}`] = "";
                                injectScriptElements(elements, headElem, attrs, true);

                                attrs = new Object();
                                attrs[`${ENGAGE_ELEM_ATTR}${ENGAGE_HEAD_STYLE_ELEM_SELECTORS[0]}`] = "";
                                injectStyleElements(elements, headElem, attrs, true);
                                break;

                            // For "Head"
                            case EngageSnippetPlacementType.HEAD:

                                //console.log(elements);
                                //debugger;
                                attrs[`${ENGAGE_ELEM_ATTR}${ENGAGE_HEAD_SCRIPT_ELEM_SELECTORS[1]}`] = "";
                                injectScriptElements(elements, headElem, attrs);

                                attrs = new Object();
                                attrs[`${ENGAGE_ELEM_ATTR}${ENGAGE_HEAD_STYLE_ELEM_SELECTORS[1]}`] = "";
                                injectStyleElements(elements, headElem, attrs);

                                break;

                            // For "BodyStartHtmlTagAfter"
                            case EngageSnippetPlacementType.BODY_START_HTML_TAG_AFTER:

                                attrs[`${ENGAGE_ELEM_ATTR}${ENGAGE_BODY_SCRIPT_ELEM_SELECTORS[0]}`] = "";
                                injectScriptElements(elements, bodyElem, attrs, true);

                                attrs = new Object();
                                attrs[`${ENGAGE_ELEM_ATTR}${ENGAGE_BODY_STYLE_ELEM_SELECTORS[0]}`] = "";
                                injectStyleElements(elements, bodyElem, attrs, true);
                                break;

                            // For "BodyEndHtmlTagBefore"
                            case EngageSnippetPlacementType.BODY_END_HTML_TAG_BEFORE:

                                attrs[`${ENGAGE_ELEM_ATTR}${ENGAGE_BODY_SCRIPT_ELEM_SELECTORS[1]}`] = "";
                                injectScriptElements(elements, bodyElem, attrs);

                                attrs = new Object();
                                attrs[`${ENGAGE_ELEM_ATTR}${ENGAGE_BODY_STYLE_ELEM_SELECTORS[1]}`] = "";
                                injectStyleElements(elements, bodyElem, attrs);
                                break;
                            default:
                                break;
                        }
                    }
                });
            } catch (e) {
                console.log(e);
            }

        }
    }, [snippets]);

}

export default useEngageAI;