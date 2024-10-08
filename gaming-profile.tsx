import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Clock, Gamepad2, Smartphone, Calendar, Award } from "lucide-react"

export default function Component() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userData, setUserData] = useState(null)
  const [email, setEmail] = useState("")

  useEffect(() => {
    if (isLoggedIn) {
      fetchUserData()
    }
  }, [isLoggedIn])

  const fetchUserData = async () => {
    try {
      const response = await fetch(`/api/user/${email}`)
      if (response.ok) {
        const data = await response.json()
        setUserData(data)
      } else if (response.status === 404) {
        // User not found, create a new user
        createNewUser()
      } else {
        console.error('Failed to fetch user data')
      }
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const createNewUser = async () => {
    const newUser = {
      email,
      currentPlan: "Nebula Nexus Basic",
      playingHours: 0,
      connectedDevices: 1,
      planExpiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      nebulaPoints: 0,
      achievementProgress: 0,
      gamesCompleted: 0,
      favoriteGenre: "None"
    }

    try {
      const response = await fetch('/api/user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newUser),
      })

      if (response.ok) {
        const data = await response.json()
        setUserData(data)
      } else {
        console.error('Failed to create new user')
      }
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const updateUserData = async (updatedData) => {
    try {
      const response = await fetch(`/api/user/${email}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
      })

      if (response.ok) {
        const data = await response.json()
        setUserData(data)
      } else {
        console.error('Failed to update user data')
      }
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoggedIn(true)
  }

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">Nebula Cloud Gaming</h1>
        {!isLoggedIn ? (
          <Card className="bg-gray-900 border-purple-500 text-white">
            <CardHeader>
              <CardTitle>Login to Your Nebula Nexus Account</CardTitle>
              <CardDescription className="text-gray-400">Enter your credentials to access your gaming profile</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-white">Email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    required 
                    className="bg-gray-800 border-purple-500 text-white" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-white">Password</Label>
                  <Input id="password" type="password" required className="bg-gray-800 border-purple-500 text-white" />
                </div>
                <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 text-white">
                  Login
                </Button>
              </form>
            </CardContent>
          </Card>
        ) : (
          <Card className="bg-gray-900 border-purple-500 text-white">
            <CardHeader>
              <CardTitle>Welcome back, Nebula Gamer!</CardTitle>
              <CardDescription className="text-gray-400">Here's your Nebula Cloud Gaming profile</CardDescription>
            </CardHeader>
            <CardContent>
              {userData ? (
                <Tabs defaultValue="profile" className="space-y-4">
                  <TabsList className="bg-gray-800 border-purple-500">
                    <TabsTrigger value="profile" className="data-[state=active]:bg-purple-600 text-white">Profile</TabsTrigger>
                    <TabsTrigger value="stats" className="data-[state=active]:bg-purple-600 text-white">Stats</TabsTrigger>
                  </TabsList>
                  <TabsContent value="profile" className="space-y-4">
                    <div className="flex items-center space-x-4">
                      <Clock className="w-6 h-6 text-purple-500" />
                      <div className="flex-grow">
                        <p className="font-semibold">Playing Time</p>
                        <p>{userData.playingHours} hours</p>
                        {userData.currentPlan === "Nebula Nexus Ultimate" && (
                          <div className="mt-2">
                            <Progress value={(userData.playingHours / 1000) * 100} className="bg-gray-800 border-purple-500" />
                            <p className="text-sm text-gray-400 mt-1">{userData.playingHours} / 1000 hours</p>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <Gamepad2 className="w-6 h-6 text-purple-500" />
                      