import React from 'react';

const CreativeCard = ({ creative }) => {
    return (
        <div className="card">
            <h3>{creative.name || 'Sem Nome'}</h3>
            <p><strong>ID do Criativo:</strong> {creative.creativeId}</p> {/* Exibe o ID do criativo */}
            <p><strong>Indústria:</strong> {creative.level1Industry?.displayNameEn || 'N/A'}</p>
            <p><strong>Clicks:</strong> {creative.clickCntAll || 'N/A'}</p>
            <p><strong>Conversões:</strong> {creative.transformCntAll || 'N/A'}</p>
            <p><strong>CTR:</strong> {creative.ctr || 'N/A'}</p>
            <p><strong>CVR:</strong> {creative.cvr || 'N/A'}</p>
            <p><strong>Rank:</strong> {creative.rank || 'N/A'}</p>
            {creative.videoUrl && <video src={creative.videoUrl} controls width="100%" />}
        </div>
    );
};

export default CreativeCard;
 