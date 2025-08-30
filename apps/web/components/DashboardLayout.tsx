import LeftColumn from './LeftColumn';
import MiddleColumn from './MiddleColumn';
import RightColumn from './RightColumn';

export default function DashboardLayout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex h-screen">
        <div className="w-[25%] border-r border-gray-300">
          <LeftColumn />
        </div>
        
        <div className="w-[55%] border-r border-gray-300">
          <MiddleColumn />
        </div>
        
        <div className="w-[20%]">
          <RightColumn />
        </div>
      </div>
    </div>
  );
}
