import Bun from 'bun';

declare const process: { exitCode: number };

const parseEnv = (contents: string): Map<string, string> =>
  new Map(
    contents
      .split(`\n`)
      .map((line) => line.match(/^\s*(?:export\s+)?([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/))
      .filter((match): match is RegExpMatchArray => match !== null)
      .map((match) => [match[1], match[2].trim()]),
  );

const hasValue = (value: string | undefined): boolean =>
  value !== undefined && value !== `` && value !== `''` && value !== `""`;

const appsDirectory = `${import.meta.dir}/../apps`;
const exampleFiles: string[] = [
  ...new Bun.Glob(`*/.env.example`).scanSync({
    cwd: appsDirectory,
    dot: true,
  }),
];

const results = await Promise.all(
  exampleFiles.map(async (exampleFile) => {
    const app = exampleFile.slice(0, exampleFile.indexOf(`/`));
    const appDirectory = `${appsDirectory}/${app}`;
    const example = parseEnv(await Bun.file(`${appDirectory}/.env.example`).text());
    const envFile = Bun.file(`${appDirectory}/.env`);
    const env = (await envFile.exists())
      ? parseEnv(await envFile.text())
      : new Map<string, string>();
    const missing = [...example.keys()].filter(
      (variable) => !hasValue(Bun.env[variable]) && !hasValue(env.get(variable)),
    );

    if (missing.length === 0) {
      console.log(`${app}: all environment variables are present`);
    } else {
      console.log(`${app}: missing ${missing.join(`, `)}`);
    }

    return missing.length > 0;
  }),
);

process.exitCode = results.some(Boolean) ? 1 : 0;
