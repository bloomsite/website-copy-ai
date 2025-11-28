import NavigationSidebar from "../../../components/core/NavigationSidebar/NavigationSidebar";
import { sidebarItems } from "../../../core/Constants/sidebarItemsAdmin";
import WorkflowsOverview from "../../../components/admin/WorkflowsOverview/WorkflowsOverview";

const AdminWorkflows = () => {
  return (
    <>
      <NavigationSidebar sidebarTitle="Admin" sidebarItems={sidebarItems} />
      <div className="admin-workflows-content">
        <WorkflowsOverview />
      </div>
    </>
  );
};

export default AdminWorkflows;
