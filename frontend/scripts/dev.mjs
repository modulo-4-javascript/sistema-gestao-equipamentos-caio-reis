import { spawn } from 'node:child_process'
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import net from 'node:net'
import { dirname, resolve } from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import axios from 'axios'

const scriptDir = dirname(fileURLToPath(import.meta.url))
const frontendDir = resolve(scriptDir, '..')
const repoRoot = resolve(frontendDir, '..')
const backendDir = resolve(repoRoot, 'backend')
const npmCommand = process.platform === 'win32' ? 'npm.cmd' : 'npm'
const dockerCommand = process.platform === 'win32' ? 'docker.exe' : 'docker'
const dockerComposeCommand = process.platform === 'win32' ? 'docker-compose.exe' : 'docker-compose'

const backendEnvPath = resolve(backendDir, '.env')
const frontendEnvPath = resolve(frontendDir, '.env')
const viteArgs = process.argv.slice(2)

const defaultBackendEnv = {
  PORT: '3000',
  POSTGRES_DB: 'denkenhub',
  POSTGRES_USER: 'denkenhub',
  POSTGRES_PASSWORD: 'denkenhub123',
  POSTGRES_PORT: '15432',
}

const managedBackendKeys = [
  'PORT',
  'DATABASE_URL',
  'POSTGRES_DB',
  'POSTGRES_USER',
  'POSTGRES_PASSWORD',
  'POSTGRES_PORT',
]

const managedFrontendEnv = {
  VITE_API_URL: '/api/v1',
}

const colors = {
  reset: '\u001b[0m',
  blue: '\u001b[34m',
  cyan: '\u001b[36m',
  green: '\u001b[32m',
}

const children = new Set()
let apiProcess
let viteProcess
let usingExistingApi = false

function tag(label, color = colors.reset) {
  return `${color}[${label}]${colors.reset}`
}

function log(message) {
  console.log(`${tag('dev', colors.cyan)} ${message}`)
}

function parseEnvFile(filePath) {
  if (!existsSync(filePath)) {
    return {}
  }

  return Object.fromEntries(
    readFileSync(filePath, 'utf8')
      .split(/\r?\n/)
      .map((line) => line.match(/^([A-Za-z_][A-Za-z0-9_]*)=(.*)$/))
      .filter(Boolean)
      .map((match) => [match[1], match[2]]),
  )
}

function buildDatabaseUrl(env) {
  return `postgresql://${env.POSTGRES_USER}:${env.POSTGRES_PASSWORD}@localhost:${env.POSTGRES_PORT}/${env.POSTGRES_DB}`
}

function mergeBackendEnv(currentEnv) {
  const env = {
    ...defaultBackendEnv,
    ...currentEnv,
  }

  env.DATABASE_URL = env.DATABASE_URL || buildDatabaseUrl(env)

  return env
}

function writeManagedEnvFile(filePath, managedValues, managedKeys = Object.keys(managedValues)) {
  const currentContent = existsSync(filePath) ? readFileSync(filePath, 'utf8') : ''
  const lines = currentContent ? currentContent.split(/\r?\n/) : []

  if (lines.at(-1) === '') {
    lines.pop()
  }

  const seenKeys = new Set()
  const nextLines = lines.map((line) => {
    const match = line.match(/^([A-Za-z_][A-Za-z0-9_]*)=/)

    if (!match) {
      return line
    }

    const key = match[1]

    if (!Object.prototype.hasOwnProperty.call(managedValues, key)) {
      return line
    }

    seenKeys.add(key)
    return `${key}=${managedValues[key]}`
  })

  for (const key of managedKeys) {
    if (!seenKeys.has(key)) {
      nextLines.push(`${key}=${managedValues[key]}`)
    }
  }

  writeFileSync(filePath, `${nextLines.join('\n')}\n`)
}

