import Cookies from "js-cookie";

/**
 * Returns session id.
 * @returns 
 */
export const getSessionId = (): string => {
    let jsId: any = document.cookie.match(/JSESSIONID=[^;]+/);
    if (jsId != null) {
        if (jsId instanceof Array) {
            jsId = jsId[0].substring(11);
        }
        else {
            jsId = jsId.substring(11);
        }
    }
    return jsId;
};

/**
 * Checks if browser session is initiated. 
 * Session timeout is defined by {DEFAULT_SESSION_TIMEOUT_IN_MINS}.
 * @returns 
 */
export const isValidSession = (): boolean => {
    // Get session id
    const sessionId = getSessionId();

    // Check if session is initiated
    const isSessionInitiated = (getSessionCookie(sessionId) !== undefined) ? true: false;

    // If session is not initiated
    if (!isSessionInitiated) {
        // Initiate a new session
        setSessionCookie(sessionId, new Date().getTime());
    }
    return isSessionInitiated;
};

/**
 * Reads session cookie identified by {key}.
 * @param key 
 * @returns 
 */
const getSessionCookie = (key: string) => {
    const sessionCookie = Cookies.get(key);

    if (sessionCookie === undefined) {
        return undefined;
    } else {
        return JSON.parse(sessionCookie);
    }
};

/**
 * Sets session cookie.
 * @param key 
 * @param value 
 */
const setSessionCookie = (key: string, value: any) => {
    Cookies.remove(key);
    const expiryTime: any = new Date(new Date().getTime() + 30 * 60 * 1000)
    Cookies.set(key, value, { expires: expiryTime });
};