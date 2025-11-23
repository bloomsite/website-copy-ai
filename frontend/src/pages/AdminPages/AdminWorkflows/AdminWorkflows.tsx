import NavigationSidebar from "../../../components/custom/NavigationSidebar/NavigationSidebar";
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
