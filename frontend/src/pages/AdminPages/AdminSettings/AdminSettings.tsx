import NavigationSidebar from "../../../components/core/NavigationSidebar/NavigationSidebar";
import { sidebarItems } from "../../../core/Constants/sidebarItemsAdmin";

const AdminSettings = () => {
  return (
    <>
      <NavigationSidebar sidebarTitle="Admin" sidebarItems={sidebarItems} />
    </>
  );
};

export default AdminSettings;
