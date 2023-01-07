import { Config, Context } from 'semantic-release';
import { PluginOptions, resolveOptions } from './options';
import { execa } from 'execa';

export async function prepare(
  options: Config & PluginOptions,
  context: Context
): Promise<void> {
  // Resolve the options and make sure we have them all populated.
  const resolved = resolveOptions(options, context);

  const { logger } = context;

  // Run the pack commands.
  logger.info(`Running the 'dotnet pack' command`);
  const pack = await execa('dotnet', [ 'pack', ...resolved.packArguments ]);

  if (pack.failed) {
    throw new Error(`Cannot run 'dotnet pack'\n\n${pack.stdout}`);
  }
}
