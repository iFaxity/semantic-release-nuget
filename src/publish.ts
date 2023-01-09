import { Config, Context } from 'semantic-release';
import { normalizeArgs, PluginOptions, resolveOptions, stringifyArgs } from './options';
import execa from 'execa';

export async function publish(
  options: Config & PluginOptions,
  context: Context
): Promise<void> {
  const { logger } = context;

  // Resolve the options and make sure we have them all populated.
  const resolved = await resolveOptions(options, context);
  const { assets, args, ...push } = resolved.push;

  // Run the push command.
  logger.info('Running the dotnet nuget push command');
  
  const pushArgs = normalizeArgs(
    'nuget',
    'push',
    ...assets,
    ...stringifyArgs(push),
    ...args
  );

  const pushCommand = await execa('dotnet', pushArgs);

  if (pushCommand.failed) {
    throw new Error(`Cannot run 'dotnet nuget push'\n\n${pushCommand.stdout}`);
  }
}
