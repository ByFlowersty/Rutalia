"use client"

import { useState } from "react"
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

interface CustomMapComponentProps {
  routes: Route[]
  stops: Stop[]
  selectedRoute: Route | null
  onStopClick: (stop: Stop) => void
  onRouteSelect: (route: Route) => void
}

export default function CustomMapComponent({
  routes,
  stops,
  selectedRoute,
  onStopClick,
  onRouteSelect,
}: CustomMapComponentProps) {
  const [hoveredRoute, setHoveredRoute] = useState<string | null>(null)
  const [hoveredStop, setHoveredStop] = useState<string | null>(null)
  const [zoom, setZoom] = useState(1)

  // Simplified coordinate conversion - map lat/lng to SVG coordinates
  const coordToSVG = (coord: [number, number]) => {
    const [lat, lng] = coord
    // Convert Mexico City coordinates to SVG space (800x600)
    const x = ((lng + 99.2) * 4000) % 800
    const y = ((19.6 - lat) * 4000) % 600
    return { x: Math.max(50, Math.min(750, x)), y: Math.max(50, Math.min(550, y)) }
  }

  // Create path string for route
  const createRoutePath = (coordinates: [number, number][]) => {
    const svgCoords = coordinates.map(coordToSVG)
    return svgCoords.reduce((path, coord, index) => {
      return index === 0 ? `M ${coord.x} ${coord.y}` : `${path} L ${coord.x} ${coord.y}`
    }, "")
  }

  // Zoom controls
  const zoomIn = () => setZoom((prev) => Math.min(prev * 1.2, 3))
  const zoomOut = () => setZoom((prev) => Math.max(prev / 1.2, 0.5))
  const resetView = () => setZoom(1)

  return (
    <div className="w-full h-full relative bg-gradient-to-br from-blue-50 to-green-50 overflow-hidden rounded-lg">
      {/* Map Controls */}
      <div className="absolute top-4 right-4 z-10 flex flex-col space-y-2">
        <Button size="sm" variant="outline" className="bg-white/90 backdrop-blur-sm w-10 h-10 p-0" onClick={zoomIn}>
          +
        </Button>
        <Button size="sm" variant="outline" className="bg-white/90 backdrop-blur-sm w-10 h-10 p-0" onClick={zoomOut}>
          -
        </Button>
        <Button size="sm" variant="outline" className="bg-white/90 backdrop-blur-sm w-10 h-10 p-0" onClick={resetView}>
          ⌂
        </Button>
      </div>

      {/* Main SVG Map */}
      <svg className="w-full h-full" viewBox="0 0 800 600" style={{ cursor: "grab" }}>
        {/* Background grid pattern */}
        <defs>
          <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
            <path d="M 50 0 L 0 0 0 50" fill="none" stroke="#e5e7eb" strokeWidth="1" />
          </pattern>
          <pattern id="streets" width="100" height="100" patternUnits="userSpaceOnUse">
            <rect width="100" height="100" fill="url(#grid)" />
            <path d="M 0 50 L 100 50 M 50 0 L 50 100" stroke="#d1d5db" strokeWidth="3" />
          </pattern>
        </defs>

        {/* Background */}
        <rect width="100%" height="100%" fill="url(#streets)" />

        {/* City landmarks */}
        <g transform={`scale(${zoom})`}>
          {/* Zócalo */}
          <rect x="380" y="280" width="50" height="50" fill="#fbbf24" stroke="#f59e0b" strokeWidth="2" rx="8" />
          <text x="405" y="310" textAnchor="middle" className="text-sm font-bold fill-white">
            Zócalo
          </text>

          {/* Chapultepec */}
          <circle cx="280" cy="220" r="35" fill="#10b981" stroke="#059669" strokeWidth="3" />
          <text x="280" y="228" textAnchor="middle" className="text-sm font-bold fill-white">
            Chapultepec
          </text>

          {/* Polanco */}
          <rect x="220" y="180" width="80" height="40" fill="#8b5cf6" stroke="#7c3aed" strokeWidth="2" rx="8" />
          <text x="260" y="205" textAnchor="middle" className="text-sm font-bold fill-white">
            Polanco
          </text>

          {/* Santa Fe */}
          <rect x="120" y="320" width="70" height="45" fill="#ef4444" stroke="#dc2626" strokeWidth="2" rx="8" />
          <text x="155" y="348" textAnchor="middle" className="text-sm font-bold fill-white">
            Santa Fe
          </text>

          {/* Route lines */}
          {routes.map((route) => (
            <g key={route.id}>
              {/* Main route line */}
              <path
                d={createRoutePath(route.coordinates)}
                stroke={route.color}
                strokeWidth={selectedRoute?.id === route.id ? 12 : hoveredRoute === route.id ? 10 : 8}
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity={selectedRoute?.id === route.id ? 1 : hoveredRoute === route.id ? 0.9 : 0.7}
                strokeDasharray={selectedRoute?.id === route.id ? "none" : "15,8"}
                className="cursor-pointer transition-all duration-300"
                onMouseEnter={() => setHoveredRoute(route.id)}
                onMouseLeave={() => setHoveredRoute(null)}
                onClick={() => onRouteSelect(route)}
              />

              {/* Route animation for selected route */}
              {selectedRoute?.id === route.id && (
                <path
                  d={createRoutePath(route.coordinates)}
                  stroke="white"
                  strokeWidth="4"
                  fill="none"
                  strokeLinecap="round"
                  opacity="0.8"
                  strokeDasharray="30,15"
                  className="animate-pulse"
                />
              )}

              {/* Route label */}
              {(hoveredRoute === route.id || selectedRoute?.id === route.id) && (
                <g>
                  {route.coordinates.map((coord, index) => {
                    if (index === Math.floor(route.coordinates.length / 2)) {
                      const svgCoord = coordToSVG(coord)
                      return (
                        <g key={index}>
                          <rect
                            x={svgCoord.x - 40}
                            y={svgCoord.y - 15}
                            width="80"
                            height="30"
                            fill="rgba(0,0,0,0.8)"
                            rx="6"
                            className="pointer-events-none"
                          />
                          <text
                            x={svgCoord.x}
                            y={svgCoord.y + 5}
                            textAnchor="middle"
                            className="text-xs font-semibold fill-white pointer-events-none"
                          >
                            {route.name}
                          </text>
                        </g>
                      )
                    }
                    return null
                  })}
                </g>
              )}
            </g>
          ))}

          {/* Stop markers */}
          {stops.map((stop) => {
            const svgCoord = coordToSVG(stop.coordinates)
            const isHovered = hoveredStop === stop.id
            const stopColor = stop.type === "metro" ? "#3b82f6" : stop.type === "bus" ? "#ef4444" : "#10b981"

            return (
              <g key={stop.id}>
                {/* Stop circle with glow effect */}
                <circle
                  cx={svgCoord.x}
                  cy={svgCoord.y}
                  r={isHovered ? 18 : 12}
                  fill={stopColor}
                  stroke="white"
                  strokeWidth="4"
                  className="cursor-pointer transition-all duration-200 drop-shadow-lg"
                  onMouseEnter={() => setHoveredStop(stop.id)}
                  onMouseLeave={() => setHoveredStop(null)}
                  onClick={() => onStopClick(stop)}
                  filter="drop-shadow(0 4px 8px rgba(0,0,0,0.3))"
                />

                {/* Stop icon */}
                <text
                  x={svgCoord.x}
                  y={svgCoord.y + 2}
                  textAnchor="middle"
                  className="text-sm font-bold fill-white pointer-events-none"
                >
                  {stop.type === "metro" ? "M" : stop.type === "bus" ? "B" : "C"}
                </text>

                {/* Stop label on hover */}
                {isHovered && (
                  <g>
                    <rect
                      x={svgCoord.x - 50}
                      y={svgCoord.y - 45}
                      width="100"
                      height="25"
                      fill="rgba(0,0,0,0.9)"
                      rx="6"
                      className="pointer-events-none"
                    />
                    <text
                      x={svgCoord.x}
                      y={svgCoord.y - 28}
                      textAnchor="middle"
                      className="text-sm font-semibold fill-white pointer-events-none"
                    >
                      {stop.name}
                    </text>
                  </g>
                )}
              </g>
            )
          })}

          {/* User location indicator */}
          <g>
            <circle cx="400" cy="300" r="12" fill="#06b6d4" stroke="white" strokeWidth="4" className="animate-pulse" />
            <circle
              cx="400"
              cy="300"
              r="20"
              fill="none"
              stroke="#06b6d4"
              strokeWidth="3"
              opacity="0.5"
              className="animate-ping"
            />
            <text x="400" y="340" textAnchor="middle" className="text-xs font-semibold fill-gray-700">
              Tu ubicación
            </text>
          </g>
        </g>
      </svg>

      {/* Route info overlay */}
      {selectedRoute && (
        <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm rounded-xl p-4 shadow-xl z-10 max-w-xs border border-gray-200">
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
      <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm rounded-xl p-4 shadow-lg z-10 border border-gray-200">
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
          <div className="flex items-center space-x-3">
            <div className="w-5 h-5 bg-cyan-500 rounded-full animate-pulse"></div>
            <span>Tu ubicación</span>
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-sm rounded-xl p-4 shadow-lg z-10 border border-gray-200 max-w-xs">
        <h4 className="font-semibold text-sm text-gray-900 mb-2">Instrucciones:</h4>
        <div className="text-xs text-gray-600 space-y-1">
          <p>• Haz clic en las líneas para seleccionar rutas</p>
          <p>• Haz clic en los puntos para ver paradas</p>
          <p>• Usa los controles para hacer zoom</p>
        </div>
      </div>
    </div>
  )
}
