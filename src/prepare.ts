import { Config, Context } from 'semantic-release';
import { PluginOptions, resolveOptions } from './options';
import execa from 'execa';

export async function prepare(
  options: Config & PluginOptions,
  context: Context
): Promise<void> {
  const { logger } = context;

  // Resolve the options and make sure we have them all populated.
  const resolved = await resolveOptions(options, context);
  const args: string[] = [];

  if (resolved.project) {
    args.push(resolved.project);
  }

  if (resolved.configuration) {
    args.push('--configuration', resolved.configuration);
  }

  if (resolved.runtime) {
    args.push('--runtime', resolved.runtime);
  }

  if (!resolved.build) {
    args.push('--no-build');
  }

  if (resolved.output) {
    args.push('--output', resolved.output);
  }

  if (resolved.includeSource) {
    args.push('--include-source');
  }

  if (resolved.includeSymbols) {
    args.push('--include-symbols');
  }

  if (resolved.restore) {
    if (!resolved.dependencies) {
      args.push('--no-dependencies');
    }

    if (resolved.force) {
      args.push('--force');
    }
  } else {
    args.push('--no-restore');
  }

  // Run the pack command.
  logger.info(`Running the 'dotnet pack' command`);

  const packCommand = await execa('dotnet', [
    'pack',
    ...args,
    ...resolved.packArguments,
    `-p:Version=${context.nextRelease?.version}`
  ]);

  if (packCommand.failed) {
    throw new Error(`Cannot run 'dotnet pack'\n\n${packCommand.stdout}`);
  }
}
