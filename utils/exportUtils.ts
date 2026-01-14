
export const exportSvgAsPng = (svgElement: SVGSVGElement | null, fileName: string) => {
  if (!svgElement) return;

  const svgData = new XMLSerializer().serializeToString(svgElement);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  const img = new Image();

  const svgSize = svgElement.getBoundingClientRect();
  canvas.width = svgSize.width * 2; // High resolution
  canvas.height = svgSize.height * 2;

  const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(svgBlob);

  img.onload = () => {
    if (ctx) {
      // Background color for the PNG
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.scale(2, 2);
      ctx.drawImage(img, 0, 0);
      
      const pngUrl = canvas.toDataURL('image/png');
      const downloadLink = document.createElement('a');
      downloadLink.href = pngUrl;
      downloadLink.download = `${fileName}.png`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    }
    URL.revokeObjectURL(url);
  };

  img.src = url;
};
