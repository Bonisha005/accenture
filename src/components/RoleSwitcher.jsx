import { useUser } from '../context/UserContext';

const RoleSwitcher = () => {
  const { userRole, setUserRole } = useUser();

  return (
    <div className="mb-4">
      <label className="mr-2 font-medium">Switch Role:</label>
      <select
        value={userRole}
        onChange={(e) => setUserRole(e.target.value)}
        className="border p-1 rounded bg-blue-500 text-white cursor-pointer"
      >
        <option value="admin" title="Full access to all features, including model retraining and analytics">Admin</option>
        <option value="analyst" title="Can view logs, predictions, and analytics">Analyst</option>
        <option value="ops" title="Limited access to basic features, no admin privileges">Ops</option>
      </select>
    </div>
  );
};

export default RoleSwitcher;