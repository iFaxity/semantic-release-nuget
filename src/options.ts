import { Context } from 'semantic-release';
import { z } from 'zod';

const PluginOptions = z.object({
    // Pack
    project: z.string().optional(),
    configuration: z.string().default('Release'),
    // Build
    build: z.boolean().default(false),
    output: z.string().optional(),
    includeSource: z.boolean().default(false),
    includeSymbols: z.boolean().default(false),
    dependencies: z.boolean().optional().default(false),
    properties: z.record(z.union([ z.string(), z.number(), z.boolean() ])),
    // Restore
    restore: z.boolean().default(false),
    force: z.boolean().default(false),
    runtime: z.string().optional(),
    // Other
    packArguments: z.array(z.string()).default([]),
    // Push
    asset: z.string().default('*.nupkg'),
    apiKey: z.string().optional(),
    source: z.string().optional(),
    skipDuplicate: z.boolean().default(false),
    timeout: z.number().int().positive().finite().optional(),
    pushArguments: z.array(z.string()).default([]),
});

export type PluginOptions = z.infer<typeof PluginOptions>;

export async function resolveOptions(
    options: Partial<PluginOptions>,
    context: Context
): Promise<PluginOptions> {
    const { env, nextRelease } = context;
    const properties = options?.properties ?? {};

    // Force Version property to be set to nextRelease.version
    if (nextRelease?.version) {
        properties.Version = nextRelease.version;
    }

    return PluginOptions.parseAsync({
        project: env.PACK_PROJECT,
        configuration: env.PACK_CONFIGURATION,
        output: env.PACK_OUTPUT,
        asset: env.NUGET_ASSET,
        source: env.NUGET_SOURCE,
        apiKey: env.NUGET_API_KEY,
        ...options,
        properties,
    });
}
