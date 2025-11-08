import React from 'react';
import { Link } from 'react-router-dom';

const About = () => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-deep-blue mb-4">
          About LoanPathfinder
        </h1>
      </div>

      <div className="space-y-6">
        <div className="neumorphic-card">
          <h2 className="text-2xl font-bold text-deep-blue mb-4">Our Mission</h2>
          <p className="text-primary-text leading-relaxed">
            LoanPathfinder is an innovative platform designed to provide transparent, 
            explainable loan assessment using cutting-edge AI technology. Our mission 
            is to empower individuals with clear insights into their loan eligibility 
            and help them make informed financial decisions.
          </p>
        </div>

        <div className="neumorphic-card">
          <h2 className="text-2xl font-bold text-deep-blue mb-4">Key Features</h2>
          <ul className="space-y-3 text-primary-text">
            <li className="flex items-start">
              <span className="text-primary-teal mr-2">✓</span>
              <span><strong>Loan Readiness Score (LRS):</strong> Get a comprehensive score 
              that evaluates your loan eligibility using explainable AI with SHAP explanations.</span>
            </li>
            <li className="flex items-start">
              <span className="text-primary-teal mr-2">✓</span>
              <span><strong>What-If Simulator:</strong> Test different financial scenarios 
              in real-time to see how changes affect your loan readiness score.</span>
            </li>
            <li className="flex items-start">
              <span className="text-primary-teal mr-2">✓</span>
              <span><strong>Commission-Neutral Marketplace:</strong> Browse unbiased loan 
              recommendations without hidden fees or commissions.</span>
            </li>
            <li className="flex items-start">
              <span className="text-primary-teal mr-2">✓</span>
              <span><strong>Transparent Analytics:</strong> Understand exactly why you 
              received your score with detailed breakdowns and explanations.</span>
            </li>
          </ul>
        </div>

        <div className="neumorphic-card">
          <h2 className="text-2xl font-bold text-deep-blue mb-4">Technology</h2>
          <p className="text-primary-text leading-relaxed mb-4">
            LoanPathfinder leverages advanced machine learning models powered by XGBoost 
            and SHAP (SHapley Additive exPlanations) to provide accurate and interpretable 
            loan assessments. Our platform combines:
          </p>
          <ul className="space-y-2 text-primary-text">
            <li>• <strong>Explainable AI:</strong> Every prediction comes with clear explanations</li>
            <li>• <strong>Real-time Processing:</strong> Instant results and updates</li>
            <li>• <strong>Secure Infrastructure:</strong> Built on Firebase for reliable, secure data handling</li>
            <li>• <strong>User-Friendly Interface:</strong> Intuitive design for seamless user experience</li>
          </ul>
        </div>

        <div className="neumorphic-card">
          <h2 className="text-2xl font-bold text-deep-blue mb-4">Get Started</h2>
          <p className="text-primary-text leading-relaxed mb-4">
            Ready to discover your loan readiness? Start by filling out our financial 
            information form to get your personalized loan assessment.
          </p>
          <Link to="/form" className="btn-primary inline-block">
            Start Your Assessment
          </Link>
        </div>
      </div>
    </div>
  );
};

export default About;