function isPortFree(port) {
  return new Promise((resolvePort) => {
    const server = net.createServer()

    server.once('error', () => resolvePort(false))
    server.once('listening', () => {
      server.close(() => resolvePort(true))
    })
    server.listen(Number(port), '127.0.0.1')
  })
}

async function findFreePort(initialPort) {
  const start = Number(initialPort)

  for (let offset = 0; offset <= 30; offset += 1) {
    const candidate = start + offset

    if (await isPortFree(candidate)) {
      return String(candidate)
    }
  }

  throw new Error(`Nao encontrei uma porta livre entre ${start} e ${start + 30}.`)
}

function wait(ms) {
  return new Promise((resolveWait) => {
    setTimeout(resolveWait, ms)
  })
}

function run(command, args, options = {}) {
  return new Promise((resolveRun, rejectRun) => {
    const child = spawn(command, args, {
      cwd: options.cwd,
      env: options.env,
      shell: process.platform === 'win32',
      stdio: options.stdio ?? 'inherit',
    })

    child.once('error', rejectRun)
    child.once('exit', (code) => {
      if (code === 0) {
        resolveRun()
        return
      }

      rejectRun(new Error(`Comando falhou: ${command} ${args.join(' ')}`))
    })
  })
}

function runQuiet(command, args, options = {}) {
  return new Promise((resolveRun) => {
    const child = spawn(command, args, {
      cwd: options.cwd,
      env: options.env,
      shell: process.platform === 'win32',
      stdio: ['ignore', 'pipe', 'pipe'],
    })

    let stdout = ''

    child.stdout.on('data', (chunk) => {
      stdout += chunk.toString()
    })

    child.once('error', () => resolveRun({ ok: false, stdout: '' }))
    child.once('exit', (code) => resolveRun({ ok: code === 0, stdout: stdout.trim() }))
  })
}

async function detectComposeCommand(env) {
  const dockerCompose = await runQuiet(dockerCommand, ['compose', 'version'], {
    cwd: backendDir,
    env,
  })

  if (dockerCompose.ok) {
    return { command: dockerCommand, args: ['compose'] }
  }

  const legacyCompose = await runQuiet(dockerComposeCommand, ['version'], {
    cwd: backendDir,
    env,
  })

  if (legacyCompose.ok) {
    return { command: dockerComposeCommand, args: [] }
  }

  throw new Error(
    'Docker Compose nao encontrado. Instale/atualize o Docker Desktop e tente novamente.',
  )
}

function openDockerDesktop() {
  if (process.platform === 'darwin') {
    spawn('open', ['-a', 'Docker'], { detached: true, stdio: 'ignore' }).unref()
    return
  }

  if (process.platform === 'win32') {
    spawn('cmd', ['/c', 'start', '""', '"Docker Desktop"'], {
      detached: true,
      stdio: 'ignore',
      shell: true,
    }).unref()
  }
}

async function ensureDockerRunning(env) {
  const dockerVersion = await runQuiet(dockerCommand, ['--version'], { env })

  if (!dockerVersion.ok) {
    throw new Error('Docker nao encontrado. Instale o Docker Desktop e rode npm run dev novamente.')
  }

  const initialCheck = await runQuiet(dockerCommand, ['info'], { env })

  if (initialCheck.ok) {
    return
  }

  log('Docker nao esta rodando. Tentando abrir o Docker Desktop...')
  openDockerDesktop()

  for (let attempt = 1; attempt <= 60; attempt += 1) {
    await wait(2000)

    const check = await runQuiet(dockerCommand, ['info'], { env })

    if (check.ok) {
      return
    }
  }

  throw new Error('Docker nao iniciou a tempo. Abra o Docker Desktop e rode npm run dev novamente.')
}

async function getPublishedPostgresPort(compose, env) {
  const result = await runQuiet(compose.command, [...compose.args, 'port', 'postgres', '5432'], {
    cwd: backendDir,
    env,
  })

  if (!result.ok || !result.stdout) {
    return undefined
  }

  return result.stdout.split(/\r?\n/).at(-1)?.split(':').at(-1)
}

