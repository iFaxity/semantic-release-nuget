import { Context } from 'semantic-release';

export interface PluginOptions {
    /**
     * The URL to push NuGet packages.
     */
    pushUrl?: string;
    /**
     * The API key used for pushing.
     */
    apiKey?: string;
    /**
     * The arguments to the `dotnet pack` command. Defaults to '-s Release'.
     */
    packArguments?: string[];
    /**
     * The path to the `dotnet nuget push` command. Defaults to '*.nupkg'.
     */
    pushFiles?: string[];
}

export interface ResolvedPluginOptions {
    pushUrl: string;
    apiKey: string;
    packArguments: string[];
    pushFiles: string[];
}

function ensureArray(input: undefined|string|string[]): string[]|null {
    if (input == null) {
        return null;
    }

    return typeof input == 'string'
        ? input.split(/\s+/g)
        : input;
}

export function resolveOptions(
    options: PluginOptions,
    context: Context
): ResolvedPluginOptions {
    const { env } = context;
    const { pushUrl, apiKey, packArguments, pushFiles } = options;

    return {
        pushUrl: pushUrl ?? env.NUGET_PUSH_URL ?? '',
        apiKey: apiKey?? env.NUGET_TOKEN ?? '',
        packArguments: ensureArray(packArguments) ?? [ ],
        pushFiles: ensureArray(pushFiles) ?? [ '*.nupkg' ],
    };
}
