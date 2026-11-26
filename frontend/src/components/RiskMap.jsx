/**
 * RiskMap.jsx
 * Leaflet map centred on India showing district risk markers.
 * Uses /risk-map data — never fabricates coordinates or risk values.
 */

import { useEffect } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet';
import { riskColor, riskLabel, formatProbability } from '../utils/riskUtils.js';
import RiskBadge from './RiskBadge.jsx';
import RiskLegend from './RiskLegend.jsx';
import LoadingState from './LoadingState.jsx';
import ErrorState from './ErrorState.jsx';

// Fix default Leaflet icon path in Vite builds
import L from 'leaflet';
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl:       'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl:     'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const INDIA_CENTER = [22.5, 82.0];
const INDIA_ZOOM   = 5;

function FitBounds({ districts }) {
  const map = useMap();
  useEffect(() => {
    if (districts && districts.length > 1) {
      const bounds = districts.map(d => [d.latitude, d.longitude]);
      map.fitBounds(bounds, { padding: [40, 40], maxZoom: 7 });
    }
  }, [districts, map]);
  return null;
}

function DistrictMarker({ district }) {
  const color = riskColor(district.level);
  const level = riskLabel(district.level);
  const pct   = formatProbability(district.probability);

  return (
    <CircleMarker
      center={[district.latitude, district.longitude]}
      radius={14}
      pathOptions={{
        color:       color,
        fillColor:   color,
        fillOpacity: 0.75,
        weight:      2,
        opacity:     1,
      }}
      aria-label={`${district.name}, ${district.state}: ${level} risk, ${pct}`}
    >
      <Popup>
        <div style={{ minWidth: 180, fontFamily: 'var(--font-sans)' }}>
          <div style={{ fontWeight: 600, fontSize: '0.9375rem', marginBottom: 4 }}>
            {district.name}
          </div>
          <div style={{ fontSize: '0.8125rem', color: '#6b7280', marginBottom: 10 }}>
            {district.state}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ fontSize: '0.8125rem', color: '#374151' }}>Risk level</span>
            <RiskBadge level={district.level} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
            <span style={{ fontSize: '0.8125rem', color: '#374151' }}>Probability</span>
            <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>{pct}</span>
          </div>
          {district.mock && (
            <div style={{ fontSize: '0.6875rem', color: '#92400e', background: '#fef3c7', padding: '3px 6px', borderRadius: 4, textAlign: 'center' }}>
              Sample data — not live observation
            </div>
          )}
          <div style={{ fontSize: '0.6875rem', color: '#6b7280', marginTop: 8, lineHeight: 1.4 }}>
            Decision-support estimate. Not an official flood warning.
          </div>
        </div>
      </Popup>
    </CircleMarker>
  );
}

export default function RiskMap({ data, loading, error, onRetry, height = 500 }) {
  const isMock = data?.districts?.some(d => d.mock);

  return (
    <div style={{ position: 'relative', height }}>
      {/* Mock data notice */}
      {isMock && !loading && !error && (
        <div style={{ position: 'absolute', top: 10, left: 10, zIndex: 1000 }}>
          <span className="mock-notice">⚠ Sample district data</span>
        </div>
      )}

      {/* Legend */}
      {!loading && !error && (
        <div style={{ position: 'absolute', bottom: 28, right: 10, zIndex: 1000 }}>
          <RiskLegend />
        </div>
      )}

      {loading && (
        <div style={{
          position: 'absolute', inset: 0, zIndex: 1000,
          background: 'rgba(255,255,255,0.85)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          borderRadius: 'var(--radius-lg)',
        }}>
          <LoadingState message="Loading risk map…" />
        </div>
      )}

      {error && !loading && (
        <div style={{
          position: 'absolute', inset: 0, zIndex: 1000,
          background: '#fff',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          borderRadius: 'var(--radius-lg)',
        }}>
          <ErrorState error={error} onRetry={onRetry} />
        </div>
      )}

      <MapContainer
        center={INDIA_CENTER}
        zoom={INDIA_ZOOM}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom
        aria-label="India flood risk map"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {data?.districts && <FitBounds districts={data.districts} />}
        {data?.districts?.map(d => (
          <DistrictMarker key={d.district_id} district={d} />
        ))}
      </MapContainer>
    </div>
  );
}
