import mapboxgl from "mapbox-gl";

// เก็บ reference ของ markers
let markersList = [];

const resetRoute = (map) => {
    // ลบ layers และ sources ของเส้นทางทั้งหมดที่เคยวาด
    const routeIds = [1, 2, 3, 4, 5, 6, 7]; // แสดงตัวอย่างว่ามีหลาย routeId
    routeIds.forEach((routeId) => {
        if (map.getLayer(`route-${routeId}`)) {
            map.removeLayer(`route-${routeId}`);
            map.removeSource(`route-${routeId}`);
        }
    });

    // ลบ markers ที่เคยเพิ่มไว้
    markersList.forEach((marker) => marker.remove());
    markersList = []; // รีเซ็ต markersList
};

const drawRoute = async (map, coordinates, routeId, color) => {
    try {
        // ลบ markers เดิมที่มีอยู่ก่อน
        markersList.forEach(marker => marker.remove());
        markersList = []; // รีเซ็ต markersList

        // แปลง coordinates เป็น string ในรูปแบบ "lng,lat;lng,lat;..."
        const coordinateString = coordinates
            .map((coord) => `${coord.lng},${coord.lat}`)
            .join(";");

        // เรียก Directions API
        const response = await fetch(
            `https://api.mapbox.com/directions/v5/mapbox/driving/${coordinateString}?geometries=geojson&overview=full&access_token=${mapboxgl.accessToken}`
        );

        const data = await response.json();

        if (data.routes && data.routes.length > 0) {
            const route = data.routes[0].geometry;
            const distance = data.routes[0].distance; // ระยะทางในเมตร
            const duration = data.routes[0].duration; // เวลาที่ใช้ในการเดินทาง (หน่วยเป็นวินาที)

            // เพิ่มเส้นทางลงใน Mapbox โดยใช้ routeId เพื่อแยกเส้นทาง
            if (map.getSource(`route-${routeId}`)) {
                map.getSource(`route-${routeId}`).setData({
                    type: "Feature",
                    geometry: route,
                });
            } else {
                map.addSource(`route-${routeId}`, {
                    type: "geojson",
                    data: {
                        type: "Feature",
                        geometry: route,
                    },
                });

                map.addLayer({
                    id: `route-${routeId}`,
                    type: "line",
                    source: `route-${routeId}`,
                    layout: {
                        "line-join": "round",
                        "line-cap": "round",
                    },
                    paint: {
                        "line-color": getRandomHexColor(),
                        "line-width": 4,
                    },
                });
            }

            // เพิ่ม Markers สำหรับจุดที่ส่งเข้ามา (coordinates)
            coordinates.forEach((coord, index) => {
                // สร้าง Element สำหรับตัวเลข
                const numberLabel = document.createElement("div");
                numberLabel.className = "marker-label";
                numberLabel.innerText = index + 1; // ตัวเลข
                numberLabel.style.position = "absolute";
                numberLabel.style.transform = "translate(-50%, -50%)"; // จัดกึ่งกลาง
                numberLabel.style.fontSize = "14px";
                numberLabel.style.color = "black";
                numberLabel.style.backgroundColor = "white";
                numberLabel.style.borderRadius = "50%";
                numberLabel.style.padding = "4px 8px"; // เพิ่ม Padding ให้ดูสวยงาม
                numberLabel.style.fontWeight = "bold";
                numberLabel.style.boxShadow = "0 0 5px rgba(0, 0, 0, 0.3)";

                // สร้าง Marker แบบกำหนดเอง
                const markerElement = new mapboxgl.Marker({
                    element: numberLabel,
                })
                    .setLngLat([coord.lng, coord.lat]) // ระบุตำแหน่งพิกัด
                    .setPopup(new mapboxgl.Popup().setText(`Point ${index + 1}`)) // เพิ่มหมายเลข 1, 2, 3, ...
                    .addTo(map);

                // เก็บ reference ของ marker ลงใน markersList
                markersList.push(markerElement);
            });
        } else {
            console.error("No route found");
        }
    } catch (error) {
        console.error("Error fetching route:", error);
    }
};

const fetchMarkers = async (idToken) => {
    try {
        const response = await fetch('http://192.168.3.251:8080/api/students', {
            headers: {
                'Authorization': `Bearer ${idToken}`, // ส่ง token ใน headers
                'Content-Type': 'application/json',
            },
        });

        if (response.ok) {
            const data = await response.json();
            return data;
        } else {
            throw new Error(`Failed to fetch data from API: ${response.status}`);
        }
    } catch (error) {
        console.error("Error fetching marker data: ", error);
        throw error;
    }
};

// ฟังก์ชันสำหรับสุ่มสีแบบ Hex
function getRandomHexColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++){
        color += letters[Math.floor(Math.random() *16)];
    }
    console.log("-->"+color);

    return color; 
}

export {drawRoute, getRandomHexColor, fetchMarkers, resetRoute}

