import React, { useState, useEffect, useContext, useCallback } from "react";
import AddStore from "../components/AddStore";
import AuthContext from "../AuthContext";

function Store() {
  const [showModal, setShowModal] = useState(false);
  const [stores, setAllStores] = useState([]);

  const authContext = useContext(AuthContext);

  // ✅ Memoized fetch function to avoid useEffect lint warning
  const fetchData = useCallback(() => {
    fetch(`http://localhost:4000/api/store/get/${authContext.user}`)
      .then((response) => response.json())
      .then((data) => {
        setAllStores(data);
      })
      .catch((err) => console.log(err));
  }, [authContext.user]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const modalSetting = () => {
    setShowModal(!showModal);
  };

  return (
    <div className="col-span-12 lg:col-span-10 flex justify-center">
      <div className="flex flex-col gap-5 w-11/12 border-2 p-4">
        {/* Header */}
        <div className="flex justify-between items-center">
          <span className="font-bold text-lg">Manage Store</span>
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold p-2 text-xs rounded"
            onClick={modalSetting}
          >
            Add Store
          </button>
        </div>

        {/* Modal */}
        {showModal && <AddStore />}

        {/* Store Cards */}
        {stores.map((element) => (
          <div
            className="bg-white w-full sm:w-96 rounded-lg shadow p-4"
            key={element._id}
          >
            <img
              alt="store"
              className="h-60 w-full object-cover rounded-md"
              src={element.image}
            />
            <div className="mt-4 flex flex-col gap-2">
              <span className="font-bold text-md">{element.name}</span>
              <div className="flex items-center gap-2 text-gray-600">
                <img
                  alt="location-icon"
                  className="h-5 w-5"
                  src={require("../assets/location-icon.png")}
                />
                <span className="text-sm">
                  {`${element.address}, ${element.city}`}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Store;
