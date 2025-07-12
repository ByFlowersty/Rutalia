"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  MapPin,
  Home,
  User,
  Settings,
  Heart,
  Search,
  Bell,
  MoreHorizontal,
  Edit,
  Share,
  Bus,
  Navigation,
  Users,
  Clock,
  RouteIcon,
  Star,
  Zap,
} from "lucide-react"
import dynamic from "next/dynamic"

// Importar el mapa dinámicamente para evitar problemas de SSR
const MapComponent = dynamic(() => import("./components/MapComponent"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-gray-100 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
        <p className="text-gray-500">Cargando mapa...</p>
      </div>
    </div>
  ),
})

type Screen = "register" | "login" | "dashboard" | "profile" | "settings" | "contacts" | "routes"

interface Stop {
  id: string
  name: string
  coordinates: [number, number]
  routes: string[]
  estimatedTime: number
  type: "metro" | "bus" | "combi"
}

// Datos ficticios de rutas y paradas con coordenadas reales de Ciudad de México
const routes: any[] = [
  {
    id: "metro-poli-vallejo",
    name: "Metro Poli - Vallejo",
    from: "Blvd Adolfo López Mateos",
    to: "Metro Politécnico",
    cost: "12$ - 18$",
    color: "#3B82F6",
    coordinates: [
      [19.5048, -99.1469], // Politécnico
      [19.5158, -99.1379], // Lindavista
      [19.5268, -99.1289], // Deportivo 18 de Marzo
      [19.5378, -99.1199], // La Raza
      [19.5488, -99.1109], // Tlatelolco
    ],
    stops: [
      {
        id: "stop-1",
        name: "Politécnico",
        coordinates: [19.5048, -99.1469],
        routes: ["metro-poli-vallejo"],
        estimatedTime: 2,
        type: "metro",
      },
      {
        id: "stop-2",
        name: "Lindavista",
        coordinates: [19.5158, -99.1379],
        routes: ["metro-poli-vallejo"],
        estimatedTime: 5,
        type: "metro",
      },
    ],
  },
  {
    id: "metro-rosario",
    name: "Metro Rosario",
    from: "Lomas de Atzapotzalco",
    to: "Metro Rosario",
    cost: "12$ - 18$",
    color: "#EF4444",
    coordinates: [
      [19.4888, -99.1609], // Rosario
      [19.4998, -99.1519], // Tezozómoc
      [19.5108, -99.1429], // UAM-Azcapotzalco
      [19.5218, -99.1339], // Ferrería
    ],
    stops: [
      {
        id: "stop-3",
        name: "Rosario",
        coordinates: [19.4888, -99.1609],
        routes: ["metro-rosario"],
        estimatedTime: 3,
        type: "metro",
      },
      {
        id: "stop-4",
        name: "Tezozómoc",
        coordinates: [19.4998, -99.1519],
        routes: ["metro-rosario"],
        estimatedTime: 7,
        type: "metro",
      },
    ],
  },
  {
    id: "metro-toreo",
    name: "Metro Toreo",
    from: "San Pedro",
    to: "Metro Toreo",
    cost: "12$ - 18$",
    color: "#10B981",
    coordinates: [
      [19.4728, -99.1749], // Toreo
      [19.4838, -99.1659], // San Joaquín
      [19.4948, -99.1569], // Polanco
      [19.5058, -99.1479], // Auditorio
    ],
    stops: [
      {
        id: "stop-5",
        name: "Toreo",
        coordinates: [19.4728, -99.1749],
        routes: ["metro-toreo"],
        estimatedTime: 4,
        type: "metro",
      },
      {
        id: "stop-6",
        name: "San Joaquín",
        coordinates: [19.4838, -99.1659],
        routes: ["metro-toreo"],
        estimatedTime: 8,
        type: "metro",
      },
    ],
  },
]

const allStops: any[] = routes.flatMap((route: any) => route.stops)

