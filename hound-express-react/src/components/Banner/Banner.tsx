import React from 'react';

const Banner: React.FC = () => {
  return (
    <section id="banner" className="banner text-center">
      <h2 className="banner__title">Seguimiento Fácil y Rápido</h2>
      <p className="banner__subtitle">¡Tu paquete en un solo clic!</p>
      <div className="banner__image-gallery d-flex justify-content-center">
        <img src="/images/1.jpg" alt="Imagen 1" className="banner__image" />
        <img src="/images/2.jpg" alt="Imagen 2" className="banner__image" />
        <img src="/images/3.jpeg" alt="Imagen 3" className="banner__image" />
      </div>
    </section>
  );
};

export default Banner;
