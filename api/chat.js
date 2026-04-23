export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Método no permitido' });

    const { message, history = [] } = req.body;
    const API_KEY = 'AIzaSyBi-kpvk67c4tIOkDFPas144BEQrDiUlN0';

    try {
        const contents = [
            ...history.map(m => ({
                role: m.role === 'user' ? 'user' : 'model',
                parts: [{ text: m.content }]
            })),
            { role: 'user', parts: [{ text: message }] }
        ];

        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents,
                    systemInstruction: {
                        parts: [{ text: 'Eres un asistente útil. Responde en español.' }]
                    }
                })
            }
        );

        const data = await response.json();
        const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Sin respuesta';
        return res.status(200).json({ reply });
    } catch (error) {
        return res.status(500).json({ reply: 'Error del servidor' });
    }
}
