
import { useState } from "react";
import { showWarning } from "../utils/swal";

const getToday = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const TransactionModal = ({
  type,
  apartment,
  onClose,
  onSave,
}) => {
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(getToday());
  const [description, setDescription] = useState("");
  const [method, setMethod] = useState("Cash");
  const [category, setCategory] = useState("Maintenance");

  const isPayment = type === "payment";

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!amount || Number(amount) <= 0 || !date) {
      showWarning("Please enter a valid amount and date.");
      return;
    }

    const transaction = {
      id: Date.now(),
      apartmentId: apartment.id,
      apartmentName: apartment.name,
      amount: Number(amount),
      date,
      description: description.trim(),
      ...(isPayment ? { method } : { category }),
    };

    onSave(transaction);
  };

  return (
    <div className="modal modal-open">
      <div className="modal-box max-w-md">
        <h3 className="text-xl font-bold mb-1">
          {isPayment ? "Add Payment" : "Add Spending"}
        </h3>

        <p className="text-sm text-base-content/60 mb-5">
          {apartment.name}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Amount */}
          <div>
            <label className="label">
              <span className="label-text font-medium">
                Amount (৳)
              </span>
            </label>

            <input
              type="number"
              min="1"
              step="0.01"
              placeholder="Enter amount"
              className="input input-bordered w-full"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>

          {/* Date */}
          <div>
            <label className="label">
              <span className="label-text font-medium">
                Date
              </span>
            </label>

            <input
              type="date"
              className="input input-bordered w-full"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>

          {/* Payment Method */}
          {isPayment ? (
            <div>
              <label className="label">
                <span className="label-text font-medium">
                  Payment Method
                </span>
              </label>

              <select
                className="select select-bordered w-full"
                value={method}
                onChange={(e) => setMethod(e.target.value)}
              >
                <option value="Cash">Cash</option>
                <option value="Bank Transfer">Bank Transfer</option>
                <option value="bKash">bKash</option>
                <option value="Nagad">Nagad</option>
                <option value="Rocket">Rocket</option>
              </select>
            </div>
          ) : (
            <div>
              <label className="label">
                <span className="label-text font-medium">
                  Spending Category
                </span>
              </label>

              <select
                className="select select-bordered w-full"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="Maintenance">Maintenance</option>
                <option value="Repair">Repair</option>
                <option value="Electricity">Electricity</option>
                <option value="Water">Water</option>
                <option value="Cleaning">Cleaning</option>
                <option value="Other">Other</option>
              </select>
            </div>
          )}

          {/* Description */}
          <div>
            <label className="label">
              <span className="label-text font-medium">
                Description (Optional)
              </span>
            </label>

            <textarea
              className="textarea textarea-bordered w-full"
              placeholder={
                isPayment
                  ? "Payment details..."
                  : "What was this spending for?"
              }
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          {/* Buttons */}
          <div className="modal-action">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-ghost"
            >
              Cancel
            </button>

            <button type="submit" className="btn btn-primary">
              {isPayment ? "Save Payment" : "Save Spending"}
            </button>
          </div>

        </form>
      </div>

      <button
        type="button"
        className="modal-backdrop"
        onClick={onClose}
        aria-label="Close modal"
      >
        Close
      </button>
    </div>
  );
};

export default TransactionModal;
