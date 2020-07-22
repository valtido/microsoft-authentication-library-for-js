/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { ClientConfiguration, buildClientConfiguration } from "../config/ClientConfiguration";
import { INetworkModule } from "../network/INetworkModule";
import { ICrypto } from "../crypto/ICrypto";
import { Authority } from "../authority/Authority";
import { Logger } from "../logger/Logger";
import { AADServerParamKeys, Constants, HeaderNames } from "../utils/Constants";
import { NetworkResponse, NetworkManager } from "../network/NetworkManager";
import { ServerAuthorizationTokenResponse } from "../server/ServerAuthorizationTokenResponse";
import { TrustedAuthority } from "../authority/TrustedAuthority";
import { CacheManager } from "../cache/CacheManager";
import { ServerTelemetryManager } from "../telemetry/server/ServerTelemetryManager";

/**
 * Base application class which will construct requests to send to and handle responses from the Microsoft STS using the authorization code flow.
 */
export abstract class BaseClient {
    // Logger object
    public logger: Logger;

    // Application config
    protected config: ClientConfiguration;

    // Crypto Interface
    protected cryptoUtils: ICrypto;

    // Storage Interface
    protected cacheManager: CacheManager;

    // Network Interface
    protected networkClient: INetworkModule;

    // Network Manager
    protected networkManager: NetworkManager;

    // Server Telemetry Manager
    protected serverTelemetryManager: ServerTelemetryManager;

    // Default authority object
    protected authority: Authority;

    protected constructor(configuration: ClientConfiguration) {
        // Set the configuration
        this.config = buildClientConfiguration(configuration);

        // Initialize the logger
        this.logger = new Logger(this.config.loggerOptions);

        // Initialize crypto
        this.cryptoUtils = this.config.cryptoInterface;

        // Initialize storage interface
        this.cacheManager = this.config.storageInterface;

        // Set the network interface
        this.networkClient = this.config.networkInterface;
        this.networkManager = new NetworkManager(this.networkClient, this.cacheManager);

        // Set TelemetryManager
        this.serverTelemetryManager = this.config.serverTelemetryManager;

        TrustedAuthority.setTrustedAuthoritiesFromConfig(this.config.authOptions.knownAuthorities, this.config.authOptions.cloudDiscoveryMetadata);

        this.authority = this.config.authOptions.authority;
    }

    /**
     * Creates default headers for requests to token endpoint
     */
    protected createDefaultTokenRequestHeaders(): Map<string, string> {
        const headers = this.createDefaultLibraryHeaders();
        headers.set(HeaderNames.CONTENT_TYPE, Constants.URL_FORM_CONTENT_TYPE);

        if (this.serverTelemetryManager) {
            headers.set(HeaderNames.X_CLIENT_CURR_TELEM, this.serverTelemetryManager.generateCurrentRequestHeaderValue());
            headers.set(HeaderNames.X_CLIENT_LAST_TELEM, this.serverTelemetryManager.generateLastRequestHeaderValue());
        }

        return headers;
    }

    /**
     * addLibraryData
     */
    protected createDefaultLibraryHeaders(): Map<string, string> {
        const headers = new Map<string, string>();

        // client info headers
        headers.set(`${AADServerParamKeys.X_CLIENT_SKU}`,this.config.libraryInfo.sku);
        headers.set(`${AADServerParamKeys.X_CLIENT_VER}`, this.config.libraryInfo.version);
        headers.set(`${AADServerParamKeys.X_CLIENT_OS}`, this.config.libraryInfo.os);
        headers.set(`${AADServerParamKeys.X_CLIENT_CPU}`, this.config.libraryInfo.cpu);

        return headers;
    }

    /**
     * Http post to token endpoint
     * @param tokenEndpoint
     * @param queryString
     * @param headers
     */
    protected async executePostToTokenEndpoint(tokenEndpoint: string, queryString: string, headers: Map<string, string>): Promise<NetworkResponse<ServerAuthorizationTokenResponse>> {
        const response = await this.networkManager.sendPostRequest<
        ServerAuthorizationTokenResponse
        >(tokenEndpoint, {
            body: queryString,
            headers: headers,
        });

        if (this.config.serverTelemetryManager && response.status < 500 && response.status !== 429) {
            this.config.serverTelemetryManager.clearTelemetryCache();
        }

        return response;
    }
}
