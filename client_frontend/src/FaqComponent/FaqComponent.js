import React, { useEffect, useState } from 'react';
import { Info } from 'lucide-react';
import './FaqComponent.css';

const FAQItem = ({ question, answer }) => (
  <div className="faq-item">
    <div className="faq-item-content">
      <div className="faq-icon">
        <Info />
      </div>
      <div className="faq-text">
        <h3 className="faq-question">{question}</h3>
        <p className="faq-answer">{answer}</p>
      </div>
    </div>
  </div>
);

const FAQPage = () => {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/faqs/');
        if (!response.ok) throw new Error('Failed to fetch FAQs');
        const data = await response.json();
        setFaqs(data);
      } catch (err) {
        console.error('Error fetching FAQs:', err);
        setError('Unable to load FAQs at the moment.');
      } finally {
        setLoading(false);
      }
    };

    fetchFaqs();
  }, []);

  if (loading) return <div>Loading FAQs...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="faq-page">
      <div className="faq-container">
        <div className="faq-grid">
          {faqs.map((faq, index) => (
            <FAQItem key={index} question={faq.question} answer={faq.answer} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default FAQPage;
