import Navbar from '../../components/Navbar';
import DashboardLayout from '../../components/DashboardLayout';

export default function Dashboard() {
  return (
    <div className="h-screen bg-gray-50">
      <Navbar />
      <DashboardLayout />
    </div>
  );
}