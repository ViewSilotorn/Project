// components/Map.js
'use client'
import { useState, useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";

// ตั้งค่า token ของ Mapbox
mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

const Map = () => {
  const [selectedStyle, setSelectedStyle] = useState("mapbox://styles/mapbox/outdoors-v11"); // ค่าเริ่มต้นเป็น Streets
  const mapContainerRef = useRef(null); // ใช้สำหรับอ้างอิงการแสดงผลแผนที่

  // รายการ styles ที่ผู้ใช้สามารถเลือกได้
  const styles = [
    { name: "Streets", value: "mapbox://styles/mapbox/streets-v11" },
    { name: "Light", value: "mapbox://styles/mapbox/light-v10" },
    { name: "Dark", value: "mapbox://styles/mapbox/dark-v10" },
    { name: "Satellite", value: "mapbox://styles/mapbox/satellite-v9" },
    { name: "Satellite Streets", value: "mapbox://styles/mapbox/satellite-streets-v11" },
    { name: "Outdoors", value: "mapbox://styles/mapbox/outdoors-v11" },
  ];

  useEffect(() => {
    // if (navigator.geolocation) {
    //   navigator.geolocation.getCurrentPosition(showPosition);
    // } else {
    //   alert("Geolocation is not supported by this browser")
    // }

    // function showPosition(position) {
    //   const lat = position.coords.latitude;
    //   const lon = position.coords.longitude;


      const map = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: selectedStyle, // ใช้ style จาก selectedStyle
        center: [-118.2437, 34.0522], // พิกัดเริ่มต้นที่ลอสแอนเจลิส center: [lon, lat], //
        zoom: 10,
        attributionControl: false,
        dragPan: true, // ให้เลื่อนแผนที่ได้
        scrollZoom: true, // ปิดการซูมด้วยการเลื่อนเมาส์
        boxZoom: false, // ปิดการซูมด้วยการเลือกกล่อง
        dragRotate: false, // ปิดการหมุนแผนที่
      });

      // new mapboxgl.Marker()
      //   .setLngLat([lon, lat])
      //   .setPopup(new mapboxgl.Popup().setHTML('You are here'))
      //   .addTo(map);

    // Cleanup เมื่อ component ถูกลบ
    return () => {
      if (map) map.remove();
    };
  }, [selectedStyle]); // เมื่อ selectedStyle เปลี่ยนแปลง ให้รีเฟรชแผนที่

  return (
    <div>
      {/* <h1>Choose a Map Style</h1>
      <select onChange={(e) => setSelectedStyle(e.target.value)} value={selectedStyle}>
        {styles.map((style) => (
          <option key={style.value} value={style.value}>
            {style.name}
          </option>
        ))}
      </select> */}

      <div
        ref={mapContainerRef}
        style={{ height: "100vh", width: "100%" }}
      />
    </div>
  );
};

export default Map;