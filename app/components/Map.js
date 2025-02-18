import { useState, useEffect, useRef, forwardRef, useImperativeHandle } from "react";
import mapboxgl from "mapbox-gl";
import 'mapbox-gl/dist/mapbox-gl.css';
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";


import { drawRoute, fetchMarkers, resetRoute, fetchRoutes, fetchRouteByTripId, getRandomHexColor } from "../services/mapboxService";
import { fetchMapCenter } from "../services/schoolService";
import { subscribeAuthState } from "../services/authService";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

const Map = forwardRef((props, ref) => {

  const { radiusValues } = props; // รับค่าจาก Sidebar

  console.log(">> Radius: " + radiusValues);


  const [user, setUser] = useState(null);
  const [idToken, setIdToken] = useState(""); // State สำหรับเก็บ token


  const [markers, setMarkers] = useState([]); // State สำหรับเก็บข้อมูลหมุดจาก API
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const [mapCenter, setMapCenter] = useState([0, 0]);
  const [isLoading, setIsLoading] = useState(false); // สถานะโหลด

  const [depotLat, setDepotLat] = useState();
  const [depotLng, setDepotLng] = useState();



  const refetchData = async () => {
    console.log("map data...");

    try {
      if (idToken) {
        // 🔹 Fetch markers ใหม่
        const data = await fetchMarkers(idToken);
        setMarkers(data);

        // 🔹 Fetch center ของโรงเรียนใหม่
        const mark_center = await fetchMapCenter(idToken);
        setMapCenter(mark_center);
        setDepotLat(mark_center[1]);
        setDepotLng(mark_center[0]);

        // 🔹 รีเซ็ตแผนที่
        if (mapRef.current) {
          const map = initializeMap(mark_center);
          mapRef.current = map;

          // โหลดหมุดใหม่
          if (data.length > 0) {
            addMarkersToMap(map, data);
          }
        }
        console.log("Map data refetched successfully.");
      }
    } catch (error) {
      console.error("Error refetching data:", error);
    }
  };

  // com อื่น ใช้ func ได้
  useImperativeHandle(ref, () => ({
    handleSubmit,
    handleReset,
    handleDrawRoute,
    handleAddCircleClick,
    clearAllElements,
    removeElement,
    updateCircleRadius,
    goMarkerById,
    refetchData,
    handleFindAuto,
  }));




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

          // ส่งข้อมูล markers กลับไปยัง Parent Component
          if (props.onMarkersUpdate && typeof props.onMarkersUpdate === 'function') {
            props.onMarkersUpdate(data);
          }

          const mark_center = await fetchMapCenter(idToken);
          setMapCenter(mark_center);
          setDepotLat(mark_center[1]);
          setDepotLng(mark_center[0]);
        }
      } catch (error) {
        console.error("Error fetching marker data: ", error);
      }
    };
    fetchAndSetMarkers();
  }, [idToken]);


  // ฟังก์ชันสำหรับการสร้างแผนที่
  const initializeMap = (mapCenter) => {
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/light-v10",
      center: mapCenter,
      zoom: 12,
      attributionControl: false,
      dragPan: true,
      scrollZoom: true,
      boxZoom: false,
      dragRotate: false,
    });

    if (mapCenter[0] !== 0 && mapCenter[1] !== 0) {
      new mapboxgl.Marker({ color: "black" }).setLngLat(mapCenter).addTo(map);
    }

    return map;
  };




  const markersRef = useRef({}); // Use useRef to persist markers across renders

  function addMarkersToMap(map, markers) {
    const existingMarkers = document.querySelectorAll('.custom-marker');
    existingMarkers.forEach((marker) => marker.remove());

    markers.forEach(({ id, latitude, longitude, first_name, last_name, age, gender, address, status }) => {
      const el = document.createElement('div');
      el.className = 'custom-marker';
      el.style.width = '8px';
      el.style.height = '8px';
      el.style.backgroundColor = '#07A1E8';
      el.style.borderRadius = '50%';
      el.style.boxShadow = '0 0 5px rgba(0, 0, 0, 0.5)';

      const marker = new mapboxgl.Marker({ element: el })
        .setLngLat([parseFloat(longitude), parseFloat(latitude)])
        .setPopup(
          new mapboxgl.Popup({ closeButton: false })
            .setHTML(
              `<div style="max-width: 250px; word-wrap: break-word; overflow-wrap: break-word; word-break: break-word; white-space: normal;">
            <h1 style="font-size: 15px"><strong>${first_name} ${last_name}</strong></h1>
            <p><strong>Age:</strong> ${age}</p>
            <p><strong>Gender:</strong> ${gender}</p>
            <p><strong>Address:</strong> ${address}</p>
          </div>`
            )
            .setOffset([0, -10]) // Adjust this value to move the popup higher or lower
        )
        .addTo(map);

      markersRef.current[id] = marker; // Use useRef to persist the markers


      el.addEventListener('click', () => {
        map.flyTo({
          center: [parseFloat(longitude), parseFloat(latitude)],
          zoom: 17,
          speed: 1.5,
          curve: 1.5,
          easing(t) {
            return t;
          },
        });
        marker.togglePopup();
      });
    });
  }

  const goMarkerById = (id) => {
    // Access markersRef correctly
    const marker = markersRef.current[id];
    if (marker) {
      // Close any open popups first
      const allPopups = document.querySelectorAll('.mapboxgl-popup'); // Get all popups
      allPopups.forEach(popup => popup.remove()); // Remove all open popups

      // Fly to the marker
      mapRef.current.flyTo({
        center: marker.getLngLat(), // Ensure map is centered at the marker position
        zoom: 17,
        speed: 1.5,
        curve: 1.5,
        easing(t) {
          return t;
        },
      });

      // Show the popup associated with the marker
      marker.getPopup().addTo(mapRef.current); // Directly add the popup to the map
    } else {
      console.warn(`Marker with id ${id} not found.`);
    }
  };


  // ------------------------pin รัศมี--------------------------------------------


  const AddCircleClickRef = useRef(false);
  const [AddCircleClick, setAddCircleClick] = useState(false);

  const [mapElements, setMapElements] = useState([]); // เก็บข้อมูลหมุดและวงกลมทั้งหมด


  // use, stably

  const handleAddCircleClick = () => {
    return new Promise((resolve) => {
      setAddCircleClick((prev) => !prev); // สลับค่าระหว่าง true และ false

      if (mapRef.current) {
        mapRef.current.on('click', async (event) => {
          const { lng, lat } = event.lngLat;
          resolve({ lng, lat }); // ส่งค่าพิกัดกลับหลังจากคลิก
        });
      }
    });
  };



  useEffect(() => {
    AddCircleClickRef.current = AddCircleClick;
  }, [AddCircleClick]);

  const drawCircle = (center, radius, map, circleId) => {
    const points = 64;
    const coordinates = [];
    const distanceX = radius / (111.32 * Math.cos((center[1] * Math.PI) / 180));
    const distanceY = radius / 110.574;

    for (let i = 0; i < points; i++) {
      const theta = (i / points) * (2 * Math.PI);
      const x = distanceX * Math.cos(theta);
      const y = distanceY * Math.sin(theta);
      coordinates.push([center[0] + x, center[1] + y]);
    }
    coordinates.push(coordinates[0]);

    const circleGeoJSON = {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          geometry: {
            type: "Polygon",
            coordinates: [coordinates],
          },
        },
      ],
    };

    if (map.getSource(circleId)) {
      map.getSource(circleId).setData(circleGeoJSON);
    } else {
      map.addSource(circleId, {
        type: "geojson",
        data: circleGeoJSON,
      });

      map.addLayer({
        id: circleId,
        type: "fill",
        source: circleId,
        layout: {},
        paint: {
          "fill-color": "rgba(0, 248, 62, 0.5)",
          "fill-opacity": 0.5,
        },
      });

      // map.addLayer({
      //   id: circleId + "-outline",
      //   type: "line",
      //   source: circleId,
      //   layout: {},
      //   // paint: {

      //   //   "line-width": 2  // ปรับความหนาของเส้นขอบตามที่ต้องการ (เช่น 2 พิกเซล)
      //   // },
      // });
    }
  };

  // ฟังก์ชันคำนวณระยะทางระหว่างจุดสองจุด (หน่วย: กิโลเมตร)
  // const calculateDistance = (lat1, lon1, lat2, lon2) => {
  //   const R = 6371; // รัศมีโลก (km)
  //   const dLat = (lat2 - lat1) * Math.PI / 180;
  //   const dLon = (lon2 - lon1) * Math.PI / 180;
  //   const a =
  //     Math.sin(dLat / 2) * Math.sin(dLat / 2) +
  //     Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
  //     Math.sin(dLon / 2) * Math.sin(dLon / 2);
  //   const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  //   return R * c;
  // };

  const calculateDistance = (lat1, lng1, lat2, lng2) => {
    const R = 6371; // รัศมีโลกเป็นกิโลเมตร
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(lat1 * Math.PI / 180) *
      Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLng / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };


  // ฟังก์ชันเช็คว่านักเรียนอยู่ในวงกลมหรือไม่
  const checkIfStudentInCircle = (studentLat, studentLng, circleLat, circleLng, radius) => {
    const distance = calculateDistance(studentLat, studentLng, circleLat, circleLng);
    return distance <= radius;
  };

  // ฟังก์ชันสำหรับอัปเดตการจัดสรรนักเรียนให้กับหมุดทั้งหมดใหม่
  // โดยให้นักเรียนแต่ละคนอยู่ในหมุดที่ใกล้ที่สุด (เฉพาะหมุดที่วงกลมครอบคลุมนักเรียน)
  const updateStudentAssignments = (circles, markers) => {
    // รีเซ็ตข้อมูลนักเรียนในแต่ละหมุดก่อน
    const newCircles = circles.map(circle => ({ ...circle, students: [] }));

    // วนลูปตรวจสอบนักเรียนแต่ละคน
    markers.forEach(student => {
      let nearestCircle = null;
      let minDistance = Infinity;
      newCircles.forEach(circle => {
        // ตรวจสอบว่านักเรียนอยู่ในวงกลมของหมุดนี้หรือไม่
        if (checkIfStudentInCircle(student.latitude, student.longitude, circle.lat, circle.lng, circle.radius)) {
          const distance = calculateDistance(student.latitude, student.longitude, circle.lat, circle.lng);
          if (distance < minDistance) {
            minDistance = distance;
            nearestCircle = circle;
          }
        }
      });
      // หากพบหมุดที่นักเรียนอยู่ในวงและใกล้ที่สุด ให้นำนักเรียนไปเก็บในหมุดนั้น
      if (nearestCircle) {
        nearestCircle.students.push(student);
      }
    });

    return newCircles;
  };


  // กำหนดตัวแปร global สำหรับนับ marker
  const markerCounterRef = useRef(1);



  const onMapClick = (event, map, radius) => {
    const { lng, lat } = event.lngLat;
    const circleId = `circle-${lng}-${lat}`;

    // สร้าง element สำหรับ marker แบบ custom พร้อมแสดงหมายเลข
    const markerEl = document.createElement("div");
    markerEl.className = "custom-marker";
    markerEl.textContent = markerCounterRef.current; // ใช้ markerCounterRef.current แสดงหมายเลข
    markerCounterRef.current++; // เพิ่มค่าตัวนับ
    // กำหนดสไตล์ให้กับ marker element
    markerEl.style.backgroundColor = "yellow";
    markerEl.style.color = "black";
    markerEl.style.borderRadius = "50%";
    markerEl.style.width = "15px";
    markerEl.style.height = "15px";
    markerEl.style.display = "flex";
    markerEl.style.alignItems = "center";
    markerEl.style.justifyContent = "center";
    markerEl.style.fontWeight = "bold";

    // ตั้งค่า data attribute เพื่อเก็บค่า radius ปัจจุบัน
    markerEl.dataset.radius = radius;

    // สร้าง marker ด้วย element ที่กำหนดเองและให้สามารถลากได้
    const marker = new mapboxgl.Marker({ element: markerEl, draggable: true })
      .setLngLat([lng, lat])
      .addTo(map);

    // วาดวงกลมบนแผนที่ด้วยค่า radius ที่ส่งเข้ามา
    drawCircle([lng, lat], radius, map, circleId);

    // สร้างวัตถุใหม่สำหรับหมุด (circle)
    const newCircle = { marker, circleId, map, lng, lat, radius, students: [] };

    // เพิ่มหมุดใหม่ลงใน state แล้วรีคำนวณการจัดสรรนักเรียน
    setMapElements((prev) => {
      const updatedCircles = [...prev, newCircle];
      return updateStudentAssignments(updatedCircles, markers);
    });

    // เมื่อ marker ถูกลาก (dragend)
    marker.on("dragend", () => {
      const newLngLat = marker.getLngLat();
      // อ่านค่า radius ปัจจุบันจาก marker element
      const currentRadius = parseFloat(marker.getElement().dataset.radius);

      // วาดวงกลมใหม่ในตำแหน่งที่ลาก โดยใช้ currentRadius
      drawCircle([newLngLat.lng, newLngLat.lat], currentRadius, map, circleId);

      // อัปเดต state ของหมุดด้วยตำแหน่งใหม่และค่า radius ปัจจุบัน
      setMapElements((prev) => {
        const updatedCircles = prev.map((el) =>
          el.circleId === circleId
            ? { ...el, lng: newLngLat.lng, lat: newLngLat.lat, radius: currentRadius }
            : el
        );
        // รีคำนวณการจัดสรรนักเรียนใหม่ในทุกหมุด
        return updateStudentAssignments(updatedCircles, markers);
      });
    });

    // ปิดการเพิ่มหมุดใหม่ (ถ้าต้องการ)
    setAddCircleClick(false);
  };

  // ----------------------------------------------------------------------------------------

  // ใช้ useEffect เพื่อส่งข้อมูลไปที่ Parent Component เมื่อ mapElements เปลี่ยนแปลง
  useEffect(() => {
    if (typeof props.onMapElementsUpdate === "function") {
      props.onMapElementsUpdate(mapElements);
    }
  }, [mapElements, props.onMapElementsUpdate]); // อัปเดตเมื่อ mapElements เปลี่ยนแปล


  //good
  const updateCircleRadius = (idx, newRadius) => {
    console.log("Updating circle radius for index", idx, "to", newRadius);

    const element = mapElements[idx];
    if (element) {
      const { circleId, map, lng, lat, marker } = element;
      // วาดวงกลมใหม่ด้วยค่า newRadius
      drawCircle([lng, lat], newRadius, map, circleId);
      // อัปเดตค่า data attribute ใน marker ให้เป็น newRadius
      marker.getElement().dataset.radius = newRadius;
      // คำนวณนักเรียนที่อยู่ในวงกลมนี้ โดยใช้ newRadius
      const updatedStudents = markers.filter(student =>
        checkIfStudentInCircle(student.latitude, student.longitude, lat, lng, newRadius)
      );
      // อัปเดต state ของ mapElements
      setMapElements((prev) => {
        // อัปเดตเฉพาะ element ที่ index ตรงกัน
        const updatedCircles = prev.map((el, i) =>
          i === idx ? { ...el, radius: newRadius, students: updatedStudents } : el
        );
        // รีคำนวณการจัดสรรนักเรียนในทุกหมุด
        return updateStudentAssignments(updatedCircles, markers);
      });
    }
  };


  const removeElement = (idx) => {
    const element = mapElements[idx]; // ค้นหา element ตาม index
    if (!element) return;

    const { marker, circleId, map } = element;

    // ลบ marker
    marker.remove();

    // ลบ outline layer (ถ้ามี)
    if (map.getLayer(circleId + "-outline")) {
      map.removeLayer(circleId + "-outline");
    }
    // ลบ fill layer
    if (map.getLayer(circleId)) {
      map.removeLayer(circleId);
    }
    // รอจนกว่า map จะ idle แล้วลบ source
    map.once("idle", () => {
      if (map.getSource(circleId)) {
        map.removeSource(circleId);
      }
    });

    // ลบ element ที่ index ที่เลือกออกจาก state
    const newElements = mapElements.filter((_, i) => i !== idx);

    // อัปเดตการจัดสรรนักเรียนใหม่ในทุกหมุด โดยใช้ฟังก์ชัน updateStudentAssignments
    const updatedCircles = updateStudentAssignments(newElements, markers);

    // อัปเดตหมายเลข marker ใหม่ให้เรียงลำดับตามลำดับใน updatedCircles
    updatedCircles.forEach((el, index) => {
      el.marker.getElement().textContent = index + 1;
    });

    // รีเซ็ต markerCounterRef ให้ตรงกับจำนวน marker ที่เหลือ + 1
    markerCounterRef.current = updatedCircles.length + 1;

    // อัปเดต state mapElements ด้วยข้อมูลใหม่
    setMapElements(updatedCircles);

    // หากมี callback แจ้ง Parent Component ให้ส่งข้อมูลใหม่ไปด้วย
    if (typeof onMapElementsUpdate === "function") {
      props.onMapElementsUpdate(updatedCircles);
    }
  };

  const clearAllElements = () => {
    mapElements.forEach(({ marker, circleId, map }) => {
      // ลบ marker
      marker.remove();

      // ลบ outline layer ก่อน (ถ้ามี)
      if (map.getLayer(circleId + "-outline")) {
        map.removeLayer(circleId + "-outline");
      }
      // ลบ fill layer
      if (map.getLayer(circleId)) {
        map.removeLayer(circleId);
      }
      // ลบ source
      if (map.getSource(circleId)) {
        map.removeSource(circleId);
      }
    });

    // รีเซ็ต marker counter (หรือใช้ useRef ตามที่แนะนำ)
    markerCounterRef.current = 1;

    // อัปเดต state และแจ้ง Parent Component
    setMapElements([]);
    if (typeof onMapElementsUpdate === "function") {
      props.onMapElementsUpdate([]);
    }
  };

  useEffect(() => {
    if (!mapCenter || (mapCenter[0] === 0 && mapCenter[1] === 0)) return;

    const map = initializeMap(mapCenter);
    mapRef.current = map;

    // map.on("click", (event) => {
    //   if (AddCircleClickRef.current) {
    //     onMapClick(event, map, 0.5);
    //   }
    // });

    map.on("click", (event) => {
      if (AddCircleClickRef.current) {
        // ใช้ค่า radius จาก prop radiusValues สำหรับ marker ใหม่
        const currentRadius = (radiusValues && radiusValues.length > 0)
          ? radiusValues[radiusValues.length - 1]
          : 0.5;
        onMapClick(event, map, currentRadius);
      }
    });



    map.on('style.load', () => {
      map.setProjection('globe');
    });



    if (markers.length > 0) {
      addMarkersToMap(map, markers);
    }

    return () => map.remove();
  }, [mapCenter, markers]);

  // MAP END *************************************************************************************************  


  const [routes, setRoutes] = useState([]); // เก็บข้อมูล routes
  const [routeColors, setRouteColors] = useState([]);

  useEffect(() => {
    console.log("Updated routeColors:", routeColors);
  }, [routeColors]);




  const handleSubmit = async (num_bus, max_stops, max_time, type, findBy, trip_id, roteImport) => {
    const locations = markers.map((marker) => [parseFloat(marker.latitude), parseFloat(marker.longitude)]);
    const data = {
      depot: [parseFloat(depotLat), parseFloat(depotLng)],
      num_vehicles: num_bus,
      max_stops_per_vehicle: max_stops,
      max_travel_time: max_time * 60, // แปลงเวลาเป็นวินาที
      locations: locations,
    };

    // รีเซ็ตสถานะ
    setRouteColors([]);
    setRoutes([]);
    resetRoute(mapRef.current);

    setIsLoading(true); // เริ่มโหลด


    // console.log("FFFFFFFF  FFF "+JSON.stringify(data, null, 2));


    try {

      let result = []
      let bus_sp = []
      let colors = []
      let route_type

      // เรียก fetchRoutes เพื่อคำนวณเส้นทาง
      if (findBy === "home") {
        result = await fetchRoutes(idToken, mapRef.current, data);
        // setRoutes(result);
        // console.log("route ที่ได้ "+ JSON.stringify(result, null, 2));
        console.log("route ที่ได้ " + result);

        route_type = "home"
        colors = result.map(() => getRandomHexColor());
        // setRouteColors(colors);

      } else if (findBy === "bus") {
        console.log("This: " + max_stops);
        const depot = [parseFloat(depotLat), parseFloat(depotLng)];
        const capacity = max_stops; // เช่น 5 คนต่อคัน
        // กำหนดระยะทาง threshold สำหรับรวมจุด (ปรับตามความเหมาะสม)
        const distanceThreshold = 2.5; // กิโลเมตร

        // 1. สร้าง pickup units จากแต่ละ bus stop
        // โครงสร้าง: { lat, lng, count, stopId, studentPositions }
        let pickupUnits = [];
        mapElements.forEach((stop) => {
          const count = stop.students.length;
          if (count > capacity) {
            const fullUnits = Math.floor(count / capacity);
            const remainder = count % capacity;
            for (let i = 0; i < fullUnits; i++) {
              pickupUnits.push({
                lat: stop.lat,
                lng: stop.lng,
                count: capacity,
                stopId: stop.circleId || stop.id,
                studentPositions: stop.students
                  .slice(i * capacity, (i + 1) * capacity)
                  .map((s) => [s.latitude, s.longitude]),
              });
            }
            if (remainder > 0) {
              pickupUnits.push({
                lat: stop.lat,
                lng: stop.lng,
                count: remainder,
                stopId: stop.circleId || stop.id,
                studentPositions: stop.students
                  .slice(fullUnits * capacity)
                  .map((s) => [s.latitude, s.longitude]),
              });
            }
          } else {
            pickupUnits.push({
              lat: stop.lat,
              lng: stop.lng,
              count: count,
              stopId: stop.circleId || stop.id,
              studentPositions: stop.students.map((s) => [s.latitude, s.longitude]),
            });
          }
        });
        // ตัวอย่าง: Bus Stop 1 (7 pax) → ได้ unit: {count: 5} และ {count: 2}
        //           Bus Stop 2 (3 pax) → ได้ unit: {count: 3}

        // 2. แยก pickupUnits เป็น fullUnits (ครบ capacity) และ remainderUnits (ไม่ครบ)
        const fullUnits = pickupUnits.filter((unit) => unit.count === capacity);
        let remainderUnits = pickupUnits.filter((unit) => unit.count < capacity);

        // 3. รวม remainderUnits ที่อยู่ใกล้กัน (ใช้ greedy approach)
        const calculateDistance = (lat1, lng1, lat2, lng2) => {
          const R = 6371; // กิโลเมตร
          const dLat = (lat2 - lat1) * Math.PI / 180;
          const dLng = (lng2 - lng1) * Math.PI / 180;
          const a =
            Math.sin(dLat / 2) ** 2 +
            Math.cos(lat1 * Math.PI / 180) *
            Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLng / 2) ** 2;
          const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
          return R * c;
        };

        let used = new Array(remainderUnits.length).fill(false);
        const combinedGroups = [];
        for (let i = 0; i < remainderUnits.length; i++) {
          if (used[i]) continue;
          let group = [remainderUnits[i]];
          let sum = remainderUnits[i].count;
          let combinedStudentPositions = [...remainderUnits[i].studentPositions];
          used[i] = true;
          for (let j = i + 1; j < remainderUnits.length; j++) {
            if (used[j]) continue;
            const d = calculateDistance(
              remainderUnits[i].lat,
              remainderUnits[i].lng,
              remainderUnits[j].lat,
              remainderUnits[j].lng
            );
            if (d <= distanceThreshold && sum + remainderUnits[j].count <= capacity) {
              group.push(remainderUnits[j]);
              sum += remainderUnits[j].count;
              combinedStudentPositions = combinedStudentPositions.concat(
                remainderUnits[j].studentPositions
              );
              used[j] = true;
              if (sum === capacity) break;
            }
          }
          combinedGroups.push({ group, total: sum, studentPositions: combinedStudentPositions });
        }

        // 4. สร้าง routes (trips) และเก็บตำแหน่งนักเรียน (busStudentPositions)
        let trips = [];
        let busStudentPositions = [];

        // สำหรับ fullUnits: แต่ละ unitสร้าง routeแบบ round-trip: depot -> [lat, lng] -> depot
        fullUnits.forEach((unit) => {
          trips.push({
            [`route ${trips.length + 1}`]: [
              depot,
              [unit.lat, unit.lng],
              depot,
            ],
          });
          busStudentPositions.push({
            [`bus ${busStudentPositions.length + 1}`]: unit.studentPositions,
          });
        });

        // สำหรับแต่ละกลุ่มใน combinedGroups: สร้าง routeโดยรวมทุก unitในกลุ่ม
        combinedGroups.forEach((item) => {
          const routeCoordinates = [
            depot,
            ...item.group.map((unit) => [unit.lat, unit.lng]),
            depot,
          ];
          trips.push({ [`route ${trips.length + 1}`]: routeCoordinates });
          busStudentPositions.push({
            [`bus ${busStudentPositions.length + 1}`]: item.studentPositions,
          });
        });

        const data = { trips, busStudentPositions };
        result = data.trips;
        bus_sp = data.busStudentPositions;
        // console.log("Routes: ", JSON.stringify(data.trips, null, 2));
        // console.log("Bus: ", JSON.stringify(data.busStudentPositions, null, 2));

        route_type = "bus"
        colors = result.map(() => getRandomHexColor());

      }
      else if (findBy === "his") {
        result = await fetchRouteByTripId(idToken, trip_id);

        console.log("HIS " + result);

        // colors = result.map(() => getRandomHexColor());
        colors = result.map(route => route.color);
        console.log("this color" + colors);

      } else if (findBy === "import") {
        result = roteImport;

        console.log("import " + result);


        colors = result.map(route => route.color);
        console.log("this color" + colors);

      } else {

      }


      const distance = [];
      const duration = [];

      // Create an array of Promises
      const drawPromises = result.map(async (route, index) => {
        const routeKey = `route ${index + 1}`;
        const coordinates = route[routeKey];

        console.log("routeKey in MAP :" + routeKey);

        if (coordinates) {
          try {
            const didu = await drawRoute(mapRef.current, coordinates, routeKey, colors[index], type);
            distance.push(didu.distance); // Push distance when resolved
            duration.push(didu.duration); // Push duration when resolved
            return didu;
          } catch (error) {
            console.error("Error drawing route:", error);
          }
        }
        return null;
      });

      // Wait for all Promises to complete
      const diduArray = await Promise.all(drawPromises);


      // console.log("this route Befor send: "+ result);
      // console.log("bus to school student: -> ", mapElements);

      const studentsPerCircle = mapElements.map(element => {
        return {
          students: element.students || []
        };
      });

      console.log("Students per circle:", studentsPerCircle);



      return { routes: result, routeColors: colors, routeDistance: distance, routeDuration: duration, Didu: JSON.stringify(diduArray, null, 2), route_type: route_type, bus_SP: bus_sp, student_inBus: studentsPerCircle };

    } catch (error) {
      console.error("Error drawing routes:", error);
      throw error; // ส่งข้อผิดพลาดออกไป
    } finally {
      setIsLoading(false); // สิ้นสุดการโหลด
    }
  };
  //-------------------------------------------------------------------------


  const handleReset = () => {
    setRouteColors([]); // รีเซ็ตสีทั้งหมด
    setRoutes([]); // รีเซ็ตเส้นทางทั้งหมด
    resetRoute(mapRef.current); // ลบเส้นทางบนแผนที่ (ถ้ามีฟังก์ชัน resetRoute)
  };



  // time count
  const [elapsedTime, setElapsedTime] = useState(0); // เก็บเวลาที่ผ่านไป

  useEffect(() => {
    let timer;
    if (isLoading) {
      setElapsedTime(0); // รีเซ็ตเวลาเมื่อเริ่มโหลด
      timer = setInterval(() => {
        setElapsedTime((prev) => prev + 1); // เพิ่มเวลาทีละ 1 วินาที
      }, 1000);
    } else {
      clearInterval(timer); // หยุดการนับเมื่อโหลดเสร็จ
    }
    return () => clearInterval(timer); // ล้าง timer เมื่อ component ถูก unmount
  }, [isLoading]);



  const handleDrawRoute = async (route, routeKey, routeColor, type) => {
    const coordinates = route[routeKey];
    if (coordinates) {
      const result = await drawRoute(mapRef.current, coordinates, routeKey, routeColor, type); // แสดงลำดับหมุด
      // console.log(".....> "+result);
      return result;
    }
  };







  // const calculateStudentClusters = (markers, maxCapacity, radius) => {
  //   const clusters = [];

  //   let remainingMarkers = [...markers];
  //   while (remainingMarkers.length > 0) {
  //     const center = [remainingMarkers[0].longitude, remainingMarkers[0].latitude];
  //     const cluster = {
  //       center,
  //       students: [],
  //     };

  //     remainingMarkers = remainingMarkers.filter((student) => {
  //       const distance = calculateDistance(student.latitude, student.longitude, center[1], center[0]);
  //       if (distance <= radius && cluster.students.length < maxCapacity) {
  //         cluster.students.push(student);
  //         return false; // Remove from remainingMarkers
  //       }
  //       return true;
  //     });

  //     clusters.push(cluster);
  //   }

  //   return clusters;
  // };




  // const drawCircleWithColor = (center, radius, map, circleId, color) => {
  //   const points = 64;
  //   const coordinates = [];
  //   const distanceX = radius / (111.32 * Math.cos((center[1] * Math.PI) / 180));
  //   const distanceY = radius / 110.574;

  //   for (let i = 0; i < points; i++) {
  //     const theta = (i / points) * (2 * Math.PI);
  //     const x = distanceX * Math.cos(theta);
  //     const y = distanceY * Math.sin(theta);
  //     coordinates.push([center[0] + x, center[1] + y]);
  //   }
  //   coordinates.push(coordinates[0]);

  //   const circleGeoJSON = {
  //     type: "FeatureCollection",
  //     features: [
  //       {
  //         type: "Feature",
  //         geometry: {
  //           type: "Polygon",
  //           coordinates: [coordinates],
  //         },
  //       },
  //     ],
  //   };

  //   if (map.getSource(circleId)) {
  //     map.getSource(circleId).setData(circleGeoJSON);
  //   } else {
  //     map.addSource(circleId, {
  //       type: "geojson",
  //       data: circleGeoJSON,
  //     });

  //     map.addLayer({
  //       id: circleId,
  //       type: "fill",
  //       source: circleId,
  //       layout: {},
  //       paint: {
  //         "fill-color": color,
  //         "fill-opacity": 0.4,
  //       },
  //     });

  //     map.addLayer({
  //       id: circleId + "-outline",
  //       type: "line",
  //       source: circleId,
  //       layout: {},
  //       paint: {
  //         "line-color": color,
  //         "line-width": 2,
  //       },
  //     });
  //   }
  // };




  // const getRandomHexColor = () => {
  //   let color = Math.floor(Math.random() * 16777215).toString(16);
  //   return `#${color.padStart(6, "0")}`; // เติม 0 ด้านหน้าให้ครบ 6 หลัก
  // };


  // ประกาศ findCoverageCircles ก่อนใช้งาน
  // const findCoverageCircles = (studentPositions, radius = 1) => {
  //   let uncovered = [...studentPositions]; // clone อาร์เรย์ของตำแหน่งนักเรียน
  //   let centers = [];
  //   while (uncovered.length > 0) {
  //     // เลือกตำแหน่งตัวแรกใน uncovered เป็นศูนย์กลางของวงกลม
  //     const center = uncovered[0];
  //     centers.push(center);
  //     // ลบนักเรียนทั้งหมดที่อยู่ภายในรัศมี 1 กม. จาก center
  //     uncovered = uncovered.filter(pos => calculateDistance(center[0], center[1], pos[0], pos[1]) > radius);
  //   }
  //   return centers;
  // };



  //   useEffect(() => {
  //     const fetchAndSetMarkers = async () => {
  //       try {
  //         if (idToken) {
  //           const data = await fetchMarkers(idToken);
  //           setMarkers(data);
  //           setMapElements(data); // ถ้าข้อมูลที่ได้มีโครงสร้างตรงกับ mapElements ที่ต้องการ
  //         }
  //       } catch (error) {
  //         console.error("Error fetching marker data: ", error);
  //       }
  //     };
  //     fetchAndSetMarkers();
  //   }, [idToken]);


  //   mapElements.forEach((stop) => {
  //     if (stop.students && stop.students.length > 0) {
  //       stop.students.forEach((student) => {
  //         allStudentPositions.push([parseFloat(student.latitude), parseFloat(student.longitude)]);
  //       });
  //     }
  //   });




  //   const handleFindAuto = () => {
  //     console.log("Find Auto button clicked");
  //     console.log("mapElements:", mapElements);

  //     let allStudentPositions = [];
  //     mapElements.forEach((student) => {
  //       if ((student.latitude || student.lat) && (student.longitude || student.lng)) {
  //         allStudentPositions.push([
  //           parseFloat(student.latitude || student.lat),
  //           parseFloat(student.longitude || student.lng)
  //         ]);
  //       }
  //     });
  //     console.log("Total student positions:", allStudentPositions.length);

  //     if (allStudentPositions.length === 0) {
  //       console.log("No student positions found!");
  //       return;
  //     }

  //     const centers = findCoverageCircles(allStudentPositions, 1);
  //     console.log("Calculated auto marker stops:", centers);

  //     centers.forEach((center, idx) => {
  //       const circleId = `auto-circle-${idx + 1}`;
  //       drawCircle([center[1], center[0]], 1, mapRef.current, circleId);

  //       const markerEl = document.createElement("div");
  //       markerEl.className = "auto-marker";
  //       markerEl.textContent = idx + 1;
  //       markerEl.style.backgroundColor = "red";
  //       markerEl.style.color = "white";
  //       markerEl.style.borderRadius = "50%";
  //       markerEl.style.width = "20px";
  //       markerEl.style.height = "20px";
  //       markerEl.style.display = "flex";
  //       markerEl.style.alignItems = "center";
  //       markerEl.style.justifyContent = "center";

  //       new mapboxgl.Marker({ element: markerEl })
  //         .setLngLat([center[1], center[0]])
  //         .addTo(mapRef.current);
  //     });
  //   };





  // ฟังก์ชันหาจุดศูนย์กลางเพื่อครอบคลุมนักเรียนด้วยวงกลมรัศมี 1 กม. แบบ Greedy
  // const findCoverageCircles = (studentPositions, radius = 1) => {
  //   let uncovered = [...studentPositions]; // clone รายการนักเรียน
  //   let centers = [];
  //   while (uncovered.length > 0) {
  //     const center = uncovered[0]; // เลือกนักเรียนตัวแรกที่ยังไม่ได้ถูกครอบคลุม
  //     centers.push(center);
  //     // ลบนักเรียนที่อยู่ภายในรัศมี 1 กม. จาก center
  //     uncovered = uncovered.filter(
  //       pos => calculateDistance(center[0], center[1], pos[0], pos[1]) > radius
  //     );
  //   }
  //   return centers;
  // };

  // ฟังก์ชัน handleFindAuto เมื่อกดปุ่ม "Find Auto"
  // ฟังก์ชันหาจุดครอบคลุมนักเรียนด้วยวงกลม 1 กม. แบบ Greedy
  const findCoverageCircles = (studentPositions, radius = 1) => {
    let uncovered = [...studentPositions]; // clone array
    let centers = [];
    while (uncovered.length > 0) {
      const center = uncovered[0]; // เลือกนักเรียนตัวแรกที่ยังไม่ได้ถูกครอบคลุม
      centers.push(center);
      // ลบนักเรียนที่อยู่ภายในรัศมี 1 กม. จาก center
      uncovered = uncovered.filter(pos => calculateDistance(center[0], center[1], pos[0], pos[1]) > radius);
    }
    return centers;
  };

  // ฟังก์ชัน handleFindAuto สำหรับปุ่ม "Find Auto"
  const handleFindAuto = () => {
    console.log("Find Auto button clicked");
    // 1. รวบรวมตำแหน่งนักเรียนจาก markers (หรือ mapElements ถ้าเก็บนักเรียนไว้ในนั้น)
    let allStudentPositions = [];
    markers.forEach((student) => {
      if ((student.latitude || student.lat) && (student.longitude || student.lng)) {
        allStudentPositions.push([
          parseFloat(student.latitude || student.lat),
          parseFloat(student.longitude || student.lng)
        ]);
      }
    });
    console.log("Total student positions:", allStudentPositions.length);

    if (allStudentPositions.length === 0) {
      console.log("No student positions found!");
      return;
    }

    // 2. คำนวณหาจุดครอบคลุมนักเรียนด้วยวงกลม 1 กม.
    const centers = findCoverageCircles(allStudentPositions, 1);
    console.log("Calculated auto marker stops:", centers);

    // 3. สร้าง auto circles จาก centers (สร้าง auto stop object คล้ายกับการปักหมุดแบบ manual)
    const autoCircles = centers.map((center, idx) => {
      const circleId = `auto-circle-${idx + 1}`;
      // วาดวงกลมที่จุดนี้ โดยพิกัดสำหรับ Mapbox คือ [lng, lat]
      drawCircle([center[1], center[0]], 1, mapRef.current, circleId);

      // สร้าง marker element แบบ custom
      const markerEl = document.createElement("div");
      markerEl.className = "auto-marker";
      markerEl.textContent = idx + 1;
      markerEl.style.backgroundColor = "red";
      markerEl.style.color = "white";
      markerEl.style.borderRadius = "50%";
      markerEl.style.width = "20px";
      markerEl.style.height = "20px";
      markerEl.style.display = "flex";
      markerEl.style.alignItems = "center";
      markerEl.style.justifyContent = "center";

      const newMarker = new mapboxgl.Marker({ element: markerEl })
        .setLngLat([center[1], center[0]])
        .addTo(mapRef.current);

      return {
        marker: newMarker,
        circleId,
        map: mapRef.current,
        lng: center[1],
        lat: center[0],
        radius: 1,
        students: [] // จะถูก update จาก updateStudentAssignments
      };
    });

    // 4. อัปเดตการจัดสรรนักเรียนสำหรับ auto circlesโดยใช้ updateStudentAssignments
    const updatedAutoCircles = updateStudentAssignments(autoCircles, markers);

    // 5. อัปเดต state mapElements และส่งค่ากลับไปยัง Parent Component (Bus To School)
    setMapElements(updatedAutoCircles);
    if (typeof props.onMapElementsUpdate === "function") {
      props.onMapElementsUpdate(updatedAutoCircles);
    }
  };








  // -------------------------------------------------------------------------
  return (
    <div className="h-screen w-full">
      {/* Map Container */}
      <div ref={mapContainerRef} className="w-full h-full " />
      <p className="absolute bottom-4 right-4 text-gray-600">
        {AddCircleClick ? "Choose a location ... " : " "}
      </p>
      <div className="absolute right-0 bottom-0  bg-red-200">
      </div>
    </div>
  );
});

export default Map;