import React, { useState } from 'react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    // In a real application, you would send this to a backend endpoint
    // For now, we'll just show a success message
    setTimeout(() => {
      setSuccess('Thank you for your message! We will get back to you soon.');
      setFormData({ name: '', email: '', subject: '', message: '' });
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-deep-blue mb-4">
          Contact Us
        </h1>
        <p className="text-primary-text opacity-70">
          Have questions or feedback? We'd love to hear from you!
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <div className="neumorphic-card">
            <h2 className="text-2xl font-bold text-deep-blue mb-4">Get in Touch</h2>
            <div className="space-y-4 text-primary-text">
              <div>
                <h3 className="font-semibold text-deep-blue mb-1">Email</h3>
                <a 
                  href="mailto:omkumarsingh2004@gmail.com" 
                  className="text-primary-teal hover:underline"
                >
                  omkumarsingh2004@gmail.com
                </a>
              </div>
              <div>
                <h3 className="font-semibold text-deep-blue mb-1">Response Time</h3>
                <p>We typically respond within 24-48 hours.</p>
              </div>
            </div>
          </div>

          <div className="neumorphic-card">
            <h2 className="text-2xl font-bold text-deep-blue mb-4">Support</h2>
            <p className="text-primary-text leading-relaxed">
              For technical support, feature requests, or general inquiries, 
              please use the contact form or email us directly.
            </p>
          </div>
        </div>

        <div className="neumorphic-card">
          <h2 className="text-2xl font-bold text-deep-blue mb-4">Send us a Message</h2>
          
          {success && (
            <div className="mb-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
              {success}
            </div>
          )}
          
          {error && (
            <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-deep-blue font-semibold mb-2">
                Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="input-field"
                placeholder="Your name"
                required
              />
            </div>

            <div>
              <label className="block text-deep-blue font-semibold mb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="input-field"
                placeholder="your.email@example.com"
                required
              />
            </div>

            <div>
              <label className="block text-deep-blue font-semibold mb-2">
                Subject
              </label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                className="input-field"
                placeholder="What is this regarding?"
                required
              />
            </div>

            <div>
              <label className="block text-deep-blue font-semibold mb-2">
                Message
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                className="input-field"
                rows="5"
                placeholder="Your message here..."
                required
              />
            </div>

            <button
              type="submit"
              className="btn-primary w-full"
              disabled={loading}
            >
              {loading ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;

