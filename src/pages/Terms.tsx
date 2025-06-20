import React, { useState } from 'react';
import { FileText, Shield, AlertTriangle, Clock, ArrowRight, CheckCircle, ExternalLink, Scale } from 'lucide-react';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';

interface TermsProps {
  onNavigate: (page: string) => void;
}

const Terms: React.FC<TermsProps> = ({ onNavigate }) => {
  const [activeSection, setActiveSection] = useState('');

  const sections = [
    { id: 'introduction', title: '1. Introduction', icon: FileText },
    { id: 'registration', title: '2. Account Registration', icon: Shield },
    { id: 'buying', title: '3. Buying Accounts', icon: CheckCircle },
    { id: 'selling', title: '4. Selling Accounts', icon: ExternalLink },
    { id: 'escrow', title: '5. Escrow Terms', icon: Shield },
    { id: 'wallet', title: '6. Wallets & Transactions', icon: ExternalLink },
    { id: 'fees', title: '7. Fees', icon: ExternalLink },
    { id: 'violations', title: '8. Bans & Violations', icon: AlertTriangle },
    { id: 'liability', title: '9. Limitation of Liability', icon: Scale },
    { id: 'changes', title: '10. Changes to Terms', icon: Clock }
  ];

  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center">
              <Scale className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Terms of Service
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-6">
            Please read these terms carefully before using GameTrust. By accessing our platform, you agree to be bound by these terms.
          </p>
          <div className="flex items-center justify-center space-x-4 text-sm text-gray-400">
            <span>📅 Last updated: January 15, 2024</span>
            <span>•</span>
            <span>⚖️ Effective immediately</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Table of Contents */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <h3 className="text-lg font-semibold text-white mb-4">Table of Contents</h3>
              <nav className="space-y-2">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => scrollToSection(section.id)}
                    className={`w-full text-left flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                      activeSection === section.id
                        ? 'bg-purple-500/20 text-purple-400'
                        : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                    }`}
                  >
                    <section.icon className="h-4 w-4" />
                    <span className="text-sm">{section.title}</span>
                  </button>
                ))}
              </nav>
            </Card>
          </div>

          {/* Content */}
          <div className="lg:col-span-3 space-y-8">
            {/* Introduction */}
            <section id="introduction">
              <Card>
                <div className="flex items-center space-x-3 mb-6">
                  <FileText className="h-6 w-6 text-purple-400" />
                  <h2 className="text-2xl font-bold text-white">1. Introduction</h2>
                </div>
                <div className="prose prose-invert max-w-none">
                  <p className="text-gray-300 leading-relaxed mb-4">
                    Welcome to GameTrust, a secure marketplace for buying and selling verified gaming accounts. GameTrust is operated by GameBox Arena and provides an escrow-protected platform for safe gaming account transactions.
                  </p>
                  <p className="text-gray-300 leading-relaxed mb-4">
                    These Terms of Service ("Terms") govern your use of the GameTrust platform, website, and services. By creating an account, accessing our platform, or using our services, you acknowledge that you have read, understood, and agree to be bound by these Terms.
                  </p>
                  <p className="text-gray-300 leading-relaxed">
                    If you do not agree with any part of these Terms, you must not use our platform. These Terms constitute a legally binding agreement between you and GameBox Arena.
                  </p>
                </div>
              </Card>
            </section>

            {/* Account Registration */}
            <section id="registration">
              <Card>
                <div className="flex items-center space-x-3 mb-6">
                  <Shield className="h-6 w-6 text-blue-400" />
                  <h2 className="text-2xl font-bold text-white">2. Account Registration</h2>
                </div>
                <div className="prose prose-invert max-w-none">
                  <h3 className="text-lg font-semibold text-white mb-3">Age Requirements</h3>
                  <p className="text-gray-300 leading-relaxed mb-4">
                    You must be at least 18 years old to use GameTrust. If you are under 18, you may only use our platform with the explicit consent and supervision of a parent or legal guardian who agrees to be bound by these Terms.
                  </p>
                  
                  <h3 className="text-lg font-semibold text-white mb-3">Account Information</h3>
                  <p className="text-gray-300 leading-relaxed mb-4">
                    You must provide accurate, current, and complete information during registration. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.
                  </p>
                  
                  <h3 className="text-lg font-semibold text-white mb-3">Account Termination</h3>
                  <p className="text-gray-300 leading-relaxed">
                    GameTrust reserves the right to suspend or terminate accounts that provide false information, engage in fraudulent activities, or violate these Terms. We may require additional verification for high-value transactions or suspicious activities.
                  </p>
                </div>
              </Card>
            </section>

            {/* Buying Accounts */}
            <section id="buying">
              <Card>
                <div className="flex items-center space-x-3 mb-6">
                  <CheckCircle className="h-6 w-6 text-green-400" />
                  <h2 className="text-2xl font-bold text-white">3. Buying Accounts</h2>
                </div>
                <div className="prose prose-invert max-w-none">
                  <h3 className="text-lg font-semibold text-white mb-3">Escrow Protection</h3>
                  <p className="text-gray-300 leading-relaxed mb-4">
                    All purchases must be made through our secure escrow system. Your payment will be held safely until you confirm the account works as described. Direct payments outside the platform are prohibited and not protected.
                  </p>
                  
                  <h3 className="text-lg font-semibold text-white mb-3">Verification Period</h3>
                  <p className="text-gray-300 leading-relaxed mb-4">
                    You have 48 hours from account delivery to verify that the account matches the listing description. During this period, you can report any issues or discrepancies for investigation.
                  </p>
                  
                  <h3 className="text-lg font-semibold text-white mb-3">Refund Policy</h3>
                  <p className="text-gray-300 leading-relaxed">
                    Refunds are available when dispute conditions are met, including accounts that don't match descriptions, are inaccessible, or have undisclosed issues. Refunds must be requested within the 48-hour verification period.
                  </p>
                </div>
              </Card>
            </section>

            {/* Selling Accounts */}
            <section id="selling">
              <Card>
                <div className="flex items-center space-x-3 mb-6">
                  <ExternalLink className="h-6 w-6 text-yellow-400" />
                  <h2 className="text-2xl font-bold text-white">4. Selling Accounts</h2>
                </div>
                <div className="prose prose-invert max-w-none">
                  <h3 className="text-lg font-semibold text-white mb-3">Account Legitimacy</h3>
                  <p className="text-gray-300 leading-relaxed mb-4">
                    You may only sell accounts that you legally own. Selling stolen, hacked, or accounts obtained through fraudulent means is strictly prohibited and may result in legal action.
                  </p>
                  
                  <h3 className="text-lg font-semibold text-white mb-3">Accurate Information</h3>
                  <p className="text-gray-300 leading-relaxed mb-4">
                    All listing information must be accurate and complete. You must provide proof of account ownership, clear screenshots, and disclose any limitations or linked platforms (Facebook, Apple ID, etc.).
                  </p>
                  
                  <h3 className="text-lg font-semibold text-white mb-3">Linked Platforms</h3>
                  <p className="text-gray-300 leading-relaxed mb-4">
                    Accounts linked to social platforms must be clearly disclosed. If an account cannot be unlinked from Facebook, Apple ID, or other services, this must be stated prominently in the listing.
                  </p>
                  
                  <h3 className="text-lg font-semibold text-white mb-3">Delivery Requirements</h3>
                  <p className="text-gray-300 leading-relaxed">
                    Sellers must deliver account credentials within 24 hours of purchase confirmation. Failure to deliver may result in automatic refunds and account penalties.
                  </p>
                </div>
              </Card>
            </section>

            {/* Escrow Terms */}
            <section id="escrow">
              <Card>
                <div className="flex items-center space-x-3 mb-6">
                  <Shield className="h-6 w-6 text-indigo-400" />
                  <h2 className="text-2xl font-bold text-white">5. Escrow Terms</h2>
                </div>
                <div className="prose prose-invert max-w-none">
                  <h3 className="text-lg font-semibold text-white mb-3">How Escrow Works</h3>
                  <p className="text-gray-300 leading-relaxed mb-4">
                    Our escrow system holds buyer payments securely until the transaction is completed successfully. Funds are only released to sellers after buyer confirmation or the 48-hour verification period expires without disputes.
                  </p>
                  
                  <h3 className="text-lg font-semibold text-white mb-3">Dispute Resolution</h3>
                  <p className="text-gray-300 leading-relaxed mb-4">
                    Disputes must be raised within 48 hours of account delivery. Our dispute team will investigate all claims fairly and make final decisions based on evidence provided by both parties.
                  </p>
                  
                  <h3 className="text-lg font-semibold text-white mb-3">Final Decisions</h3>
                  <p className="text-gray-300 leading-relaxed">
                    GameTrust's decisions on disputes are final and binding. We reserve the right to request additional evidence, conduct investigations, and make determinations in the best interest of platform integrity.
                  </p>
                </div>
              </Card>
            </section>

            {/* Wallets & Transactions */}
            <section id="wallet">
              <Card>
                <div className="flex items-center space-x-3 mb-6">
                  <ExternalLink className="h-6 w-6 text-orange-400" />
                  <h2 className="text-2xl font-bold text-white">6. Wallets & Transactions</h2>
                </div>
                <div className="prose prose-invert max-w-none">
                  <h3 className="text-lg font-semibold text-white mb-3">Wallet Balance</h3>
                  <p className="text-gray-300 leading-relaxed mb-4">
                    Your GameTrust wallet balance is non-interest-bearing and represents a credit balance for platform transactions. Wallet funds are held securely but do not constitute a bank deposit.
                  </p>
                  
                  <h3 className="text-lg font-semibold text-white mb-3">Withdrawals</h3>
                  <p className="text-gray-300 leading-relaxed mb-4">
                    Withdrawal requests are processed within 24-48 hours to verified payment methods. We may require additional verification for large withdrawals or suspicious activity.
                  </p>
                  
                  <h3 className="text-lg font-semibold text-white mb-3">Third-Party Delays</h3>
                  <p className="text-gray-300 leading-relaxed">
                    GameTrust is not liable for delays caused by third-party payment processors, banks, or cryptocurrency networks. Processing times may vary based on the chosen withdrawal method.
                  </p>
                </div>
              </Card>
            </section>

            {/* Fees */}
            <section id="fees">
              <Card>
                <div className="flex items-center space-x-3 mb-6">
                  <ExternalLink className="h-6 w-6 text-pink-400" />
                  <h2 className="text-2xl font-bold text-white">7. Fees</h2>
                </div>
                <div className="prose prose-invert max-w-none">
                  <h3 className="text-lg font-semibold text-white mb-3">Commission Structure</h3>
                  <p className="text-gray-300 leading-relaxed mb-4">
                    GameTrust charges a 10% commission on successful sales. This fee covers escrow protection, payment processing, customer support, platform maintenance, and dispute resolution services.
                  </p>
                  
                  <h3 className="text-lg font-semibold text-white mb-3">No Listing Fees</h3>
                  <p className="text-gray-300 leading-relaxed mb-4">
                    There are no upfront fees to list accounts on GameTrust. You only pay commission when your account sells successfully.
                  </p>
                  
                  <h3 className="text-lg font-semibold text-white mb-3">Fee Changes</h3>
                  <p className="text-gray-300 leading-relaxed">
                    GameTrust reserves the right to adjust fees with 30 days' notice. Fee changes will not affect transactions already in progress at the time of the change.
                  </p>
                </div>
              </Card>
            </section>

            {/* Bans & Violations */}
            <section id="violations">
              <Card>
                <div className="flex items-center space-x-3 mb-6">
                  <AlertTriangle className="h-6 w-6 text-red-400" />
                  <h2 className="text-2xl font-bold text-white">8. Bans & Violations</h2>
                </div>
                <div className="prose prose-invert max-w-none">
                  <h3 className="text-lg font-semibold text-white mb-3">Prohibited Activities</h3>
                  <p className="text-gray-300 leading-relaxed mb-4">
                    The following activities may result in immediate account termination: scam attempts, impersonation, selling stolen accounts, repeated false disputes, manipulation of reviews, or any form of fraud.
                  </p>
                  
                  <h3 className="text-lg font-semibold text-white mb-3">Account Termination</h3>
                  <p className="text-gray-300 leading-relaxed mb-4">
                    We reserve the right to suspend or permanently ban accounts that violate these Terms. Banned users forfeit any pending transactions and wallet balances may be frozen pending investigation.
                  </p>
                  
                  <h3 className="text-lg font-semibold text-white mb-3">Legal Action</h3>
                  <p className="text-gray-300 leading-relaxed">
                    Serious violations may result in legal action. We cooperate with law enforcement agencies and may pursue civil or criminal charges for fraud, theft, or other illegal activities.
                  </p>
                </div>
              </Card>
            </section>

            {/* Limitation of Liability */}
            <section id="liability">
              <Card>
                <div className="flex items-center space-x-3 mb-6">
                  <Scale className="h-6 w-6 text-purple-400" />
                  <h2 className="text-2xl font-bold text-white">9. Limitation of Liability</h2>
                </div>
                <div className="prose prose-invert max-w-none">
                  <h3 className="text-lg font-semibold text-white mb-3">Platform Liability</h3>
                  <p className="text-gray-300 leading-relaxed mb-4">
                    GameTrust provides a marketplace platform and escrow services but is not responsible for the quality, legality, or authenticity of accounts listed by users. We facilitate transactions but do not guarantee account performance.
                  </p>
                  
                  <h3 className="text-lg font-semibold text-white mb-3">User Responsibility</h3>
                  <p className="text-gray-300 leading-relaxed mb-4">
                    All transactions are conducted at your own discretion and risk. Users are responsible for verifying account details, understanding game terms of service, and ensuring compliance with applicable laws.
                  </p>
                  
                  <h3 className="text-lg font-semibold text-white mb-3">Damages Limitation</h3>
                  <p className="text-gray-300 leading-relaxed">
                    In no event shall GameTrust be liable for indirect, incidental, special, or consequential damages arising from platform use. Our total liability is limited to the amount of the specific transaction in question.
                  </p>
                </div>
              </Card>
            </section>

            {/* Changes to Terms */}
            <section id="changes">
              <Card>
                <div className="flex items-center space-x-3 mb-6">
                  <Clock className="h-6 w-6 text-blue-400" />
                  <h2 className="text-2xl font-bold text-white">10. Changes to Terms</h2>
                </div>
                <div className="prose prose-invert max-w-none">
                  <h3 className="text-lg font-semibold text-white mb-3">Right to Modify</h3>
                  <p className="text-gray-300 leading-relaxed mb-4">
                    GameTrust reserves the right to modify these Terms at any time. We will provide notice of significant changes through email, platform notifications, or website announcements.
                  </p>
                  
                  <h3 className="text-lg font-semibold text-white mb-3">Continued Use</h3>
                  <p className="text-gray-300 leading-relaxed mb-4">
                    Continued use of the platform after Terms changes constitutes acceptance of the updated Terms. If you disagree with changes, you must stop using the platform.
                  </p>
                  
                  <h3 className="text-lg font-semibold text-white mb-3">Effective Date</h3>
                  <p className="text-gray-300 leading-relaxed">
                    Updated Terms become effective immediately upon posting unless otherwise specified. We recommend reviewing these Terms periodically for changes.
                  </p>
                </div>
              </Card>
            </section>

            {/* Contact Information */}
            <Card className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-purple-500/20">
              <div className="text-center">
                <h3 className="text-xl font-semibold text-white mb-4">Questions About These Terms?</h3>
                <p className="text-gray-300 mb-6">
                  If you have any questions about these Terms of Service, please contact our legal team.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button 
                    variant="outline"
                    onClick={() => onNavigate('contact')}
                    className="border-purple-500/50 text-purple-400 hover:bg-purple-500/10"
                  >
                    Contact Legal Team
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => onNavigate('help-center')}
                    className="border-blue-500/50 text-blue-400 hover:bg-blue-500/10"
                  >
                    Visit Help Center
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Footer Notice */}
        <Card className="mt-12 bg-gray-800/50">
          <div className="text-center">
            <p className="text-gray-400 text-sm">
              These Terms of Service are governed by the laws of Nigeria. Any disputes will be resolved in Lagos State courts.
              <br />
              GameTrust is operated by GameBox Arena. All rights reserved.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Terms;