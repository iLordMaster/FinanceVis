import { useState, useEffect } from 'react';
import { UserApi } from '../../api/userApi';

export default function AssetLegend() {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await UserApi.request('/api/dashboard/asset-summary');
        
        if (Array.isArray(response)) {
          // Show top 2 assets
          setAssets(response.slice(0, 2));
        } else {
          console.error('Expected array from asset-summary but got:', response);
          setAssets([]);
        }
      } catch (error) {
        console.error('Error fetching asset summary:', error);
        setAssets([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading || assets.length === 0) {
    return null;
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px', fontSize: '0.8rem' }}>
      {assets.map((asset, index) => (
        <div key={index}>
          <div>{asset.name}</div>
          <div style={{ fontWeight: 'bold' }}>${asset.value.toLocaleString()}</div>
        </div>
      ))}
    </div>
  );
}
