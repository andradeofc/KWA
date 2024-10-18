import React from 'react';

const RelatedAdsPopup = ({ relatedAds, onClose }) => {
    return (
        <div className="popup">
            <div className="popup-content">
                <h2>Criativos Relacionados</h2>
                <div className="related-ads">
                    {relatedAds.map((ad, index) => (
                        <div key={index} className="related-ad">
                            <video src={ad.videoUrl} controls width="100%" />
                        </div>
                    ))}
                </div>
                <button className="button" onClick={onClose}>Fechar</button>
            </div>
        </div>
    );
};

export default RelatedAdsPopup;
