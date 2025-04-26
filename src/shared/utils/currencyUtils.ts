// Function to format a number as Euro currency
export const formatCurrency = (amount: number): string => {
    // Use Intl.NumberFormat to format the number as Euro currency
    return new Intl.NumberFormat('es-ES', { // Use 'es-ES' locale for Euro format
      style: 'currency',
      currency: 'EUR', // Specify Euro currency
    }).format(amount);
  };