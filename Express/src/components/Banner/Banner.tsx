// src/components/Banner/Banner.tsx

import React from 'react';
import './Banner.css';

export const Banner: React.FC = () => {
  const images = ['1.jpg', '2.jpg', '3.jpeg'];
  
  return (
    <section className="banner text-center">
      <h2 className="banner__title">Seguimiento Fácil y Rápido</h2>
      <p className="banner__subtitle">¡Tu paquete en un solo clic!</p>
      <div className="banner__image-gallery d-flex justify-content-center">
        {images.map((img, index) => (
          <img 
            key={index}
            src={`./images/${img}`} 
            alt={`Imagen ${index + 1}`} 
            className="banner__image"
          />
        ))}
      </div>
    </section>
  );
};