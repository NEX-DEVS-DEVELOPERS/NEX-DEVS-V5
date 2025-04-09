module.exports = {
  onPreBuild: async ({ inputs, utils }) => {
    const fs = require('fs-extra');
    const path = require('path');

    const source = inputs.source;
    const destination = inputs.destination;

    if (!source || !destination) {
      console.log('No source or destination provided');
      return;
    }

    console.log(`Copying ${source} to ${destination}`);
    
    try {
      // Make sure the destination directory exists
      await fs.ensureDir(path.dirname(destination));
      // Copy the file
      await fs.copy(source, destination);
      console.log(`Successfully copied ${source} to ${destination}`);
    } catch (error) {
      console.error(`Error copying files: ${error.message}`);
    }
  }
}; 