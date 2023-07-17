import * as core from '@actions/core'
import {UpdateScript} from './types'
import {GloriousEggrollUpdateScript} from './wine-ge/update'

async function run(): Promise<void> {
  try {
    const update_script: UpdateScript = get_update_script()
    const version = await update_script.get_latest_version()

    core.setOutput('pkgver', version.pkgver)
    core.setOutput('release_tag', version.release_tag)
    core.setOutput('checksum', version.checksum)
    core.info(`::set-output name=pkgver::${version.pkgver}`)
    core.info(`::set-output name=checksum::${version.checksum}`)
    core.info(`::set-output name=release_tag::${version.release_tag}`)
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

function get_update_script(): UpdateScript {
  const repo: string = core.getInput('aur-package')

  switch (repo) {
    case 'wine-ge-lutris-bin':
      return new GloriousEggrollUpdateScript('wine-ge-custom')
    case 'proton-ge-custom-bin':
      return new GloriousEggrollUpdateScript('proton-ge-custom')
    default:
      throw new Error(`Unsupported AUR repo: ${repo}`)
  }
}

run()
