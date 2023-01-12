import { Config, Context } from 'semantic-release';
import { PluginOptions, resolveOptions } from './options';
import { execPipe } from './execPipe';

const NUGET_VERSION_REGEX = /^NuGet Command Line\s+([0-9.]+)$/m;

export async function verifyConditions(
  options: Config & PluginOptions,
  context: Context
): Promise<void> {
  const errors: string[] = [];

  // Resolve the options and make sure we have them all populated.
  const resolved = await resolveOptions(options, context);

  // Set up debugging.
  const { logger } = context;

  logger.debug('options', resolved);

  if (!resolved.source) {
    errors.push('NUGET_SOURCE or the push.source option must be set!');
  }

  if (!resolved.apiKey) {
    errors.push('NUGET_TOKEN or the push.apiKey option must be set!');
  }

  // Make sure we have access to the `dotnet nuget` command.
  try {
    const output = await execPipe('dotnet', [
      'nuget',
      '--version',
    ], options);

    if (output.failed) {
      errors.push(`The 'dotnet nuget --version' responded with an error code!`);
    } else {
      const { stdout } = output;
      const match = NUGET_VERSION_REGEX.exec(stdout);

      if (match != null && match.length == 2) {
        logger.info(`Using NuGet version ${match[1]}.`);
      } else {
        logger.warn(`'dotnet nuget --version' didn't respond as expected!`);
      }
    }
  } catch {
    errors.push(`Cannot run the 'dotnet' process!`);
  }

  if (errors.length) {
    errors.forEach(x => logger.error(x));

    throw new Error('Could not verify conditions for NuGet!');
  }
}
