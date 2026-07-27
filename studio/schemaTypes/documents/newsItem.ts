import {defineType, defineField} from 'sanity'

export const newsItem = defineType({
  name: 'newsItem',
  title: 'News Item',
  type: 'document',
  fields: [
    defineField({
      name: 'date',
      title: 'Date',
      type: 'date',
      options: {dateFormat: 'YYYY-MM'},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'title',
      title: 'Title',
      description: 'The headline text. If a link is set, this becomes clickable.',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'location',
      title: 'Location',
      type: 'string',
    }),
    defineField({
      name: 'link',
      title: 'Link',
      description: 'Optional external URL (e.g. a press article or source). Makes the title clickable.',
      type: 'url',
      validation: (rule) => rule.uri({scheme: ['http', 'https']}),
    }),
  ],
  orderings: [
    {
      name: 'dateDesc',
      title: 'Date, New to Old',
      by: [{field: 'date', direction: 'desc'}],
    },
  ],
  preview: {
    select: {
      title: 'title',
      date: 'date',
      location: 'location',
    },
    prepare({title, date, location}) {
      return {
        title,
        subtitle: [date, location].filter(Boolean).join(' · '),
      }
    },
  },
})
