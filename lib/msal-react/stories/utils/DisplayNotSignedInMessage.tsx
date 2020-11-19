/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import React from "react";
import { AccountIdentifiers, useAccount, useMsal } from "../../src";

export function DisplayNotSignedInMessage (args: AccountIdentifiers) {
    const accountInfo = useAccount(args);
    const { accounts } = useMsal();

    if (!!accountInfo) {
        return null;
    }

    if (args.localAccountId) {
        return <b>User with localAccountId {args.localAccountId} is not signed in!</b>;
    } else if (args.homeAccountId) {
        return <b>User with homeAccountId {args.homeAccountId} is not signed in!</b>;
    } else if (args.username) {
        return <b>User with username {args.username} is not signed in!</b>;
    } else if (accounts.length <= 0) {
        return <b>There are no accounts signed in!</b>;
    }

    return null;
}
