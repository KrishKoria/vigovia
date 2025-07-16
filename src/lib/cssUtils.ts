// Utility to sanitize CSS and remove unsupported color functions
export function sanitizeCSS(cssText: string): string {
  return (
    cssText
      // Remove lab() color functions
      .replace(/lab\([^)]*\)/g, "#000000")
      // Remove lch() color functions
      .replace(/lch\([^)]*\)/g, "#000000")
      // Remove oklch() color functions
      .replace(/oklch\([^)]*\)/g, "#000000")
      // Remove oklab() color functions
      .replace(/oklab\([^)]*\)/g, "#000000")
      // Remove color-mix() functions
      .replace(/color-mix\([^)]*\)/g, "#000000")
      // Remove any other modern color functions that might cause issues
      .replace(/color\([^)]*\)/g, "#000000")
  );
}

// Function to sanitize all stylesheets in a document
export function sanitizeDocumentStyles(doc: Document): void {
  // Sanitize inline styles
  const elementsWithStyle = doc.querySelectorAll("[style]");
  elementsWithStyle.forEach((element) => {
    const htmlElement = element as HTMLElement;
    if (htmlElement.style.cssText) {
      htmlElement.style.cssText = sanitizeCSS(htmlElement.style.cssText);
    }
  });

  // Sanitize style elements
  const styleElements = doc.querySelectorAll("style");
  styleElements.forEach((styleElement) => {
    if (styleElement.textContent) {
      styleElement.textContent = sanitizeCSS(styleElement.textContent);
    }
  });

  // Note: We can't easily sanitize external stylesheets, but the onclone function
  // in html2canvas should handle removing problematic external styles
}
