/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import React from "react";
import { AccountIdentifiers, useAccount, useMsal } from "../../src";

export function DisplayWelcomeMessage (args: AccountIdentifiers) {
    const accountInfo = useAccount(args);
    const { accounts } = useMsal();

    if (accountInfo) {
        return <b>Welcome, {accountInfo.username}!</b>;
    } else if (accounts.length > 0) {
        return <b>Welcome, {accounts[0].username}!</b>;
    }
    
    return null;
}
