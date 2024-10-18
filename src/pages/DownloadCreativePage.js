import React, { useState } from 'react';

const DownloadCreativePage = () => {
    const [creativeId, setCreativeId] = useState('');
    const [startAccountId, setStartAccountId] = useState('');
    const [dateType, setDateType] = useState(3); // 30 dias por padrão
    const [result, setResult] = useState(null);
    const [relatedAds, setRelatedAds] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleSearch = async () => {
        setLoading(true);
        setResult(null);
        setRelatedAds([]);
        const baseUrl = "http://localhost:5001/api/creative-details"; // Ajustado para a URL correta
        let accountId = parseInt(startAccountId);
        
        const payload = {
            dateType: dateType,
            creativeId: String(creativeId),
            accountId: accountId
        };

        try {
            const response = await fetch(baseUrl, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                const data = await response.json();
                console.log("Payload capturado:", data); // Log do payload completo

                if (data.data && data.data.creativeId !== '0') {
                    console.log("Nome capturado:", data.data.name); // Log do nome capturado
                    setResult({
                        success: true,
                        accountId: data.data.accountId, // Usar o accountId retornado pelo servidor
                        creativeId: data.data.creativeId,
                        name: data.data.name || 'Nome não disponível', // Acessando o campo `name` corretamente
                        industry: data.data.level1Industry?.displayNameEn,
                        clickCntAll: data.data.clickCntAll,
                        transformCntAll: data.data.transformCntAll,
                        ctr: data.data.ctr,
                        cvr: data.data.cvr,
                        rank: data.data.rank,
                        videoUrl: data.data.videoUrl
                    });
                    setRelatedAds(data.data.relatedAds || []);
                } else {
                    setResult({
                        success: false,
                        message: 'Criativo não encontrado.'
                    });
                }
            } else {
                setResult({
                    success: false,
                    message: 'Erro ao buscar o criativo.'
                });
            }
        } catch (error) {
            console.error('Erro na requisição:', error);
            setResult({
                success: false,
                message: 'Erro ao buscar o criativo.'
            });
        }

        setLoading(false);
    };

    return (
        <div className="container">
            <h1>Download Criativo</h1>
            <div className="download-controls">
                <label htmlFor="dateType">Selecionar intervalo de dias:</label>
                <select id="dateType" value={dateType} onChange={(e) => setDateType(parseInt(e.target.value))}>
                    <option value="1">Últimos 7 dias</option>
                    <option value="2">Últimos 15 dias</option>
                    <option value="3">Últimos 30 dias</option>
                </select>
            </div>
            <div className="download-search-container">
                <label>ID do Criativo:</label>
                <input
                    type="text"
                    value={creativeId}
                    onChange={(e) => setCreativeId(e.target.value)}
                />
                <label>ID da Conta Inicial:</label>
                <input
                    type="text"
                    value={startAccountId}
                    onChange={(e) => setStartAccountId(e.target.value)}
                />
                <button className="button" onClick={handleSearch} disabled={loading}>
                    {loading ? 'Pesquisando...' : 'Buscar Criativo'}
                </button>
            </div>

            {result && (
                <div className="result">
                    {result.success ? (
                        <div>
                            <p><strong>ID da conta:</strong> {result.accountId}</p>
                            <p><strong>ID do Criativo:</strong> {result.creativeId}</p>
                            <p><strong>Nome do Criativo:</strong> {result.name}</p> {/* Mostra o nome do criativo */}
                            <p><strong>Indústria:</strong> {result.industry || 'N/A'}</p>
                            <p><strong>Clicks:</strong> {result.clickCntAll || 'N/A'}</p>
                            <p><strong>Conversões:</strong> {result.transformCntAll || 'N/A'}</p>
                            <p><strong>CTR:</strong> {result.ctr || 'N/A'}</p>
                            <p><strong>CVR:</strong> {result.cvr || 'N/A'}</p>
                            <p><strong>Rank:</strong> {result.rank || 'N/A'}</p>
                            <div className="video-card">
                                {result.videoUrl ? (
                                    <video src={result.videoUrl} controls className="video-result card-video" />
                                ) : (
                                    <p>Vídeo não disponível</p>
                                )}
                            </div>
                            <h3>Criativos Relacionados:</h3>
                            <div className="related-ads">
                                {relatedAds.map((ad, index) => (
                                    <div key={index} className="related-ad">
                                        <video src={ad.videoUrl} controls className="video-result card-video" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <p>{result.message}</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default DownloadCreativePage;
