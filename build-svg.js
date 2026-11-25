const fs = require('fs')
const path = require('path')

// The profile no longer includes weather or date-dependent messages.
fs.copyFileSync(
  path.join(__dirname, 'template.svg'),
  path.join(__dirname, 'chat.svg')
)
