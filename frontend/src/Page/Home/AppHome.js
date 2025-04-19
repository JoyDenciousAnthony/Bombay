import React, { useContext, useEffect } from 'react';
import { userPageContext } from '../../Store/MainStore';
import AppLayout from '../../Layout/AppLayout';

export default function Home() {
  const [PageData, setPageData] = useContext(userPageContext);

  // ✅ Fixed useEffect to avoid infinite update loop
  useEffect(() => {
    setPageData((prev) => ({ ...prev, Page: 'Home' }));
  }, [setPageData]); // 👈 No need to include PageData

  return (
    <div>
      <AppLayout />
    </div>
  );
}
