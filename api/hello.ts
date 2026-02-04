// WEBHOOK PER RETELL AI - SALUTO DINAMICO
// Deploy su Vercel in 2 minuti

export default async function handler(req, res) {
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
        // Leggi i dati della chiamata da Retell
        const callData = req.body;
        console.log('Chiamata ricevuta:', callData);
        
        // Ottieni orario Italia
        const now = new Date();
        const italyTime = new Date(now.toLocaleString('en-US', { 
            timeZone: 'Europe/Rome' 
        }));
        
        const hour = italyTime.getHours();
        const minute = italyTime.getMinutes();
        const day = italyTime.getDay(); // 0=domenica, 1=lunedì, ...
        const dayName = italyTime.toLocaleDateString('it-IT', { weekday: 'long' });
        
        // Determina il saluto
        let greeting;
        let period;
        
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
        
        // Verifica se è orario lavorativo
        const isWeekday = day >= 1 && day <= 5; // Lunedì-Venerdì
        const isOpen = isWeekday && hour >= 9 && hour < 18;
        
        // Messaggio completo per l'agente
        let openingMessage;
        if (!isOpen) {
            openingMessage = `${greeting}, la ringrazio per aver chiamato New Line Group. In questo momento i nostri uffici sono chiusi. Gli orari di apertura sono dal lunedì al venerdì, dalle 9 alle 18. Desidera lasciare un messaggio?`;
        } else {
            openingMessage = `${greeting}, New Line Group, sono Silvia. Come posso aiutarla?`;
        }
        
        // Risposta per Retell con variabili dinamiche
        return res.status(200).json({
            response_type: 1, // Override agent prompt
            response: {
                // Variabili che Retell passerà all'agente
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
        console.error('Errore webhook:', error);
        
        // Fallback in caso di errore
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
