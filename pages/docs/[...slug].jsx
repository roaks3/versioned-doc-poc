import fs from 'fs'
import { promisify } from 'util'
import matter from 'gray-matter'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import highlight from '@mapbox/rehype-prism'
import { MDXProvider } from '@mdx-js/react'
import hydrate from 'next-mdx-remote/hydrate'
import renderToString from 'next-mdx-remote/render-to-string'
import DocsPage from '@hashicorp/react-docs-page'
import {
  anchorLinks,
  includeMarkdown,
  paragraphCustomAlerts,
  typography,
} from '@hashicorp/remark-plugins'
import Placement from '../../components/placement-table'
import VersionDropdown from '../../components/version-dropdown'
import versionManifest from '../../data/version-manifest.json'

const GITHUB_CONTENT_REPO = 'roaks3/versioned-doc-poc'
const DEFAULT_COMPONENTS = { Placement }

export default function DocsDocsPage({
  renderedContent,
  frontMatter,
  resourceUrl,
  url,
  sidenavData,
  order,
  versionSlug,
  versionOptions,
}) {
  const router = useRouter()
  if (router.isFallback) {
    return <div>Loading ...</div>
  }

  if (!renderedContent) {
    return <div>404 Page NotFound</div>
  }

  const hydratedContent = hydrate(renderedContent, DEFAULT_COMPONENTS)
  return (
    <>
      <div className="g-container">
        <VersionDropdown
          versionOptions={versionOptions}
          selectedVersionSlug={versionSlug}
        />
      </div>
      <MDXProvider components={DEFAULT_COMPONENTS}>
        <DocsPage
          product="nomad"
          head={{
            is: Head,
            title: `${frontMatter.page_title} | Nomad by HashiCorp`,
            description: frontMatter.description,
            siteName: 'Nomad by HashiCorp',
          }}
          sidenav={{
            Link,
            category: 'docs',
            currentPage: `/${url}`,
            data: sidenavData,
            order,
          }}
          resourceURL={resourceUrl}
        >
          {hydratedContent}
        </DocsPage>
      </MDXProvider>
    </>
  )
}

export async function getStaticProps({ params }) {
  const url = `docs/${params.slug.join('/')}`
  const versionParam = params.slug[0]
  const filePath = `content/docs/${params.slug.slice(1).join('/')}.mdx`
  const indexFilePath = `content/docs/${params.slug
    .slice(1)
    .join('/')}/index.mdx`

  const stableVersions = versionManifest.versions
  const allVersions =
    process.env.LATEST_ENABLED === 'true'
      ? [
          {
            slug: 'latest',
            display: 'Latest',
          },
          ...stableVersions,
        ]
      : stableVersions

  // Validate the version that is specified on the url
  // `stable` is a special case that means "the most recent of the stable versions"
  const version =
    versionParam === 'stable'
      ? stableVersions[0]
      : allVersions.find((v) => v.slug === versionParam)

  let fileContent
  let indexFileContent
  let sidenavData
  let order
  if (process.env.LATEST_ENABLED === 'true' && versionParam === 'latest') {
    // For latest version, use local filesytem content, which may include in-progress changes
    ;[fileContent, indexFileContent, sidenavData, order] = await Promise.all([
      fetchLocalContent(filePath),
      fetchLocalContent(indexFilePath),
      (await fetchLocalJson('data/docs-frontmatter.json')).frontmatter,
      (await fetchLocalJson('data/docs-navigation.json')).navigation,
    ])
  } else {
    // Invalid version in url
    if (!version) {
      return {
        props: {},
      }
    }

    const commitSha = version['commit-sha']

    // For other versions, use github raw cdn content
    ;[fileContent, indexFileContent, sidenavData, order] = await Promise.all([
      fetchGithubContent(commitSha, filePath),
      fetchGithubContent(commitSha, indexFilePath),
      (await fetchGithubJson(commitSha, 'data/docs-frontmatter.json'))
        .frontmatter,
      (await fetchGithubJson(commitSha, 'data/docs-navigation.json'))
        .navigation,
    ])
  }

  const { content, data } = matter(fileContent || indexFileContent)
  const renderedContent = await renderToString(content, DEFAULT_COMPONENTS, {
    remarkPlugins: [
      includeMarkdown,
      anchorLinks,
      paragraphCustomAlerts,
      typography,
    ],
    rehypePlugins: [[highlight, { ignoreMissing: true }]],
  })

  return {
    props: {
      renderedContent,
      frontMatter: data,
      resourceUrl: `https://github.com/${GITHUB_CONTENT_REPO}/blob/${
        version['commit-sha'] || 'master'
      }/${fileContent ? filePath : indexFilePath}`,
      url,
      sidenavData,
      order,
      versionSlug: version.slug,
      versionOptions: allVersions.map((v) => ({
        slug: v.slug,
        display: v.display,
        url: `/docs/${v.slug}/${params.slug.slice(1).join('/')}`,
      })),
    },
  }
}

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: true,
  }
}

async function fetchLocalContent(contentFilePath) {
  try {
    return (
      await promisify(fs.readFile)(`${process.cwd()}/${contentFilePath}`)
    ).toString()
  } catch (error) {
    if (error.code === 'ENOENT') {
      return undefined
    }
    throw error
  }
}

async function fetchLocalJson(jsonFilePath) {
  return JSON.parse(await fetchLocalContent(jsonFilePath))
}

async function fetchGithubContent(commitSha, contentFilePath) {
  const response = await (
    await fetch(
      `https://raw.githubusercontent.com/${GITHUB_CONTENT_REPO}/${commitSha}/${contentFilePath}`
    )
  ).text()

  if (response === '404: Not Found') {
    return undefined
  }

  return response
}

async function fetchGithubJson(commitSha, jsonFilePath) {
  return JSON.parse(await fetchGithubContent(commitSha, jsonFilePath))
}
