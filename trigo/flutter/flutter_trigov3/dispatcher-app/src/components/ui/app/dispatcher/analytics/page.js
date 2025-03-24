import React, { useEffect, useState } from 'react';
import withSecurityAndMonitoring from '../../../../hoc/withSecurityAndMonitoring';

const AnalyticsPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('week');
  const [chartType, setChartType] = useState('rides');

  useEffect(() => {
    // In a real app, this would be an API call
    // Simulating API call
    setTimeout(() => {
      const mockData = {
        summary: {
          totalRides: 1256,
          totalRevenue: 187500.75,
          activeDrivers: 42,
          averageRating: 4.7,
          completionRate: 97.5,
          cancellationRate: 2.5
        },
        charts: {
          rides: {
            day: [12, 15, 10, 18, 22, 16, 14, 19, 21, 17, 20, 23, 25, 18, 16, 14, 19, 22, 20, 17, 15, 18, 21, 19],
            week: [125, 142, 138, 156, 147, 165, 183],
            month: [520, 580, 610, 590, 650, 720, 680, 710, 750, 790, 820, 850]
          },
          revenue: {
            day: [1800, 2250, 1500, 2700, 3300, 2400, 2100, 2850, 3150, 2550, 3000, 3450, 3750, 2700, 2400, 2100, 2850, 3300, 3000, 2550, 2250, 2700, 3150, 2850],
            week: [18750, 21300, 20700, 23400, 22050, 24750, 27450],
            month: [78000, 87000, 91500, 88500, 97500, 108000, 102000, 106500, 112500, 118500, 123000, 127500]
          },
          drivers: {
            day: [35, 36, 34, 38, 40, 39, 37, 41, 42, 40, 41, 43, 44, 42, 40, 38, 41, 43, 42, 40, 39, 41, 43, 42],
            week: [32, 34, 36, 38, 40, 41, 42],
            month: [25, 27, 29, 31, 33, 35, 36, 38, 39, 40, 41, 42]
          }
        },
        topDrivers: [
          { id: 'driver-001', name: 'Juan Cruz', rides: 342, revenue: 51300.50, rating: 4.9 },
          { id: 'driver-005', name: 'Isabella Reyes', rides: 328, revenue: 49200.75, rating: 4.9 },
          { id: 'driver-003', name: 'Miguel Tan', rides: 315, revenue: 47250.25, rating: 4.8 },
          { id: 'driver-002', name: 'Ana Lim', rides: 287, revenue: 43050.50, rating: 4.7 },
          { id: 'driver-004', name: 'Gabriel Santos', rides: 275, revenue: 41250.75, rating: 4.6 }
        ],
        popularRoutes: [
          { from: 'Makati City', to: 'BGC, Taguig City', count: 187, avgFare: 220.50 },
          { from: 'Quezon City', to: 'Makati City', count: 156, avgFare: 350.75 },
          { from: 'Manila City', to: 'Pasay City', count: 134, avgFare: 180.25 },
          { from: 'Pasig City', to: 'Makati City', count: 128, avgFare: 250.50 },
          { from: 'BGC, Taguig City', to: 'NAIA, Pasay City', count: 112, avgFare: 420.75 }
        ]
      };
      
      setData(mockData);
      setLoading(false);
    }, 1000);
  }, []);

  // Helper function to format currency
  const formatCurrency = (amount) => {
    return '₱' + amount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
  };

  // Helper function to get chart data based on selected type and time range
  const getChartData = () => {
    if (!data) return [];
    
    return data.charts[chartType][timeRange];
  };

  // Helper function to get chart labels based on selected time range
  const getChartLabels = () => {
    switch (timeRange) {
      case 'day':
        return Array.from({ length: 24 }, (_, i) => `${i}:00`);
      case 'week':
        return ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
      case 'month':
        return ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      default:
        return [];
    }
  };

  // Helper function to get chart title
  const getChartTitle = () => {
    const typeText = chartType === 'rides' ? 'Rides' : chartType === 'revenue' ? 'Revenue' : 'Active Drivers';
    const timeText = timeRange === 'day' ? 'Today' : timeRange === 'week' ? 'This Week' : 'This Year';
    
    return `${typeText} by ${timeRange === 'day' ? 'Hour' : timeRange === 'week' ? 'Day' : 'Month'} (${timeText})`;
  };

  // Simple chart component (in a real app, you'd use a library like Chart.js or Recharts)
  const SimpleChart = ({ data, labels, title }) => {
    const maxValue = Math.max(...data);
    
    return (
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">{title}</h3>
        <div className="h-64 flex items-end space-x-2">
          {data.map((value, index) => (
            <div key={index} className="flex flex-col items-center flex-1">
              <div 
                className="w-full bg-primary rounded-t" 
                style={{ 
                  height: `${(value / maxValue) * 100}%`,
                  minHeight: '4px'
                }}
              ></div>
              <span className="text-xs mt-1 text-gray-500">{labels[index]}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Analytics Dashboard</h1>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Total Rides</h3>
          <p className="text-2xl font-bold">{data.summary.totalRides.toLocaleString()}</p>
          <div className="mt-1 text-xs text-green-600">+8.5% from last month</div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Total Revenue</h3>
          <p className="text-2xl font-bold">{formatCurrency(data.summary.totalRevenue)}</p>
          <div className="mt-1 text-xs text-green-600">+12.3% from last month</div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Active Drivers</h3>
          <p className="text-2xl font-bold">{data.summary.activeDrivers}</p>
          <div className="mt-1 text-xs text-green-600">+5.0% from last month</div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Average Rating</h3>
          <div className="flex items-center">
            <p className="text-2xl font-bold">{data.summary.averageRating.toFixed(1)}</p>
            <span className="text-yellow-400 material-icons ml-1">star</span>
          </div>
          <div className="mt-1 text-xs text-green-600">+0.2 from last month</div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Completion Rate</h3>
          <p className="text-2xl font-bold">{data.summary.completionRate}%</p>
          <div className="mt-1 text-xs text-green-600">+1.5% from last month</div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Cancellation Rate</h3>
          <p className="text-2xl font-bold">{data.summary.cancellationRate}%</p>
          <div className="mt-1 text-xs text-red-600">-0.8% from last month</div>
        </div>
      </div>
      
      {/* Chart Controls */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="flex space-x-2">
            <button 
              onClick={() => setChartType('rides')}
              className={`px-3 py-1 rounded-md ${chartType === 'rides' ? 'bg-primary text-white' : 'bg-gray-100'}`}
            >
              Rides
            </button>
            <button 
              onClick={() => setChartType('revenue')}
              className={`px-3 py-1 rounded-md ${chartType === 'revenue' ? 'bg-primary text-white' : 'bg-gray-100'}`}
            >
              Revenue
            </button>
            <button 
              onClick={() => setChartType('drivers')}
              className={`px-3 py-1 rounded-md ${chartType === 'drivers' ? 'bg-primary text-white' : 'bg-gray-100'}`}
            >
              Drivers
            </button>
          </div>
          
          <div className="flex space-x-2">
            <button 
              onClick={() => setTimeRange('day')}
              className={`px-3 py-1 rounded-md ${timeRange === 'day' ? 'bg-primary text-white' : 'bg-gray-100'}`}
            >
              Day
            </button>
            <button 
              onClick={() => setTimeRange('week')}
              className={`px-3 py-1 rounded-md ${timeRange === 'week' ? 'bg-primary text-white' : 'bg-gray-100'}`}
            >
              Week
            </button>
            <button 
              onClick={() => setTimeRange('month')}
              className={`px-3 py-1 rounded-md ${timeRange === 'month' ? 'bg-primary text-white' : 'bg-gray-100'}`}
            >
              Year
            </button>
          </div>
        </div>
      </div>
      
      {/* Chart */}
      <SimpleChart 
        data={getChartData()} 
        labels={getChartLabels()} 
        title={getChartTitle()} 
      />
      
      {/* Top Drivers */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4">Top Performing Drivers</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Driver
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rides
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Revenue
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rating
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.topDrivers.map((driver) => (
                <tr key={driver.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                        <span className="material-icons text-gray-500">person</span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {driver.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {driver.id}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {driver.rides}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatCurrency(driver.revenue)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-500">
                      <span>{driver.rating.toFixed(1)}</span>
                      <span className="text-yellow-400 material-icons text-sm ml-1">star</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Popular Routes */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4">Popular Routes</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Route
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rides
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Average Fare
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.popularRoutes.map((route, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{route.from}</div>
                    <div className="text-sm text-gray-500">to {route.to}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {route.count}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatCurrency(route.avgFare)}
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

export default withSecurityAndMonitoring(AnalyticsPage);
