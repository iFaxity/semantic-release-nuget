import { Config, Context } from 'semantic-release';
import { PluginOptions, resolveOptions } from './options';
import { execPipe } from './execPipe'

export async function publish(
  options: Config & PluginOptions,
  context: Context
): Promise<void> {
  const { logger } = context;

  // Resolve the options and make sure we have them all populated.
  const resolved = await resolveOptions(options, context);
  const args: string[] = [];

  if (resolved.apiKey) {
    args.push('--api-key', resolved.apiKey);
  }

  if (resolved.source) {
    args.push('--source', resolved.source);
  }

  if (resolved.skipDuplicate) {
    args.push('--skip-duplicate');
  }

  if (resolved.timeout != null && resolved.timeout >= 0) {
    args.push('--timeout', String(resolved.timeout));
  }

  // Run the push command.
  logger.info('Running the dotnet nuget push command.');

  const pushCommand = await execPipe('dotnet', [
    'nuget',
    'push',
    resolved.asset,
    ...resolved.pushArguments,
  ], options);

  if (pushCommand.failed) {
    throw new Error(`Cannot run 'dotnet nuget push'!`);
  }
}
