import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse,
) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  try {
    const callData = req.body;
    
    const now = new Date();
    const italyTime = new Date(now.toLocaleString('en-US', { 
      timeZone: 'Europe/Rome' 
    }));
    
    const hour = italyTime.getHours();
    const minute = italyTime.getMinutes();
    const day = italyTime.getDay();
    const dayName = italyTime.toLocaleDateString('it-IT', { weekday: 'long' });
    
    let greeting: string;
    let period: string;
    
    if (hour >= 6 && hour < 12) {
      greeting = "Buongiorno";
      period = "mattina";
    } else if (hour >= 12 && hour < 18) {
      greeting = "Buon pomeriggio";
      period = "pomeriggio";
    } else if (hour >= 18 && hour < 22) {
      greeting = "Buonasera";
      period = "sera";
    } else {
      greeting = "Salve";
      period = "notte";
    }
    
    const isWeekday = day >= 1 && day <= 5;
    const isOpen = isWeekday && hour >= 9 && hour < 18;
    
    let openingMessage: string;
    if (!isOpen) {
      openingMessage = `${greeting}, la ringrazio per aver chiamato New Line Group. In questo momento i nostri uffici sono chiusi. Gli orari di apertura sono dal lunedì al venerdì, dalle 9 alle 18. Desidera lasciare un messaggio?`;
    } else {
      openingMessage = `${greeting}, New Line Group, sono Silvia. Come posso aiutarla?`;
    }
    
    return res.status(200).json({
      response_type: 1,
      response: {
        variables: {
          GREETING: greeting,
          PERIOD: period,
          HOUR: hour.toString(),
          MINUTE: minute.toString().padStart(2, '0'),
          IS_OPEN: isOpen ? "true" : "false",
          DAY_NAME: dayName,
          OPENING_MESSAGE: openingMessage
        }
      }
    });
    
  } catch (error) {
    return res.status(200).json({
      response_type: 1,
      response: {
        variables: {
          GREETING: "Buongiorno",
          IS_OPEN: "true",
          OPENING_MESSAGE: "Buongiorno, New Line Group, sono Silvia. Come posso aiutarla?"
        }
      }
    });
  }
}
