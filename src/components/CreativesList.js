import React from 'react';
import CreativeCard from './CreativeCard';

const CreativesList = ({ creatives, onCreativeClick }) => {
    return (
        <div style={{ display: 'flex', flexWrap: 'wrap', marginTop: '20px' }}>
            {creatives.map((creative, index) => (
                <div key={index} onClick={() => onCreativeClick(creative.relatedAds)}>
                    <CreativeCard creative={creative} />
                </div>
            ))}
        </div>
    );
};

export default CreativesList;
