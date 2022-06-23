import inquirer from 'inquirer'
import path from 'path'
import { fileURLToPath } from 'url'
import { writeFile, readFile } from 'fs/promises'
import chalk from 'chalk'
import { TEMPLATE, TemplateName } from './template'

const log = console.log

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const templateNames = ['gitignore', 'prettierrc.yml', 'all']

const questions = [
  {
    type: 'list',
    name: 'filename',
    message: 'Please select the generated file',
    choices: templateNames
  }
]
export async function easyCreate() {
  const { filename } = await inquirer.prompt(questions)
  if (filename !== 'all') {
    await writeFilesThroughTemplates(filename)
  } else {
    for (const file of templateNames) {
      if (file === 'all') continue
      await writeFilesThroughTemplates(file)
    }
  }
  log(
    chalk.green(
      'Thank you very much for using this easy create. i am really happy. Good luck with your work!'
    )
  )
}

async function writeFilesThroughTemplates(filename: string): Promise<void> {
  const cwd = process.cwd()
  const templateUrl = path.resolve(__dirname, '..', 'templates/', filename)
  const fileBody = await readFile(templateUrl, { encoding: 'utf8' })

  const { toFileName } = TEMPLATE[filename as TemplateName]
  const toFileUrl = path.resolve(cwd, toFileName)

  await writeFile(toFileUrl, fileBody, { flag: 'w' })

  log(chalk.bgGreen(`.${filename} created successfully`))
}
