import { useState } from 'react';
const [zipData, setZipData] = useState([]);

useEffect(() => {
  fetch('/allZips.json')
    .then(res => res.json())
    .then(data => setZipData(data))
    .catch(err => console.error('Failed to load ZIP data:', err));
}, []);


function haversineDistance([lat1, lon1], [lat2, lon2]) {
  const R = 3958.8;
  const toRad = angle => (angle * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a = Math.sin(dLat/2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon/2) ** 2;
  return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
}

const getCoords = (zip) => {
  const entry = zipData.find(z => z.zip === String(zip));
  return entry ? [entry.lat, entry.lng] : null;
};

export default function LTLTransitEstimator() {
  const [vendorZip, setVendorZip] = useState('');
  const [deliveryZip, setDeliveryZip] = useState('');
  const [transitTime, setTransitTime] = useState(null);

  const estimateTransit = () => {
    const origin = getCoords(vendorZip);
    const dest = getCoords(deliveryZip);
    if (!origin || !dest) {
      setTransitTime('ZIP code not found');
      return;
    }
    const distance = haversineDistance(origin, dest);
    const days = Math.ceil(distance / 500);
    setTransitTime(`${days} day(s) estimated`);
  };

  return (
    <div style={{ padding: 20, fontFamily: 'sans-serif' }}>
      <h1>LTL Transit Estimator</h1>
      <input
        type="text"
        placeholder="Vendor ZIP"
        value={vendorZip}
        onChange={e => setVendorZip(e.target.value)}
      />
      <input
        type="text"
        placeholder="Delivery ZIP"
        value={deliveryZip}
        onChange={e => setDeliveryZip(e.target.value)}
      />
      <button onClick={estimateTransit}>Estimate</button>
      {transitTime && <p>{transitTime}</p>}
    </div>
  );
}