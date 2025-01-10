// 'use client'
// import { useState, useEffect, useRef } from "react";
// import mapboxgl from "mapbox-gl";
// import 'mapbox-gl/dist/mapbox-gl.css';
// import * as turf from '@turf/turf';

// // ตั้งค่า token ของ Mapbox
// mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

// const Map = () => {
//   const mapContainerRef = useRef(null);
//   const mapRef = useRef(null);
//   const [markers, setMarkers] = useState([]); // เก็บพิกัดหมุดทั้งหมด
//   const [lineData, setLineData] = useState(null); // GeoJSON สำหรับเส้น

//   // ฟังก์ชันสร้าง GeoJSON สำหรับวาดเส้นเชื่อมระหว่างหมุด
//   const generateLineData = (markers) => {
//    if (markers.length < 2) return null;

//    const coords = markers.map((marker) => marker.lngLat);
//    const coordinates = coords.map((lng, lat) => `${lng},${lat}`).join(";")

//    const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${coordinates}?geometries=geojson&access_token=${mapboxgl.accessToken}`;
    
//    fetch(url)
//      .then((response) => response.json())
//      .then((data) => {
//        const route = data.routes[0].geometry; // รับข้อมูลเส้นทางจาก API
//        setLineData(route); // อัปเดตข้อมูลเส้นทาง
//      })
//      .catch((error) => console.error("Error fetching directions:", error));
//  };
  

//   useEffect(() => {
//     // สร้างแผนที่
//     const map = new mapboxgl.Map({
//       container: mapContainerRef.current,
//       style: "mapbox://styles/mapbox/light-v10", // แผนที่ style
//       center: [145.0361988357555, -37.78029297469943], // ศูนย์กลางแผนที่ (Bangkok)
//       zoom: 10,
//       attributionControl: false,
//       dragPan: true, // ให้เลื่อนแผนที่ได้
//       scrollZoom: true, // ปิดการซูมด้วยการเลื่อนเมาส์
//       boxZoom: false, // ปิดการซูมด้วยการเลือกกล่อง
//       dragRotate: false, // ปิดการหมุนแผนที่
//     });

//     mapRef.current = map;

//     // ฟังก์ชันปักหมุดเมื่อผู้ใช้คลิกบนแผนที่
//     const onMapClick = (event) => {
//       const { lngLat } = event; // ดึงพิกัดที่คลิก
//       const id = Date.now(); // สร้าง id ให้กับหมุดแต่ละตัว

//       // สร้างหมุด
//       const newMarker = new mapboxgl.Marker({ draggable: true })
//         .setLngLat([lngLat.lng, lngLat.lat])
//         .addTo(map);

//       // เพิ่มพิกัดหมุดใน state
//       setMarkers((prevMarkers) => {
//         const updatedMarkers = [
//           ...prevMarkers,
//           { id, lngLat: [lngLat.lng, lngLat.lat], marker: newMarker },
//         ];
//         setLineData(generateLineData(updatedMarkers)); // อัปเดตเส้น
//         return updatedMarkers;
//       });

//       // ฟังก์ชันลากหมุด
//       newMarker.on("dragend", () => {
//         const newLngLat = newMarker.getLngLat();
//         setMarkers((prevMarkers) => {
//           const updatedMarkers = prevMarkers.map((marker) =>
//             marker.id === id
//               ? { ...marker, lngLat: [newLngLat.lng, newLngLat.lat] }
//               : marker
//           );
//           setLineData(generateLineData(updatedMarkers)); // อัปเดตเส้น
//           return updatedMarkers;
//         });
//       });

//       // ฟังก์ชันลบหมุดเมื่อคลิกขวา
//       newMarker.getElement().addEventListener("contextmenu", (e) => {
//         e.preventDefault();
//         newMarker.remove();
//         setMarkers((prevMarkers) => {
//           const updatedMarkers = prevMarkers.filter(
//             (marker) => marker.id !== id
//           );
//           setLineData(generateLineData(updatedMarkers)); // อัปเดตเส้น
//           return updatedMarkers;
//         });
//       });
//     };

   
//     // Event ฟังการคลิกแผนที่
//     map.on("load", () => {
//       // ตั้งค่า Event Listener สำหรับการคลิกแผนที่
//       map.on("click", onMapClick);
//     });

