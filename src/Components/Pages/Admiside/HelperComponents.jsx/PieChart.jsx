import React,{useState,useEffect} from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { userData } from './../utils/Data'
import Loader from '../../Userside/HelperComponents/Loader';
import api from '../../../../Config'

// Register the components with Chart.js
ChartJS.register(ArcElement, Tooltip, Legend);

const PieChart = () => {

    const access = localStorage.getItem('access')
    const [dataset, setDataset] = useState(null)
    const [isLoading, setLoading] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await api.get('admin/user/verification-status/', {
                    headers: {
                        Authorization: `Bearer ${access}`
                    }
                })
                setLoading(false)
                setDataset(response.data)
            } catch (error) {
                setLoading(false)
                console.log(error)
            }
        }

        fetchData()
    },
    [setDataset])
   
    const chartData = {
        labels: ['Verified Users', 'Non-Verified Users'],
        datasets: [
            {
                label: 'User Verification Status',
                data: dataset?[dataset.verified,dataset.non_verified]:
                [userData.verified, userData.nonVerified],
                backgroundColor: [
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(255, 99, 132, 0.2)'
                ],
                borderColor: [
                    'rgba(75, 192, 192, 1)',
                    'rgba(255, 99, 132, 1)'
                ],
                borderWidth: 1,
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Verified vs Non-Verified Users',
            },
        },
    };
    if(isLoading){
        return <Loader />
    }
    return <Pie data={chartData} options={options} />;
};

export default PieChart;
