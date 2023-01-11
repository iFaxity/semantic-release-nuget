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
    // Restore
    restore: z.boolean().default(false),
    force: z.boolean().default(false),
    runtime: z.string().optional(),
    // Other
    packArguments: z.array(z.string()).default([]),
    // Push
    assets: z.array(z.string()).default([ '*.nupkg' ]),
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
    const { env } = context;

    return PluginOptions.parseAsync({
        source: env.NUGET_SOURCE,
        apiKey: env.NUGET_TOKEN,
        ...options,
    });
}
