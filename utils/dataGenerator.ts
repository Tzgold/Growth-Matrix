
import { DataPoint } from '../types';

export const generateSampleData = (days: number = 90): DataPoint[] => {
  const data: DataPoint[] = [];
  const today = new Date();
  
  // Starting values
  let users = 100;
  let sessions = 250;

  for (let i = days; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    
    // Add some random walk and seasonal growth
    const growth = 1 + (Math.random() * 0.1 - 0.03); // Random fluctuation
    const weekendFactor = (d.getDay() === 0 || d.getDay() === 6) ? 0.7 : 1.1; // Weekends usually lower for B2B/Product
    
    users = Math.floor(users * growth);
    sessions = Math.floor(users * (1.5 + Math.random() * 2) * weekendFactor);

    data.push({
      date: d.toISOString().split('T')[0],
      users: Math.max(0, users),
      sessions: Math.max(0, sessions)
    });
  }
  return data;
};
