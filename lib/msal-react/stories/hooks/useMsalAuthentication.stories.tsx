/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

/* eslint-disable react/no-multi-comp */

import React, { useState } from "react";
import { AccountIdentifiers, AuthenticatedTemplate, IMsalContext, MsalProvider, UnauthenticatedTemplate, useMsalAuthentication } from "../../src";
import { Configuration, PublicClientApplication } from "@azure/msal-browser";
import { defaultMsalConfig } from "../msalInstance";

export default {
    title: "MSAL React/Hooks/useMsalAuthentication",
};

const UseMsalAuthenticationStory = (args) => {
    const accountIdentifier = {
        username: args.username,
        homeAccountId: args.homeAccountId,
        localAccountId: args.localAccountId
    };

    useMsalAuthentication(args.interactionType, args.authenticationRequest, accountIdentifier);
    
    return (
        <React.Fragment>
            <p>The <pre style={{display: "inline"}}>useMsalAuthentication()</pre> hook initiates the authentication process. You must specify what interaction type to use for authentication. It also accepts optional parameters to identify if a specific user is signed in and a request object passed to the MSAL API for authentication, if necessary.</p>
            <UnauthenticatedTemplate>
                <p><b>Authenticating...</b></p>
            </UnauthenticatedTemplate>
            <AuthenticatedTemplate>
                {(context: IMsalContext) => (
                    <p><b>Welcome {context.accounts[0].username}! You have been authenticated.</b></p>
                )}
            </AuthenticatedTemplate>
        </React.Fragment>
    );
};

type StoryType = {
    username: string,
    homeAccountId: string, 
    localAccountId: string,
    msalConfig: Configuration
};

const StoryTemplate = ({msalConfig, ...args}: StoryType) => {
    const msalInstance = new PublicClientApplication(msalConfig);
    const [params, setParams] = useState(args);

    return (
        <>
            <button onClick={() => setParams(args)}>Set Params</button>
            <MsalProvider instance={msalInstance}>
                <UseMsalAuthenticationStory {...params} />
            </MsalProvider>
        </>
    );
};

export const MsalAuthenticationHookStory = StoryTemplate.bind({});
MsalAuthenticationHookStory.storyName = "useMsalAuthentication Hook";
MsalAuthenticationHookStory.args = {
    interactionType: "popup",
    authenticationRequest: {},
    username: "",
    homeAccountId: "",
    localAccountID: "",
    msalConfig: defaultMsalConfig
};

MsalAuthenticationHookStory.parameters = {
    docs: {
        source: {
            type: "code",
            code: "const { login, result, error } = useMsalAuthentication(interactionType, authenticationRequest, accountIdentifier)"
        }
    }
};
