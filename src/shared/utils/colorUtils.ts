// Function to generate a random HSL color
export const generateRandomHSLColor = () => {
    const hue = Math.floor(Math.random() * 360);
    const saturation = Math.floor(Math.random() * (80 - 40) + 40); // Saturation between 40-80%
    const lightness = Math.floor(Math.random() * (70 - 40) + 40); // Lightness between 40-70%
    return `hsl(${hue} ${saturation}% ${lightness}%)`;
  };
  