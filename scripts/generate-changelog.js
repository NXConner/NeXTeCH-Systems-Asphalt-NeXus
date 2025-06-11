const conventionalChangelog = require('conventional-changelog');
const fs = require('fs');
const output = fs.createWriteStream('CHANGELOG.md');
conventionalChangelog({ preset: 'angular' })
  .pipe(output)
  .on('finish', () => console.log('CHANGELOG.md generated!')); 