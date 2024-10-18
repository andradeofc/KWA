import React, { useState } from 'react';

const AccountSearchPopup = ({ onClose, onSearch, result }) => {
    const [creativeId, setCreativeId] = useState('');
    const [startAccountId, setStartAccountId] = useState('');

    const handleSearch = () => {
        if (creativeId && startAccountId) {
            onSearch(parseInt(creativeId), parseInt(startAccountId));
        }
    };

    return (
        <div className="popup">
            <div className="popup-content">
                <h2>Buscar Conta por Criativo</h2>
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
                <button className="button" onClick={handleSearch}>Buscar</button>
                <button className="button" onClick={onClose}>Fechar</button>

                {result && (
                    <div className="search-result">
                        {result.found ? (
                            <pre>
                                <strong>Conta Encontrada:</strong> {result.accountId}
                                <br />
                                <strong>Detalhes:</strong> {JSON.stringify(result.result, null, 2)}
                            </pre>
                        ) : (
                            <p>ID da conta não encontrado.</p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AccountSearchPopup;
