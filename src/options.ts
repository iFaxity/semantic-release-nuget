import { Context } from 'semantic-release';
import { z } from 'zod';

const PluginOptions = z.object({
    pushUrl: z.string().default(''),
    apiKey: z.string().default(''),
    packArguments: z.array(z.string()).default([]),
    pushFiles: z.array(z.string()).default([]),
});

export type PluginOptions = z.infer<typeof PluginOptions>;

export async function resolveOptions(
    options: Partial<PluginOptions>,
    context: Context
): Promise<PluginOptions> {
    const { env } = context;
    const pushUrl = options?.pushUrl ?? env.NUGET_PUSH_URL;
    const apiKey = options?.apiKey ?? env.NUGET_TOKEN;

    return PluginOptions.parseAsync({ ...options, pushUrl, apiKey });
}
