import { useState, useEffect } from 'react'
import { Plus, Search, Car, MapPin, Filter, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { blink } from '@/blink/client'
import { Vehicle, VEHICLE_CLASSES } from '@/types/vehicle'

export function Dashboard() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filterClass, setFilterClass] = useState<string>('all')
  const [filterGarage, setFilterGarage] = useState<string>('all')
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  // Form state
  const [newVehicle, setNewVehicle] = useState({
    name: '',
    class: '',
    garage: '',
    imageUrl: ''
  })

  useEffect(() => {
    const unsubscribe = blink.auth.onAuthStateChanged((state) => {
      setUser(state.user)
      setLoading(state.isLoading)
    })
    return unsubscribe
  }, [])

  useEffect(() => {
    if (user) {
      const loadData = async () => {
        try {
          // Load vehicles
          const vehicleList = await blink.db.vehicles.list({
            where: { userId: user.id },
            orderBy: { createdAt: 'desc' }
          })
          setVehicles(vehicleList)
        } catch (error) {
          console.error('Failed to load data:', error)
        }
      }
      loadData()
    }
  }, [user])

  const addVehicle = async () => {
    if (!newVehicle.name || !newVehicle.class || !newVehicle.garage.trim()) return

    try {
      const vehicle = await blink.db.vehicles.create({
        name: newVehicle.name,
        class: newVehicle.class,
        garage: newVehicle.garage.trim(),
        imageUrl: newVehicle.imageUrl || '',
        userId: user.id,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      })

      setVehicles(prev => [vehicle, ...prev])
      setNewVehicle({ name: '', class: '', garage: '', imageUrl: '' })
      setIsAddDialogOpen(false)
    } catch (error) {
      console.error('Failed to add vehicle:', error)
    }
  }

  const deleteVehicle = async (id: string) => {
    try {
      await blink.db.vehicles.delete(id)
      setVehicles(prev => prev.filter(v => v.id !== id))
    } catch (error) {
      console.error('Failed to delete vehicle:', error)
    }
  }

  const filteredVehicles = vehicles.filter(vehicle => {
    const matchesSearch = vehicle.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesClass = filterClass === 'all' || vehicle.class === filterClass
    const matchesGarage = filterGarage === 'all' || vehicle.garage.toLowerCase().includes(filterGarage.toLowerCase())
    return matchesSearch && matchesClass && matchesGarage
  })

  const getUniqueGarages = () => {
    const garages = [...new Set(vehicles.map(v => v.garage))]
    return garages.sort()
  }

  const getVehiclesByGarage = () => {
    const garageStats: { [key: string]: number } = {}
    vehicles.forEach(vehicle => {
      garageStats[vehicle.garage] = (garageStats[vehicle.garage] || 0) + 1
    })
    return garageStats
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="font-gta-body text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-gta text-4xl font-bold gta-gradient-text mb-4">GTA ONLINE CAR TRACKER</h1>
          <p className="font-gta-body text-muted-foreground mb-6">Please sign in to track your vehicles</p>
          <Button onClick={() => blink.auth.login()} className="font-gta-body">
            Sign In
          </Button>
        </div>
      </div>
    )
  }

  const garageStats = getVehiclesByGarage()
  const uniqueGarages = getUniqueGarages()

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-gta text-2xl md:text-3xl font-bold gta-gradient-text">
                GTA ONLINE CAR TRACKER
              </h1>
              <p className="font-gta-body text-sm text-muted-foreground">
                Welcome back, {user.email}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="font-gta-body">
                {vehicles.length} Vehicles
              </Badge>
              <Badge variant="outline" className="font-gta-body">
                {uniqueGarages.length} Garages
              </Badge>
              <Button 
                onClick={() => blink.auth.logout()} 
                variant="outline" 
                size="sm"
                className="font-gta-body"
              >
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="gta-card-glow">
            <CardHeader className="pb-3">
              <CardTitle className="font-gta-body text-sm text-muted-foreground">Total Vehicles</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">{vehicles.length}</div>
            </CardContent>
          </Card>
          
          <Card className="gta-card-glow">
            <CardHeader className="pb-3">
              <CardTitle className="font-gta-body text-sm text-muted-foreground">Garages Used</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-secondary">{uniqueGarages.length}</div>
            </CardContent>
          </Card>
          
          <Card className="gta-card-glow">
            <CardHeader className="pb-3">
              <CardTitle className="font-gta-body text-sm text-muted-foreground">Most Popular Class</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-lg font-bold text-accent">
                {vehicles.length > 0 ? 
                  Object.entries(vehicles.reduce((acc, v) => {
                    acc[v.class] = (acc[v.class] || 0) + 1
                    return acc
                  }, {} as { [key: string]: number }))
                  .sort(([,a], [,b]) => b - a)[0]?.[0] || 'None'
                  : 'None'
                }
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Controls */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search vehicles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 font-gta-body"
              />
            </div>
          </div>
          
          <Select value={filterClass} onValueChange={setFilterClass}>
            <SelectTrigger className="w-full md:w-48 font-gta-body">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Filter by class" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Classes</SelectItem>
              {VEHICLE_CLASSES.map(cls => (
                <SelectItem key={cls} value={cls}>{cls}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={filterGarage} onValueChange={setFilterGarage}>
            <SelectTrigger className="w-full md:w-48 font-gta-body">
              <MapPin className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Filter by garage" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Garages</SelectItem>
              {uniqueGarages.map(garage => (
                <SelectItem key={garage} value={garage}>{garage}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="font-gta-body">
                <Plus className="h-4 w-4 mr-2" />
                Add Vehicle
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="font-gta-body">Add New Vehicle</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name" className="font-gta-body">Vehicle Name</Label>
                  <Input
                    id="name"
                    value={newVehicle.name}
                    onChange={(e) => setNewVehicle(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g., Zentorno, Adder, T20"
                    className="font-gta-body"
                  />
                </div>
                
                <div>
                  <Label htmlFor="class" className="font-gta-body">Vehicle Class</Label>
                  <Select value={newVehicle.class} onValueChange={(value) => setNewVehicle(prev => ({ ...prev, class: value }))}>
                    <SelectTrigger className="font-gta-body">
                      <SelectValue placeholder="Select class" />
                    </SelectTrigger>
                    <SelectContent>
                      {VEHICLE_CLASSES.map(cls => (
                        <SelectItem key={cls} value={cls}>{cls}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="garage" className="font-gta-body">Garage Name</Label>
                  <Input
                    id="garage"
                    value={newVehicle.garage}
                    onChange={(e) => setNewVehicle(prev => ({ ...prev, garage: e.target.value }))}
                    placeholder="e.g., Eclipse Towers Apt 31, My Custom Garage"
                    className="font-gta-body"
                  />
                  <p className="text-xs text-muted-foreground mt-1 font-gta-body">
                    Enter any garage name you want
                  </p>
                </div>
                
                <div>
                  <Label htmlFor="imageUrl" className="font-gta-body">Image URL (Optional)</Label>
                  <Input
                    id="imageUrl"
                    value={newVehicle.imageUrl}
                    onChange={(e) => setNewVehicle(prev => ({ ...prev, imageUrl: e.target.value }))}
                    placeholder="https://example.com/car-image.jpg"
                    className="font-gta-body"
                  />
                </div>
                
                <div className="flex justify-end space-x-2 pt-4">
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)} className="font-gta-body">
                    Cancel
                  </Button>
                  <Button onClick={addVehicle} className="font-gta-body">
                    Add Vehicle
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Vehicle Grid */}
        {filteredVehicles.length === 0 ? (
          <div className="text-center py-12">
            <Car className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-gta-body text-lg font-semibold mb-2">No vehicles found</h3>
            <p className="text-muted-foreground mb-4">
              {vehicles.length === 0 
                ? "Start by adding your first vehicle to track"
                : "Try adjusting your search or filters"
              }
            </p>
            {vehicles.length === 0 && (
              <Button onClick={() => setIsAddDialogOpen(true)} className="font-gta-body">
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Vehicle
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredVehicles.map((vehicle) => (
              <Card key={vehicle.id} className="gta-card-glow hover:scale-105 transition-transform duration-200">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="font-gta-body text-lg">{vehicle.name}</CardTitle>
                      <Badge variant="secondary" className="mt-1 font-gta-body text-xs">
                        {vehicle.class}
                      </Badge>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteVehicle(vehicle.id)}
                      className="text-destructive hover:text-destructive/80 h-8 w-8 p-0"
                    >
                      ×
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {vehicle.imageUrl && (
                    <div className="mb-3 rounded-md overflow-hidden bg-muted">
                      <img 
                        src={vehicle.imageUrl} 
                        alt={vehicle.name}
                        className="w-full h-32 object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          target.style.display = 'none'
                        }}
                      />
                    </div>
                  )}
                  <div className="flex items-center text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span className="font-gta-body">{vehicle.garage}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}