import { useMemo } from 'react';

const usePermission = (permissions = []) => {
  const can = (name) => permissions.includes(name);
  return useMemo(() => ({ can }), [permissions]);
};

export default usePermission;
