import { Config, Context } from 'semantic-release';
import { PluginOptions, resolveOptions } from './options';
import { execa } from 'execa';

const NUGET_VERSION_REGEX = /^NuGet Command Line\s+([0-9.]+)$/m;

export async function verifyConditions(
  options: Config & PluginOptions,
  context: Context
): Promise<void> {
  const errors: string[] = [];

  // Resolve the options and make sure we have them all populated.
  const resolved = resolveOptions(options, context);

  // Set up debugging.
  const { logger } = context;

  logger.debug('options', resolved);

  if (!resolved.pushUrl) {
    errors.push('NUGET_PUSH_URL or the pushUrl option must be set');
  }

  if (!resolved.apiKey) {
    errors.push('NUGET_TOKEN or the apiKey option must be set');
  }

  // Make sure we have access to the `dotnet nuget` command.
  try {
    const output = await execa('dotnet', [ 'nuget', '--version' ]);

    if (output.failed) {
      errors.push(`The 'dotnet nuget --version' responded with an error code`);
    } else {
      const { stdout } = output;
      const match = NUGET_VERSION_REGEX.exec(stdout);

      if (match != null && match.length == 2) {
        logger.info(`Using NuGet version ${match[1]}`);
      } else {
        errors.push(`'dotnet nuget --version' didn't respond as expected: ${stdout}`);
      }
    }
  } catch {
    errors.push(`Cannot run the 'dotnet' process`);
  }

  if (errors.length) {
    errors.forEach(x => logger.error(x));

    throw new Error('Could not verify conditions for NuGet');
  }
}
