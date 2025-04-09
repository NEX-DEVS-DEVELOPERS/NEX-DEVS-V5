module.exports = {
  onPreBuild: async ({ inputs, utils }) => {
    const fs = require('fs-extra');
    const path = require('path');

    console.log('Starting netlify-plugin-copy-files');
    console.log('Current working directory:', process.cwd());
    
    try {
      const source = inputs.source;
      const destination = inputs.destination;

      if (!source || !destination) {
        console.log('No source or destination provided');
        return;
      }

      console.log(`Checking if source exists: ${source}`);
      const sourceExists = await fs.pathExists(source);
      if (!sourceExists) {
        console.error(`Source file or directory does not exist: ${source}`);
        // Don't fail the build, just warn
        return;
      }

      console.log(`Copying ${source} to ${destination}`);
      
      // Make sure the destination directory exists
      await fs.ensureDir(path.dirname(destination));
      // Copy the file
      await fs.copy(source, destination);
      console.log(`Successfully copied ${source} to ${destination}`);
    } catch (error) {
      console.error(`Error in netlify-plugin-copy-files: ${error.message}`);
      console.error(error.stack);
      // Don't fail the build
    }
  }
}; 