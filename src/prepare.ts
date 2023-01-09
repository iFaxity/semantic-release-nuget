import { Config, Context } from 'semantic-release';
import { normalizeArgs, PluginOptions, resolveOptions, stringifyArgs } from './options';
import execa from 'execa';

export async function prepare(
  options: Config & PluginOptions,
  context: Context
): Promise<void> {
  const { logger } = context;

  // Resolve the options and make sure we have them all populated.
  const resolved = await resolveOptions(options, context);
  const { args, project, ...pack } = resolved.pack;

  // Run the pack command.
  logger.info(`Running the 'dotnet pack' command`);

  const packArgs = normalizeArgs(
    'pack',
    project,
    ...stringifyArgs(pack),
    ...args,
    `-p:Version=${context.nextRelease?.version}`
  );
  const packCommand = await execa('dotnet', packArgs);

  if (packCommand.failed) {
    throw new Error(`Cannot run 'dotnet pack'\n\n${packCommand.stdout}`);
  }
}
