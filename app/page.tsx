import { Button } from "./components/ui/button"
import { Input } from "./components/ui/input"
import { Card, CardContent, CardFooter } from "./components/ui/card"
import Link from "next/link"
import Image from "next/image"

export default function Component() {
  return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <h1 className="text-[2.9rem] font-bold text-center mb-6 text-black">Sistema Hospitalario</h1>
        <Card className="w-full max-w-md">
          <CardContent>
            <form>
            <div className="space-y-4">
                <div className="space-y-2 mt-5">
                  <label
                      htmlFor="email"
                      className="text-sm text-black font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Email
                  </label>
                  <Input id="email" type="email" placeholder="Email" />
                </div>
                <div className="space-y-2">
                  <label
                      htmlFor="password"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
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
          <CardFooter className="space-y-2">
            <Link className="text-sm text-gray-500 underline hover:no-underline" href="#">
              ¿Olvidaste tu contraseña?
            </Link>
          </CardFooter>
        </Card>
        <Link className="block text-[1.6rem] text-blue-600 underline mt-4 text-center hover:no-underline" href="#">
          Registrarse como paciente
        </Link>

        <div className="fixed bottom-4 right-4 mb-9">
          <Image src="/file.png" alt="Description" width={170} height={170} />
        </div>
        <div className="text-white text-l text-left pl-4 pr-4 fixed bottom-0 left-0 right-0 bg-black w-full py-4">
          Usuario: Admin / Paciente / Médico
        </div>
      </div>
  )
}
