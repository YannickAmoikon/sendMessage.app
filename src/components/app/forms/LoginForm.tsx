"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLoginMutation } from "@/services/auth.service";
import { Loader } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";

export default function LoginForm() {
    const router = useRouter();
    const [login, { isLoading }] = useLoginMutation();
    const { toast } = useToast();

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    /** Gérer les champs du formulaire */
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    /** Valider les champs du formulaire */
    const validateFields = () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!formData.email || !formData.password) {
            toast({
                title: "Validation échouée",
                description: "Tous les champs sont requis.",
                variant: "destructive",
            });
            console.log("Toast appelé : Validation échouée");
            return false;
        }
        if (!emailRegex.test(formData.email)) {
            toast({
                title: "Email invalide",
                description: "Veuillez entrer une adresse email valide.",
                variant: "destructive",
            });
            console.log("Toast appelé : Email invalide");
            return false;
        }
        return true;
    };

    /** Soumission du formulaire */
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateFields()) return;

        try {
            const response = await login({
                email: formData.email,
                password: formData.password,
            }).unwrap();

            // Sauvegarder le token et l'utilisateur dans localStorage
            localStorage.setItem("token", response.token);
            localStorage.setItem("user", JSON.stringify(response.user));

            toast({
                title: "Connexion réussie",
                description: "Bienvenue ! Vous allez être redirigé.",
                className: "bg-green-600 text-white",
            });
            console.log("Toast appelé : Connexion réussie");

            setTimeout(() => {
                router.push("/send");
                router.refresh();
            }, 1000);
        } catch (error) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            const status = error?.status;
            if (status === 400) {
                toast({
                    title: "Identifiants incorrects",
                    description: "Veuillez vérifier vos informations.",
                    variant: "destructive",
                });
                console.log("Toast appelé : Identifiants incorrects");
            } else if (status === 500) {
                toast({
                    title: "Erreur serveur",
                    description: "Une erreur est survenue.",
                    variant: "destructive",
                });
                console.log("Toast appelé : Erreur serveur");
            }
        }
    };

    return (
        <div className="flex h-screen w-full overflow-hidden">
            <Toaster />
            <div className="flex w-full flex-col items-center justify-center lg:w-1/2">
                <div className="relative h-40 w-40">
                    <Image
                        src="/images/logo.jpeg"
                        alt="Logo de la Mairie"
                        layout="fill"
                        objectFit="contain"
                        className="dark:brightness-[0.9]"
                    />
                </div>
                <div className="w-full max-w-[350px] px-4">
                    <form onSubmit={handleSubmit} className="grid gap-6">
                        <div className="text-center">
                            <h1 className="text-xl font-bold">MESSAGERIE</h1>
                        </div>
                        <div className="grid gap-4">
                            <div>
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="m@exemple.com"
                                    required
                                    value={formData.email}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div>
                                <Label htmlFor="password">Mot de passe</Label>
                                <Input
                                    id="password"
                                    name="password"
                                    type="password"
                                    placeholder="********"
                                    required
                                    value={formData.password}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <Button
                                size="sm"
                                disabled={isLoading}
                                type="submit"
                                className="w-full bg-blue-950 hover:bg-blue-800 transition duration-500"
                            >
                                {isLoading ? (
                                    <div className="flex items-center">
                                        <Loader className="animate-spin mr-1" size={18} />
                                        <span>Connexion...</span>
                                    </div>
                                ) : (
                                    "Se connecter"
                                )}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>

            {/* Section image */}
            <div className="hidden w-1/2 lg:block">
                <div className="relative h-full w-full">
                    <Image
                        src="/images/loginImage.jpg"
                        alt="Illustration d'accueil"
                        layout="fill"
                        objectFit="cover"
                        className="dark:brightness-[0.2] dark:grayscale"
                    />
                </div>
            </div>
        </div>
    );
}