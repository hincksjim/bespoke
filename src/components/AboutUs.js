import React from 'react';
import './AboutUs.css';
import { useNavigate } from 'react-router-dom';



const About = () => {
  const handleRegisterClick = () => {
    navigate('/Portal');
  };
  const navigate = useNavigate();
  return (
    <div>


      <main>
        <section className="hero">
          <h1>Our Story</h1>
        </section>

        <section className="content container">
          <p> </p>
          <p> </p>
          <h2>About Elegance Jewellery</h2>
          <p>Elegance Jewellery was founded in 2020 with a vision to revolutionize the jewellery design industry through the power of artificial intelligence. Our team of expert jewellers, data scientists, and AI specialists came together with a shared passion for combining traditional craftsmanship with cutting-edge technology.</p>
          <p>We believe that AI has the potential to unlock unprecedented creativity in jewellery design, allowing both professional designers and hobbyists to explore new possibilities and create truly unique pieces. Our platform harnesses the latest advancements in machine learning and computer vision to assist in every step of the design process, from initial concept to final production.</p>
          <button className="register-button" onClick={handleRegisterClick}>
          Lets Start
          </button>
          <p>Join the Revolution. Design. Create. Shine.</p>
          
          <h2>Our Journey</h2>
          <div className="timeline">
            <div className="timeline-item left">
              <div className="timeline-content">
                <h3>2020</h3>
                <p>Elegance Jewellery is founded, bringing together a team of experts in jewellery design and artificial intelligence.</p>
              </div>
            </div>
            <div className="timeline-item right">
              <div className="timeline-content">
                <h3>2021</h3>
                <p>Launch of our first AI-powered design tool, enabling users to generate unique jewellery concepts based on their preferences.</p>
              </div>
            </div>
            <div className="timeline-item left">
              <div className="timeline-content">
                <h3>2022</h3>
                <p>Integration of advanced 3D modeling capabilities, allowing for rapid prototyping and visualization of designs.</p>
              </div>
            </div>
            <div className="timeline-item right">
              <div className="timeline-content">
                <h3>2023</h3>
                <p>Introduction of our AI-driven personalization engine, creating bespoke designs tailored to individual customer preferences and styles.</p>
              </div>
            </div>
          </div>

          <h2>Our Mission</h2>
          <p>At Elegance Jewellery, our mission is to democratize jewellery design by making sophisticated AI tools accessible to everyone. We strive to empower designers, jewellers, and enthusiasts to push the boundaries of creativity and craft pieces that are as unique as the individuals who wear them.</p>
          <button className="register-button" onClick={handleRegisterClick}>
          Lets Start
          </button>
          <p>Join the Revolution. Design. Create. Shine.</p>
         
        </section>
      </main>


    </div>
  );
};

export default About;

