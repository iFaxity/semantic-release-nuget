import { Config, Context } from 'semantic-release';
import { PluginOptions, resolveOptions } from './options';
import { execPipe } from './execPipe';

const NUGET_VERSION_REGEX = /^NuGet Command Line\s+([0-9.]+)$/m;
const DOTNET_CLI_VERSION_REGEX = /^([0-9.]+)$/g;

export async function verifyConditions(
  options: Config & PluginOptions,
  context: Context
): Promise<void> {
  const errors: string[] = [];

  // Resolve the options and make sure we have them all populated.
  const resolved = await resolveOptions(options, context);

  // Set up debugging.
  const { logger } = context;

  async function verifyNuget() {
    // Make sure we have access to the `dotnet nuget` command.
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
  }

  async function verifyDotnet() {
    // Make sure we have access to the `dotnet` command.
    const output = await execPipe('dotnet', [
      '--version',
    ], options);

    if (output.failed) {
      errors.push(`The 'dotnet --version' responded with an error code`);
    } else {
      const { stdout } = output;
      const match = DOTNET_CLI_VERSION_REGEX.exec(stdout);

      if (match != null && match.length == 2) {
        logger.info(`Using dotnet-cli version ${match[1]}`);
      } else {
        logger.warn(`'dotnet --version' didn't respond as expected: ${stdout}`);
      }
    }
  }

  logger.debug('options', resolved);

  if (!resolved.source) {
    errors.push(`NUGET_SOURCE or the 'source' option must be set!`);
  }

  if (!resolved.apiKey) {
    errors.push(`NUGET_API_KEY or the 'apiKey' option must be set!`);
  }

  try {
    await verifyDotnet();
    await verifyNuget();
  } catch {
    errors.push(`Cannot run the 'dotnet' process!`);
  }

  if (errors.length) {
    errors.forEach(x => logger.error(x));

    throw new Error('Could not verify conditions for NuGet!');
  }
}


