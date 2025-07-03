// Function to copy code from code blocks
function copyCodeToClipboard(button) {
  // Get the code from the data attribute
  const code = button.getAttribute('data-code').replace(/\\n/g, '\n');
  
  // Copy to clipboard
  navigator.clipboard.writeText(code)
    .then(() => {
      // Update button UI to show success
      const originalHTML = button.innerHTML;
      button.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg><span>Copied!</span>';
      button.classList.add('success');
      
      // Reset after 2 seconds
      setTimeout(() => {
        button.innerHTML = originalHTML;
        button.classList.remove('success');
      }, 2000);
    })
    .catch(err => {
      console.error('Could not copy code: ', err);
      alert('Failed to copy code to clipboard');
    });
}

// Add event listeners to all code block copy buttons when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  const copyButtons = document.querySelectorAll('.code-copy-btn');
  copyButtons.forEach(button => {
    button.addEventListener('click', () => copyCodeToClipboard(button));
  });
}); 