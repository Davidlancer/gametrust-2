interface Transaction {
  id: string;
  type: 'purchase' | 'sale' | 'escrow_hold' | 'withdrawal' | 'refund' | 'in_escrow';
  amount: number;
  status: 'completed' | 'pending' | 'failed' | 'in_escrow';
  date: string;
  relatedListing?: {
    title: string;
    listingId: string;
  } | null;
  counterparty?: {
    username: string;
    userId: string;
  } | null;
  reference: string;
  bankDetails?: string;
}

// PDF generation utility using browser's print functionality
export const generateTransactionPDF = async (transaction: Transaction) => {
  // Create a new window with the transaction data
  const printWindow = window.open('', '_blank');
  if (!printWindow) return;
  
  const htmlContent = generatePDFContent(transaction);
  printWindow.document.write(htmlContent);
  printWindow.document.close();
  
  // Wait for content to load, then print
  printWindow.onload = () => {
    printWindow.print();
    printWindow.close();
  };
};

// Generate HTML content for PDF
const generatePDFContent = (transaction: Transaction): string => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <title>GameTrust Transaction Statement - ${transaction.id}</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          margin: 40px;
          color: #333;
        }
        .header {
          text-align: center;
          margin-bottom: 40px;
          border-bottom: 2px solid #007bff;
          padding-bottom: 20px;
        }
        .header h1 {
          margin: 0;
          color: #007bff;
          font-size: 24px;
        }
        .header p {
          margin: 5px 0 0 0;
          color: #666;
        }
        .section {
          margin-bottom: 30px;
        }
        .section h2 {
          color: #333;
          border-bottom: 1px solid #ddd;
          padding-bottom: 5px;
          margin-bottom: 15px;
        }
        .detail-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 8px;
          padding: 5px 0;
        }
        .detail-row:nth-child(even) {
          background-color: #f9f9f9;
        }
        .label {
          font-weight: bold;
          color: #555;
        }
        .value {
          color: #333;
        }
        .amount {
          font-size: 18px;
          font-weight: bold;
          color: ${transaction.amount > 0 ? '#28a745' : '#dc3545'};
        }
        .footer {
          margin-top: 40px;
          text-align: center;
          font-size: 12px;
          color: #666;
          border-top: 1px solid #ddd;
          padding-top: 20px;
        }
        @media print {
          body { margin: 20px; }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>GameTrust Transaction Statement</h1>
        <p>Secure Gaming Account Marketplace</p>
      </div>
      
      <div class="section">
        <h2>Transaction Details</h2>
        <div class="detail-row">
          <span class="label">Transaction ID:</span>
          <span class="value">${transaction.id}</span>
        </div>
        <div class="detail-row">
          <span class="label">Reference:</span>
          <span class="value">${transaction.reference}</span>
        </div>
        <div class="detail-row">
          <span class="label">Type:</span>
          <span class="value">${getTransactionTypeLabel(transaction.type)}</span>
        </div>
        <div class="detail-row">
          <span class="label">Amount:</span>
          <span class="value amount">₦${Math.abs(transaction.amount).toLocaleString()}</span>
        </div>
        <div class="detail-row">
          <span class="label">Status:</span>
          <span class="value">${transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}</span>
        </div>
        <div class="detail-row">
          <span class="label">Date & Time:</span>
          <span class="value">${new Date(transaction.date).toLocaleString()}</span>
        </div>
        <div class="detail-row">
          <span class="label">Payment Method:</span>
          <span class="value">${getPaymentMethod(transaction)}</span>
        </div>
      </div>
      
      ${(transaction.relatedListing || transaction.counterparty || transaction.bankDetails) ? `
        <div class="section">
          <h2>Related Information</h2>
          ${transaction.relatedListing ? `
            <div class="detail-row">
              <span class="label">Listing:</span>
              <span class="value">${transaction.relatedListing.title}</span>
            </div>
            <div class="detail-row">
              <span class="label">Listing ID:</span>
              <span class="value">${transaction.relatedListing.listingId}</span>
            </div>
          ` : ''}
          ${transaction.counterparty ? `
            <div class="detail-row">
              <span class="label">Counterparty:</span>
              <span class="value">@${transaction.counterparty.username}</span>
            </div>
            <div class="detail-row">
              <span class="label">User ID:</span>
              <span class="value">${transaction.counterparty.userId}</span>
            </div>
          ` : ''}
          ${transaction.bankDetails ? `
            <div class="detail-row">
              <span class="label">Bank Details:</span>
              <span class="value">${transaction.bankDetails}</span>
            </div>
          ` : ''}
        </div>
      ` : ''}
      
      <div class="footer">
        <p>This is an official transaction statement from GameTrust</p>
        <p>Generated on ${new Date().toLocaleString()}</p>
      </div>
    </body>
    </html>
  `;
};

// Alternative: Download as text file if print doesn't work
export const downloadTransactionStatement = (transaction: Transaction) => {
  const content = `
GameTrust Transaction Statement
==============================

Transaction Details:
- ID: ${transaction.id}
- Reference: ${transaction.reference}
- Type: ${getTransactionTypeLabel(transaction.type)}
- Amount: ₦${Math.abs(transaction.amount).toLocaleString()}
- Status: ${transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
- Date: ${new Date(transaction.date).toLocaleString()}
- Payment Method: ${getPaymentMethod(transaction)}

${(transaction.relatedListing || transaction.counterparty || transaction.bankDetails) ? `
Related Information:
${transaction.relatedListing ? `- Listing: ${transaction.relatedListing.title}
- Listing ID: ${transaction.relatedListing.listingId}
` : ''}${transaction.counterparty ? `- Counterparty: @${transaction.counterparty.username}
- User ID: ${transaction.counterparty.userId}
` : ''}${transaction.bankDetails ? `- Bank Details: ${transaction.bankDetails}
` : ''}
` : ''}

Generated on ${new Date().toLocaleString()}
GameTrust - Secure Gaming Account Marketplace
  `;
  
  const blob = new Blob([content], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `GameTrust_Transaction_${transaction.id}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

// Main PDF generation function that tries print first, falls back to download
export const generateTransactionPDFMain = async (transaction: Transaction) => {
  try {
    await generateTransactionPDF(transaction);
  } catch (error) {
    console.warn('Print failed, falling back to text download:', error);
    downloadTransactionStatement(transaction);
  }
};

// Bank redirect utility
export const redirectToBankPortal = (transaction: Transaction): boolean => {
  // Check if transaction has bank details or is a withdrawal
  if (!transaction.bankDetails && transaction.type !== 'withdrawal') {
    return false;
  }
  
  // In a real application, this would use the actual bank API
  // For now, we'll simulate different bank portals based on transaction reference
  const bankPortals = {
    'GTB': 'https://ibank.gtbank.com',
    'UBA': 'https://www.ubaafrica.com/ng/personal/e-banking',
    'FBN': 'https://firstbankonline.com',
    'ZEN': 'https://www.zenithbank.com/internet-banking',
    'ACC': 'https://online.accessbankplc.com'
  };
  
  // Extract bank code from reference (first 3 characters)
  const bankCode = transaction.reference.substring(0, 3).toUpperCase();
  const bankUrl = bankPortals[bankCode as keyof typeof bankPortals] || bankPortals.GTB;
  
  // Add transaction reference as query parameter
  const fullUrl = `${bankUrl}?ref=${encodeURIComponent(transaction.reference)}`;
  
  // Open in new tab
  window.open(fullUrl, '_blank', 'noopener,noreferrer');
  return true;
};

// Report transaction issue
export const reportTransactionIssue = async (transactionId: string, message: string): Promise<void> => {
  // Simulate API call
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() > 0.1) { // 90% success rate
        console.log(`Issue reported for transaction ${transactionId}:`, message);
        resolve();
      } else {
        reject(new Error('Failed to submit issue report'));
      }
    }, 1500);
  });
};

// Utility functions
const getTransactionTypeLabel = (type: string): string => {
  switch (type) {
    case 'purchase': return 'Account Purchase';
    case 'sale': return 'Account Sale';
    case 'withdrawal': return 'Withdrawal';
    case 'refund': return 'Refund';
    case 'escrow_hold': return 'Escrow Hold';
    case 'in_escrow': return 'In Escrow';
    default: return 'Transaction';
  }
};

const getPaymentMethod = (transaction: Transaction): string => {
  if (transaction.bankDetails) return 'Bank Transfer';
  if (transaction.type === 'withdrawal') return 'Bank Transfer';
  if (transaction.type === 'purchase' || transaction.type === 'sale') return 'Escrow System';
  return 'Platform Wallet';
};

import { alertUtils } from './alertMigration';

// Toast notification utility using SimpleToast
export const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
  switch (type) {
    case 'success':
      alertUtils.success(message);
      break;
    case 'error':
      alertUtils.error(message);
      break;
    case 'info':
      alertUtils.info(message);
      break;
    default:
      alertUtils.info(message);
  }
};