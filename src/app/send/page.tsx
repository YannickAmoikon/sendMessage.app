"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useMessageMutation } from "@/services/message.service";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { SendHorizontal, Download, X } from "lucide-react";
import ProtectedRoad from "@/components/app/roads/ProtectedRoad";
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
} from "@/components/ui/card";

export default function SendPage() {
    const [sendMessage, { isLoading }] = useMessageMutation();
    const { toast } = useToast();

    const [formData, setFormData] = useState({
        phones: [] as string[],
        body: "",
    });
    const [phoneInput, setPhoneInput] = useState("");
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    /** Gérer l'ajout de numéros de téléphone */
    const handlePhoneInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === ',' || e.key === 'Enter') {
            e.preventDefault();
            const newPhone = phoneInput.trim();

            if (newPhone) {
                // Vérifier le format du numéro
                const phoneRegex = /^\d{10}$/;
                if (phoneRegex.test(newPhone)) {
                    // Ajouter le numéro s'il n'existe pas déjà
                    setFormData(prev => ({
                        ...prev,
                        phones: prev.phones.includes(newPhone)
                            ? prev.phones
                            : [...prev.phones, newPhone]
                    }));
                    setPhoneInput(""); // Réinitialiser l'input
                } else {
                    toast({
                        title: "Numéro invalide",
                        description: "Le numéro doit contenir exactement 10 chiffres.",
                        variant: "destructive",
                    });
                }
            }
        }
    };

    /** Supprimer un numéro de téléphone */
    const removePhone = (phoneToRemove: string) => {
        setFormData(prev => ({
            ...prev,
            phones: prev.phones.filter(phone => phone !== phoneToRemove)
        }));
    };

    /** Gérer les changements de champs du formulaire */
    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    /** Gérer l'import de fichier */
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) {
            const file = e.target.files[0];
            setSelectedFile(file);
            toast({
                title: "Fichier importé",
                description: `Fichier sélectionné : ${file.name}`,
                className: "bg-green-600 text-white",
            });
        }
    };

    /** Valider les champs du formulaire */
    const validateFields = () => {
        // Validation des numéros de téléphone
        if (formData.phones.length === 0) {
            toast({
                title: "Validation échouée",
                description: "Veuillez saisir au moins un numéro de téléphone.",
                variant: "destructive",
            });
            return false;
        }

        // Validation du corps du message
        if (!formData.body) {
            toast({
                title: "Validation échouée",
                description: "Le message ne peut pas être vide.",
                variant: "destructive",
            });
            return false;
        }

        return true;
    };

    /** Soumettre le formulaire */
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateFields()) return;

        try {
            await sendMessage({
                phones: formData.phones,
                body: formData.body,
            }).unwrap();

            toast({
                title: "Succès",
                description: "Votre message a été envoyé avec succès.",
                className: "bg-green-600 text-white",
            });

            // Réinitialiser le formulaire
            setFormData({
                phones: [],
                body: "",
            });
            setPhoneInput("");
            setSelectedFile(null);
        } catch (error) {
            console.error("Erreur lors de l'envoi :", error);
            toast({
                title: "Erreur",
                description: "Impossible d'envoyer le message, veuillez réessayer.",
                variant: "destructive",
            });
        }
    };

    return (
        <ProtectedRoad>
            <main className="flex flex-1 h-full">
                <Toaster />
                <Card className="flex-1 rounded-none px-4 md:px-10 shadow-none border-0 flex flex-col">
                    <CardHeader className="border-b-2">
                        <div className="flex justify-between items-center">
                            <div className="flex flex-col space-y-2">
                                <CardTitle className="uppercase">Messagerie</CardTitle>
                                <CardDescription>
                                    {"Gérez l'envoi de vos messages."}
                                </CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="py-8 md:py-16 mx-auto flex flex-col h-auto w-full md:max-w-4xl">
                            <div className="border-2 p-4 md:p-8 flex flex-col rounded-md w-full space-y-8">
                                <div className="flex justify-end">
                                    <div className="flex items-center space-x-2 rounded-md">
                                        <Input
                                            id="file-upload"
                                            type="file"
                                            accept=".xlsx, .xls"
                                            className="hidden"
                                            onChange={handleFileChange}
                                        />
                                        <Label
                                            htmlFor="file-upload"
                                            className="bg-gray-500 border px-3 py-1.5 rounded-md text-gray-700 font-medium hover:bg-gray-600 cursor-pointer transition-colors"
                                        >
                                            <div className="flex items-center text-white space-x-2">
                                                <Download size={18} className="mr-1" />
                                                <span className="text-sm">
                                                    {selectedFile
                                                        ? selectedFile.name
                                                        : "Importer téléphones"}
                                                </span>
                                            </div>
                                        </Label>
                                    </div>
                                </div>

                                <form
                                    onSubmit={handleSubmit}
                                    className="space-y-6 md:space-y-8"
                                >
                                    <div>
                                        <Label htmlFor="phones">Téléphones</Label>
                                        <div className="space-y-2">
                                            <Input
                                                id="phones"
                                                placeholder="Entrez les numéros (10 chiffres), séparés par une virgule ou Entrée..."
                                                value={phoneInput}
                                                onChange={(e) => setPhoneInput(e.target.value)}
                                                onKeyDown={handlePhoneInput}
                                                className="h-10"
                                            />
                                            {formData.phones.length > 0 && (
                                                <div className="flex flex-wrap gap-2">
                                                    {formData.phones.map(phone => (
                                                        <div
                                                            key={phone}
                                                            className="bg-white border text-gray-800 px-2 py-0.5 rounded-md flex items-center space-x-3 rounded-sm"
                                                        >
                                                            <span className="text-sm">{phone}</span>
                                                            <Button
                                                                size="icon"
                                                                variant="destructive"
                                                                type="button"
                                                                onClick={() => removePhone(phone)}
                                                                className="text-red-500 w-4 h-4 rounded-sm text-white"
                                                            >
                                                                <X size={6} />
                                                            </Button>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                            <p className="text-sm text-gray-500 mt-1">
                                                {"Format attendu : numéros de 10 chiffres suivi d'une virgule ou de la touche Entrée."}
                                            </p>
                                        </div>
                                    </div>

                                    <div>
                                        <Label htmlFor="body">Message</Label>
                                        <Textarea
                                            id="body"
                                            name="body"
                                            placeholder="Rédigez votre message ici..."
                                            value={formData.body}
                                            onChange={handleInputChange}
                                            className="h-32 md:h-48"
                                        />
                                        <p className="text-sm text-gray-500 mt-1">
                                            Ce message sera envoyé aux téléphones.
                                        </p>
                                    </div>

                                    <Button
                                        onClick={handleSubmit}
                                        size="sm"
                                        className="bg-green-600 hover:scale-105 hover:bg-green-700 duration-500 hover:shadow-md"
                                        disabled={isLoading}
                                    >
                                        <SendHorizontal className="mr-1" />
                                        {isLoading ? "Envoi en cours..." : "Envoyer"}
                                    </Button>
                                </form>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </main>
        </ProtectedRoad>
    );
}