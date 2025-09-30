import React from 'react'
import { useAppContext } from '../../context/AppContext'
import { assets } from '../../assets/assets';
import { Link, NavLink, Outlet } from 'react-router-dom';
import toast from 'react-hot-toast';


const AdminLayout = () => {

    const { axios, navigate } = useAppContext();

    const sidebarLinks = [
        { name: "Main Category", path:"/admin/Main-category", icon: assets.add_icon },
        { name: "Main Category List", path:"/admin/Main-category-List", icon: assets.product_list_icon  },
        { name: "Add category", path: "/admin", icon: assets.add_icon },
        { name: "Category List", path:"/admin/Category-List", icon: assets.product_list_icon },
        
  
        { name: "SubCategory", path:"/admin/SubCategory", icon: assets.add_icon },
        { name: "SubCategory List", path:"/admin/SubCategory-List", icon: assets.product_list_icon },
        { name: "Order List", path: "/admin/order-list", icon: assets.order_icon },
        { name: "Seller List", path: "/admin/seller-list", icon: assets.product_list_icon },

    ];

    const logout = async () => {
        try{
            const { data } = await axios.get('/api/admin/logout');
            if(data.succes){
                toast.success(data.message);
                navigate('/')
            }
            else{
                toast.error(data.message);
                navigate('/')
            }
        }
        catch(error){
            toast.error(data.message);
        }
    }

  return (
    <>
        <div className="flex items-center justify-between px-4 md:px-8 border-b border-gray-300 py-3 bg-white ">
            <Link to='/'>
                <img className="cursor-pointer w-34 md:w-38" src={assets.logo} alt="logo" />
            </Link>
            <div className="flex items-center gap-5 text-gray-500">
                <p>Hi! Admin</p>
                <button onClick={logout} className='border rounded-full text-sm px-4 py-1'>Logout</button>
            </div>
        </div>
        <div className='flex'>
            <div className="md:w-64 w-16 border-r h-[95vh] text-base border-gray-300 pt-4 flex flex-col">
                {sidebarLinks.map((item) => (
                    <NavLink to={item.path} key={item.name} end={item.path === '/admin'}
                        className={({isActive})=>`flex items-center py-3 px-4 gap-3 
                            ${isActive ? "border-r-4 md:border-r-[6px] bg-green-500/10 border-green-500 text-green-500"
                                : "hover:bg-gray-100/90 border-white"
                            }`
                        }
                    >
                        <img src={item.icon} alt="" className='w-7 h-7' />
                        <p className="md:block hidden text-center">{item.name}</p>
                    </NavLink>
                ))}
            </div>
            <Outlet />
        </div>
    </>
  )
}


export default AdminLayout
