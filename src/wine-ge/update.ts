import {Release, ReleaseAsset, UpdateScript, Version} from '../types'

export class GloriousEggrollUpdateScript implements UpdateScript {
  constructor(private repo: string) {}

  async get_latest_version(): Promise<Version> {
    return await get_latest_version(this.repo)
  }
}

async function get_latest_version(github_repo: string): Promise<Version> {
  const release = await get_latest_release('GloriousEggroll', github_repo)
  const release_tag = release.tag_name
  const pkgver = release_tag.replace('GE-Proton', '').replace(/-/g, '.')
  const checksum = await get_checksum(release)

  return {
    release_tag,
    pkgver,
    checksum
  }
}

async function get_checksum(release: Release): Promise<string> {
  const checksum_url = release.assets.find((asset: ReleaseAsset) =>
    asset.name.endsWith('.sha512sum')
  )?.browser_download_url

  if (checksum_url === undefined) {
    throw new Error('Checksum URL not found')
  }

  const checksum_response = await fetch(checksum_url)
  const checksum = await checksum_response.text()

  if (checksum === null) {
    throw new Error('Checksum not found')
  }

  return checksum
}

async function get_latest_release(
  github_user: string,
  github_repo: string
): Promise<Release> {
  const response = await fetch(
    `https://api.github.com/repos/${github_user}/${github_repo}/releases/latest`
  )

  return await response.json()
}
