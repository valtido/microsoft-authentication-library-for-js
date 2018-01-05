import { Logger } from "./Logger";
import { User } from "./User";
declare global  {
    interface Window {
        msal: Object;
        callBackMappedToRenewStates: Object;
        callBacksMappedToRenewStates: Object;
    }
}
export declare type tokenReceivedCallback = (errorDesc: string, token: string, error: string, tokenType: string) => void;
export declare class UserAgentApplication {
    private _cacheLocations;
    private _cacheLocation;
    readonly cacheLocation: string;
    private _logger;
    private _loginInProgress;
    private _acquireTokenInProgress;
    private _renewStates;
    private _activeRenewals;
    private _clockSkew;
    private _cacheStorage;
    private _tokenReceivedCallback;
    private _user;
    clientId: string;
    private authorityInstance;
    authority: string;
    validateAuthority: boolean;
    private _redirectUri;
    private _postLogoutredirectUri;
    private _openedWindows;
    private _requestType;
    loadFrameTimeout: number;
    constructor(clientId: string, authority: string | null, tokenReceivedCallback: tokenReceivedCallback, options?: {
        validateAuthority?: boolean;
        cacheLocation?: string;
        redirectUri?: string;
        postLogoutRedirectUri?: string;
        logger?: Logger;
        loadFrameTimeout?: number;
    });
    private processCallBack(hash);
    loginRedirect(scopes?: Array<string>, extraQueryParameters?: string): void;
    loginPopup(scopes: Array<string>, extraQueryParameters?: string): Promise<string>;
    private promptUser(urlNavigate);
    private openWindow(urlNavigate, title, interval, instance, resolve?, reject?);
    logout(): void;
    private clearCache();
    private openPopup(urlNavigate, title, popUpWidth, popUpHeight);
    private validateInputScope(scopes);
    private filterScopes(scopes);
    private registerCallback(expectedState, scope, resolve, reject);
    private getCachedToken(authenticationRequest, user);
    getAllUsers(): Array<User>;
    private getUniqueUsers(users);
    private getUniqueAuthority(accessTokenCacheItems, property);
    private addHintParameters(urlNavigate, user);
    private urlContainsQueryStringParameter(name, url);
    acquireTokenRedirect(scopes: Array<string>): void;
    acquireTokenRedirect(scopes: Array<string>, authority: string): void;
    acquireTokenRedirect(scopes: Array<string>, authority: string, user: User): void;
    acquireTokenRedirect(scopes: Array<string>, authority: string, user: User, extraQueryParameters: string): void;
    acquireTokenPopup(scopes: Array<string>): Promise<string>;
    acquireTokenPopup(scopes: Array<string>, authority: string): Promise<string>;
    acquireTokenPopup(scopes: Array<string>, authority: string, user: User): Promise<string>;
    acquireTokenPopup(scopes: Array<string>, authority: string, user: User, extraQueryParameters: string): Promise<string>;
    acquireTokenSilent(scopes: Array<string>, authority?: string, user?: User, extraQueryParameters?: string): Promise<string>;
    private loadIframeTimeout(urlNavigate, frameName, scope);
    private loadFrame(urlNavigate, frameName);
    private addAdalFrame(iframeId);
    private renewToken(scopes, resolve, reject, user, authenticationRequest, extraQueryParameters?);
    private renewIdToken(scopes, resolve, reject, user, authenticationRequest, extraQueryParameters?);
    getUser(): User;
    private handleAuthenticationResponse(hash);
    private saveAccessToken(authority, tokenResponse, user, clientInfo, idToken);
    private saveTokenFromHash(tokenResponse);
    private isCallback(hash);
    private getHash(hash);
    private getRequestInfo(hash);
    private getScopeFromState(state);
    private isInIframe();
}
