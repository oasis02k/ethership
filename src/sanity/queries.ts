import { defineQuery } from 'next-sanity';

export const PROJECT_BY_SLUG_QUERY = defineQuery(`
  *[_type == "project" && slug.current == $slug][0]{
    _id,
    title,
    "slug": slug.current,
    year,
    type,
    location,
    result,
    images[]{
      _key,
      alt,
      asset->{
        _id,
        url,
        metadata { dimensions { width, height } }
      }
    }
  }
`);

export const PROJECT_CARDS_QUERY = defineQuery(`
  *[_type == "project" && defined(slug.current)] | order(year desc, _createdAt desc){
    _id,
    title,
    "slug": slug.current,
    year,
    type,
    location,
    result,
    "cover": images[0]{
      alt,
      asset->{
        url,
        metadata { dimensions { width, height } }
      }
    }
  }
`);

export const PROJECT_ORDER_QUERY = defineQuery(`
  *[_type == "project" && defined(slug.current)] | order(year desc, _createdAt desc){
    "slug": slug.current,
    title,
    year
  }
`);

export const PROJECT_SLUGS_QUERY = defineQuery(`
  *[_type == "project" && defined(slug.current)].slug.current
`);
