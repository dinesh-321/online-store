import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useAppContext } from '../../context/AppContext'

const SellerList = () => {

  const { axios } = useAppContext();

  const [sellers, setSellers] = useState([]);

  useEffect(() => {
    fetchSellers();
  }, []);

  const fetchSellers = () => {
    axios.get("http://localhost:4000/api/seller/seller-list")
      .then(res => {
        if (res.data.success) {
          setSellers(res.data.data);
        }
      })
      .catch(err => console.error(err));
  };

  const handleToggle = (id, currentStatus) => {
    const updatedStatus = !currentStatus;

    axios.put(`http://localhost:4000/api/seller/update-status`, { id, status: updatedStatus })
      .then(res => {
        if (res.data.success) {
          // update the local state
          setSellers(prev =>
            prev.map(seller =>
              seller._id === id ? { ...seller, status: updatedStatus } : seller
            )
          );
          toast.success('Status Updated');
        }
      })
      .catch(err => console.error(err));
  };



    return (
        <div className="no-scrollbar flex-1 h-[95vh] overflow-y-scroll flex flex-col justify-between">
            <div className="w-full md:p-10 p-4">
                <h2 className="pb-4 text-lg font-medium">Seller List</h2>
                <div className="flex flex-col items-center max-w-4xl w-full overflow-hidden rounded-md bg-white border border-gray-500/20">
                    <table className="md:table-auto table-fixed w-full overflow-hidden">
                        <thead className="text-gray-900 text-sm text-left">
                            <tr>
                                <th className="px-4 py-3 font-semibold truncate">Name</th>
                                <th className="px-4 py-3 font-semibold truncate">Email</th>
                                <th className="px-4 py-3 font-semibold truncate">Status</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm text-gray-500">
                            {sellers.map((seller) => (
                                <tr key={seller._id} className="border-t border-gray-500/20">
                                    <td className="md:px-4 pl-2 md:pl-4 py-3 flex items-center space-x-3 truncate">
                                        <span className="truncate max-sm:hidden w-full">{seller.name}</span>
                                    </td>
                                    <td className="px-4 py-3">{seller.email}</td>
                                    <td className="px-4 py-3 max-sm:hidden">
                                       <button
                                          onClick={() => handleToggle(seller._id, seller.status)}
                                          style={{
                                            background: seller.status ? "red" : "green",
                                            color: "#fff",
                                            padding: "4px 8px",
                                            border: "none",
                                            borderRadius: "4px"
                                          }}
                                        >
                                          {seller.status ? "Inactive" : "Active"}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default SellerList
