/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

/* eslint-disable react/no-multi-comp */

import React from "react";
import { MsalProvider, useMsal } from "../../src";
import { Configuration, PublicClientApplication } from "@azure/msal-browser";
import { defaultMsalConfig } from "../msalInstance";

export default {
    title: "MSAL React/Hooks/useMsal",
};

const UseMsalExample = () => {
    const { accounts } = useMsal();

    return (
        <p>The <pre style={{display: "inline"}}>useMsal()</pre> hook gives access to the MSAL React context. From here, any MSAL methods can be called, and state values accessed. For example, we know there are {accounts.length} accounts authenticated.</p>
    );
};

type StoryType = {
    username: string,
    homeAccountId: string, 
    localAccountId: string,
    msalConfig: Configuration
};

const StoryTemplate = ({msalConfig}: StoryType) => {
    const msalInstance = new PublicClientApplication(msalConfig);

    return (
        <MsalProvider instance={msalInstance}>
            <UseMsalExample />
        </MsalProvider>
    );
};

export const useMsalHookStory = StoryTemplate.bind({});
useMsalHookStory.storyName = "useMsal Hook";
useMsalHookStory.args = {
    msalConfig: defaultMsalConfig
};

useMsalHookStory.parameters = {
    docs: {
        source: {
            type: "code",
            code: "const { instance, accounts, inProgress } = useMsal()"
        }
    }
};
