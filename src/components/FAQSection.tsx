import React, { useState } from 'react';

const defaultFaqs = [
  {
    question: 'How much does a custom short sleeve t-shirt cost?',
    answer: 'Pricing depends on quantity, design, and shirt type. Contact us for a custom quote.'
  },
  {
    question: 'How many short sleeve t-shirts do I have to order?',
    answer: 'Minimum order quantities vary by product. Most start at 12 pieces.'
  },
  {
    question: 'What shipping options do you offer?',
    answer: 'We offer standard, expedited, and overnight shipping options.'
  },
  {
    question: 
      
      'What\'s the best way to wash my T-shirt to keep the print vibrant?',
    answer: 'Wash inside out in cold water and tumble dry low for best results.'
  }
];

const FAQSection: React.FC<{ faqs?: { question: string; answer: string }[]; title?: string }> = ({ faqs = defaultFaqs, title = 'Short Sleeve T-Shirt FAQs' }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="bg-[#f7fafc] py-10 px-4 md:px-12 lg:px-24 mt-8 rounded-xl">
      <h2 className="text-2xl font-bold mb-6 text-gray-900">{title}</h2>
      <div className="space-y-4">
        {faqs.map((faq, idx) => (
          <div key={idx} className="border-b border-gray-200 pb-2">
            <button
              className="w-full flex justify-between items-center text-left text-base font-medium text-gray-800 focus:outline-none"
              onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
              aria-expanded={openIndex === idx}
            >
              <span>{faq.question}</span>
              <span className="ml-2 text-gray-400">{openIndex === idx ? '▲' : '▼'}</span>
            </button>
            {openIndex === idx && (
              <div className="mt-2 text-gray-600 text-sm animate-fadeIn">
                {faq.answer}
              </div>
            )}
          </div>
        ))}
      </div>
      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .animate-fadeIn { animation: fadeIn 0.3s; }
      `}</style>
    </section>
  );
};

export default FAQSection;