//     return () => {
//       if (map) map.remove();
//     };
//   }, []);

//   // เพิ่ม GeoJSON layer สำหรับเส้น
//   useEffect(() => {
//     if (mapRef.current && lineData) {
//       const map = mapRef.current;

//       // เช็คว่ามี source เดิมอยู่หรือไม่
//       if (map.getSource("line-source")) {
//         map.getSource("line-source").setData(lineData);
//       } else {
//         map.addSource("line-source", {
//           type: "geojson",
//           data: lineData,
//         });

//         map.addLayer({
//           id: "line-layer",
//           type: "line",
//           source: "line-source",
//           layout: {
//             "line-join": "round",
//             "line-cap": "round",
//           },
//           paint: {
//             "line-color": "#0ea5e9", // สีเส้น
//             "line-width": 5, // ความหนาของเส้น
//           },
//         });
//       }
//     }
//   }, [lineData]);



//   return (
//     <div>
//       {/* <h1>Choose a Map Style</h1>
//       <select onChange={(e) => setSelectedStyle(e.target.value)} value={selectedStyle}>
//         {styles.map((style) => (
//           <option key={style.value} value={style.value}>
//             {style.name}
//           </option>
//         ))}
//       </select> */}

//       <div 
//         ref={mapContainerRef}
//         style={{ height: "100vh", width: "100%" }}
//       />
//     </div>
//   );
// };

// export default Map;

