import { LeWagonModule } from './types'

export const COURSE_REGEX = /\s(FT|PT)\s/i
export const ROLE_REGEX = /Role: (\w+)/i

export const addresses: Record<string, string> = {
  casablanca: '380 Bd Brahim Roudani, Casablanca, Morocco',
}

export const modules: LeWagonModule[] = [
  {
    name: 'Setup',
    path: 'Setup',
    days: [
      {
        name: 'Setup',
      },
    ],
  },
  {
    name: 'Ruby',
    path: 'Ruby',
    days: [
      {
        name: 'Programming Basics',
        path: 'Programming-basics',
      },
      {
        name: 'Flow, Conditionals & Arrays',
        path: 'Flow-Array',
      },
      {
        name: 'Iterators & Blocks',
        path: 'Iterators-Blocks',
      },
      {
        name: 'Hash & Symbols',
        path: 'Hash-Symbols',
      },
      {
        name: 'Regular Expressions',
        path: 'Regular-Expressions',
      },
      {
        name: 'Parsing',
        path: 'Parsing',
      },
    ],
  },
  {
    name: 'OOP',
    path: 'OOP',
    days: [
      {
        name: 'Classes & Instances',
        path: 'OO-Basics',
      },
      {
        name: 'Inheritance & Self',
        path: 'OO-Advanced',
      },
      {
        name: 'Cookbook',
        path: 'Cookbook',
      },
      {
        name: 'Food Delivery (Day 1)',
        path: 'Food-Delivery-Day-One',
      },
      {
        name: 'Food Delivery (Day 2)',
        path: 'Food-Delivery-Day-Two',
      },
      {
        name: 'Food Delivery (Day 3)',
        path: 'Food-Delivery-Day-Three',
      },
    ],
  },
  {
    name: 'DB',
    path: 'AR-Database',
    days: [
      {
        name: 'DB & SQL',
        path: 'DB-and-SQL',
      },
      {
        name: 'Active Record Basics',
        path: 'ActiveRecord-Basics',
      },
      {
        name: 'Associations & Validations',
        path: 'ActiveRecord-Advanced',
      },
    ],
  },
  {
    name: 'Front',
    path: 'Front-End',
    days: [
      {
        name: 'HTML & CSS',
        path: 'HTML-and-CSS',
      },
      {
        name: 'CSS Components',
        path: 'CSS-components',
      },
      {
        name: 'Bootstrap & Layouts',
        path: 'Bootstrap',
      },
      {
        name: 'JS & DOM',
        path: 'JS-and-DOM',
      },
      {
        name: 'Iterators & Events',
        path: 'Events-and-Iterators',
      },
      {
        name: 'HTTP & API',
        path: 'HTTP-and-API',
      },
      {
        name: 'AJAX & External Packages',
        path: 'AJAX',
      },
      {
        name: 'Templating',
        path: 'Templating',
      },
      {
        name: 'Stimulus JS',
        path: 'Stimulus-JS',
      },
      {
        name: 'Product Design Sprint',
        path: 'Product-Design-Sprint',
      },
    ],
  },
  {
    name: 'Rails',
    path: 'Rails',
    days: [
      {
        name: 'Routing, Controllers & Views',
        path: 'Rails-intro',
      },
      {
        name: 'Models & CRUD',
        path: 'Rails-CRUD',
      },
      {
        name: 'Advanced Routing',
        path: 'Rails-restaurant-reviews',
      },
      {
        name: 'Rails Assets',
        path: 'Rails-mister-cocktail',
      },
      {
        name: 'Hosting & Image Upload',
        path: 'Rails-MC-with-images',
      },
      {
        name: 'Authentication & Devise',
        path: 'Airbnb-Devise',
      },
      {
        name: 'JavaScript in Rails',
        path: 'Airbnb-Facebook-connect',
      },
      {
        name: 'Geocoding',
        path: 'Airbnb-Geocoder',
      },
      {
        name: 'Search',
        path: 'Airbnb-SMTP',
      },
      {
        name: 'Authorization & Pundit',
        path: 'Airbnb-Ajax-in-Rails',
      },
    ],
  },
  {
    name: 'Projects',
    path: 'Projects',
    days: [
      {
        name: 'WebSocket & Action Cable',
        path: 'Pundit',
      },
      {
        name: 'From Design To Code',
        path: 'i18n',
      },
      {
        name: 'Background Jobs & Sidekiq',
        path: 'Advanced-Admin',
      },
      {
        name: 'DB advanced',
        path: 'Background-jobs',
      },
      {
        name: 'AI in Rails',
        path: 'Build-an-API',
      },
      {
        name: 'Project',
        path: 'Payment-with-Stripe',
      },
      {
        name: 'Project',
        path: 'Search',
      },
      {
        name: 'Project',
        path: 'Testing',
      },
      {
        name: 'Dress Rehearsal',
        path: 'Dress-Rehearsal-React',
      },
      {
        name: 'Demo Day',
        path: 'Demo-Day',
      },
    ],
  },
]
