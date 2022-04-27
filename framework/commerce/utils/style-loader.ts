
export const styleElementLoader = (element: any, insertAtTop: boolean, attrs?: object, node?: HTMLElement, skip?: boolean) => {
    //debugger;
    const loadStyle = (element: any, insertAtTop: boolean, attrs?: object, parentNode?: HTMLElement) => {
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
        return loadStyle(element, insertAtTop, attrs, node)
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