import {defineType, defineField, defineArrayMember} from 'sanity'

export const homePage = defineType({
  name: 'homePage',
  title: 'Home Page',
  type: 'document',
  fields: [
    defineField({
      name: 'selectedProjects',
      title: 'Selected Projects',
      description: 'Projects shown on the home page ticker, in this order.',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'reference',
          to: [{type: 'project'}],
        }),
      ],
    }),
  ],
  preview: {
    prepare() {
      return {title: 'Home Page'}
    },
  },
})