async function waitForPostgres(compose, env) {
  log('Aguardando o banco aceitar conexoes...')

  for (let attempt = 1; attempt <= 30; attempt += 1) {
    const result = await runQuiet(
      compose.command,
      [
        ...compose.args,
        'exec',
        '-T',
        'postgres',
        'pg_isready',
        '-U',
        env.POSTGRES_USER,
        '-d',
        env.POSTGRES_DB,
      ],
      {
        cwd: backendDir,
        env,
      },
    )

    if (result.ok) {
      return
    }

    await wait(2000)
  }

  throw new Error('PostgreSQL nao ficou pronto a tempo. Veja os logs com docker compose logs postgres.')
}

async function waitForApi(port) {
  for (let attempt = 1; attempt <= 40; attempt += 1) {
    try {
      const response = await axios.get(`http://localhost:${port}/health`)

      if (response.status >= 200 && response.status < 300) {
        return
      }
    } catch {
      // A API ainda pode estar inicializando.
    }

    await wait(1000)
  }

  throw new Error(`A API nao respondeu em http://localhost:${port}/health.`)
}

function createPrefixedWriter(label, stream) {
  let pending = ''
  const color = label === 'backend' ? colors.green : colors.blue
  const prefix = tag(label, color)

  return {
    write(chunk) {
      pending += chunk.toString()

      const lines = pending.split(/\r?\n/)
      pending = lines.pop() ?? ''

      for (const line of lines) {
        stream.write(`${prefix} ${line}\n`)
      }
    },
    flush() {
      if (!pending) {
        return
      }

      stream.write(`${prefix} ${pending}\n`)
      pending = ''
    },
  }
}

function spawnLongRunning(command, args, options = {}) {
  const child = spawn(command, args, {
    cwd: options.cwd,
    env: options.env,
    shell: process.platform === 'win32',
    stdio: ['ignore', 'pipe', 'pipe'],
  })
  const stdout = createPrefixedWriter(options.label ?? 'process', process.stdout)
  const stderr = createPrefixedWriter(options.label ?? 'process', process.stderr)

  child.stdout.on('data', (chunk) => stdout.write(chunk))
  child.stderr.on('data', (chunk) => stderr.write(chunk))

  children.add(child)
  child.once('exit', () => {
    stdout.flush()
    stderr.flush()
    children.delete(child)
  })

  return child
}

function stopChildren() {
  for (const child of children) {
    child.kill('SIGINT')
  }
}

