import {components} from '@octokit/openapi-types'

export type Release = components['schemas']['release']
export type ReleaseAsset = components['schemas']['release-asset']

export interface Version {
  release_tag: string
  pkgver: string
  checksum?: string
}

export interface UpdateScript {
  get_latest_version(): Promise<Version>
}
