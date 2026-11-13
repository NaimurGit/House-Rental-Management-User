
import { useEffect, useState } from "react";

const MonthlyChargeModal = ({
  isOpen,
  onClose,
  apartment,
  month,
  year,
  monthlyCharge,
  onSave,
}) => {
  const [rent, setRent] = useState(0);
  const [water, setWater] = useState(0);
  const [garbage, setGarbage] = useState(0);
  const [service, setService] = useState(0);
  const [saving, setSaving] = useState(false);

  const monthName = new Date(year, month).toLocaleString(
    "en-US",
    { month: "long" }
  );

  useEffect(() => {
    if (isOpen) {
      setRent(monthlyCharge?.rent ?? 0);
      setWater(monthlyCharge?.water ?? 0);
      setGarbage(monthlyCharge?.garbage ?? 0);
      setService(monthlyCharge?.service ?? 0);
    }
  }, [isOpen, monthlyCharge]);

  if (!isOpen || !apartment) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    const chargeData = {
      apartmentId: apartment.id,
      month,
      year,
      rent: Number(rent),
      water: Number(water),
      garbage: Number(garbage),
      service: Number(service),
    };

    try {
      setSaving(true);
      await onSave(chargeData);
      onClose();
    } catch (error) {
      console.error("Failed to save monthly charges:", error);
    } finally {
      setSaving(false);
    }
  };

  const fields = [
    { label: "House Rent", value: rent, setter: setRent },
    { label: "Water Bill", value: water, setter: setWater },
    { label: "Garbage Bill", value: garbage, setter: setGarbage },
    { label: "Service Charge", value: service, setter: setService },
  ];

  return (
    <div className="modal modal-open">
      <div className="modal-box max-w-md">
        <h3 className="text-xl font-bold mb-1">
          Monthly Charges
        </h3>

        <p className="text-sm text-base-content/60 mb-5">
          {apartment.name} · {monthName} {year}
        </p>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            {fields.map((field) => (
              <div key={field.label}>
                <label className="label">
                  <span className="label-text font-medium">
                    {field.label}
                  </span>
                </label>

                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={field.value}
                  onChange={(e) => field.setter(e.target.value)}
                  className="input input-bordered w-full"
                  required
                />
              </div>
            ))}
          </div>

          <div className="modal-action">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-ghost"
              disabled={saving}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={saving}
            >
              {saving ? "Saving..." : "Save Charges"}
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

export default MonthlyChargeModal;
