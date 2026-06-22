import { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { IndianRupee, Download, CheckCircle, CreditCard, FileText } from 'lucide-react';

const FeePortal = () => {
  const { themeColor } = useOutletContext<any>();
  const [paymentData, setPaymentData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const res = await fetch('https://shri-shirdi-sai-group-of-institutions.onrender.com/api/finance/my-payments', {
        headers: { 'x-auth-token': localStorage.getItem('token') || '' }
      });
      if (res.ok) {
        const data = await res.json();
        setPaymentData(data);
      }
    } catch (err) { console.error(err); }
  };

  const handlePayment = async (amount: number, installmentId?: string) => {
    setLoading(true);
    try {
      // Simulating Payment Gateway
      setTimeout(async () => {
        const res = await fetch('https://shri-shirdi-sai-group-of-institutions.onrender.com/api/finance/pay', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'x-auth-token': localStorage.getItem('token') || '' },
          body: JSON.stringify({ amount, method: 'Credit Card', installmentId })
        });
        if (res.ok) fetchPayments();
        setLoading(false);
      }, 1500);
    } catch (err) { setLoading(false); }
  };

  if (!paymentData) return (
    <div className="p-8 text-center">
      <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <IndianRupee className="w-8 h-8 text-slate-400" />
      </div>
      <h2 className="text-xl font-bold text-slate-800 mb-2">No Fee Records Found</h2>
      <p className="text-slate-500">Your admission might still be under review or a fee structure hasn't been assigned yet.</p>
    </div>
  );

  const balance = paymentData.totalAmountDue - paymentData.totalAmountPaid;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-black text-gray-900">Fee Portal</h1>
          <p className="text-gray-500 font-medium">Manage your tuition fees and download receipts.</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
          <p className="text-sm font-bold text-slate-500 uppercase mb-2">Total Program Fee</p>
          <p className="text-3xl font-black text-slate-800 font-mono">₹{paymentData.totalAmountDue.toLocaleString()}</p>
        </div>
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
          <p className="text-sm font-bold text-emerald-600 uppercase mb-2">Amount Paid</p>
          <p className="text-3xl font-black text-emerald-600 font-mono">₹{paymentData.totalAmountPaid.toLocaleString()}</p>
        </div>
        <div className={`p-6 rounded-3xl shadow-sm border ${balance <= 0 ? 'bg-emerald-50 border-emerald-200' : 'bg-rose-50 border-rose-200'}`}>
          <p className={`text-sm font-bold uppercase mb-2 ${balance <= 0 ? 'text-emerald-700' : 'text-rose-700'}`}>Pending Balance</p>
          <p className={`text-3xl font-black font-mono ${balance <= 0 ? 'text-emerald-700' : 'text-rose-700'}`}>₹{balance.toLocaleString()}</p>
          {balance <= 0 && <p className="text-xs font-bold text-emerald-600 mt-2 flex items-center"><CheckCircle className="w-4 h-4 mr-1"/> Fully Cleared</p>}
        </div>
      </div>

      {/* Payment Action & Installments */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <h2 className="text-lg font-bold text-slate-800 flex items-center"><CreditCard className="w-5 h-5 mr-2 text-indigo-600"/> Payment Schedule ({paymentData.paymentPlan})</h2>
          {balance > 0 && paymentData.paymentPlan === 'One-time' && (
             <button 
                onClick={() => handlePayment(balance)}
                disabled={loading}
                className={`bg-${themeColor}-600 hover:bg-${themeColor}-700 text-white px-6 py-2 rounded-xl font-bold transition-colors flex items-center shadow-md disabled:opacity-50`}
             >
               {loading ? 'Processing...' : `Pay ₹${balance.toLocaleString()} Now`}
             </button>
          )}
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {paymentData.installments.map((inst: any, idx: number) => (
              <div key={inst._id} className="flex flex-col md:flex-row justify-between md:items-center p-4 border border-slate-200 rounded-2xl bg-white hover:border-slate-300 transition-colors">
                <div className="mb-4 md:mb-0">
                  <h3 className="font-bold text-slate-800">Installment {idx + 1}</h3>
                  <p className="text-sm text-slate-500 font-medium mt-1">Due: {new Date(inst.dueDate).toLocaleDateString()}</p>
                </div>
                <div className="flex items-center gap-6">
                  <span className="text-xl font-black font-mono text-slate-800">₹{inst.amount.toLocaleString()}</span>
                  {inst.status === 'Paid' ? (
                    <span className="px-3 py-1.5 bg-emerald-100 text-emerald-700 text-xs font-bold rounded flex items-center"><CheckCircle className="w-4 h-4 mr-1"/> Paid on {new Date(inst.paidDate).toLocaleDateString()}</span>
                  ) : (
                    <button 
                      onClick={() => handlePayment(inst.amount, inst._id)}
                      disabled={loading}
                      className={`px-4 py-2 bg-${themeColor}-600 text-white text-sm font-bold rounded-xl shadow-sm hover:opacity-90 disabled:opacity-50 transition-opacity`}
                    >
                      {loading ? 'Processing...' : 'Pay Now'}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Transaction History */}
      {paymentData.transactions.length > 0 && (
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden mt-6">
          <div className="p-6 border-b border-slate-100 bg-slate-50">
            <h2 className="text-lg font-bold text-slate-800 flex items-center"><FileText className="w-5 h-5 mr-2 text-blue-600"/> Transaction History & Receipts</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-200 text-xs font-bold text-slate-500 uppercase">
                  <th className="p-4">Transaction ID</th>
                  <th className="p-4">Date</th>
                  <th className="p-4">Method</th>
                  <th className="p-4">Amount</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Receipt</th>
                </tr>
              </thead>
              <tbody>
                {paymentData.transactions.map((tx: any) => (
                  <tr key={tx._id} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="p-4 font-mono font-medium text-slate-600">{tx.transactionId}</td>
                    <td className="p-4 text-sm font-medium text-slate-700">{new Date(tx.date).toLocaleString()}</td>
                    <td className="p-4 text-sm font-medium text-slate-700">{tx.method}</td>
                    <td className="p-4 font-mono font-bold text-emerald-600">₹{tx.amount.toLocaleString()}</td>
                    <td className="p-4">
                      <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded">{tx.status}</span>
                    </td>
                    <td className="p-4">
                      <button className="text-blue-600 hover:text-blue-800 font-bold text-sm flex items-center">
                        <Download className="w-4 h-4 mr-1" /> PDF
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default FeePortal;
