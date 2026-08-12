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

const rootDirectory = `${import.meta.dir}/..`;
const example = parseEnv(await Bun.file(`${rootDirectory}/.env.example`).text());
const envFile = Bun.file(`${rootDirectory}/.env`);
const env = (await envFile.exists()) ? parseEnv(await envFile.text()) : new Map<string, string>();
const missing = [...example.keys()].filter(
  (variable) => !hasValue(Bun.env[variable]) && !hasValue(env.get(variable)),
);

if (missing.length === 0) {
  console.log(`all environment variables are present`);
} else {
  console.log(`missing ${missing.join(`, `)}`);
}

process.exitCode = missing.length > 0 ? 1 : 0;
