// src/Content.ts

const detectListType = (element: Element | null): string | null => {
  if (!element) return null;
  
  // Check if element is a list item or part of a list
  if (element.matches('li, ul, ol')) {
    
    if (element.closest('ol')) return 'numbered';
    if (element.closest('ul')) return 'bullet';
  }
  
  // Check for common bullet point characters
  const text = element.textContent || '';
  if (/^[•·○●※■□☆★-]\s/.test(text)) return 'bullet';
  if (/^\d+[.)]\s/.test(text)) return 'numbered';
  
  return null;
};

const preserveFormatting = (node: Node, depth: number = 0): string => {
  if (node.nodeType === Node.TEXT_NODE) {
    return node.textContent?.trim() || '';
  }

  const element = node as Element;
  let result = '';
  const listType = detectListType(element);

  // Handle list items
  if (element.matches('li')) {
    const index = Array.from(element.parentElement?.children || []).indexOf(element) + 1;
    const prefix = listType === 'numbered' ? `${index}. ` : '• ';
    result = `${' '.repeat(depth * 2)}${prefix}${Array.from(element.childNodes)
      .map(child => preserveFormatting(child, depth + 1))
      .join(' ').trim()}\n`;
  } 
  // Handle paragraphs and divs
  else if (element.matches('p, div')) {
    result = Array.from(element.childNodes)
      .map(child => preserveFormatting(child, depth))
      .join(' ').trim();
    if (result) result += '\n';
  }
  // Handle line breaks
  else if (element.matches('br')) {
    result = '\n';
  }
  // Handle all other elements
  else {
    result = Array.from(element.childNodes)
      .map(child => preserveFormatting(child, depth))
      .join(' ').trim();
  }

  return result;
};

// Notify background script that content script is loaded
chrome.runtime.sendMessage({ action: 'contentScriptLoaded' });
