// Base Imports
import { useEffect } from "react";

// Type Imports
import { GUIDType } from "@core/types";
import { TagNameType } from "@lib/hooks/useDOMReader";
import { domReader } from "@commerce/utils/dom-reader";
import { scriptElementLoader, styleElementLoader } from "@commerce/utils";

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

const useEngageAI = (snippets: Array<any>): void => {

    const resetEngageElem = () => {
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
    }

    useEffect(() => {
        //debugger;
        resetEngageElem();
        if (snippets && snippets.length) {
            try {
                snippets.forEach((snippet: IEngageSnippet) => {

                    if (snippet.content) {

                        const { elements } = domReader(snippet.content);
                        switch (snippet.placement) {

                            // For "TopHead"
                            case EngageSnippetPlacementType.TOP_HEAD:

                                if (elements && elements.length) {
                                    const headElem: any = document.querySelector("head");
                                    elements.filter(x => x.type === TagNameType.SCRIPT)?.forEach(x => {
                                        let attrs: any = new Object();
                                        attrs[`${ENGAGE_ELEM_ATTR}${ENGAGE_HEAD_SCRIPT_ELEM_SELECTORS[0]}`] = "";
                                        scriptElementLoader(x.element, true, attrs, headElem);
                                    });

                                    elements.filter(x => x.type === TagNameType.STYLE)?.forEach(x => {
                                        let attrs: any = new Object();
                                        attrs[`${ENGAGE_ELEM_ATTR}${ENGAGE_HEAD_STYLE_ELEM_SELECTORS[0]}`] = "";
                                        styleElementLoader(x.element, true, attrs, headElem);
                                    });
                                }
                                break;

                            // For "Head"
                            case EngageSnippetPlacementType.HEAD:

                                //console.log(elements);
                                //debugger;
                                if (elements && elements.length) {
                                    const headElem: any = document.querySelector("head");
                                    elements.filter(x => x.type === TagNameType.SCRIPT)?.forEach(x => {
                                        let attrs: any = new Object();
                                        attrs[`${ENGAGE_ELEM_ATTR}${ENGAGE_HEAD_SCRIPT_ELEM_SELECTORS[1]}`] = "";
                                        scriptElementLoader(x.element, false, attrs, headElem);
                                    });

                                    elements.filter(x => x.type === TagNameType.STYLE)?.forEach(x => {
                                        let attrs: any = new Object();
                                        attrs[`${ENGAGE_ELEM_ATTR}${ENGAGE_HEAD_STYLE_ELEM_SELECTORS[1]}`] = "";
                                        styleElementLoader(x.element, false, attrs, headElem);
                                    });
                                }

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