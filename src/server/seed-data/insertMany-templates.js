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
      { title: 'Backlog' },
      { title: 'Design' },
      { title: 'To-Do' },
      { title: 'In progress' },
      { title: 'Code Review' },
      { title: 'Testing' },
      { title: 'Done' }
    ]
  }
])
