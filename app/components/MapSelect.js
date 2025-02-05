import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

// ใส่ Token ของคุณที่นี่
mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

const MapSelect = ({ latitude, longitude, onLocationChange }) => {
  const mapContainerRef = useRef(null);
  const markerRef = useRef(null); // สำหรับการอ้างอิงถึง marker
  const mapRef = useRef(null); // อ้างอิงถึง map

  useEffect(() => {
    // การตั้งค่าแผนที่ครั้งแรก
    if (!mapRef.current) {
      mapRef.current = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: "mapbox://styles/mapbox/light-v10",
        center: [longitude, latitude], // ตั้งค่าตำแหน่งเริ่มต้น [lng, lat]
        zoom: 0,
        // attributionControl: false,
        // dragPan: true,
        // scrollZoom: true,
        boxZoom: false,
        dragRotate: false,
        maxBounds: [
          [190, -85],  // Southwest coordinates
          [-190, 85],    // Northeast coordinates
        ],
      });

      // ปักหมุดในตำแหน่งเริ่มต้น
      markerRef.current = new mapboxgl.Marker({ draggable: true })
        .setLngLat([longitude, latitude])
        .addTo(mapRef.current);

      // เมื่อหมุดถูกลาก จะอัปเดตพิกัด
      markerRef.current.on("dragend", () => {
        const { lng, lat } = markerRef.current.getLngLat();
        onLocationChange(lat, lng); // ส่งค่าพิกัดกลับไปยัง parent
      });
    } else {
      // เมื่อแผนที่ถูกสร้างแล้ว ให้แค่ย้ายหมุดตามพิกัดใหม่
      if (markerRef.current) {
        markerRef.current.setLngLat([longitude, latitude]);
      }
    }

    // return () => {
    //   // ไม่ต้องลบ map หรือ marker ทุกครั้งที่มีการเปลี่ยนแปลง
    //   // mapRef.current.remove(); // ให้แผนที่ไม่รีโหลดซ้ำ
    // };
  }, [latitude, longitude, onLocationChange]);

  return (
    <div className="w-full h-full" ref={mapContainerRef} />
  );
};

export default MapSelect;

