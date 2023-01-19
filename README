@ifaxity/semantic-release-nuget
===================================

[**semantic-release**](https://github.com/semantic-release/semantic-release) plugin to package and publish a package via NuGet using the dotnet-cli.

[![Codacy grade](https://img.shields.io/codacy/grade/a0c628b128c044269faefc1da74382f7?style=for-the-badge&logo=codacy)](https://www.codacy.com/gh/iFaxity/semantic-release-nuget/dashboard)
[![npm (scoped)](https://img.shields.io/npm/v/semantic-release-nuget?style=for-the-badge&logo=npm)](https://npmjs.org/package/@ifaxity/semantic-release-nuget)
[![npm bundle size (scoped)](https://img.shields.io/bundlephobia/min/semantic-release-nuget?label=Bundle%20size&style=for-the-badge)](https://npmjs.org/package/@ifaxity/semantic-release-nuget)
[![npm bundle size (scoped)](https://img.shields.io/bundlephobia/minzip/semantic-release-nuget?label=Bundle%20size%20%28gzip%29&style=for-the-badge)](https://npmjs.org/package/@ifaxity/semantic-release-nuget)

| Step               | Description                                                                           |
|--------------------|---------------------------------------------------------------------------------------|
| `verifyConditions` | Verify that the dotnet-cli is installed and prints its nuget version.                 |
| `prepare`          | Executes `dotnet pack` which creates a nupkg file from the targeted project.          |
| `publish`          | Executes `dotnet nuget push` which publishes nupkg files to a specified NuGet server. |


Install
--------------------------

```bash
$ npm i --save-dev @ifaxity/semantic-release-nuget
```


Usage
--------------------------

The plugin can be configured in the [**semantic-release** configuration file](https://github.com/semantic-release/semantic-release/blob/master/docs/usage/configuration.md#configuration):

```json
{
  "plugins": [
    "@semantic-release/commit-analyzer",
    "@semantic-release/release-notes-generator",
    "@ifaxity/semantic-release-dotnet",
    ["@ifaxity/semantic-release-nuget", {
      "apiKey": "abc...",
      "source": "https://api.nuget.org/v3/index.json"
    }]
  ]
}
```

With this example:
- The project will be built and versioned by the plugin @ifaxity/semantic-release-dotnet
- The package will be prepared by @ifaxity/semantic-release-nuget
- The package will be published by @ifaxity/semantic-release-nuget

**Note**: it's recommended to include @ifaxity/semantic-release-dotnet directly before this plugin or some other custom way.


Configuration
--------------------------

### Nuget registry authentication

The Nuget authentication configuration is **required** and can be set via [environment variables](#environment-variables) or via options.

**Notes**:
- Both `source` and `apiKey` is required. Either implicitly from environment variables or explicitly in the configuration.


### Environment variables

| Variable             | Description                                                                                  |
|----------------------|----------------------------------------------------------------------------------------------|
| `NUGET_API_KEY`      | Nuget API Key, (to create one for nuget.org go to https://www.nuget.org/account/apikeys).     |
| `NUGET_SOURCE`       | Nuget source url (for nuget.org this is https://api.nuget.org/v3/index.json).                 |
| `NUGET_ASSET`        | Asset to push to Nuget, supports glob patterns so *.nupkg publishes all the packages in cwd.  |
| `PACK_PROJECT`       | Project to pack, should be an absolute reference to a csproj file or a directory.             |
| `PACK_CONFIGURATION` | Sets the configuration when building the project (only works if option `build: true` is set). |
| `PACK_OUTPUT`        | Sets the output directory of the `nuget pack` command. Defaults to cwd. |


### Options

#### project

- **Type:** `string`
- **Related:** [dotnet pack arguments](https://learn.microsoft.com/en-us/dotnet/core/tools/dotnet-pack#arguments)

The project or solution to pack. It's either a path to a csproj, vbproj, or fsproj file, or to a solution file or directory. If not specified, the command searches the current directory for a project or solution file.

#### configuration

- **Type:** `string`
- **Default:** `'Release'`
- **Related:** [dotnet pack options](https://learn.microsoft.com/en-us/dotnet/core/tools/dotnet-pack#options)

Defines the build configuration. The default for most projects is Debug, but you can override the build configuration settings in your project.

#### build

- **Type:** `boolean`
- **Default:** `false`
- **Related:** [dotnet pack options](https://learn.microsoft.com/en-us/dotnet/core/tools/dotnet-pack#options)

Doesn't build the project before packing. It also implicitly sets the --no-restore flag.

#### output

- **Type:** `string`
- **Related:** [dotnet pack options](https://learn.microsoft.com/en-us/dotnet/core/tools/dotnet-pack#options)

Places the built packages in the directory specified.

#### includeSource

- **Type:** `boolean`
- **Default:** `false`
- **Related:** [dotnet pack options](https://learn.microsoft.com/en-us/dotnet/core/tools/dotnet-pack#options)

Includes the debug symbols NuGet packages in addition to the regular NuGet packages in the output directory. The sources files are included in the src folder within the symbols package.

#### includeSymbols

- **Type:** `boolean`
- **Default:** `false`
- **Related:** [dotnet pack options](https://learn.microsoft.com/en-us/dotnet/core/tools/dotnet-pack#options)

Includes the debug symbols NuGet packages in addition to the regular NuGet packages in the output directory.

#### dependencies

- **Type:** `boolean`
- **Default:** `false`
- **Related:** [dotnet pack options](https://learn.microsoft.com/en-us/dotnet/core/tools/dotnet-pack#options)

Ignores project-to-project references and only restores the root project.

#### properties

- **Type:** `Record<string, string>`
- **Default:** `{}`
- **Related:** [MSBuild properties](https://learn.microsoft.com/en-us/nuget/reference/msbuild-targets#pack-target)

MSBuild properties to override when packaging the project. See the MSBuild properties reference for a list of properties that can be set.

#### restore

- **Type:** `boolean`
- **Default:** `false`
- **Related:** [dotnet pack options](https://learn.microsoft.com/en-us/dotnet/core/tools/dotnet-pack#options)

Doesn't execute an implicit restore when running the command.

#### force

- **Type:** `boolean`
- **Default:** `false`
- **Related:** [dotnet pack options](https://learn.microsoft.com/en-us/dotnet/core/tools/dotnet-pack#options)

Forces all dependencies to be resolved even if the last restore was successful. Specifying this flag is the same as deleting the project.assets.json file.

#### runtime

- **Type:** `string`
- **Related:** [dotnet pack options](https://learn.microsoft.com/en-us/dotnet/core/tools/dotnet-pack#options)

Specifies the target runtime to restore packages for. For a list of Runtime Identifiers (RIDs), see the [RID catalog](https://learn.microsoft.com/en-us/dotnet/core/rid-catalog).

#### packArguments

- **Type:** `string[]`
- **Default:** `[]`
- **Related:** [dotnet pack options](https://learn.microsoft.com/en-us/dotnet/core/tools/dotnet-pack#options)

Generic pack arguments to send, can be used if there is a specific option that needs to be configured that is not in the config above.

#### asset

- **Type:** `string`
- **Default:** `'*.nupkg'`
- **Related:** [dotnet push arguments](https://learn.microsoft.com/en-us/dotnet/core/tools/dotnet-nuget-push#arguments)

Specifies the file path to the package to be pushed.

#### apiKey

- **Type:** `string`
- **Default:** `env.NUGET_API_KEY`
- **Related:** [dotnet push options](https://learn.microsoft.com/en-us/dotnet/core/tools/dotnet-nuget-push#options)

The API key for the server. If not explicitly set, the value from the environment variable `NUGET_API_KEY` is used instead.

#### source

- **Type:** `string`
- **Default:** `env.NUGET_SOURCE`
- **Related:** [dotnet push options](https://learn.microsoft.com/en-us/dotnet/core/tools/dotnet-nuget-push#options)

Specifies the server URL. NuGet identifies a UNC or local folder source and simply copies the file there instead of pushing it using HTTP. If not explicitly set, the value from the environment variable `NUGET_SOURCE` is used instead.

#### skipDuplicate

- **Type:** `boolean`
- **Default:** `false`
- **Related:** [dotnet push options](https://learn.microsoft.com/en-us/dotnet/core/tools/dotnet-nuget-push#options)

When pushing multiple packages to an HTTP(S) server, treats any 409 Conflict response as a warning so that other pushes can continue.

#### timeout

- **Type:** `number`
- **Related:** [dotnet push options](https://learn.microsoft.com/en-us/dotnet/core/tools/dotnet-nuget-push#options)

Specifies the timeout for pushing to a server in seconds. Defaults to 300 seconds (5 minutes). Specifying 0 applies the default value.

#### pushArguments

- **Type:** `string[]`
- **Default:** `[]`
- **Related:** [dotnet push options](https://learn.microsoft.com/en-us/dotnet/core/tools/dotnet-nuget-push#options)

Generic push arguments to send, can be used if there is a specific option that needs to be configured that is not in the config above.


License
--------------------------

[MIT](./LICENSE)
