"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Bus, Clock } from "lucide-react"

interface Route {
  id: string
  name: string
  from: string
  to: string
  cost: string
  color: string
  coordinates: [number, number][]
  stops: Stop[]
}

interface Stop {
  id: string
  name: string
  coordinates: [number, number]
  routes: string[]
  estimatedTime: number
  type: "metro" | "bus" | "combi"
}

interface MapComponentProps {
  routes: Route[]
  stops: Stop[]
  selectedRoute: Route | null
  onStopClick: (stop: Stop) => void
  onRouteSelect: (route: Route) => void
}

export default function MapComponent({ routes, stops, selectedRoute, onStopClick, onRouteSelect }: MapComponentProps) {
  const mapRef = useRef<any>(null)
  const mapInstanceRef = useRef<any>(null)
  const routeLayersRef = useRef<any[]>([])
  const stopMarkersRef = useRef<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let L: any = null

    const initializeMap = async () => {
      try {
        console.log("Intentando importar Leaflet...");
        L = (await import("leaflet")).default
        console.log("Leaflet importado:", L);

        // Configurar iconos por defecto
        delete (L.Icon.Default.prototype as any)._getIconUrl
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
          iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
          shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
        })

        if (mapRef.current && !mapInstanceRef.current) {
          console.log("Creando mapa en", mapRef.current);
          mapInstanceRef.current = L.map(mapRef.current).setView([19.4326, -99.1332], 12)

          L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution: "© OpenStreetMap contributors",
          }).addTo(mapInstanceRef.current)

          // Crear iconos personalizados para diferentes tipos de paradas
          const createCustomIcon = (type: string, color: string) => {
            const iconHtml = `
              <div style="
                background-color: ${color};
                width: 30px;
                height: 30px;
                border-radius: 50%;
                border: 3px solid white;
                display: flex;
                align-items: center;
                justify-content: center;
                font-weight: bold;
                color: white;
                font-size: 14px;
                box-shadow: 0 2px 8px rgba(0,0,0,0.3);
              ">
                ${type === "metro" ? "M" : type === "bus" ? "B" : "C"}
              </div>
            `

            return L.divIcon({
              html: iconHtml,
              className: "custom-marker",
              iconSize: [30, 30],
              iconAnchor: [15, 15],
            })
          }

          // Añadir rutas al mapa
          routes.forEach((route) => {
            const routeLayer = L.polyline(route.coordinates, {
              color: route.color,
              weight: selectedRoute?.id === route.id ? 8 : 5,
              opacity: selectedRoute?.id === route.id ? 1 : 0.7,
              dashArray: selectedRoute?.id === route.id ? null : "10, 5",
            }).addTo(mapInstanceRef.current)

            // Evento click en la ruta
            routeLayer.on("click", () => {
              onRouteSelect(route)
            })

            // Tooltip para la ruta
            routeLayer.bindTooltip(
              `
              <div style="text-align: center;">
                <strong>${route.name}</strong><br>
                <span style="color: ${route.color};">${route.cost}</span>
              </div>
            `,
              {
                permanent: false,
                direction: "top",
              },
            )

            routeLayersRef.current.push(routeLayer)
          })

          // Añadir paradas al mapa
          stops.forEach((stop) => {
            const stopColor = stop.type === "metro" ? "#3b82f6" : stop.type === "bus" ? "#ef4444" : "#10b981"
            const icon = createCustomIcon(stop.type, stopColor)

            const marker = L.marker(stop.coordinates, { icon }).addTo(mapInstanceRef.current)

            // Popup para la parada
            marker.bindPopup(`
              <div style="text-align: center; min-width: 200px;">
                <h3 style="margin: 0 0 10px 0; color: ${stopColor};">${stop.name}</h3>
                <p style="margin: 5px 0;"><strong>Tipo:</strong> ${stop.type.charAt(0).toUpperCase() + stop.type.slice(1)}</p>
                <p style="margin: 5px 0;"><strong>Tiempo estimado:</strong> ${stop.estimatedTime} min</p>
                <button 
                  onclick="window.selectStop('${stop.id}')" 
                  style="
                    background: ${stopColor};
                    color: white;
                    border: none;
                    padding: 8px 16px;
                    border-radius: 6px;
                    cursor: pointer;
                    margin-top: 10px;
                  "
                >
                  Ver detalles
                </button>
              </div>
            `)

            // Evento click en el marcador
            marker.on("click", () => {
              onStopClick(stop)
            })

            stopMarkersRef.current.push(marker)
          })

          // Función global para seleccionar parada desde popup
          ;(window as any).selectStop = (stopId: string) => {
            const stop = stops.find((s) => s.id === stopId)
            if (stop) {
              onStopClick(stop)
            }
          }

          setIsLoading(false)
          console.log("Mapa inicializado correctamente");
        }
      } catch (error) {
        console.error("Error initializing map:", error)
        setIsLoading(false)
      }
    }

    if (mapRef.current && !mapInstanceRef.current) {
      initializeMap()
    }

    // Cleanup
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
      routeLayersRef.current = []
      stopMarkersRef.current = []
    }
  }, [mapRef.current])

  useEffect(() => {
    const loadLeafletStyles = async () => {
      await import("leaflet/dist/leaflet.css")
    }

    loadLeafletStyles()
  }, [])

  // Actualizar estilos de rutas cuando cambia la selección
  useEffect(() => {
    if (mapInstanceRef.current && routeLayersRef.current.length > 0) {
      routeLayersRef.current.forEach((layer, index) => {
        const route = routes[index]
        if (route) {
          layer.setStyle({
            weight: selectedRoute?.id === route.id ? 8 : 5,
            opacity: selectedRoute?.id === route.id ? 1 : 0.7,
            dashArray: selectedRoute?.id === route.id ? null : "10, 5",
          })
        }
      })
    }
  }, [selectedRoute, routes])

  return (
    <div className="w-full bg-gray-100 flex items-center justify-center" style={{ minHeight: 400, position: "relative" }}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-10">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
            <p className="text-gray-500">Cargando mapa...</p>
          </div>
        </div>
      )}
      <div
        ref={mapRef}
        className="w-full h-full rounded-lg"
        style={{
          minHeight: 400,
          height: "100%",
          zIndex: 1,
          position: "relative",
          display: isLoading ? "none" : "block"
        }}
      />

      {/* Route info overlay */}
      {selectedRoute && (
        <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm rounded-xl p-4 shadow-xl z-[1000] max-w-xs border border-gray-200">
          <div className="flex items-center space-x-3 mb-3">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center"
              style={{ backgroundColor: selectedRoute.color }}
            >
              <Bus className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{selectedRoute.name}</h3>
              <p className="text-xs text-gray-600">
                {selectedRoute.from} → {selectedRoute.to}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <span className="text-blue-600 font-bold text-lg">{selectedRoute.cost}</span>
            </div>
            <div className="flex items-center space-x-1 text-green-600">
              <Clock className="w-4 h-4" />
              <span className="text-sm font-medium">2-8 min</span>
            </div>
          </div>

          <Button
            size="sm"
            className="w-full bg-blue-600 hover:bg-blue-700"
            onClick={() => onRouteSelect(selectedRoute)}
          >
            Usar esta ruta
          </Button>
        </div>
      )}

      {/* Legend */}
      <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm rounded-xl p-4 shadow-lg z-[1000] border border-gray-200">
        <h4 className="font-semibold text-sm text-gray-900 mb-3">Leyenda</h4>
        <div className="space-y-2 text-sm">
          <div className="flex items-center space-x-3">
            <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">M</span>
            </div>
            <span>Metro</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">B</span>
            </div>
            <span>Autobús</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">C</span>
            </div>
            <span>Combi</span>
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-sm rounded-xl p-4 shadow-lg z-[1000] border border-gray-200 max-w-xs">
        <h4 className="font-semibold text-sm text-gray-900 mb-2">Instrucciones:</h4>
        <div className="text-xs text-gray-600 space-y-1">
          <p>• Haz clic en las líneas para seleccionar rutas</p>
          <p>• Haz clic en los marcadores para ver paradas</p>
          <p>• Usa los controles del mapa para navegar</p>
        </div>
      </div>
    </div>
  )
}
