import { spawnSync } from 'node:child_process'
import { createHash } from 'node:crypto'
import { cp, mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'

interface PackageManifest {
  name: string
  version: string
  files: string[]
  dependencies?: Record<string, string>
  devDependencies?: Record<string, string>
  optionalDependencies?: Record<string, string>
  peerDependencies?: Record<string, string>
  [key: string]: unknown
}

async function prepareConsumer(file: string | undefined) {
  if (!file)
    return undefined
  const consumerPath = path.resolve(file)
  const text = await readFile(consumerPath, 'utf8')
  const manifest = JSON.parse(text) as PackageManifest
  const values = [
    'dependencies',
    'devDependencies',
    'optionalDependencies'
  ].flatMap((field) => {
    const value = (manifest[field] as Record<string, string> | undefined)?.[
      'naive-ui'
    ]
    return value === undefined ? [] : [value]
  })
  if (values.length !== 1) {
    throw new Error(
      `Expected exactly one naive-ui dependency in ${consumerPath}`
    )
  }
  const matches = [
    ...text.matchAll(/("naive-ui"\s*:\s*)("(?:\\.|[^"\\])*")/g)
  ].filter(match => JSON.parse(match[2]) === values[0])
  if (matches.length !== 1) {
    throw new Error(
      `Cannot uniquely locate the naive-ui dependency in ${consumerPath}`
    )
  }
  const match = matches[0]
  return {
    path: consumerPath,
    text,
    start: match.index + match[1].length,
    end: match.index + match[0].length
  }
}

async function main(): Promise<void> {
  const repository = path.resolve(path.dirname(process.argv[1]), '..')
  const destination = path.resolve(process.argv[2] || 'D:/his-dependence')
  const consumer = await prepareConsumer(process.argv[3])
  const manifest = JSON.parse(
    await readFile(path.join(repository, 'package.json'), 'utf8')
  ) as PackageManifest
  if (
    manifest.name !== 'naive-ui'
    || !manifest.version
    || !Array.isArray(manifest.files)
  ) {
    throw new Error('Invalid Naive UI package manifest')
  }
  for (const file of [
    'es/index.mjs',
    'es/index.d.ts',
    'lib/index.js',
    'lib/index.d.ts',
    'dist/index.js',
    'dist/index.prod.js',
    'dist/index.mjs',
    'dist/index.prod.mjs',
    'volar.d.ts',
    'web-types.json'
  ]) {
    try {
      await readFile(path.join(repository, file))
    }
    catch {
      throw new Error(`Missing build artifact: ${file}. Run pnpm build first.`)
    }
  }
  for (const field of [
    'dependencies',
    'optionalDependencies',
    'peerDependencies'
  ] as const) {
    for (const [name, value] of Object.entries(manifest[field] ?? {})) {
      if (/^(?:catalog|workspace|file|link):/.test(value)) {
        throw new Error(
          `Non-portable dependency in ${field}: ${name} = ${value}`
        )
      }
    }
  }

  const pnpm = process.env.npm_execpath
  if (!pnpm)
    throw new Error('Run this script through pnpm pack:his')
  const cache = path.join(repository, 'node_modules', '.cache')
  await mkdir(cache, { recursive: true })
  const temporary = await mkdtemp(path.join(cache, 'naive-ui-pack-'))
  try {
    const stagedPackage = path.join(temporary, 'package')
    const packedOutput = path.join(temporary, 'archives')
    await mkdir(stagedPackage)
    await mkdir(packedOutput)
    const files = [...new Set([...manifest.files, 'LICENSE'])]
    for (const file of files) {
      const source = path.resolve(repository, file)
      if (
        !source.startsWith(`${repository}${path.sep}`)
        || source === temporary
      ) {
        throw new Error(`Invalid package file path: ${file}`)
      }
      await cp(source, path.join(stagedPackage, file), { recursive: true })
    }
    const packedManifest = { ...manifest }
    for (const field of [
      'scripts',
      'devDependencies',
      'packageManager',
      'lint-staged'
    ])
      delete packedManifest[field]
    await writeFile(
      path.join(stagedPackage, 'package.json'),
      `${JSON.stringify(packedManifest, null, 2)}\n`
    )

    const script = /\.(?:c?js|mjs)$/i.test(pnpm)
    const result = spawnSync(
      script ? process.execPath : pnpm,
      [...(script ? [pnpm] : []), 'pack', '--pack-destination', packedOutput],
      { cwd: stagedPackage, stdio: 'inherit' }
    )
    if (result.error)
      throw result.error
    if (result.status !== 0)
      throw new Error(`pnpm pack failed with exit code ${result.status}`)

    const bytes = await readFile(
      path.join(packedOutput, `naive-ui-${manifest.version}.tgz`)
    )
    const digest = createHash('sha256').update(bytes).digest('hex')
    const archive = path.join(
      destination,
      `naive-ui-${digest.slice(0, 16)}.tgz`
    )
    await mkdir(destination, { recursive: true })
    try {
      await writeFile(archive, bytes, { flag: 'wx' })
    }
    catch (error) {
      if ((error as NodeJS.ErrnoException).code !== 'EEXIST')
        throw error
      const existingDigest = createHash('sha256')
        .update(await readFile(archive))
        .digest('hex')
      if (digest !== existingDigest)
        throw new Error(`Archive hash collision: ${archive}`)
    }
    const dependency = `file:${archive.replaceAll('\\', '/')}`
    console.log(`Local package: ${archive}`)
    console.log(`Install in another project: pnpm add "${dependency}"`)
    if (consumer) {
      if ((await readFile(consumer.path, 'utf8')) !== consumer.text) {
        throw new Error(
          `Consumer changed during packaging; dependency was not updated: ${consumer.path}`
        )
      }
      await writeFile(
        consumer.path,
        consumer.text.slice(0, consumer.start)
        + JSON.stringify(dependency)
        + consumer.text.slice(consumer.end)
      )
      console.log(
        `Dependency updated: ${consumer.path}. Run pnpm install in that project.`
      )
    }
  }
  finally {
    if (
      path.dirname(temporary) !== cache
      || !path.basename(temporary).startsWith('naive-ui-pack-')
    ) {
      console.error(
        `Refusing to remove unexpected temporary directory: ${temporary}`
      )
      process.exitCode = 1
    }
    else {
      await rm(temporary, { recursive: true, force: true })
    }
  }
}

main().catch((error: unknown) => {
  console.error(error)
  process.exitCode = 1
})
