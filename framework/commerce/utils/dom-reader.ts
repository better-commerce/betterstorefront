// Package Imports
//import { DOMParser } from "@xmldom/xmldom";

export enum TagNameType {
    SCRIPT = "SCRIPT",
    STYLE = "STYLE",
    HTML = "HTML",
    OTHER = "OTHER"
}

interface IDomReference {
    readonly element: any;
    readonly type: string;
}

export const domReader = (content: string) => {
    //debugger;
    const doc = new DOMParser().parseFromString(content, "text/html");
    try {
        if (doc) {
            //debugger;
            const domElements = [...doc.head.querySelectorAll("*"), ...doc.body.querySelectorAll("*")];
            if (domElements && domElements.length) {
                let arrDOM = new Array<IDomReference>();
                domElements.forEach((elem: any) => {
                    if (elem.tagName === TagNameType.SCRIPT) {
                        arrDOM.push({
                            type: elem.tagName,
                            element: elem
                        });
                    } else if (elem.tagName === TagNameType.STYLE) {
                        arrDOM.push({
                            type: elem.tagName,
                            element: elem
                        });
                    } else {
                        arrDOM.push({
                            type: TagNameType.HTML,
                            element: elem
                        });
                    }
                });
                return { elements: arrDOM };
            }
        } else {
            return { error: "Error parsing DOM input." };
        }
    } catch (e) {
        return { error: e };
    }

    return {};
}