async function prepareBackend() {
  log('Preparando backend e banco de dados...')

  let backendEnv = mergeBackendEnv(parseEnvFile(backendEnvPath))

  if (await fetchHealth(backendEnv.PORT)) {
    usingExistingApi = true
    log(`API ja esta rodando em http://localhost:${backendEnv.PORT}/api/v1.`)
    return backendEnv
  }

  if (!(await isPortFree(backendEnv.PORT))) {
    const nextPort = await findFreePort(backendEnv.PORT)
    log(`Porta ${backendEnv.PORT} ocupada. Usando porta ${nextPort} para a API.`)
    backendEnv.PORT = nextPort
  }

  const processEnv = {
    ...process.env,
    ...backendEnv,
  }

  await ensureDockerRunning(processEnv)
  const compose = await detectComposeCommand(processEnv)

  const publishedPostgresPort = await getPublishedPostgresPort(compose, processEnv)

  if (publishedPostgresPort) {
    backendEnv.POSTGRES_PORT = publishedPostgresPort
  } else if (!(await isPortFree(backendEnv.POSTGRES_PORT))) {
    const nextPostgresPort = await findFreePort(backendEnv.POSTGRES_PORT)
    log(`Porta ${backendEnv.POSTGRES_PORT} ocupada. Usando porta ${nextPostgresPort} para o PostgreSQL.`)
    backendEnv.POSTGRES_PORT = nextPostgresPort
  }

  backendEnv.DATABASE_URL = buildDatabaseUrl(backendEnv)
  writeManagedEnvFile(backendEnvPath, backendEnv, managedBackendKeys)

  const updatedProcessEnv = {
    ...process.env,
    ...backendEnv,
  }

  if (!existsSync(resolve(backendDir, 'node_modules'))) {
    log('Instalando dependencias do backend...')
    await run(npmCommand, ['install'], { cwd: backendDir, env: updatedProcessEnv })
  }

  log('Subindo PostgreSQL local com Docker...')
  await run(compose.command, [...compose.args, 'up', '-d', 'postgres'], {
    cwd: backendDir,
    env: updatedProcessEnv,
  })

  const runningPostgresPort = await getPublishedPostgresPort(compose, updatedProcessEnv)

  if (runningPostgresPort && runningPostgresPort !== backendEnv.POSTGRES_PORT) {
    backendEnv.POSTGRES_PORT = runningPostgresPort
    backendEnv.DATABASE_URL = buildDatabaseUrl(backendEnv)
    writeManagedEnvFile(backendEnvPath, backendEnv, managedBackendKeys)
  }

  await waitForPostgres(compose, {
    ...process.env,
    ...backendEnv,
  })

  log(`Banco configurado em postgresql://localhost:${backendEnv.POSTGRES_PORT}/${backendEnv.POSTGRES_DB}.`)

  return backendEnv
}

async function fetchHealth(port) {
  try {
    const response = await axios.get(`http://localhost:${port}/health`)

    return response.status >= 200 && response.status < 300
  } catch {
    return false
  }
}

async function startApi(backendEnv) {
  if (usingExistingApi) {
    return
  }

  log(`Subindo API em http://localhost:${backendEnv.PORT}/api/v1...`)
  apiProcess = spawnLongRunning(npmCommand, ['run', 'dev'], {
    cwd: backendDir,
    env: {
      ...process.env,
      ...backendEnv,
    },
    label: 'backend',
  })

  apiProcess.once('exit', (code) => {
    if (viteProcess) {
      viteProcess.kill('SIGINT')
    }

    if (code && code !== 0) {
      process.exitCode = code
    }
  })

  await waitForApi(backendEnv.PORT)
}

function writeFrontendEnv(backendEnv) {
  writeManagedEnvFile(frontendEnvPath, {
    ...managedFrontendEnv,
    VITE_API_PROXY_TARGET: `http://localhost:${backendEnv.PORT}`,
  })
}

function startVite(backendEnv) {
  log('Subindo frontend com Vite...')
  viteProcess = spawnLongRunning(npmCommand, ['run', 'dev:vite', '--', ...viteArgs], {
    cwd: frontendDir,
    env: {
      ...process.env,
      VITE_API_URL: managedFrontendEnv.VITE_API_URL,
      VITE_API_PROXY_TARGET: `http://localhost:${backendEnv.PORT}`,
    },
    label: 'frontend',
  })

  viteProcess.once('exit', (code) => {
    if (apiProcess) {
      apiProcess.kill('SIGINT')
    }

    process.exit(code ?? 0)
  })
}

process.on('SIGINT', () => {
  stopChildren()
})

process.on('SIGTERM', () => {
  stopChildren()
})

try {
  if (!existsSync(resolve(frontendDir, 'scripts'))) {
    mkdirSync(resolve(frontendDir, 'scripts'), { recursive: true })
  }

  const backendEnv = await prepareBackend()

  writeFrontendEnv(backendEnv)
  await startApi(backendEnv)
  startVite(backendEnv)
} catch (error) {
  console.error()
  console.error(`[dev] ${error instanceof Error ? error.message : String(error)}`)
  stopChildren()
  process.exit(1)
}
