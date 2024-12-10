import Image from "next/image";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";


export default function LoginForm() {
    return (
        <div className="flex h-screen w-full overflow-hidden">
            <div className="flex w-full flex-col items-center justify-center lg:w-1/2">
                <div className="relative h-40 w-40">
                    <Image
                        src="/images/logo.jpeg" // Assurez-vous de mettre le bon chemin vers votre logo
                        alt="Logo de la Mairie"
                        layout="fill"
                        objectFit="contain"
                        className="dark:brightness-[0.9]"
                    />
                </div>
                <div className="w-full max-w-[350px] px-4">
                    <div className="grid gap-6">
                        <div className="grid gap-2 text-center">
                            <h1 className="text-xl font-bold">MESSAGERIE</h1>
                        </div>
                        <div className="grid gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="m@exemple.com"
                                    required
                                />
                            </div>
                            <div className="grid gap-2">
                                <div className="flex items-center">
                                    <Label htmlFor="password">Mot de passe</Label>
                                </div>
                                <Input id="password" type="password" required/>
                            </div>
                            <Button type="submit" className="w-full bg-blue-950 hover:shadow-md duration-500 hover:bg-blue-800">
                                Se connecter
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="hidden w-1/2 lg:block">
                <div className="relative h-full w-full">
                    <Image
                        src="/images/loginImage.jpg"
                        alt="Image"
                        layout="fill"
                        objectFit="cover"
                        className="dark:brightness-[0.2] dark:grayscale"
                    />
                </div>
            </div>
        </div>
    );
}
