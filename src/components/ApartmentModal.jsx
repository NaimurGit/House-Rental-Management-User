import React, { useState} from "react";
function ApartmentModal({
  isOpen,
  onClose,
  onSave,
  apartment
}) {
  const [formData, setFormData] = useState(() => ({
    name: apartment?.name || "",
    rent: apartment?.rent ?? "",
    water: apartment?.water ?? "",
    garbage: apartment?.garbage ?? "",
    service: apartment?.service ?? ""
  }));

  React.useEffect(() => {
    if (apartment) {
      setFormData({
        name: apartment.name,
        rent: apartment.rent,
        water: apartment.water,
        garbage: apartment.garbage,
        service: apartment.service
      });
    } else {
      setFormData({
        name: "",
        rent: "",
        water: "",
        garbage: "",
        service: ""
      });
    }
  }, [apartment, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const apartmentData = {
      name: formData.name.trim(),
      rent: Number(formData.rent),
      water: Number(formData.water),
      garbage: Number(formData.garbage),
      service: Number(formData.service)
    };

    if (
      !apartmentData.name ||
      !Number.isFinite(apartmentData.rent) ||
      apartmentData.rent <= 0 ||
      !Number.isFinite(apartmentData.water) ||
      apartmentData.water < 0 ||
      !Number.isFinite(apartmentData.garbage) ||
      apartmentData.garbage < 0 ||
      !Number.isFinite(apartmentData.service) ||
      apartmentData.service < 0
    ) {
      alert("Please enter valid apartment information.");
      return;
    }

    onSave(apartmentData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <dialog open className="modal modal-open">
      <div className="modal-box max-w-lg">

        <h3 className="font-bold text-xl mb-5">
          {apartment ? "Edit Apartment" : "Add Apartment"}
        </h3>

        <form onSubmit={handleSubmit}>

          <div className="space-y-3">

            <label className="form-control w-full">
              <span className="label-text mb-1">
                Apartment Name
              </span>
              <input
                type="text"
                name="name"
                placeholder="Example: 1A"
                className="input input-bordered w-full"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </label>

            <label className="form-control w-full">
              <span className="label-text mb-1">Rent</span>
              <input
                type="number"
                name="rent"
                min="1"
                className="input input-bordered w-full"
                value={formData.rent}
                onChange={handleChange}
                required
              />
            </label>

            <label className="form-control w-full">
              <span className="label-text mb-1">Water Bill</span>
              <input
                type="number"
                name="water"
                min="0"
                className="input input-bordered w-full"
                value={formData.water}
                onChange={handleChange}
                required
              />
            </label>

            <label className="form-control w-full">
              <span className="label-text mb-1">Garbage Bill</span>
              <input
                type="number"
                name="garbage"
                min="0"
                className="input input-bordered w-full"
                value={formData.garbage}
                onChange={handleChange}
                required
              />
            </label>

            <label className="form-control w-full">
              <span className="label-text mb-1">
                Service Charge
              </span>
              <input
                type="number"
                name="service"
                min="0"
                className="input input-bordered w-full"
                value={formData.service}
                onChange={handleChange}
                required
              />
            </label>

          </div>

          <div className="modal-action">

            <button
              type="button"
              className="btn"
              onClick={onClose}
            >
              Cancel
            </button>

            <button type="submit" className="btn btn-primary">
              {apartment ? "Update Apartment" : "Add Apartment"}
            </button>

          </div>

        </form>
      </div>

      <div
        className="modal-backdrop"
        onClick={onClose}
      >
        <button type="button">close</button>
      </div>
    </dialog>
  );
}

export default ApartmentModal;
