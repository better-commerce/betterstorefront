// Base Imports
import { useEffect } from "react";

// Type Imports
import { GUIDType } from "@core/types";
import { TagNameType } from "@lib/hooks/useDOMReader";
import { domReader } from "@commerce/utils/dom-reader";
import { scriptElementLoader, ScriptLoaderType } from "@commerce/utils/script-loader";

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

const useEngageAI = (snippets: Array<any>): void => {

    const resetEngageElem = () => {
        const head = document.querySelector("head");
        if (head) {
            const allScripts = head.querySelectorAll("script.engage-head");
            if (allScripts && allScripts.length) {
                allScripts.forEach(elem => {
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
                    switch (snippet.placement) {
                        case EngageSnippetPlacementType.HEAD:
                            if (snippet.content) {
                                const { elements } = domReader(snippet.content);
                                //console.log(elements);
                                //debugger;
                                if (elements && elements.length) {
                                    const headElem: any = document.querySelector("head");
                                    elements.filter(x => x.type === TagNameType.SCRIPT)?.forEach(x => {
                                        scriptElementLoader(x.element, { "class": "engage-head" }, headElem);
                                    });
                                }
                            }
                            break;
                        default:
                            break;
                    }
                });
            } catch (e) {
                console.log(e);
            }

        }
    }, [snippets]);

}

export default useEngageAI;