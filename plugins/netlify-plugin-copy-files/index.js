module.exports = {
  onPreBuild: async ({ inputs, utils }) => {
    const fs = require('fs-extra');
    const path = require('path');

    console.log('Starting netlify-plugin-copy-files');
    console.log('Current working directory:', process.cwd());
    
    try {
      // Extract inputs (simple format only)
      const { source, destination, optional = false } = inputs;
      
      if (!source || !destination) {
        console.log('No source or destination provided');
        return;
      }
      
      console.log(`Processing file copy: ${source} → ${destination}`);
      console.log(`File is ${optional ? 'optional' : 'required'}`);

      console.log(`Checking if source exists: ${source}`);
      const sourceExists = await fs.pathExists(source);
      
      if (!sourceExists) {
        if (optional) {
          console.log(`Optional file does not exist: ${source} - skipping`);
          return;
        } else {
          console.error(`Required file does not exist: ${source}`);
          throw new Error(`Required file not found: ${source}`);
        }
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
      
      // Fail the build for required files, continue for optional
      if (!inputs.optional) {
        utils.build.failBuild(`Failed to copy required file: ${error.message}`);
      }
    }
  }
}; 