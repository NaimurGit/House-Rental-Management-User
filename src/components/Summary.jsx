
function Summary({ payments, spendings, due }) {
  return (
    <div className="flex flex-wrap gap-x-6 gap-y-2 my-7 text-lg">

      <p className="text-base-content/70">
        Payments{" "}
        <span className="font-bold text-base-content">
          ৳{payments.toLocaleString("en-US")}
        </span>
      </p>

      <p className="text-base-content/70">
        Spendings{" "}
        <span className="font-bold text-base-content">
          ৳{spendings.toLocaleString("en-US")}
        </span>
      </p>

      <p className="text-base-content/70">
        Due{" "}
        <span className="font-bold text-error">
          ৳{due.toLocaleString("en-US")}
        </span>
      </p>

    </div>
  );
}

export default Summary;
