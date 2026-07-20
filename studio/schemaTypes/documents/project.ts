import {defineType, defineField, defineArrayMember} from 'sanity'

export const project = defineType({
  name: 'project',
  title: 'Project',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {source: 'title'},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'year',
      title: 'Year',
      type: 'number',
      validation: (rule) => rule.required().integer().min(1900).max(2100),
    }),
    defineField({
      name: 'type',
      title: 'Project Type',
      type: 'string',
      options: {
        list: [
          {title: 'Building', value: 'building'},
          {title: 'Object', value: 'object'},
          {title: 'Ether Art', value: 'ether-art'},
        ],
        layout: 'radio',
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'location',
      title: 'Location',
      type: 'string',
    }),
    defineField({
      name: 'result',
      title: 'Result',
      type: 'string',
    }),
    defineField({
      name: 'images',
      title: 'Images',
      description:
        'Gallery images shown on the project detail page. The first image is also used as the cover thumbnail on listing pages.',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'image',
          fields: [
            defineField({
              name: 'alt',
              title: 'Alt text',
              type: 'string',
            }),
          ],
        }),
      ],
      validation: (rule) => rule.required().min(1).max(8),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      description: 'Shown as a two-column block of text when "Infos" is expanded on the project detail page.',
      type: 'array',
      of: [defineArrayMember({type: 'block', styles: [], lists: []})],
      fieldset: 'infos',
    }),
    defineField({
      name: 'siteArea',
      title: 'Site Area',
      type: 'string',
      fieldset: 'infos',
    }),
    defineField({
      name: 'spaceArea',
      title: 'Space Area',
      type: 'string',
      fieldset: 'infos',
    }),
    defineField({
      name: 'totalArea',
      title: 'Total Area',
      type: 'string',
      fieldset: 'infos',
    }),
    defineField({
      name: 'buildingCoverage',
      title: 'Building Coverage',
      type: 'string',
      fieldset: 'infos',
    }),
    defineField({
      name: 'far',
      title: 'FAR',
      description: 'Floor area ratio',
      type: 'string',
      fieldset: 'infos',
    }),
    defineField({
      name: 'program',
      title: 'Program',
      type: 'string',
      fieldset: 'infos',
    }),
    defineField({
      name: 'team',
      title: 'Team',
      type: 'string',
      fieldset: 'infos',
    }),
  ],
  fieldsets: [
    {
      name: 'infos',
      title: 'Infos (project detail expander)',
      description:
        'Powers the "Infos" section on the project detail page. Location and Result above are reused as the Site and Result spec rows.',
      options: {collapsible: true, collapsed: false},
    },
  ],
  preview: {
    select: {
      title: 'title',
      year: 'year',
      media: 'images.0',
    },
    prepare({title, year, media}) {
      return {
        title: year ? `${title} ${year}` : title,
        media,
      }
    },
  },
})
