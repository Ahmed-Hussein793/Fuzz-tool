import fs from 'node:fs'
import { Command } from 'commander'
import path from 'node:path'
import pLimit from 'p-limit'
import chalk from 'chalk'

function getColorByStatus(status) {
  if (status >= 100 && status < 200) return 'cyan'
  if (status >= 200 && status < 300) return 'green'
  if (status >= 300 && status < 400) return 'yellow'
  if (status >= 400 && status < 500) return 'red'
  if (status >= 500 && status < 600) return 'magenta'
  return 'gray'
}

const program = new Command()
program
  .name('fuzzer')
  .description('Simple URL fuzzing CLI tool')
  .version('1.0.0')
  .usage('-u https://example.com/FUZZ -w wordlist.txt -t 50')
  .option('-u, --url <url>', 'URL to fuzz (use FUZZ as placeholder)')
  .option('-w, --wordlist <file>', 'Path to wordlist file')
  .option('-t, --threads <number>', 'Number of concurrent requests', '20')
  .showHelpAfterError('(add --help for more information)')
program.parse(process.argv)
const options = program.opts()

if (!options.url || !options.wordlist) {
  console.error('Error: Both --url and --wordlist are required.')
  process.exit(1)
} else if  (!(options.url.includes("FUZZ"))) {
  console.error("Error: No FUZZ placeholder found")
  process.exit(1)
}

const threads = Number(options.threads)
let urlTemplate = options.url
const wordlistPath = path.isAbsolute(options.wordlist)
  ? options.wordlist
  : path.join(process.cwd(), options.wordlist)

let wordListContent
try {
  console.log('Reading wordlist file...')
  wordListContent = fs.readFileSync(wordlistPath, 'utf8')
  console.log('Wordlist loaded successfully.')
} catch (error) {
  console.error('Failed to read wordlist:', error.message)
  process.exit(1)
}

if (!urlTemplate.startsWith('http://') && !urlTemplate.startsWith('https://')) {
  urlTemplate = 'https://' + urlTemplate
}

const limit = pLimit(threads)
const words = wordListContent.split('\n').filter(Boolean)

console.log(`Starting fuzzing on ${urlTemplate.replace('FUZZ', '[WORD]')} with ${threads} threads...`)

const run = async () => {
  const promises = words.map(word =>
    limit(async () => {
      const url = urlTemplate.replace('FUZZ', word.trim())

      try {
        const res = await fetch(url, { redirect: 'manual' })
        const status = res.status
        const color = getColorByStatus(status)
        const statusText = chalk[color](status)

        const location = res.headers.get('location')
        if (status === 301 || status === 302) {
          console.log(`${url} ${statusText} => ${location}`)
        } else {
          console.log(`${url} ${statusText}`)
        }
      } catch (err) {
        console.error(`Error fetching ${url}:`, err.message)
      }
    })
  )

  await Promise.all(promises)
  console.log('Fuzzing process completed successfully.')
}

run()
