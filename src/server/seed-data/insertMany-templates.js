// ===========================================================================
// Usage notes:
// ===========================================================================
// Inside of a mongo shell, run the following:
// use maderas
//
// # For windows,
// load("C:\\Users\\danie\\projects\\Maderas\\src\\server\\seed-data\\insertMany-templates.js")
//
// # Other,
// load("C:/Users/danie/projects/Maderas/src/server/seed-data/insertMany-templates.js")

db.templates.insertMany([
  {
    name: 'Kanban',
    lists: [
      'Backlog',
      'Design',
      'To-Do',
      'In progress',
      'Code Review',
      'Testing',
      'Done'
    ]
  }
])