exports.handler = async (event) => {
    const { q, lang, sortby, max, page } = event.queryStringParameters;
    const API_KEYS = [
        process.env.GNEWS_API_KEY_1,
        process.env.GNEWS_API_KEY_2
    ];

    for (const key of API_KEYS) {
        try {
            const url = `https://gnews.io/api/v4/search?q=${q}&lang=${lang}&sortby=${sortby}&max=${max}&page=${page}&apikey=${key}`;
            const res = await fetch(url);
            if (!res.ok) throw new Error(res.status);
            const data = await res.json();
            if (data.errors) throw new Error(data.errors);

            return {
                statusCode: 200,
                headers: { 'Access-Control-Allow-Origin': '*' },
                body: JSON.stringify(data)
            };
        } catch (e) {
            // intenta con la siguiente key
        }
    }

    return { statusCode: 500, body: JSON.stringify({ error: 'Sin fuentes disponibles' }) };
};