import { SnippetContentType } from "@framework/content/use-content-snippet";

export enum TagNameType {
  SCRIPT = "SCRIPT",
  STYLE = "STYLE",
  HTML = "HTML",
  OTHER = "OTHER"
}

export type HtmlElementPosition =
  | "beforebegin"
  | "afterbegin"
  | "beforeend"
  | "afterend";

export interface IDomReference {
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
};

export const domElementLoader = (element: any, insertAtTop: boolean, attrs?: object, node?: HTMLElement, skip?: boolean) => {
  //debugger;
  const loadDOM = (element: any, insertAtTop: boolean, attrs?: object, parentNode?: HTMLElement) => {
    return new Promise((resolve, reject) => {
      //const style = Object.create(element); // JSON.parse(JSON.stringify(element));

      for (const [k, v] of Object.entries(attrs || {})) {
        element.setAttribute(k, v);
      }

      const node = parentNode || document.head; // || document.getElementsByTagName('head')[0];
      if (insertAtTop) {
        node.insertBefore(element, node.firstChild);
        resolve(true);
      } else {
        node.appendChild(element);
        resolve(true);
      }
    });
  };

  if (!skip) {
    return loadDOM(element, insertAtTop, attrs, node)
      .then(style => {
        return { style: style as HTMLStyleElement };
      })
      .catch((e: { message: string }) => {
        console.error(e);
        return { error: e };
      });
  }

  return {};
};

export const insertAdjacentHTML = (content: string, contentType: string, node: HTMLElement, attrs: Object, position: HtmlElementPosition, refs?: any) => {
  if (node) {
    let container = document.createElement("div");
    container.insertAdjacentHTML("beforeend", content);
    //console.log(container);
    //const arrNodes = container.querySelectorAll("*");

    let arrNodes: NodeListOf<Element> | Element[];
    if (contentType === SnippetContentType.JAVASCRIPT) {
      arrNodes = container.querySelectorAll("*");
    } else {
      // Need to handle all first level children inside parent.
      arrNodes = [container.children[0]];
    }
    if (arrNodes && arrNodes.length) {
      arrNodes.forEach(node => {
        for (const [k, v] of Object.entries(attrs || {})) {
          node.setAttribute(k, v);
        }
      });
    }

    if (contentType === SnippetContentType.JAVASCRIPT && (position === "afterbegin" || position === "beforeend")) {
      const { bodyStartScrCntrRef, bodyEndScrCntrRef }: any = refs;
      const node = document.createRange().createContextualFragment(container.innerHTML);

      //arrNodes.forEach(node => {
      if (position === "afterbegin" && bodyStartScrCntrRef) {
        if (bodyStartScrCntrRef?.current) {
          bodyStartScrCntrRef?.current?.appendChild(node);
        }
      } else if (position === "beforeend" && bodyEndScrCntrRef) {
        if (bodyEndScrCntrRef?.current) {
          bodyEndScrCntrRef?.current?.appendChild(node);
        }
      }
      //});
      return;
    } else if (contentType === SnippetContentType.HTML && (position === "afterbegin" || position === "beforeend")) {
      const { bodyStartScrCntrRef, bodyEndScrCntrRef }: any = refs;
      if (position === "afterbegin" && bodyStartScrCntrRef) {
        if (bodyStartScrCntrRef?.current) {
          bodyStartScrCntrRef?.current?.appendChild(document.createRange().createContextualFragment(container.innerHTML))
        }
      } else if (position === "beforeend" && bodyEndScrCntrRef) {
        if (bodyEndScrCntrRef?.current) {
          bodyEndScrCntrRef?.current?.appendChild(document.createRange().createContextualFragment(container.innerHTML))
        }
      }
      return;
    }

    node.insertAdjacentHTML(position, container.innerHTML);
  }
};