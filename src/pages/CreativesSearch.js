import React, { useState } from 'react';
import CreativesList from '../components/CreativesList';
import RelatedAdsPopup from '../components/RelatedAdsPopup';

const CreativesSearch = () => {
    const [creatives, setCreatives] = useState([]);
    const [filteredCreatives, setFilteredCreatives] = useState([]);
    const [loading, setLoading] = useState(false);
    const [dateType, setDateType] = useState(3); // 30 dias por padrão
    const [keyword, setKeyword] = useState(''); // Palavra-chave para pesquisa
    const [creativeIdFilter, setCreativeIdFilter] = useState(''); // Novo estado para o filtro por ID do criativo
    const [startPage, setStartPage] = useState(1); // Página inicial
    const [endPage, setEndPage] = useState(1); // Página final
    const [showPopup, setShowPopup] = useState(false);
    const [selectedRelatedAds, setSelectedRelatedAds] = useState(null);

    const handleDateTypeChange = (event) => setDateType(parseInt(event.target.value));
    const handleKeywordChange = (event) => {
        setKeyword(event.target.value);
        applyFilters(event.target.value, creativeIdFilter);
    };
    const handleCreativeIdFilterChange = (event) => {
        setCreativeIdFilter(event.target.value);
        applyFilters(keyword, event.target.value);
    };
    const handleStartPageChange = (event) => setStartPage(parseInt(event.target.value));
    const handleEndPageChange = (event) => setEndPage(parseInt(event.target.value));
    const clearKeyword = () => {
        setKeyword('');
        setCreativeIdFilter('');
        setFilteredCreatives(creatives);
    };

    const fetchCreativeDetails = async (creativeId, accountId, dateType) => {
        const detailUrl = "http://localhost:5001/api/creative-details";  // Proxy para a URL de detalhes do criativo
        const detailBody = {
            dateType,
            creativeId,
            accountId
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

    const fetchCreatives = async () => {
        if (endPage - startPage > 5) {
            setShowPopup(true);
            return;
        }
        performFetchCreatives();
    };

    const performFetchCreatives = async () => {
        setLoading(true);
        setShowPopup(false);
        const allResults = [];
        const listUrl = 'http://localhost:5001/api/creatives';  // Apontando para o proxy

        for (let pageNum = startPage; pageNum <= endPage; pageNum++) {
            const listBody = {
                pageNum,
                pageSize: 24,
                queryParam: {
                    countryCode: 76,
                    campaignType: 3,
                    dateType: dateType,
                    orderType: 1
                },
                orderByFields: {}
            };

            try {
                const response = await fetch(listUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(listBody),
                });

                if (response.ok) {
                    const data = await response.json();
                    const creatives = data?.data?.data || [];

                    for (let creative of creatives) {
                        const creativeDetails = await fetchCreativeDetails(creative.creativeId, creative.accountId, dateType);

                        creative.clickCntAllInt = convertToNumber(creativeDetails.clickCntAll || '0');
                        creative.transformCntAllInt = convertToNumber(creativeDetails.transformCntAll || '0');
                        creative = { ...creative, ...creativeDetails };

                        allResults.push(creative);
                    }
                }
            } catch (error) {}
        }

        setCreatives(allResults);
        setFilteredCreatives(allResults);
        setLoading(false);
    };

    const convertToNumber = (value) => {
        if (typeof value === 'string') {
            const multiplier = value.includes('k') ? 1000 : value.includes('M') ? 1000000 : 1;
            return parseFloat(value.replace(/[^\d.]/g, '')) * multiplier;
        }
        return value;
    };

    const applyFilters = (searchKeyword, searchId) => {
        let filtered = creatives;

        if (searchKeyword) {
            filtered = filtered.filter(creative =>
                creative.asr && creative.asr.toLowerCase().includes(searchKeyword.toLowerCase())
            );
        }

        if (searchId) {
            filtered = filtered.filter(creative =>
                creative.creativeId && creative.creativeId.toString() === searchId
            );
        }

        setFilteredCreatives(filtered.length > 0 ? filtered : creatives);
    };

    const sortCreatives = (criteria) => {
        const sorted = [...filteredCreatives].sort((a, b) => b[criteria] - a[criteria]);
        setFilteredCreatives(sorted);
    };

    const handleCreativeClick = (relatedAds) => {
        console.log('Related Ads:', relatedAds); // Log para verificar os dados
        setSelectedRelatedAds(relatedAds);
    };

    const closePopup = () => {
        setSelectedRelatedAds(null);
    };

    return (
        <div>
            <h1>Buscar Criativos</h1>
            <div className="controls">
                <label htmlFor="dateType">Selecionar intervalo de dias:</label>
                <select id="dateType" value={dateType} onChange={handleDateTypeChange}>
                    <option value="1">Últimos 7 dias</option>
                    <option value="2">Últimos 15 dias</option>
                    <option value="3">Últimos 30 dias</option>
                </select>
            </div>
            <div className="filters">
                <label htmlFor="startPage">Página inicial:</label>
                <input type="number" id="startPage" value={startPage} onChange={handleStartPageChange} min="1" />
                <label htmlFor="endPage">Página final:</label>
                <input type="number" id="endPage" value={endPage} onChange={handleEndPageChange} min="1" />

                <button className="button" onClick={fetchCreatives} disabled={loading}>
                    {loading ? 'Carregando...' : 'Buscar Anúncios'}
                </button>

                <h3>Filtros:</h3>
                <div className="search-container">
                    <input
                        type="text"
                        id="keyword"
                        className="search-input"
                        value={keyword}
                        onChange={handleKeywordChange}
                        placeholder="Digite a palavra-chave"
                    />
                </div>

                {/* Novo campo de filtro por ID do Criativo */}
                <div className="search-container">
                    <input
                        type="text"
                        id="creativeIdFilter"
                        className="search-input"
                        value={creativeIdFilter}
                        onChange={handleCreativeIdFilterChange}
                        placeholder="Filtrar por ID do Criativo"
                    />
                </div>

                <div className="sort-buttons">
                    <button onClick={() => sortCreatives('clickCntAllInt')}>Ordenar por Cliques</button>
                    <button onClick={() => sortCreatives('transformCntAllInt')}>Ordenar por Conversões</button>
                </div>

                <button className="clear-button" onClick={clearKeyword}>Limpar Filtros</button>
            </div>

            {loading ? (
                <div className="spinner">
                    <div></div>
                    <div></div>
                    <div></div>
                </div>
            ) : (
                <CreativesList creatives={filteredCreatives} onCreativeClick={handleCreativeClick} />
            )}

            {showPopup && (
                <div className="popup">
                    <div className="popup-content">
                        <h2>Atenção!</h2>
                        <p>Você está tentando buscar criativos em mais de 5 páginas. Isso pode demorar mais do que o esperado.</p>
                        <button className="button" onClick={performFetchCreatives}>Continuar</button>
                        <button className="button" onClick={() => setShowPopup(false)}>Cancelar</button>
                    </div>
                </div>
            )}

            {selectedRelatedAds && (
                <RelatedAdsPopup relatedAds={selectedRelatedAds} onClose={closePopup} />
            )}
        </div>
    );
};

export default CreativesSearch;
