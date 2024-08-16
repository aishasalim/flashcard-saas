"use client";
import React from 'react';
import HeroSection from './components/hero.js';
import ProductSection from './components/product.js';
import PricingSection from './components/pricing.js';
import Footer from './components/footer.js';
import Navbar from './components/navbar.js';

export default function Home() {
  const handleSubmit = async () => {
    const checkoutSession = await fetch('/api/checkout_sessions', {
      method: 'POST',
      headers: { origin: 'http://localhost:3000' },
    });
    const checkoutSessionJson = await checkoutSession.json();
  
    const stripe = await getStripe();
    const { error } = await stripe.redirectToCheckout({
      sessionId: checkoutSessionJson.id,
    });
  
    if (error) {
      console.warn(error.message);
    }
  };

  return (
    <>
      <Navbar /> 
      <HeroSection />
      <ProductSection />
      <PricingSection />
      <Footer />
    </>
  );
}
