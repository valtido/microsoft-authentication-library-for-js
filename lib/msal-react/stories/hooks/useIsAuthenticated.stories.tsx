/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

/* eslint-disable react/no-multi-comp */

import React, { useEffect, useState } from "react";
import { AccountIdentifiers, MsalProvider, useIsAuthenticated } from "../../src";
import { DisplayNotSignedInMessage } from "../utils/DisplayNotSignedInMessage";
import { DisplayWelcomeMessage } from "../utils/DisplayWelcomeMessage";
import { Configuration, PublicClientApplication } from "@azure/msal-browser";
import { defaultMsalConfig } from "../msalInstance";

export default {
    title: "MSAL React/Hooks/useIsAuthenticated",
};

const UseIsAuthenticatedStory = (args) => {
    const [accountId, setAccountId] = useState({});
    useEffect(() => {
        const accountId: AccountIdentifiers = {
            username: args.username,
            homeAccountId: args.homeAccountId,
            localAccountId: args.localAccountId
        };
        setAccountId(accountId);
    }, [args.username, args.localAccountId, args.homeAccountId]);
    const isAuthenticated = useIsAuthenticated(accountId);
    
    return (
        <>
            <p>The useIsAuthenticated() hook will tell you if there is at least one authenticated account. The hook also accepts optional username and homeAccountId arguments, and will indicate whether the given user is authenticated.</p>
            
            {isAuthenticated ? (
                <DisplayWelcomeMessage {...args} />
            ) : (
                <DisplayNotSignedInMessage {...args} />
            )}
        </>
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

    return (
        <MsalProvider instance={msalInstance}>
            <UseIsAuthenticatedStory {...args} />
        </MsalProvider>
    );
};

export const IsAuthenticatedHookStory = StoryTemplate.bind({});
IsAuthenticatedHookStory.storyName = "useIsAuthenticated Hook";
IsAuthenticatedHookStory.args = {
    username: "",
    homeAccountId: "",
    localAccountID: "",
    msalConfig: defaultMsalConfig
};

IsAuthenticatedHookStory.parameters = {
    docs: {
        source: {
            type: "code",
            code: "const accountIdentifier = { \n username: username, \n homeAcocuntId: homeAccountId \n localAccountId: localAccountId \n}; \n const isAuthenticated = useIsAuthenticated(accountIdentifier);"
        }
    }
};
