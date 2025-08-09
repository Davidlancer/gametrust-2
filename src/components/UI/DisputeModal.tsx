import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  XMarkIcon,
  CloudArrowUpIcon,
  DocumentIcon,
  VideoCameraIcon,
  PhotoIcon,
  TrashIcon
} from '@heroicons/react/24/outline';
import Modal from './Modal';
import Button from './Button';
import { alertUtils } from '../../utils/alertMigration';

interface Order {
  id: string;
  game: string;
  accountTitle: string;
  seller: string;
  price: number;
  status: string;
}

interface DisputeModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order | null;
  onDisputeSubmitted?: (orderId: string) => void;
}

interface UploadedFile {
  id: string;
  file: File;
  preview: string;
  type: 'image' | 'video';
}

const DISPUTE_REASONS = [
  'I did not receive the account details',
  'The login credentials don\'t work',
  'The account was recalled after delivery',
  'The account does not match the listing',
  'Other'
];

const DisputeModal: React.FC<DisputeModalProps> = ({
  isOpen,
  onClose,
  order,
  onDisputeSubmitted
}) => {

  const [selectedReason, setSelectedReason] = useState('');
  const [otherReason, setOtherReason] = useState('');
  const [explanation, setExplanation] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClose = () => {
    setSelectedReason('');
    setOtherReason('');
    setExplanation('');
    setUploadedFiles([]);
    setIsSubmitting(false);
    onClose();
  };

  const handleFileUpload = (files: FileList | null) => {
    if (!files) return;
    
    const newFiles: UploadedFile[] = [];
    const remainingSlots = 3 - uploadedFiles.length;
    
    for (let i = 0; i < Math.min(files.length, remainingSlots); i++) {
      const file = files[i];
      if (file.type.startsWith('image/') || file.type.startsWith('video/')) {
        const preview = URL.createObjectURL(file);
        newFiles.push({
          id: Math.random().toString(36).substr(2, 9),
          file,
          preview,
          type: file.type.startsWith('image/') ? 'image' : 'video'
        });
      }
    }
    
    setUploadedFiles(prev => [...prev, ...newFiles]);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    handleFileUpload(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const removeFile = (fileId: string) => {
    setUploadedFiles(prev => {
      const updated = prev.filter(f => f.id !== fileId);
      // Clean up object URL
      const fileToRemove = prev.find(f => f.id === fileId);
      if (fileToRemove) {
        URL.revokeObjectURL(fileToRemove.preview);
      }
      return updated;
    });
  };

  const isFormValid = selectedReason && (selectedReason !== 'Other' || otherReason.trim());

  const handleSubmit = async () => {
    if (!isFormValid || !order) return;
    
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Store dispute in localStorage for DEVMODE
    const dispute = {
      id: `DISP-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      orderId: order.id,
      reason: selectedReason === 'Other' ? otherReason : selectedReason,
      explanation,
      files: uploadedFiles.map(f => f.file.name),
      submittedAt: new Date().toISOString(),
      status: 'pending'
    };
    
    const existingDisputes = JSON.parse(localStorage.getItem('disputes') || '[]');
    localStorage.setItem('disputes', JSON.stringify([...existingDisputes, dispute]));
    
    alertUtils.success(
      "We'll get back to you within 24 hours."
    );
    
    // Clean up file URLs
    uploadedFiles.forEach(file => URL.revokeObjectURL(file.preview));
    
    onDisputeSubmitted?.(order.id);
    handleClose();
  };

  if (!order) return null;

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="md">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-white">Dispute This Order</h2>
            <p className="text-gray-400 text-sm mt-1">
              Tell us what went wrong so our team can investigate and protect your funds.
            </p>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Order Summary */}
        <div className="bg-gray-800/50 rounded-lg p-4 mb-6">
          <h3 className="text-white font-semibold mb-3">Order Summary</h3>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <span className="text-gray-400">Game:</span>
              <span className="text-white ml-2">{order.game}</span>
            </div>
            <div>
              <span className="text-gray-400">Account Name:</span>
              <span className="text-white ml-2">{order.accountTitle}</span>
            </div>
            <div>
              <span className="text-gray-400">Amount Paid:</span>
              <span className="text-white ml-2">₦{order.price.toLocaleString()}</span>
            </div>
            <div>
              <span className="text-gray-400">Seller Username:</span>
              <span className="text-white ml-2">{order.seller}</span>
            </div>
            <div className="col-span-2">
              <span className="text-gray-400">Order ID:</span>
              <span className="text-white ml-2">#{order.id}</span>
            </div>
          </div>
        </div>

        {/* Dispute Reason */}
        <div className="mb-6">
          <label className="block text-white font-medium mb-2">
            Select a reason for this dispute:
          </label>
          <select
            value={selectedReason}
            onChange={(e) => setSelectedReason(e.target.value)}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            <option value="">Choose a reason...</option>
            {DISPUTE_REASONS.map((reason) => (
              <option key={reason} value={reason}>
                {reason}
              </option>
            ))}
          </select>
          
          {selectedReason === 'Other' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-3"
            >
              <input
                type="text"
                placeholder="Please specify the reason..."
                value={otherReason}
                onChange={(e) => setOtherReason(e.target.value)}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </motion.div>
          )}
        </div>

        {/* File Upload */}
        <div className="mb-6">
          <label className="block text-white font-medium mb-2">
            Upload screenshots or screen recordings
          </label>
          <p className="text-gray-400 text-xs mb-3">
            Include login screens, error messages, or other proof (up to 3 files)
          </p>
          
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
              isDragOver
                ? 'border-indigo-500 bg-indigo-500/10'
                : 'border-gray-600 hover:border-gray-500'
            } ${uploadedFiles.length >= 3 ? 'opacity-50 pointer-events-none' : ''}`}
          >
            <CloudArrowUpIcon className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-400 mb-2">
              Drag & drop files here, or{' '}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-indigo-400 hover:text-indigo-300 underline"
                disabled={uploadedFiles.length >= 3}
              >
                browse
              </button>
            </p>
            <p className="text-xs text-gray-500">
              Images and videos only ({uploadedFiles.length}/3 files)
            </p>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*,video/*"
              onChange={(e) => handleFileUpload(e.target.files)}
              className="hidden"
              disabled={uploadedFiles.length >= 3}
            />
          </div>

          {/* File Previews */}
          {uploadedFiles.length > 0 && (
            <div className="mt-4 grid grid-cols-3 gap-3">
              {uploadedFiles.map((file) => (
                <div key={file.id} className="relative group">
                  <div className="aspect-square bg-gray-800 rounded-lg overflow-hidden">
                    {file.type === 'image' ? (
                      <img
                        src={file.preview}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <VideoCameraIcon className="w-8 h-8 text-gray-400" />
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => removeFile(file.id)}
                    className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <TrashIcon className="w-3 h-3" />
                  </button>
                  <p className="text-xs text-gray-400 mt-1 truncate">
                    {file.file.name}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Explanation */}
        <div className="mb-6">
          <label className="block text-white font-medium mb-2">
            Add Explanation (Optional)
          </label>
          <textarea
            value={explanation}
            onChange={(e) => setExplanation(e.target.value)}
            placeholder="Add any details to help us understand what happened..."
            rows={4}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
          />
        </div>

        {/* Submit Button */}
        <div className="flex justify-end space-x-3">
          <Button
            variant="ghost"
            onClick={handleClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            disabled={!isFormValid || isSubmitting}
            className="bg-red-600 hover:bg-red-700 disabled:bg-gray-600 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Submitting...
              </div>
            ) : (
              'Submit Dispute'
            )}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default DisputeModal;