import type {StructureResolver} from 'sanity/structure'

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items([
      S.listItem()
        .title('Home Page')
        .id('homePage')
        .child(S.document().schemaType('homePage').documentId('homePage')),
      S.divider(),
      S.documentTypeListItem('newsItem').child(
        S.documentTypeList('newsItem').defaultOrdering([{field: 'date', direction: 'desc'}])
      ),
      ...S.documentTypeListItems().filter((item) => item.getId() !== 'homePage' && item.getId() !== 'newsItem'),
    ])
