/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { Configuration, PublicClientApplication } from "@azure/msal-browser";
import React, { useState } from "react";
import { MsalAuthenticationProps, MsalAuthenticationTemplate, MsalProvider } from "../../src";
import { defaultMsalConfig } from "../msalInstance";
import { ErrorMessage } from "../utils/ErrorMessage";

export default {
    title: "MSAL React/Components/MsalAuthenticationTemplate",
    component: MsalAuthenticationTemplate
};

type StoryType = MsalAuthenticationProps & {
    msalConfig: Configuration
};

const StoryTemplate = ({msalConfig, ...args}: StoryType) => {
    const msalInstance = new PublicClientApplication(msalConfig);
    const [params, setParams] = useState(args);

    return (
        <>
            <button onClick={() => setParams(args)}>Set Params</button>
            <MsalProvider instance={msalInstance}>
                <p>This page has content that will only render if you are not authenticated.</p>
                <p>Authentication status templates can optionally be scoped to a specific user.</p>
                <MsalAuthenticationTemplate {...params} errorComponent={ErrorMessage}>
                    <b>You are authenticated, which means you can see this content.</b>
                </MsalAuthenticationTemplate>
            </MsalProvider>
        </>
    );};

export const MsalAuthenticationStory = StoryTemplate.bind({});
MsalAuthenticationStory.storyName = "MsalAuthenticationTemplate";
MsalAuthenticationStory.args = {
    interactionType: "popup",
    msalConfig: defaultMsalConfig
};

MsalAuthenticationStory.argTypes = {
    username:{
        table: {
            category: "Account Identifiers"
        }
    },
    homeAccountId:{
        table: {
            category: "Account Identifiers"
        }
    },
    localAccountId:{
        table: {
            category: "Account Identifiers"
        }
    },
    loadingComponent: {
        table: {
            disable: true
        }
    },
    errorComponent: {
        table: {
            disable: true
        }
    },
    msalConfig: {
        table: {
            category: "PublicClientApplication Config"
        }
    }
};
