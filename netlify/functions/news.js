exports.handler = async (event) => {
    const { q, lang, sortby, max, page, category, country } = event.queryStringParameters;
    const API_KEYS = [
        process.env.GNEWS_API_KEY_1,
        process.env.GNEWS_API_KEY_2
    ];

    for (const key of API_KEYS) {
        try {
            let url;
            if (category && !q) {
                url = `https://gnews.io/api/v4/top-headlines?category=${category}&lang=${lang || 'es'}${country ? `&country=${country}` : ''}&max=${max}&page=${page}&apikey=${key}`;
            } else {
                url = `https://gnews.io/api/v4/search?q=${q || 'noticias'}&lang=${lang || 'es'}${country ? `&country=${country}` : ''}&sortby=${sortby || 'publishedAt'}&max=${max}&page=${page}&apikey=${key}`;
            }
            const res = await fetch(url);
            if (!res.ok) throw new Error(res.status);
            const data = await res.json();
            if (data.errors) throw new Error(JSON.stringify(data.errors));
            return {
                statusCode: 200,
                headers: { 'Access-Control-Allow-Origin': '*' },
                body: JSON.stringify(data)
            };
        } catch (e) {}
    }

    return { statusCode: 500, body: JSON.stringify({ error: 'Sin fuentes disponibles' }) };
};