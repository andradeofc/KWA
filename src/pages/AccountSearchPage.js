import React, { useState } from 'react';

const AccountSearchPage = () => {
    const [creativeId, setCreativeId] = useState('');
    const [startAccountId, setStartAccountId] = useState('');
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [showRelatedAds, setShowRelatedAds] = useState(false);

    const fetchCreativeDetails = async (creativeId, accountId) => {
        const detailUrl = "http://localhost:5001/api/creative-details";
        const detailBody = {
            "dateType": 1, // Fixo para 1 (últimos 7 dias)
            "creativeId": creativeId,
            "accountId": accountId
        };

        try {
            const response = await fetch(detailUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(detailBody),
            });

            if (response.ok) {
                const data = await response.json();
                return data.data || {};
            } else {
                return {};
            }
        } catch (error) {
            return {};
        }
    };

    const performAccountSearch = async (creativeId, startAccountId, maxAttempts = 1000, delay = 1000, timeout = 20000) => {
        setLoading(true);
        let accountId = startAccountId;
        let found = false;
        const startTime = Date.now();

        for (let attempt = 0; attempt < maxAttempts; attempt++) {
            const elapsedTime = Date.now() - startTime;
            if (elapsedTime > timeout) { 
                // Se o tempo limite for excedido, sai do loop
                break;
            }

            try {
                const result = await fetchCreativeDetails(creativeId, accountId);
                if (result.creativeId && result.creativeId !== '0') {
                    found = true;
                    setResult({ found: true, accountId, result });
                    setShowRelatedAds(false); // Reseta a visualização dos anúncios relacionados
                    break;
                }
            } catch (error) {
                console.error(error);
            }

            accountId += 1;
            await new Promise(resolve => setTimeout(resolve, delay));
        }

        if (!found) {
            setResult({ found: false, message: "Não encontramos nada com esses IDs, faça uma nova busca." });
            setShowRelatedAds(false);
        }

        setLoading(false);
    };

    const handleSearch = () => {
        if (creativeId && startAccountId) {
            performAccountSearch(parseInt(creativeId), parseInt(startAccountId));
        }
    };

    return (
        <div>
            <h1>Buscar Conta por Criativo</h1>
            <div className="search-form">
                <input
                    type="text"
                    placeholder="ID do Criativo"
                    value={creativeId}
                    onChange={(e) => setCreativeId(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="ID da Conta Inicial"
                    value={startAccountId}
                    onChange={(e) => setStartAccountId(e.target.value)}
                />
                <button className="button" onClick={handleSearch} disabled={loading}>
                    {loading ? 'Buscando...' : 'Buscar'}
                </button>
            </div>

            {loading && (
                <div className="spinner">
                    <div></div>
                    <div></div>
                    <div></div>
                </div>
            )}

            {result && (
                <div className="search-result">
                    {result.found ? (
                        <>
                            <pre>
                                <strong>Conta Encontrada:</strong> {result.accountId}
                                <br />
                                <strong>Detalhes:</strong> {JSON.stringify(result.result, null, 2)}
                            </pre>
                            {result.result.relatedAds && result.result.relatedAds.length > 0 && (
                                <button 
                                    className="button" 
                                    onClick={() => setShowRelatedAds(!showRelatedAds)}
                                >
                                    {showRelatedAds ? 'Ocultar Anúncios Relacionados' : 'Ver Anúncios Relacionados'}
                                </button>
                            )}
                            {showRelatedAds && (
                                <div className="related-ads">
                                    {result.result.relatedAds.map((ad, index) => (
                                        <div key={ad.photoId || index} className="related-ad">
                                            <video src={ad.videoUrl} controls />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </>
                    ) : (
                        <p>{result.message || "ID da conta não encontrado."}</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default AccountSearchPage;
