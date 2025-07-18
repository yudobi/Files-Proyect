import React from 'react';
import HeroSection from '../components/componentesPaginaInicio/HeroSection';
import FeaturesSection from '../components/componentesPaginaInicio/FeaturesSection';
import BannerSection from '../components/componentesPaginaInicio/BannerSection';
import TestimonialsSection from '../components/componentesPaginaInicio/TestimonialsSection';
import ProductsSection from '../components/componentesPaginaProducts/ProductsSection';

const Home = () => {
  return (
    <>
      <HeroSection />
      <FeaturesSection />
      <BannerSection />
      <TestimonialsSection />
      <ProductsSection />
    </>
  );
};

export default Home;