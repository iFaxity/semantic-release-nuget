import { Context } from 'semantic-release';
import { z } from 'zod';

const SNAKE_CASE_REGEX = /(?=[A-Z])/;

const PackOptions = z.object({
    project: z.string(),
    args: z.array(z.string()).default([]),
    configuration: z.string().default('Release'),
    runtime: z.string().optional(),
    force: z.boolean().optional(),
    includeSource: z.boolean().optional(),
    includeSymbols: z.boolean().optional(),
    output: z.string().optional(),
    noBuild: z.boolean().default(true),
    noDependencies: z.boolean().optional(),
    noRestore: z.boolean().default(true),
    verbosity: z.string().optional(),
    versionSuffix: z.string().optional(),
});

const PushOptions = z.object({
    assets: z.array(z.string()).default([ '*.nupkg' ]),
    args: z.array(z.string()).default([]),
    apiKey: z.string(),
    source: z.string(),
    skipDuplicate: z.boolean().optional(),
    timeout: z.number().int().positive().finite().optional(),
});

const PluginOptions = z.object({
    pack: PackOptions,
    push: PushOptions,
});

type PushOptions = z.infer<typeof PushOptions>;
type PackOptions = z.infer<typeof PackOptions>;
export type PluginOptions = Partial<z.infer<typeof PluginOptions>>;

export async function resolveOptions(
    options: PluginOptions,
    context: Context
): Promise<Required<PluginOptions>> {
    const { env } = context;

    return PluginOptions.parseAsync({
        pack: {
            ...options.pack,
        },
        push: {
            source: env.NUGET_SOURCE,
            apiKey: env.NUGET_TOKEN,
            ...options.push,
        },
    });
}

export function stringifyArgs<T extends object>(obj: T): string[] {
    return Object.keys(obj).reduce<string[]>((acc, key) => {
        const value = obj[key as keyof T];
        const str = String(value || '');

        if (str) {
            const snakeKey = key.split(SNAKE_CASE_REGEX).join('-').toLowerCase();

            // if a boolean is used use toggle flag
            if (value === true) {
                acc.push(`--${snakeKey}`);
            } else {
                acc.push(`--${snakeKey}`, str);
            }
        }

        return acc;
    }, []);
}

export function normalizeArgs(...args: any[]): string[] {
    return args
        .filter(x => x)
        .reduce((acc, x) => {
            if (Array.isArray(x)) {
                return [ ...acc, ...x ];
            }
            if (typeof x == 'object') {
                return [ ...acc, ...stringifyArgs(x) ];
            }

            return [ ...acc, String(x) ];
        });
}