import { useState, useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import 'mapbox-gl/dist/mapbox-gl.css';
import { drawRoute, fetchMarkers, resetRoute } from "../services/mapboxService";
import { subscribeAuthState } from "../services/authService";
// import { points1, points2, points3, points4, points5, points6, points7 } from '../components/point2';

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

const Map = () => {
  const [user, setUser] = useState(null);
  const [idToken, setIdToken] = useState(""); // State สำหรับเก็บ token

  const [selectedStyle, setSelectedStyle] = useState("mapbox://styles/mapbox/light-v10");
  const [markers, setMarkers] = useState([]); // State สำหรับเก็บข้อมูลหมุดจาก API
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);

  const styles = [
    { name: "Streets", value: "mapbox://styles/mapbox/streets-v11" },
    { name: "Dark", value: "mapbox://styles/mapbox/dark-v10" },
    { name: "Satellite Streets", value: "mapbox://styles/mapbox/satellite-streets-v11" },
    { name: "Light", value: "mapbox://styles/mapbox/light-v10" }
  ];

  useEffect(() => {
    const unsubscribe = subscribeAuthState(setUser, setIdToken); // เรียกใช้ service
    return () => unsubscribe(); // เมื่อ component ถูกลบออก, ยกเลิกการ subscribe
  }, []); // ใช้ [] เพื่อให้เพียงแค่ครั้งแรกที่ mount

  
  useEffect(() => {
    const fetchAndSetMarkers = async () => {
      try {
        if (idToken) {
          const data = await fetchMarkers(idToken); // เรียกใช้ service ดึงข้อมูล
          setMarkers(data); // เก็บข้อมูลที่ได้จาก API ใน state
        }
      } catch (error) {
        console.error("Error fetching marker data: ", error);
      }
    };
    fetchAndSetMarkers();
  }, [idToken]);


  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: selectedStyle,
      center: [145.03619883, -37.78029297],
      zoom: 13,
      attributionControl: false,
    });

    // ปักหมุดที่จุดศูนย์กลาง
    const centerMarker = new mapboxgl.Marker({ color: 'black' })
      .setLngLat([145.0361988357555, -37.78029297469943])
      .addTo(map);

    mapRef.current = map;

    return () => map.remove(); // Cleanup เมื่อ component ถูกลบ
  }, [selectedStyle]);

  useEffect(() => {
    if (mapRef.current && markers.length > 0) {
      // ลบหมุดเดิมก่อน เพื่อไม่ให้มีหมุดซ้ำ
      const existingMarkers = document.querySelectorAll('.custom-marker');
      existingMarkers.forEach((marker) => marker.remove());
      let currentPopup = null; 
  
      markers.forEach(({ latitude, longitude, first_name, last_name, age, gender, address, status }) => {
        const el = document.createElement('div');
        el.className = 'custom-marker';
        el.style.width = '7px'; // ขนาดจุด
        el.style.height = '7px';
        el.style.backgroundColor = '#58d68d'; // สีของจุด
        // el.style.backgroundColor = status === 0 ? '#FFECA1' : '#58d68d'; // เปลี่ยนสีเป็นเทาถ้า status เป็น 0
        el.style.borderRadius = '50%'; // ทำให้เป็นวงกลม
        el.style.boxShadow = '0 0 5px rgba(0, 0, 0, 0.5)'; // เพิ่มเงาเล็กน้อย
  
        const marker = new mapboxgl.Marker({ element: el })
          .setLngLat([parseFloat(longitude), parseFloat(latitude)]) // แปลง latitude และ longitude เป็นตัวเลข
          .setPopup(
            new mapboxgl.Popup({ closeButton: false }).setHTML(
              `<div">
                <h3>${first_name} ${last_name}</h3>
                <p><strong>Age:</strong> ${age}</p>
                <p><strong>Gender:</strong> ${gender}</p>
                <p><strong>Address:</strong> ${address}</p>
              </div>`
            )
          )
          .addTo(mapRef.current);

      });
    }
  }, [markers, selectedStyle]);


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
          {/* <button
              onClick={() => {
                drawRoute(mapRef.current, points1, 1, "#BB15EE");
                drawRoute(mapRef.current, points2, 2, "#01AF97");
                drawRoute(mapRef.current, points3, 3, "#7306CA");

                drawRoute(mapRef.current, points4, 4, "#0AAAF9");
                drawRoute(mapRef.current, points5, 5, "#6B9EAA");
                drawRoute(mapRef.current, points6, 6, "#FFA68A");
                drawRoute(mapRef.current, points7, 7, "#685B9A");
          }}
          style={{
            backgroundColor: "green",
            color: "white",
            padding: "10px",
            borderRadius: "5px",
            marginLeft: "75%",
      }}
        >
          Draw Multi-Point Route
        </button> */}

    {/* <button
      onClick={() => resetRoute(mapRef.current)}
      style={{
        backgroundColor: "red",
        color: "white",
        padding: "10px",
        borderRadius: "5px",
        margin: "10px",
      }}
    >
      Reset Route
    </button> */}
        </div>
      );
    };

export default Map;

  // mapRef.current = map;

    // map.on('click', (e) => {
    //   const { lng, lat } = e.lngLat;
    //   console.log('Clicked at:', lng, lat);

    //   // const marker = new mapboxgl.Marker().setLngLat([lng, lat]).addTo(map);

    //   // setMarkers((prevMaerkers) => [...prevMaerkers, {lng,lat,marker}]);

    //  map.flyTo({
    //     center: [lng, lat],
    //     zoom: 12,
    //     essential: true,
    //   });
    //   const center = turf.point([lng, lat]);
    //   const radius = 5;
    //   const options = { steps: 64, units: 'kilometers' };
    //   const circle = turf.circle(center, radius, options);

    //   // Add the circle to the map
    //   if (map.getSource('circle')) {
    //     map.getSource('circle').setData(circle); // อัปเดตวงกลมเดิม
    //   } else {
    //     map.addSource('circle', {
    //       type: 'geojson',
    //       data: circle,
    //     });

    //     map.addLayer({
    //       id: 'circle-layer',
    //       type: 'fill',
    //       source: 'circle',
    //       paint: {
    //         'fill-color': '#3887be',
    //         'fill-opacity': 0.4,
    //       },
    //     });
    //   }
  
    //   // Add a marker at the center
    //   // new mapboxgl.Marker().setLngLat([lng, lat]).addTo(map);
    // });
