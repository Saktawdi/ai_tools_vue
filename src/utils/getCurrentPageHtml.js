export default function updateSVGs(templateString, currentPage) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(templateString, 'text/html');
  
    const marpitDiv = doc.querySelector('.marpit');
    const sectionNodes = marpitDiv.querySelectorAll('section[data-paginate="true"]');
    
    let targetSVGNode = null;
    
    sectionNodes.forEach(sectionNode => {
      const sectionId = sectionNode.getAttribute('id');
      if (sectionId === String(currentPage)) {
        targetSVGNode = sectionNode.closest('svg[data-marpit-svg]');
      }
    });
    
    if (targetSVGNode) {
      marpitDiv.innerHTML = ''; // Clear all SVG nodes
      marpitDiv.appendChild(targetSVGNode); // Append the target SVG node
    }
  
    return doc.documentElement.innerHTML;
  }
  