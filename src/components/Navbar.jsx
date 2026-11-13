
function Navbar() {
  return (
    <div className="navbar bg-base-100 px-6 border-b border-base-200">
      <div className="flex-1">
        <h1 className="text-xl font-bold">
          Rent Management
        </h1>
      </div>

      <div className="flex gap-3">
        <button className="btn btn-ghost btn-sm">
          Dashboard
        </button>

        <button className="btn btn-ghost btn-sm">
          Apartments
        </button>

        <button className="btn btn-ghost btn-sm">
          Profile
        </button>
      </div>
    </div>
  );
}

export default Navbar;
