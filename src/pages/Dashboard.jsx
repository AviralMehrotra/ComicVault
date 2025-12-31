import AppLayout from "@/components/layout/AppLayout";
import { useTitle } from "@/hooks/useTitle";
import { Input } from "@/components/ui/input";
import ActivityContainer from "@/components/elements/ActivityContainer";
import CurrentlyReading from "@/components/dashboard/CurrentlyReading";

const Dashboard = () => {
  useTitle("Dashboard");

  return (
    <AppLayout activeRoute="dashboard">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full p-8">
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-card rounded-xl shadow-sm border border-border p-6">
            <h3 className="text-lg font-semibold pb-4 text-card-foreground">
              Activity
            </h3>
            <div className="flex w-full items-center gap-3 mb-6">
              <Input
                type="text"
                placeholder="Post an Activity..."
                className="shadow-sm bg-background border-input focus-visible:ring-ring"
              />
              <button className="bg-primary text-primary-foreground py-2 px-6 rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 font-medium transition-colors">
                Post
              </button>
            </div>
            <div>
              <ActivityContainer />
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 space-y-6">
          <CurrentlyReading />
        </div>
      </div>
    </AppLayout>
  );
};

export default Dashboard;
