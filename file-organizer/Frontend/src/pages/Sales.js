import React, { useState, useEffect, useContext, useCallback } from "react";
import AddSale from "../components/AddSale";
import AuthContext from "../AuthContext";

function Sales() {
  const [showSaleModal, setShowSaleModal] = useState(false);
  const [sales, setAllSalesData] = useState([]);
  const [products, setAllProducts] = useState([]);
  const [stores, setAllStores] = useState([]);
  const [updatePage, setUpdatePage] = useState(true);

  const authContext = useContext(AuthContext);

  // 🔁 Memoized fetch functions to fix useEffect dependency warnings
  const fetchSalesData = useCallback(() => {
    fetch(`http://localhost:4000/api/sales/get/${authContext.user}`)
      .then((response) => response.json())
      .then((data) => {
        setAllSalesData(data);
      })
      .catch((err) => console.log(err));
  }, [authContext.user]);

  const fetchProductsData = useCallback(() => {
    fetch(`http://localhost:4000/api/product/get/${authContext.user}`)
      .then((response) => response.json())
      .then((data) => {
        setAllProducts(data);
      })
      .catch((err) => console.log(err));
  }, [authContext.user]);

  const fetchStoresData = useCallback(() => {
    fetch(`http://localhost:4000/api/store/get/${authContext.user}`)
      .then((response) => response.json())
      .then((data) => {
        setAllStores(data);
      });
  }, [authContext.user]);

  useEffect(() => {
    fetchSalesData();
    fetchProductsData();
    fetchStoresData();
  }, [updatePage, fetchSalesData, fetchProductsData, fetchStoresData]);

  const addSaleModalSetting = () => {
    setShowSaleModal(!showSaleModal);
  };

  const handlePageUpdate = () => {
    setUpdatePage(!updatePage);
  };

  return (
    <div className="col-span-12 lg:col-span-10 flex justify-center">
      <div className="flex flex-col gap-5 w-11/12">
        {showSaleModal && (
          <AddSale
            addSaleModalSetting={addSaleModalSetting}
            products={products}
            stores={stores}
            handlePageUpdate={handlePageUpdate}
            authContext={authContext}
          />
        )}

        {/* Table */}
        <div className="overflow-x-auto rounded-lg border bg-white border-gray-200">
          <div className="flex justify-between pt-5 pb-3 px-3">
            <div className="flex gap-4 justify-center items-center">
              <span className="font-bold">Sales</span>
            </div>
            <div className="flex gap-4">
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold p-2 text-xs rounded"
                onClick={addSaleModalSetting}
              >
                Add Sales
              </button>
            </div>
          </div>

          <table className="min-w-full divide-y-2 divide-gray-200 text-sm">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left font-medium text-gray-900">
                  Product Name
                </th>
                <th className="px-4 py-2 text-left font-medium text-gray-900">
                  Store Name
                </th>
                <th className="px-4 py-2 text-left font-medium text-gray-900">
                  Stock Sold
                </th>
                <th className="px-4 py-2 text-left font-medium text-gray-900">
                  Sales Date
                </th>
                <th className="px-4 py-2 text-left font-medium text-gray-900">
                  Total Sale Amount
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {sales.map((element) => (
                <tr key={element._id}>
                  <td className="px-4 py-2 text-gray-900">
                    {element.ProductID?.name}
                  </td>
                  <td className="px-4 py-2 text-gray-700">
                    {element.StoreID?.name}
                  </td>
                  <td className="px-4 py-2 text-gray-700">
                    {element.StockSold}
                  </td>
                  <td className="px-4 py-2 text-gray-700">
                    {new Date(element.SaleDate).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-2 text-gray-700">
                    ${element.TotalSaleAmount}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Sales;
