import React, { useState } from 'react';
import {
  CreditCard,
  CheckCircle2,
  AlertCircle,
  Smartphone,
  Download,
  Printer,
  ChevronRight,
  ShieldCheck,
  Search,
} from 'lucide-react';
import { UserProfile, InvoiceItem } from '../../types';
import { repository } from '../../data/caseRepository';

interface InvoicesPaymentsScreenProps {
  currentUser: UserProfile;
  invoices: InvoiceItem[];
  onNavigate: (screen: string) => void;
}

export const InvoicesPaymentsScreen: React.FC<InvoicesPaymentsScreenProps> = ({
  currentUser,
  invoices,
  onNavigate,
}) => {
  const [selectedInvoice, setSelectedInvoice] = useState<InvoiceItem | null>(invoices[0] || null);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'momo'>('card');
  const [momoNetwork, setMomoNetwork] = useState('MTN Mobile Money');
  const [momoPhone, setMomoPhone] = useState('0244123456');
  const [cardNumber, setCardNumber] = useState('4123 •••• •••• 8891');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);
  const [receiptData, setReceiptData] = useState<any>(null);

  const handlePay = () => {
    if (!selectedInvoice) return;
    setIsProcessing(true);

    setTimeout(() => {
      const confirmNo = `JS-${Math.floor(100 + Math.random() * 900)}-2024`;
      repository.payInvoice(selectedInvoice.invoiceRefNo, confirmNo);

      setReceiptData({
        suitNumber: selectedInvoice.suitNumber || 'CV/0566/2024',
        bankRefNo: `82912143${Math.floor(1000 + Math.random() * 9000)}`,
        branchName: 'Law Court Complex Ecobank Branch (HQ1)',
        caseTitle: selectedInvoice.caseTitle,
        dateOfCollection: new Date().toISOString().replace('T', ' ').slice(0, 19),
        paymentMethod: paymentMethod === 'card' ? 'Visa / Master Debit' : `Mobile Money (${momoNetwork})`,
        amount: selectedInvoice.amount,
        paymentFor: 'Judicial Service of Ghana Filing Assessment',
        transactionStatus: 'Approved',
        confirmationNo: confirmNo,
      });

      setIsProcessing(false);
      setShowReceipt(true);
    }, 800);
  };

  return (
    <div className="space-y-4 pb-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 border-b border-slate-200 gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Invoices & Online Court Payments
          </h2>
          <p className="text-xs text-slate-500">
            e-Justice Ecobank & Ghana.gov Gateway · Filing Assessments, Fines & Service Fees
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left: Invoice List (6 cols) */}
        <div className="lg:col-span-6 bg-white rounded-xl p-4 border border-slate-200 shadow-2xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
              Assessed Invoices ({invoices.length})
            </h4>
            <span className="text-[11px] text-slate-500">Official JSG Assessments</span>
          </div>

          <div className="space-y-2.5">
            {invoices.map((inv) => {
              const isSelected = selectedInvoice?.invoiceRefNo === inv.invoiceRefNo;
              const isPaid = inv.status === 'Payment Done';

              return (
                <div
                  key={inv.invoiceRefNo}
                  onClick={() => {
                    setSelectedInvoice(inv);
                    setShowReceipt(false);
                  }}
                  className={`p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                    isSelected
                      ? 'border-blue-600 bg-blue-50/40 ring-2 ring-blue-100 shadow-xs'
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="font-mono text-blue-700 font-bold text-[11px]">
                        INV #{inv.invoiceRefNo}
                      </span>
                      <h5 className="font-bold text-slate-900 mt-0.5">{inv.caseTitle}</h5>
                      <p className="text-[11px] text-slate-500 font-mono mt-0.5">
                        {inv.suitNumber || 'Pending Suit Assignment'} · Account: {inv.accountNumber}
                      </p>
                    </div>

                    <div className="text-right">
                      <span className="font-bold font-mono text-sm text-slate-900">
                        GHS {inv.amount.toFixed(2)}
                      </span>
                      <span
                        className={`block text-[10px] font-bold px-2 py-0.5 rounded mt-1 text-center ${
                          isPaid
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {isPaid ? 'Payment Complete' : 'Pending Payment'}
                      </span>
                    </div>
                  </div>

                  {inv.paymentConfirmationNo && (
                    <div className="mt-2 pt-2 border-t border-slate-100 text-[10px] text-emerald-700 font-mono flex items-center justify-between">
                      <span>Confirmation No: {inv.paymentConfirmationNo}</span>
                      <span>Paid: {inv.paymentDate}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Payment Form or Certified Receipt (6 cols) */}
        <div className="lg:col-span-6 space-y-4">
          {showReceipt && receiptData ? (
            /* Certified Judicial Receipt matching eJustice manual page 32/42 */
            <div className="bg-white rounded-xl p-6 border-2 border-slate-300 shadow-lg text-slate-800 space-y-4 print:border-none">
              <div className="text-center pb-3 border-b-2 border-slate-800">
                <img src="/jsg-logo.svg" alt="JSG" className="w-14 h-14 mx-auto mb-1" />
                <h3 className="font-serif font-extrabold text-sm uppercase tracking-wider text-slate-900">
                  The Republic of Ghana Judiciary Service Receipt
                </h3>
                <p className="text-[10px] text-slate-500 font-mono mt-0.5">
                  e-Justice Online Payment Confirmation (Ecobank Electronic Clearance)
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-slate-500">Suit Number:</span>
                  <p className="font-bold font-mono text-slate-900">{receiptData.suitNumber}</p>
                </div>
                <div>
                  <span className="text-slate-500">Bank Ref No:</span>
                  <p className="font-bold font-mono text-slate-900">{receiptData.bankRefNo}</p>
                </div>
                <div>
                  <span className="text-slate-500">Branch Name:</span>
                  <p className="font-medium text-slate-800">{receiptData.branchName}</p>
                </div>
                <div>
                  <span className="text-slate-500">Date of Collection:</span>
                  <p className="font-medium font-mono text-slate-800">{receiptData.dateOfCollection}</p>
                </div>
                <div className="col-span-2">
                  <span className="text-slate-500">Case Title:</span>
                  <p className="font-bold text-slate-900">{receiptData.caseTitle}</p>
                </div>
                <div>
                  <span className="text-slate-500">Payment Method:</span>
                  <p className="font-medium text-slate-800">{receiptData.paymentMethod}</p>
                </div>
                <div>
                  <span className="text-slate-500">Amount Paid:</span>
                  <p className="font-extrabold text-base text-emerald-700 font-mono">
                    GHS {receiptData.amount.toFixed(2)}
                  </p>
                </div>
                <div>
                  <span className="text-slate-500">Transaction Status:</span>
                  <p className="font-bold text-emerald-700 flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" /> {receiptData.transactionStatus}
                  </p>
                </div>
                <div>
                  <span className="text-slate-500">Confirmation No:</span>
                  <p className="font-bold font-mono text-blue-800">{receiptData.confirmationNo}</p>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
                <button
                  onClick={() => window.print()}
                  className="px-3 py-1.5 bg-slate-900 text-white rounded text-xs font-semibold flex items-center gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Official Receipt</span>
                </button>
                <button
                  onClick={() => setShowReceipt(false)}
                  className="text-xs text-blue-700 font-semibold hover:underline"
                >
                  Done
                </button>
              </div>
            </div>
          ) : selectedInvoice ? (
            /* Ecobank Ghana.gov Payment Portal Checkout matching manual pages 29-34 */
            <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-2xs space-y-4">
              <div className="pb-3 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                    Ecobank Payment Portal
                  </h4>
                  <p className="text-[11px] text-slate-500">Ghana Judicial Service Authorized Gateway</p>
                </div>
                <span className="text-xs font-bold font-mono bg-blue-50 text-blue-700 px-2 py-0.5 rounded border border-blue-200">
                  GHS {selectedInvoice.amount.toFixed(2)}
                </span>
              </div>

              {/* Invoice Confirmation Details */}
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-500">Invoice Number:</span>
                  <strong className="font-mono">{selectedInvoice.invoiceRefNo}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Case Title:</span>
                  <strong className="truncate max-w-[200px]">{selectedInvoice.caseTitle}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Category:</span>
                  <strong>{selectedInvoice.category}</strong>
                </div>
              </div>

              {/* Payment Method Selector */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2">
                  Select Payment Method:
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={`p-3 rounded-xl border flex flex-col items-center text-center transition-all ${
                      paymentMethod === 'card'
                        ? 'border-blue-600 bg-blue-50/50 text-blue-900 font-bold ring-2 ring-blue-100'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <CreditCard className="w-5 h-5 mb-1 text-blue-600" />
                    <span className="text-xs">Debit Card</span>
                    <span className="text-[10px] text-slate-400">Visa / Mastercard</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('momo')}
                    className={`p-3 rounded-xl border flex flex-col items-center text-center transition-all ${
                      paymentMethod === 'momo'
                        ? 'border-amber-600 bg-amber-50/50 text-amber-900 font-bold ring-2 ring-amber-100'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <Smartphone className="w-5 h-5 mb-1 text-amber-600" />
                    <span className="text-xs">Mobile Money</span>
                    <span className="text-[10px] text-slate-400">MTN / Telecel / AT</span>
                  </button>
                </div>
              </div>

              {/* Method Specific Fields */}
              {paymentMethod === 'momo' ? (
                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Network</label>
                    <select
                      value={momoNetwork}
                      onChange={(e) => setMomoNetwork(e.target.value)}
                      className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg"
                    >
                      <option>MTN Mobile Money</option>
                      <option>Telecel Cash (Vodafone)</option>
                      <option>AT Money (AirtelTigo)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Mobile Wallet Number</label>
                    <input
                      type="text"
                      value={momoPhone}
                      onChange={(e) => setMomoPhone(e.target.value)}
                      className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg font-mono"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Card Number</label>
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg font-mono"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <input type="text" defaultValue="08 / 28" className="p-2 bg-slate-50 border border-slate-300 rounded-lg text-center" />
                    <input type="password" defaultValue="•••" className="p-2 bg-slate-50 border border-slate-300 rounded-lg text-center" />
                  </div>
                </div>
              )}

              {/* Pay Button */}
              <button
                disabled={isProcessing || selectedInvoice.status === 'Payment Done'}
                onClick={handlePay}
                className="w-full py-2.5 px-4 bg-[#14366A] hover:bg-[#0E264D] disabled:opacity-50 text-white text-xs font-bold rounded-lg shadow-md transition-colors flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <span>Processing Ecobank Ghana Clearance...</span>
                ) : selectedInvoice.status === 'Payment Done' ? (
                  <span>Already Paid (Click to View Receipt)</span>
                ) : (
                  <span>Authorize Payment of GHS {selectedInvoice.amount.toFixed(2)}</span>
                )}
              </button>

              <div className="flex items-center justify-center gap-2 text-[10px] text-slate-400">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Protected by Ecobank 3D Secure & Bank of Ghana e-Payment Regulations</span>
              </div>
            </div>
          ) : (
            <div className="p-6 bg-white rounded-xl border text-center text-slate-400 text-xs">
              Select an invoice on the left to initiate clearance.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