export default function RutaliaApp() {
  const [currentScreen, setCurrentScreen] = useState<Screen>("register")
  const [user, setUser] = useState<any>(null)
  const [selectedRoute, setSelectedRoute] = useState<any | null>(null)
  const [selectedStop, setSelectedStop] = useState<any | null>(null)
  const [showStopDialog, setShowStopDialog] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredRoutes, setFilteredRoutes] = useState<any[]>(routes)

  useEffect(() => {
    if (searchQuery) {
      const filtered = routes.filter(
        (route: any) =>
          route.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          route.from.toLowerCase().includes(searchQuery.toLowerCase()) ||
          route.to.toLowerCase().includes(searchQuery.toLowerCase()),
      )
      setFilteredRoutes(filtered)
    } else {
      setFilteredRoutes(routes)
    }
  }, [searchQuery])

  const handleStopClick = (stop: any) => {
    setSelectedStop(stop)
    setShowStopDialog(true)
  }

  const handleRouteSelect = (route: any) => {
    setSelectedRoute(route)
    setCurrentScreen("dashboard")
  }

  const BusIcon = () => (
    <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-lg">
      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
        <Bus className="w-8 h-8 text-white" />
      </div>
    </div>
  )

  const MobileNavigation = () => (
    <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-gray-200 px-4 py-2 flex justify-around items-center md:hidden shadow-lg">
      <button
        onClick={() => setCurrentScreen("dashboard")}
        className={`p-3 rounded-xl transition-all duration-200 ${
          currentScreen === "dashboard" ? "bg-blue-100 scale-110" : "hover:bg-gray-100"
        }`}
      >
        <Heart className={`w-6 h-6 ${currentScreen === "dashboard" ? "text-blue-600" : "text-gray-400"}`} />
      </button>
      <button
        onClick={() => setCurrentScreen("routes")}
        className={`p-3 rounded-xl transition-all duration-200 ${
          currentScreen === "routes" ? "bg-blue-100 scale-110" : "hover:bg-gray-100"
        }`}
      >
        <MapPin className={`w-6 h-6 ${currentScreen === "routes" ? "text-blue-600" : "text-gray-400"}`} />
      </button>
      <button
        onClick={() => setCurrentScreen("dashboard")}
        className={`p-4 rounded-full transition-all duration-200 ${
          currentScreen === "dashboard" ? "bg-blue-600 scale-110" : "bg-blue-500 hover:bg-blue-600"
        }`}
      >
        <Home className="w-6 h-6 text-white" />
      </button>
      <button
        onClick={() => setCurrentScreen("profile")}
        className={`p-3 rounded-xl transition-all duration-200 ${
          currentScreen === "profile" ? "bg-blue-100 scale-110" : "hover:bg-gray-100"
        }`}
      >
        <User className={`w-6 h-6 ${currentScreen === "profile" ? "text-blue-600" : "text-gray-400"}`} />
      </button>
      <button
        onClick={() => setCurrentScreen("settings")}
        className={`p-3 rounded-xl transition-all duration-200 ${
          currentScreen === "settings" ? "bg-blue-100 scale-110" : "hover:bg-gray-100"
        }`}
      >
        <Settings className={`w-6 h-6 ${currentScreen === "settings" ? "text-blue-600" : "text-gray-400"}`} />
      </button>
    </div>
  )

  const RegisterScreen = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
      </div>

      <div className="w-full max-w-sm space-y-6 relative z-10">
        <div className="text-center">
          <div className="mb-6 animate-bounce">
            <BusIcon />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">¿No tienes cuenta?</h1>
          <h2 className="text-2xl font-bold text-white mb-2">¡Creala hoy mismo!</h2>
          <p className="text-blue-100">Llena todos los campos correctamente.</p>
        </div>

        <div className="space-y-4">
          <Input
            placeholder="Usuario"
            className="bg-white/90 backdrop-blur-sm border-0 rounded-full h-12 px-6 placeholder:text-gray-500 focus:bg-white transition-all duration-200"
          />
          <Input
            placeholder="Celular"
            className="bg-white/90 backdrop-blur-sm border-0 rounded-full h-12 px-6 placeholder:text-gray-500 focus:bg-white transition-all duration-200"
          />
          <Input
            type="password"
            placeholder="Contraseña"
            className="bg-white/90 backdrop-blur-sm border-0 rounded-full h-12 px-6 placeholder:text-gray-500 focus:bg-white transition-all duration-200"
          />
        </div>

        <div className="space-y-3">
          <Button
            className="w-full bg-blue-900 hover:bg-blue-800 text-white rounded-full h-12 font-semibold transition-all duration-200 hover:scale-105 shadow-lg"
            onClick={() => {
              setUser({ name: "Lisa", email: "lisa@example.com" })
              setCurrentScreen("dashboard")
            }}
          >
            Crear
          </Button>

          <div className="text-center">
            <span className="text-white text-sm bg-white/20 px-3 py-1 rounded-full">O</span>
          </div>

          <Button className="w-full bg-blue-800 hover:bg-blue-700 text-white border-0 rounded-full h-12 font-semibold transition-all duration-200 hover:scale-105 shadow-lg">
            Continuar con Google
          </Button>

          <Button
            variant="outline"
            className="w-full bg-white/90 hover:bg-white text-blue-900 border-0 rounded-full h-12 font-semibold transition-all duration-200 hover:scale-105 shadow-lg backdrop-blur-sm"
            onClick={() => setCurrentScreen("login")}
          >
            Inicia sesión con mi cuenta
          </Button>
        </div>

        <div className="flex justify-center space-x-6 text-blue-100 text-sm">
          <button className="hover:text-white transition-colors">Privacidad</button>
          <button className="hover:text-white transition-colors">Términos de uso</button>
        </div>
      </div>
    </div>
  )

  const LoginScreen = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
      </div>

      <div className="w-full max-w-sm space-y-6 relative z-10">
        <div className="text-center">
          <div className="mb-6 animate-bounce">
            <BusIcon />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Inicia sesión con</h1>
          <h2 className="text-2xl font-bold text-white mb-2">tu nombre de usuario</h2>
          <h3 className="text-2xl font-bold text-white mb-4">o tu celular</h3>
          <p className="text-blue-100">Ingresa tus datos correctamente.</p>
        </div>

        <div className="space-y-4">
          <Input
            placeholder="Usuario"
            className="bg-white/90 backdrop-blur-sm border-0 rounded-full h-12 px-6 placeholder:text-gray-500 focus:bg-white transition-all duration-200"
          />
          <Input
            type="password"
            placeholder="Contraseña"
            className="bg-white/90 backdrop-blur-sm border-0 rounded-full h-12 px-6 placeholder:text-gray-500 focus:bg-white transition-all duration-200"
          />
        </div>

        <div className="space-y-3">
          <Button
            className="w-full bg-white/90 hover:bg-white text-blue-900 rounded-full h-12 font-semibold transition-all duration-200 hover:scale-105 shadow-lg backdrop-blur-sm"
            onClick={() => {
              setUser({ name: "Lisa", email: "lisa@example.com" })
              setCurrentScreen("dashboard")
            }}
          >
            Iniciar sesión
          </Button>

          <Button className="w-full bg-blue-900 hover:bg-blue-800 text-white rounded-full h-12 font-semibold transition-all duration-200 hover:scale-105 shadow-lg">
            Continuar con Google
          </Button>

          <Button className="w-full bg-blue-800 hover:bg-blue-700 text-white rounded-full h-12 font-semibold transition-all duration-200 hover:scale-105 shadow-lg">
            Ingresar con mi número
          </Button>

          <div className="text-center">
            <span className="text-white text-sm bg-white/20 px-3 py-1 rounded-full">O</span>
          </div>

          <Button
            className="w-full bg-blue-900 hover:bg-blue-800 text-white rounded-full h-12 font-semibold transition-all duration-200 hover:scale-105 shadow-lg"
            onClick={() => setCurrentScreen("register")}
          >
            Crear Cuenta
          </Button>
        </div>

        <div className="flex justify-center space-x-6 text-blue-100 text-sm">
          <button className="hover:text-white transition-colors">Privacidad</button>
          <button className="hover:text-white transition-colors">Términos de uso</button>
        </div>
      </div>
    </div>
  )

  const DashboardScreen = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 pb-20 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-white/5 rounded-full blur-2xl"></div>
        <div className="absolute top-1/3 -left-20 w-60 h-60 bg-white/5 rounded-full blur-3xl"></div>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between p-4 pt-12 relative z-10">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-br from-white to-gray-100 rounded-full overflow-hidden shadow-lg border-2 border-white/50">
            <img src="/placeholder.svg?height=48&width=48" alt="Profile" className="w-full h-full object-cover" />
          </div>
          <div>
            <span className="text-white font-semibold text-lg">Bienvenid@, Lisa</span>
            <p className="text-blue-100 text-sm">¡Que tengas un buen viaje!</p>
          </div>
        </div>
        <div className="relative">
          <Bell className="w-6 h-6 text-white" />
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border border-white"></div>
        </div>
      </div>

      {/* Transport Card */}
      <div className="px-4 mb-6 relative z-10">
        <Card className="bg-gradient-to-r from-blue-800 to-blue-900 text-white border-0 shadow-xl">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                  <Bus className="w-5 h-5" />
                </div>
                <h3 className="font-semibold text-lg">Transporte Cercano</h3>
              </div>
              <MoreHorizontal className="w-5 h-5" />
            </div>
            <div className="flex justify-between items-end">
              <div>
                <p className="text-blue-200 text-sm">Costo desde tu ubicación</p>
                <p className="text-4xl font-bold mb-1">$12</p>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <p className="text-blue-200 text-sm">Metro Rosario</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-blue-200 text-sm">Tiempo estimado</p>
                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <p className="text-2xl font-semibold">4 min</p>
                </div>
              </div>
            </div>
            {selectedRoute && (
              <div className="mt-4 p-3 bg-white/10 rounded-lg">
                <p className="text-sm text-blue-100">Ruta seleccionada:</p>
                <p className="font-semibold">{selectedRoute.name}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Map Area */}
      <div className="px-4 flex-1 relative z-10">
        <Card className="h-96 overflow-hidden shadow-xl border-0">
          <MapComponent
            routes={routes}
            stops={allStops}
            selectedRoute={selectedRoute}
            onStopClick={handleStopClick}
            onRouteSelect={setSelectedRoute}
          />
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="px-4 mt-6 relative z-10">
        <div className="flex space-x-3">
          <Button
            size="sm"
            className="bg-white/20 hover:bg-white/30 text-white border-0 backdrop-blur-sm"
            onClick={() => setCurrentScreen("routes")}
          >
            <Search className="w-4 h-4 mr-2" />
            Buscar Rutas
          </Button>
          <Button
            size="sm"
            className="bg-white/20 hover:bg-white/30 text-white border-0 backdrop-blur-sm"
            onClick={() => setCurrentScreen("contacts")}
          >
            <Users className="w-4 h-4 mr-2" />
            Compartir
          </Button>
        </div>
      </div>

      <MobileNavigation />
    </div>
  )

  const ProfileScreen = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 pb-20 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-white/5 rounded-full blur-2xl"></div>
        <div className="absolute bottom-1/3 -left-20 w-60 h-60 bg-white/5 rounded-full blur-3xl"></div>
      </div>

      {/* Header */}
      <div className="text-center p-4 pt-12 relative z-10">
        <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 inline-block mb-4 shadow-lg">
          <span className="text-white font-semibold">Información de mi cuenta</span>
        </div>
      </div>

      {/* Profile Info */}
      <div className="px-4 text-center mb-6 relative z-10">
        <div className="w-28 h-28 bg-gradient-to-br from-white to-gray-100 rounded-full mx-auto mb-4 overflow-hidden shadow-xl border-4 border-white/50">
          <img src="/placeholder.svg?height=112&width=112" alt="Lisa" className="w-full h-full object-cover" />
        </div>
        <h2 className="text-3xl font-bold text-white mb-1">Lisa</h2>
        <p className="text-blue-100 mb-4">todo sobre ti</p>
        <div className="flex justify-center space-x-4">
          <button className="w-12 h-12 bg-black/30 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-black/40 transition-all duration-200 shadow-lg">
            <Edit className="w-5 h-5 text-white" />
          </button>
          <button className="w-12 h-12 bg-black/30 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-black/40 transition-all duration-200 shadow-lg">
            <Share className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>

      {/* Stats Card */}
      <div className="px-4 relative z-10">
        <Card className="bg-white/95 backdrop-blur-sm shadow-xl border-0">
          <CardContent className="p-6 space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-xl">
                <Star className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
                <p className="text-3xl font-bold text-blue-900">39</p>
                <p className="text-sm text-gray-600">Recompensas</p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-xl">
                <RouteIcon className="w-8 h-8 text-green-500 mx-auto mb-2" />
                <p className="text-3xl font-bold text-green-900">171</p>
                <p className="text-sm text-gray-600">Viajes</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <h3 className="font-semibold text-gray-900">Ubicación:</h3>
                  <p className="text-gray-600">Ciudad de México</p>
                </div>
                <MapPin className="w-5 h-5 text-blue-600" />
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <h3 className="font-semibold text-gray-900">Ruta más concurrente:</h3>
                  <p className="text-gray-600">Metro Tacuba</p>
                </div>
                <Bus className="w-5 h-5 text-blue-600" />
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <h3 className="font-semibold text-gray-900">Distancia recorrida:</h3>
                  <p className="text-2xl font-bold text-gray-900">566 km</p>
                </div>
                <Navigation className="w-5 h-5 text-blue-600" />
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <h3 className="font-semibold text-gray-900">Promedio por viaje:</h3>
                  <p className="text-2xl font-bold text-gray-900">3,3 km</p>
                </div>
                <Zap className="w-5 h-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <MobileNavigation />
    </div>
  )

  const SettingsScreen = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 pb-20 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 -right-20 w-40 h-40 bg-white/5 rounded-full blur-2xl"></div>
        <div className="absolute bottom-1/4 -left-20 w-60 h-60 bg-white/5 rounded-full blur-3xl"></div>
      </div>

      {/* Header */}
      <div className="text-center p-4 pt-12 relative z-10">
        <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 inline-block mb-8 shadow-lg">
          <span className="text-white font-semibold">Ajustes y Configuraciones</span>
        </div>
      </div>

      {/* Settings Options */}
      <div className="px-4 space-y-4 relative z-10">
        {[
          { icon: User, label: "Administrar tu cuenta", color: "bg-blue-500" },
          { icon: Star, label: "Recompensas", color: "bg-yellow-500" },
          { icon: Settings, label: "Seguridad", color: "bg-green-500" },
          { icon: RouteIcon, label: "Mis viajes y rutas", color: "bg-purple-500" },
          { icon: Bell, label: "Enviar un reporte", color: "bg-orange-500" },
        ].map((item, index) => (
          <Button
            key={index}
            className="w-full bg-white/95 hover:bg-white text-gray-900 rounded-2xl h-16 text-left justify-start shadow-lg backdrop-blur-sm transition-all duration-200 hover:scale-105"
          >
            <div className={`w-10 h-10 ${item.color} rounded-lg flex items-center justify-center mr-4`}>
              <item.icon className="w-5 h-5 text-white" />
            </div>
            <span className="font-medium">{item.label}</span>
          </Button>
        ))}

        <div className="pt-4 space-y-4">
          <Button className="w-full bg-red-600 hover:bg-red-700 text-white rounded-2xl h-16 font-semibold shadow-lg transition-all duration-200 hover:scale-105">
            Salir de la app
          </Button>
          <Button className="w-full bg-red-600 hover:bg-red-700 text-white rounded-2xl h-16 font-semibold shadow-lg transition-all duration-200 hover:scale-105">
            Cerrar sesión
          </Button>
        </div>

        <Button className="w-full bg-white/95 hover:bg-white text-gray-900 rounded-2xl h-16 font-medium shadow-lg backdrop-blur-sm transition-all duration-200 hover:scale-105">
          Información Legal
        </Button>
      </div>

      <MobileNavigation />
    </div>
  )

  const ContactsScreen = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 pb-20 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/3 -right-20 w-40 h-40 bg-white/5 rounded-full blur-2xl"></div>
        <div className="absolute bottom-1/4 -left-20 w-60 h-60 bg-white/5 rounded-full blur-3xl"></div>
      </div>

      {/* Header */}
      <div className="text-center p-4 pt-12 relative z-10">
        <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 inline-block mb-8 shadow-lg">
          <span className="text-white font-semibold">Contactos y Amigos</span>
        </div>
      </div>

      {/* Geolocation Toggle */}
      <div className="px-4 mb-6 relative z-10">
        <div className="bg-black/30 backdrop-blur-sm rounded-2xl p-4 flex items-center justify-between shadow-lg">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
              <MapPin className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="text-white font-semibold">Geolocalización</span>
              <p className="text-blue-200 text-sm">Compartir ubicación en tiempo real</p>
            </div>
          </div>
          <Switch defaultChecked />
        </div>
      </div>

      {/* Contacts List */}
      <div className="px-4 space-y-3 relative z-10">
        {[
          { name: "Mamá", time: "9:41 AM", status: "En línea", color: "bg-green-500" },
          { name: "Moises", time: "8:58 AM", status: "Hace 2 min", color: "bg-yellow-500" },
          { name: "Osvaldo", time: "8:41 AM", status: "Hace 15 min", color: "bg-orange-500" },
          { name: "Enrique", time: "7:54 AM", status: "Hace 1 hora", color: "bg-gray-500" },
        ].map((contact, index) => (
          <div
            key={index}
            className="bg-black/30 backdrop-blur-sm rounded-2xl p-4 shadow-lg hover:bg-black/40 transition-all duration-200"
          >
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-12 h-12 bg-gray-400 rounded-xl flex items-center justify-center">
                  <User className="w-6 h-6 text-white" />
                </div>
                <div
                  className={`absolute -bottom-1 -right-1 w-4 h-4 ${contact.color} rounded-full border-2 border-white`}
                ></div>
              </div>
              <div className="flex-1">
                <h3 className="text-white font-semibold">{contact.name}</h3>
                <p className="text-blue-200 text-sm">Ver ruta en tiempo real</p>
                <p className="text-blue-300 text-xs">{contact.status}</p>
              </div>
              <div className="text-right">
                <span className="text-blue-200 text-sm">{contact.time}</span>
                <div className="mt-1">
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg">
                    Ver
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <MobileNavigation />
    </div>
  )

  const RoutesScreen = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 pb-20 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 -right-20 w-40 h-40 bg-white/5 rounded-full blur-2xl"></div>
        <div className="absolute bottom-1/3 -left-20 w-60 h-60 bg-white/5 rounded-full blur-3xl"></div>
      </div>

      {/* Header */}
      <div className="text-center p-4 pt-12 relative z-10">
        <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 inline-block mb-6 shadow-lg">
          <span className="text-white font-semibold">Buscar Rutas</span>
        </div>
      </div>

      {/* Search */}
      <div className="px-4 mb-6 relative z-10">
        <div className="relative">
          <Input
            placeholder="Metro politecnico"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-white/95 backdrop-blur-sm border-0 rounded-full h-12 px-6 pr-12 placeholder:text-gray-500 focus:bg-white transition-all duration-200 shadow-lg"
          />
          <Search className="absolute right-4 top-3 w-6 h-6 text-gray-400" />
        </div>
        <Button className="w-full mt-3 bg-white/95 hover:bg-white text-blue-900 rounded-full h-12 font-semibold shadow-lg backdrop-blur-sm transition-all duration-200 hover:scale-105">
          Buscar
        </Button>
      </div>

      {/* Routes Section */}
      <div className="px-4 relative z-10">
        <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 mb-4 shadow-lg">
          <span className="text-white font-semibold">Rutas cercanas a ti</span>
          <p className="text-blue-100 text-sm mt-1">{filteredRoutes.length} rutas disponibles</p>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {filteredRoutes.map((route, index) => (
            <Card
              key={index}
              className="bg-white/95 backdrop-blur-sm shadow-lg border-0 hover:shadow-xl transition-all duration-200 hover:scale-105 cursor-pointer"
              onClick={() => handleRouteSelect(route)}
            >
              <CardContent className="p-4">
                <div className="flex items-start space-x-3">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: route.color }}
                  >
                    <Bus className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-gray-900">{route.name}</h3>
                      <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Disponible</Badge>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center space-x-1">
                        <Navigation className="w-3 h-3 text-gray-400" />
                        <p className="text-sm text-gray-600">{route.from}</p>
                      </div>
                      <div className="flex items-center space-x-1">
                        <MapPin className="w-3 h-3 text-gray-400" />
                        <p className="text-sm text-gray-600">{route.to}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      <div>
                        <span className="text-xs text-gray-500">Costo aproximado:</span>
                        <p className="font-semibold text-blue-600">{route.cost}</p>
                      </div>
                      <div className="flex items-center space-x-1 text-green-600">
                        <Clock className="w-3 h-3" />
                        <span className="text-sm font-medium">2-8 min</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <MobileNavigation />
    </div>
  )

  // Stop Information Dialog
  const StopDialog = () => (
    <Dialog open={showStopDialog} onOpenChange={setShowStopDialog}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              {selectedStop?.type === "metro" ? (
                <Bus className="w-5 h-5 text-white" />
              ) : (
                <Navigation className="w-5 h-5 text-white" />
              )}
            </div>
            <span>{selectedStop?.name}</span>
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
            <div>
              <p className="text-sm text-gray-600">Tiempo estimado de llegada</p>
              <div className="flex items-center space-x-2">
                <Clock className="w-5 h-5 text-blue-600" />
                <p className="text-2xl font-bold text-blue-600">{selectedStop?.estimatedTime} min</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Tipo de transporte</p>
              <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100 capitalize">{selectedStop?.type}</Badge>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="font-semibold text-gray-900">Rutas disponibles:</h4>
            {selectedStop?.routes.map((routeId: string) => {
              const route = routes.find((r: any) => r.id === routeId)
              return (
                <div key={routeId} className="flex items-center space-x-2 p-2 bg-gray-50 rounded-lg">
                  <div className="w-4 h-4 rounded-full" style={{ backgroundColor: route?.color || "#3B82F6" }}></div>
                  <span className="text-sm">{route?.name}</span>
                </div>
              )
            })}
          </div>

          <div className="flex space-x-2">
            <Button
              className="flex-1 bg-blue-600 hover:bg-blue-700"
              onClick={() => {
                setShowStopDialog(false)
                setCurrentScreen("dashboard")
              }}
            >
              Ver en mapa
            </Button>
            <Button variant="outline" className="flex-1" onClick={() => setShowStopDialog(false)}>
              Cerrar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )

  // Web Layout for Desktop
  const WebLayout = ({ children }: { children: React.ReactNode }) => (
    <div className="min-h-screen bg-gray-100 hidden md:flex">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg">
        <div className="p-6">
          <div className="flex items-center space-x-2 mb-8">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
              <Bus className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-blue-900">RUTALIA</span>
          </div>

          <nav className="space-y-2">
            {[
              { screen: "dashboard", icon: Home, label: "Dashboard" },
              { screen: "routes", icon: MapPin, label: "Rutas" },
              { screen: "contacts", icon: Users, label: "Contactos" },
              { screen: "profile", icon: User, label: "Perfil" },
              { screen: "settings", icon: Settings, label: "Configuración" },
            ].map((item) => (
              <button
                key={item.screen}
                onClick={() => setCurrentScreen(item.screen as Screen)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200 ${
                  currentScreen === item.screen
                    ? "bg-blue-100 text-blue-600 scale-105"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">{children}</div>
    </div>
  )

  // Show auth screens if no user
  if (!user) {
    return (
      <>
        <div className="md:hidden">{currentScreen === "register" ? <RegisterScreen /> : <LoginScreen />}</div>
        <WebLayout>
          <div className="flex items-center justify-center min-h-screen">
            <div className="max-w-md w-full">{currentScreen === "register" ? <RegisterScreen /> : <LoginScreen />}</div>
          </div>
        </WebLayout>
      </>
    )
  }

  // Main app screens
  const renderScreen = () => {
    switch (currentScreen) {
      case "dashboard":
        return <DashboardScreen />
      case "profile":
        return <ProfileScreen />
      case "settings":
        return <SettingsScreen />
      case "contacts":
        return <ContactsScreen />
      case "routes":
        return <RoutesScreen />
      default:
        return <DashboardScreen />
    }
  }

  return (
    <>
      {/* Mobile Layout */}
      <div className="md:hidden">
        {renderScreen()}
        <StopDialog />
      </div>

      {/* Web Layout */}
      <WebLayout>
        <div className="p-6">
          <div className="max-w-6xl mx-auto">
            {currentScreen === "dashboard" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                  <div className="flex items-center space-x-3">
                    <span className="text-gray-600">Bienvenid@, Lisa</span>
                    <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
                  </div>
                </div>

                <div className="grid lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2">
                    <Card className="h-96">
                      <CardHeader>
                        <CardTitle>Mapa de Rutas</CardTitle>
                      </CardHeader>
                      <CardContent className="p-0">
                        <MapComponent
                          routes={routes}
                          stops={allStops}
                          selectedRoute={selectedRoute}
                          onStopClick={handleStopClick}
                          onRouteSelect={setSelectedRoute}
                        />
                      </CardContent>
                    </Card>
                  </div>

                  <div className="space-y-4">
                    <Card>
                      <CardContent className="p-6">
                        <h3 className="font-semibold mb-4">Transporte Cercano</h3>
                        <div className="space-y-2">
                          <p className="text-2xl font-bold text-blue-600">$12</p>
                          <p className="text-gray-600">Metro Rosario</p>
                          <p className="text-sm text-gray-500">Tiempo estimado: 4 minutos</p>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-6">
                        <h3 className="font-semibold mb-4">Rutas Disponibles</h3>
                        <div className="space-y-2">
                          {routes.slice(0, 3).map((route: any) => (
                            <div
                              key={route.id}
                              className="flex items-center space-x-2 p-2 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100"
                              onClick={() => handleRouteSelect(route)}
                            >
                              <div className="w-4 h-4 rounded-full" style={{ backgroundColor: route.color }}></div>
                              <span className="text-sm">{route.name}</span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            )}

            {currentScreen === "routes" && (
              <div className="space-y-6">
                <h1 className="text-3xl font-bold text-gray-900">Buscar Rutas</h1>

                <div className="flex space-x-4">
                  <Input
                    placeholder="Metro politecnico"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1"
                  />
                  <Button>Buscar</Button>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredRoutes.map((route: any, index: number) => (
                    <Card
                      key={index}
                      className="cursor-pointer hover:shadow-lg transition-all duration-200"
                      onClick={() => handleRouteSelect(route)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-3">
                          <div
                            className="w-8 h-8 rounded-lg flex items-center justify-center"
                            style={{ backgroundColor: route.color }}
                          >
                            <Bus className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <h3 className="font-semibold">{route.name}</h3>
                            <p className="text-blue-600 font-medium">{route.cost}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {currentScreen === "profile" && (
              <div className="space-y-6">
                <h1 className="text-3xl font-bold text-gray-900">Mi Perfil</h1>
                <div className="grid md:grid-cols-2 gap-6">
                  <Card>
                    <CardContent className="p-6 text-center">
                      <div className="w-24 h-24 bg-gray-300 rounded-full mx-auto mb-4"></div>
                      <h2 className="text-2xl font-bold mb-2">Lisa</h2>
                      <p className="text-gray-600">Ciudad de México</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-6 space-y-4">
                      <div>
                        <h3 className="font-semibold">Ruta más concurrente:</h3>
                        <p className="text-gray-600">Metro Tacuba</p>
                      </div>
                      <div>
                        <h3 className="font-semibold">Recompensas obtenidas:</h3>
                        <p className="text-2xl font-bold text-blue-600">39</p>
                      </div>
                      <div>
                        <h3 className="font-semibold">Viajes realizados:</h3>
                        <p className="text-2xl font-bold text-blue-600">171</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}

            {currentScreen === "contacts" && (
              <div className="space-y-6">
                <h1 className="text-3xl font-bold text-gray-900">Contactos y Amigos</h1>
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <MapPin className="w-6 h-6 text-blue-600" />
                        <span className="font-medium">Geolocalización</span>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="space-y-3">
                      {["Mamá", "Moises", "Osvaldo", "Enrique"].map((name: string, index: number) => (
                        <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                          <User className="w-8 h-8 text-gray-400" />
                          <div className="flex-1">
                            <h3 className="font-medium">{name}</h3>
                            <p className="text-sm text-gray-500">Ver ruta en tiempo real</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {currentScreen === "settings" && (
              <div className="space-y-6">
                <h1 className="text-3xl font-bold text-gray-900">Configuración</h1>
                <div className="grid md:grid-cols-2 gap-4">
                  {[
                    "Administrar tu cuenta",
                    "Recompensas",
                    "Seguridad",
                    "Mis viajes y rutas",
                    "Enviar un reporte",
                    "Información Legal",
                  ].map((setting: string, index: number) => (
                    <Card key={index} className="cursor-pointer hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <h3 className="font-medium">{setting}</h3>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                <div className="flex space-x-4">
                  <Button variant="destructive">Cerrar sesión</Button>
                  <Button variant="destructive">Salir de la app</Button>
                </div>
              </div>
            )}
          </div>
        </div>
        <StopDialog />
      </WebLayout>
    </>
  )
}
