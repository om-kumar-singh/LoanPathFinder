import React from 'react';

const PrivacyPolicy = () => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-deep-blue mb-4">
          Privacy Policy
        </h1>
        <p className="text-primary-text opacity-70">
          Last updated: {new Date().toLocaleDateString()}
        </p>
      </div>

      <div className="space-y-6">
        <div className="neumorphic-card">
          <h2 className="text-2xl font-bold text-deep-blue mb-4">Introduction</h2>
          <p className="text-primary-text leading-relaxed">
            At LoanPathfinder, we are committed to protecting your privacy and ensuring 
            the security of your personal information. This Privacy Policy explains how 
            we collect, use, disclose, and safeguard your information when you use our 
            platform.
          </p>
        </div>

        <div className="neumorphic-card">
          <h2 className="text-2xl font-bold text-deep-blue mb-4">Information We Collect</h2>
          <div className="space-y-4 text-primary-text">
            <div>
              <h3 className="font-semibold text-deep-blue mb-2">Personal Information</h3>
              <p className="leading-relaxed">
                We collect information that you provide directly to us, including:
              </p>
              <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
                <li>Name, email address, and account credentials</li>
                <li>Financial information (income, expenses, credit score, etc.)</li>
                <li>Demographic information (age, gender) if provided</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-deep-blue mb-2">Usage Data</h3>
              <p className="leading-relaxed">
                We automatically collect information about how you interact with our platform, 
                including simulation history, preferences, and analytics data.
              </p>
            </div>
          </div>
        </div>

        <div className="neumorphic-card">
          <h2 className="text-2xl font-bold text-deep-blue mb-4">How We Use Your Information</h2>
          <ul className="space-y-2 text-primary-text">
            <li className="flex items-start">
              <span className="text-primary-teal mr-2">•</span>
              <span>To provide and improve our loan assessment services</span>
            </li>
            <li className="flex items-start">
              <span className="text-primary-teal mr-2">•</span>
              <span>To generate personalized loan readiness scores and recommendations</span>
            </li>
            <li className="flex items-start">
              <span className="text-primary-teal mr-2">•</span>
              <span>To maintain your account and provide customer support</span>
            </li>
            <li className="flex items-start">
              <span className="text-primary-teal mr-2">•</span>
              <span>To analyze usage patterns and improve our platform</span>
            </li>
            <li className="flex items-start">
              <span className="text-primary-teal mr-2">•</span>
              <span>To comply with legal obligations</span>
            </li>
          </ul>
        </div>

        <div className="neumorphic-card">
          <h2 className="text-2xl font-bold text-deep-blue mb-4">Data Security</h2>
          <p className="text-primary-text leading-relaxed">
            We implement industry-standard security measures to protect your personal information:
          </p>
          <ul className="space-y-2 text-primary-text mt-4">
            <li>• Encrypted data transmission using SSL/TLS</li>
            <li>• Secure storage on Firebase infrastructure</li>
            <li>• Access controls and authentication</li>
            <li>• Regular security audits and updates</li>
          </ul>
        </div>

        <div className="neumorphic-card">
          <h2 className="text-2xl font-bold text-deep-blue mb-4">Data Sharing</h2>
          <p className="text-primary-text leading-relaxed">
            We do not sell, trade, or rent your personal information to third parties. 
            We may share your information only in the following circumstances:
          </p>
          <ul className="space-y-2 text-primary-text mt-4">
            <li>• With your explicit consent</li>
            <li>• To comply with legal requirements or court orders</li>
            <li>• To protect our rights, property, or safety</li>
            <li>• With service providers who assist in operating our platform (under strict confidentiality agreements)</li>
          </ul>
        </div>

        <div className="neumorphic-card">
          <h2 className="text-2xl font-bold text-deep-blue mb-4">Your Rights</h2>
          <p className="text-primary-text leading-relaxed mb-4">
            You have the right to:
          </p>
          <ul className="space-y-2 text-primary-text">
            <li>• Access and review your personal information</li>
            <li>• Update or correct your information</li>
            <li>• Delete your account and associated data</li>
            <li>• Request a copy of your data</li>
            <li>• Opt-out of certain data collection practices</li>
          </ul>
        </div>

        <div className="neumorphic-card">
          <h2 className="text-2xl font-bold text-deep-blue mb-4">Contact Us</h2>
          <p className="text-primary-text leading-relaxed">
            If you have any questions or concerns about this Privacy Policy or our data 
            practices, please contact us at:
          </p>
          <p className="text-primary-teal font-semibold mt-2">
            Email: <a href="mailto:omkumarsingh2004@gmail.com" className="hover:underline">omkumarsingh2004@gmail.com</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;

