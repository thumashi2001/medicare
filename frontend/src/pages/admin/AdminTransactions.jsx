import "./adminTransactions.css";

const transactionData = [
  { id: 1, patient: "Nethasa N", amount: "Rs. 3,500.00", method: "Card", status: "Completed", date: "16/04/2026" },
  { id: 2, patient: "Thumashi W", amount: "Rs. 2,000.00", method: "Cash", status: "Completed", date: "16/04/2026" },
  { id: 3, patient: "Suwani P", amount: "Rs. 4,750.00", method: "Card", status: "Pending", date: "15/04/2026" }
];

export default function AdminTransactions() {
  const totalAmount = transactionData.reduce((sum, item) => {
    const numeric = Number(item.amount.replace(/[^\d.]/g, ""));
    return sum + numeric;
  }, 0);

  return (
    <div className="admin-transactions-page">
      <h2>Transactions</h2>
      <p>Monitor financial transactions across the platform</p>

      <div className="transaction-summary-grid">
        <div className="transaction-summary-card">
          <h4>Total Transactions</h4>
          <h3>{transactionData.length}</h3>
        </div>
        <div className="transaction-summary-card">
          <h4>Total Amount</h4>
          <h3>Rs. {totalAmount.toLocaleString()}.00</h3>
        </div>
        <div className="transaction-summary-card">
          <h4>Completed Payments</h4>
          <h3>{transactionData.filter((t) => t.status === "Completed").length}</h3>
        </div>
        <div className="transaction-summary-card">
          <h4>Pending Payments</h4>
          <h3 className="warning">{transactionData.filter((t) => t.status === "Pending").length}</h3>
        </div>
      </div>

      <div className="transactions-table-card">
        <table className="transactions-table">
          <thead>
            <tr>
              <th>Patient</th>
              <th>Amount</th>
              <th>Method</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {transactionData.map((item) => (
              <tr key={item.id}>
                <td>{item.patient}</td>
                <td>{item.amount}</td>
                <td>{item.method}</td>
                <td>
                  <span className={item.status === "Completed" ? "payment-status completed" : "payment-status pending"}>
                    {item.status}
                  </span>
                </td>
                <td>{item.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
