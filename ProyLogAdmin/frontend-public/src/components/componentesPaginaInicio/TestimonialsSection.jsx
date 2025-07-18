import React from 'react';
import '../../stayles/TestimonialsSection.css';

const testimonials = [
  {
    text: "Excelente servicio al cliente y productos de alta calidad. Mi pedido llegó antes de lo esperado y en perfectas condiciones.",
    name: "María González",
    since: "Cliente desde 2022",
    image: "https://randomuser.me/api/portraits/women/43.jpg"
  },
  {
    text: "La relación calidad-precio es increíble. He comparado con otras tiendas y definitivamente aquí encuentras las mejores ofertas.",
    name: "Carlos Martínez",
    since: "Cliente desde 2021",
    image: "https://randomuser.me/api/portraits/men/32.jpg"
  },
  {
    text: "Me encanta la variedad de productos que ofrecen. Siempre encuentro lo que busco y el proceso de compra es muy sencillo.",
    name: "Laura Rodríguez",
    since: "Cliente desde 2023",
    image: "https://randomuser.me/api/portraits/women/65.jpg"
  }
];

const TestimonialsSection = () => {
  return (
    <section className="testimonials-section">
      <h2 className="section-title">Lo que dicen nuestros clientes</h2>
      <div className="testimonials-grid">
        {testimonials.map((testimonial, index) => (
          <div className="testimonial-card" key={index}>
            <p className="testimonial-text">"{testimonial.text}"</p>
            <div className="testimonial-author">
              <img src={testimonial.image} alt={testimonial.name} className="author-avatar" />
              <div className="author-info">
                <h4>{testimonial.name}</h4>
                <p>{testimonial.since}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TestimonialsSection;