import fs from 'node:fs'
import path from 'node:path'
import {getCliClient} from 'sanity/cli'

type ProjectType = 'building' | 'object' | 'ether-art'

interface SeedProject {
  slug: string
  title: string
  year: number
  type: ProjectType
  location: string
  result: string
  image: string
}

// Mirrors the placeholder PROJECTS array in src/app/project/page.tsx
const PROJECTS: SeedProject[] = [
  {slug: 'forestry-institute', title: 'Forestry Institute', year: 2024, type: 'building', location: 'Daejeon, Korea', result: '1st Place', image: '01.jpg'},
  {slug: 'jinju-museum', title: 'Jinju Museum', year: 2023, type: 'building', location: 'Jinju, Korea', result: '1st Place', image: '04.jpg'},
  {slug: 'confucianism-center', title: 'Confucianism Center', year: 2023, type: 'building', location: 'Daejeon, Korea', result: '1st Place', image: '07.jpg'},
  {slug: 'deep-paper', title: 'Deep Paper', year: 2022, type: 'building', location: 'Seoul, Korea', result: '1st Place', image: '10.jpg'},
  {slug: 'banpo-park', title: 'Banpo Park', year: 2024, type: 'building', location: 'Seoul, Korea', result: '1st Place', image: '02.jpg'},
  {slug: 'gusan-school', title: 'Gusan School', year: 2023, type: 'building', location: 'Daejeon, Korea', result: '1st Place', image: '05.jpg'},
  {slug: 'memorial-house', title: 'Memorial House', year: 2022, type: 'building', location: 'Daejeon, Korea', result: '1st Place', image: '08.jpg'},
  {slug: 'seoul-library', title: 'Seoul Library', year: 2023, type: 'building', location: 'Seoul, Korea', result: '1st Place', image: '03.jpg'},
  {slug: 'forestry-institute-object', title: 'Forestry Institute', year: 2024, type: 'object', location: 'Daejeon, Korea', result: '1st Place', image: '06.jpg'},
  {slug: 'pyungtaek-square', title: 'Pyungtaek Square', year: 2023, type: 'object', location: 'Pyeongtaek, Korea', result: '1st Place', image: '09.jpg'},
  {slug: 'jeju-office', title: 'Jeju Office', year: 2022, type: 'building', location: 'Jeju, Korea', result: '1st Place', image: '12.jpg'},
  {slug: 'kinetic-facade', title: 'Kinetic Facade', year: 2024, type: 'ether-art', location: 'Seoul, Korea', result: '1st Place', image: '11.jpg'},
]

const client = getCliClient({apiVersion: '2026-05-15'})
const imagesDir = path.join(__dirname, '..', '..', 'public', 'ticker')

async function run() {
  const assetIds = new Map<string, string>()

  for (const filename of new Set(PROJECTS.map((p) => p.image))) {
    const filePath = path.join(imagesDir, filename)
    console.log(`Uploading ${filename}...`)
    const asset = await client.assets.upload('image', fs.createReadStream(filePath), {
      filename,
    })
    assetIds.set(filename, asset._id)
  }

  for (const p of PROJECTS) {
    const existing = await client.fetch(`*[_type == "project" && slug.current == $slug][0]._id`, {
      slug: p.slug,
    })
    if (existing) {
      console.log(`Skipping ${p.slug} (already exists)`)
      continue
    }

    console.log(`Creating ${p.slug}...`)
    await client.create({
      _type: 'project',
      title: p.title,
      slug: {_type: 'slug', current: p.slug},
      year: p.year,
      type: p.type,
      location: p.location,
      result: p.result,
      images: [
        {
          _type: 'image',
          _key: `${p.slug}-0`,
          asset: {_type: 'reference', _ref: assetIds.get(p.image)},
          alt: p.title,
        },
      ],
    })
  }

  console.log('Done.')
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
