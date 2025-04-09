module.exports = {
  onPreBuild: async ({ inputs, utils }) => {
    const fs = require('fs-extra');
    const path = require('path');

    console.log('Starting netlify-plugin-copy-files');
    console.log('Current working directory:', process.cwd());
    
    try {
      // Handle both direct inputs and nested inputs
      const processInputs = (inputObj) => {
        // If direct source/destination exist, use them
        if (inputObj.source && inputObj.destination) {
          return [{ source: inputObj.source, destination: inputObj.destination }];
        }
        
        // Otherwise, look for nested objects (db, wal, shm, etc.)
        const operations = [];
        for (const key in inputObj) {
          if (typeof inputObj[key] === 'object' && inputObj[key].source && inputObj[key].destination) {
            operations.push({
              name: key,
              source: inputObj[key].source,
              destination: inputObj[key].destination
            });
          }
        }
        return operations;
      };
      
      const operations = processInputs(inputs);
      
      if (operations.length === 0) {
        console.log('No valid source/destination pairs found in inputs');
        return;
      }
      
      // Process all file operations
      for (const op of operations) {
        const { name, source, destination } = op;
        
        console.log(`Processing ${name ? name + ': ' : ''}${source} → ${destination}`);

        console.log(`Checking if source exists: ${source}`);
        const sourceExists = await fs.pathExists(source);
        if (!sourceExists) {
          console.error(`Source file or directory does not exist: ${source}`);
          // Don't fail the build, just warn
          continue;
        }

        console.log(`Copying ${source} to ${destination}`);
        
        // Make sure the destination directory exists
        await fs.ensureDir(path.dirname(destination));
        // Copy the file
        await fs.copy(source, destination);
        console.log(`Successfully copied ${source} to ${destination}`);
      }
    } catch (error) {
      console.error(`Error in netlify-plugin-copy-files: ${error.message}`);
      console.error(error.stack);
      // Don't fail the build
    }
  }
}; 