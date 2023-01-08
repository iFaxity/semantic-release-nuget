import { Config, Context } from 'semantic-release';
import { PluginOptions, resolveOptions } from './options';
import { execa } from 'execa';

export async function publish(
  options: Config & PluginOptions,
  context: Context
): Promise<void> {
  // Resolve the options and make sure we have them all populated.
  const resolved = await resolveOptions(options, context);

  const { logger } = context;

  // Run the push commands.
  logger.info('Running the dotnet nuget push command');
  const push = await execa('dotnet', [
    'nuget',
    'push',
    '--api-key',
    resolved.apiKey,
    '--source',
    resolved.pushUrl,
    ...resolved.pushFiles,
  ]);

  if (push.failed) {
    throw new Error(`Cannot run 'dotnet nuget push'\n\n${push.stdout}`);
  }
}
