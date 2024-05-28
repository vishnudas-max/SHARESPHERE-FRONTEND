import React, { useState, useEffect } from 'react'
import AdminNavbar from './HelperComponents.jsx/AdminNavbar'
import { Link } from 'react-router-dom'
import Chart from "chart.js/auto";
import { CategoryScale } from 'chart.js/auto';
import BarChart from './HelperComponents.jsx/BarChart';
import PieChart from './HelperComponents.jsx/PieChart';
import AdminPrivotRoute from '../../Wrappers/AdminPrivotRoute'
import api from '../../../Config'

Chart.register(CategoryScale);
function AdminHome() {
  const access = localStorage.getItem('access')
  const [overViewData, setOverViewData] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get('admin/postuser/overview/', {
          headers: {
            Authorization: `Bearer ${access}`
          }
        })
        setOverViewData(response.data)

      }
      catch (error) {
        console.log(error)

      }
    }
    fetchData()
  }, [setOverViewData])

  return (
    <>
      <AdminNavbar />
      <div className='text-white md:ml-[320px] max-w-full grid grid-cols-12 '>
        <div className='col-span-12 px-4 py-3 md:py-5 border-b border-gray-500 fixed w-full bg-[#000300]'>
          <nav class="flex " aria-label="Breadcrumb">
            <ol class="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
              <li class="inline-flex items-center">
                <Link to={'/admin/dashboard/'} class="inline-flex items-center md:text-sm text-xs font-medium text-gray-700 hover:text-blue-600 dark:text-gray-400 dark:hover:text-white">
                  <svg class="w-3 h-3 me-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                  </svg>
                  Admin
                </Link>
              </li>
              <li>
                <div class="flex items-center">
                  <svg class="rtl:rotate-180 w-3 h-3 text-gray-400 mx-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 9 4-4-4-4" />
                  </svg>
                  <Link to={'/admin/dashboard/'} class="ms-1 md:text-sm text-xs font-medium text-gray-700 hover:text-blue-600 md:ms-2 dark:text-gray-400 dark:hover:text-white">Dashboard</Link>
                </div>
              </li>
            </ol>
          </nav>
        </div>
        {overViewData ?
          <div className='col-span-12 h-fit md:mt-16 mt-10 flex justify-around px-10 py-6'>
            <div className='h-fit md:w-32 w-20 rounded-xl bg-zinc-900 md:py-3 py-2 flex-col'>
              <h1 className='mx-auto w-fit font-bold text-xl md:text-2xl'>Users</h1>
              <h1 className='mx-auto w-fit font-semibold md:text-xl text-sm md:mt-2'>{overViewData.total_users}</h1>
            </div>
            <div className='h-fit md:w-32 w-20 rounded-xl bg-zinc-900 md:py-3 py-2 flex-col'>
              <h1 className='mx-auto w-fit font-bold text-xl md:text-2xl'>Posts</h1>
              <h1 className='mx-auto w-fit font-semibold md:text-xl text-sm md:mt-2'>{overViewData.total_post}</h1>
            </div>
            <div className='h-fit md:w-32 w-20 rounded-xl bg-zinc-900 md:py-3 py-2 flex-col'>
              <h1 className='mx-auto w-fit font-bold text-xl md:text-2xl'>Reports</h1>
              <h1 className='mx-auto w-fit font-semibold md:text-xl text-sm md:mt-2'>100</h1>
            </div>
          </div>
          :
          <div className='col-span-12 h-fit md:mt-16 mt-10 flex justify-around px-10 py-6'>
          
            <div className='md:h-24 h-14  animate-pulse md:w-32 w-20 rounded-xl bg-gray-700 md:py-3 py-2 flex-col'>
            </div>
            <div className='md:h-24 h-14  animate-pulse md:w-32 w-20 rounded-xl bg-gray-700 md:py-3 py-2 flex-col'>
            </div>
            <div className='md:h-24 h-14  animate-pulse md:w-32 w-20 rounded-xl bg-gray-700 md:py-3 py-2 flex-col'>
            </div>
          </div>
        }

        <div className='md:col-span-6 col-span-12 p-3 '>
          <AdminPrivotRoute>
            <BarChart />
          </AdminPrivotRoute>

        </div>
        <div className='md:col-span-6 col-span-12 p-4 '>
          <AdminPrivotRoute>
            <PieChart />
          </AdminPrivotRoute>
        </div>
      </div>
    </>
  )
}

export default AdminHome