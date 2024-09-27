import { Button } from "./components/ui/button"
import { Input } from "./components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./components/ui/card"
import Link from "next/link"
import Image from "next/image"

export default function Component() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-black font-bold text-center">Sistema Hospitalario</CardTitle>
        </CardHeader>
        <CardContent>
          <form>
            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm text-black font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Email
                </label>
                <Input id="email" type="email" placeholder="Email" />
              </div>
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Contraseña
                </label>
                <Input id="password" type="password" placeholder="Contraseña" />
              </div>
              <Button className="bg-black w-full text-white" type="submit">
                Iniciar sesión
              </Button>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col items-center space-y-2">
          <Link className="text-sm text-blue-600 hover:underline" href="#">
            ¿Olvidaste tu contraseña?
          </Link>
          <Link className="block text-sm text-blue-600 hover:underline" href="#">
            Registrarse como paciente
      </Link>
        </CardFooter>
        
      </Card>
     
        
       
      <div className="fixed bottom-4 right-4">
        <Image src="/file.png" alt="Description" width={170} height={170} />
      </div>
      <div className="fixed bottom-4 left-0 right-0 text-center text-sm text-gray-500">
        Usuario: Admin / Paciente / Médico
      </div>
    </div>
  )
}