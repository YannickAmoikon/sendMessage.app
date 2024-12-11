"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useMessageMutation } from "@/services/message.service";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { Toaster } from "@/components/ui/toaster";
import { SendHorizontal, Download, X, LogOut } from "lucide-react";
import ProtectedRoad from "@/components/app/roads/ProtectedRoad";
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
} from "@/components/ui/card";
import * as XLSX from "xlsx";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function SendPage() {
    const [sendMessage, { isLoading }] = useMessageMutation();
    const { toast } = useToast();
    const router = useRouter();

    const [formData, setFormData] = useState({
        phones: [] as string[],
        body: "",
    });
    const [phoneInput, setPhoneInput] = useState("");
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const handlePhoneInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "," || e.key === "Enter") {
            e.preventDefault();
            const newPhone = phoneInput.trim();
            if (newPhone) {
                const phoneRegex = /^\d{10}$/;
                if (phoneRegex.test(newPhone)) {
                    setFormData((prev) => {
                        const updatedPhones = prev.phones.includes(newPhone)
                            ? prev.phones
                            : [...prev.phones, newPhone];
                        console.log("Numéros enregistrés (depuis saisie):", updatedPhones);
                        return {
                            ...prev,
                            phones: updatedPhones,
                        };
                    });
                    setPhoneInput("");
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

    const removePhone = (phoneToRemove: string) => {
        setFormData((prev) => ({
            ...prev,
            phones: prev.phones.filter((phone) => phone !== phoneToRemove),
        }));
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) {
            const file = e.target.files[0];
            setSelectedFile(file);

            const reader = new FileReader();
            reader.onload = (event) => {
                const data = new Uint8Array(event.target?.result as ArrayBuffer);
                const workbook = XLSX.read(data, { type: "array" });
                const sheet = workbook.Sheets[workbook.SheetNames[0]];

                const rows = XLSX.utils.sheet_to_json(sheet, { raw: false });
                const columnsToExtract = ["Téléphone", "Numéro", "Contact"];
                const extractedPhones: string[] = [];

                rows.forEach((row: any) => {
                    columnsToExtract.forEach((col) => {
                        if (row[col]) {
                            let phone = row[col].toString().trim();
                            if (/^\d{9}$/.test(phone)) phone = "0" + phone;
                            if (/^\d{10}$/.test(phone)) extractedPhones.push(phone);
                        }
                    });

                    Object.values(row).forEach((value) => {
                        let phone = value?.toString().trim();
                        //@ts-ignore
                        if (/^\d{9}$/.test(phone)) phone = "0" + phone;
                        //@ts-ignore
                        if (/^\d{10}$/.test(phone)) extractedPhones.push(phone);
                    });
                });

                console.log("Numéros extraits depuis le fichier Excel:", extractedPhones);

                setFormData((prev) => ({
                    ...prev,
                    phones: Array.from(new Set([...prev.phones, ...extractedPhones])),
                }));

                toast({
                    title: "Fichier importé avec succès",
                    description: `${extractedPhones.length} numéros valides ont été ajoutés.`,
                    className: "bg-green-600 text-white",
                });
            };

            reader.onerror = () => {
                toast({
                    title: "Erreur",
                    description: "Le fichier n'a pas pu être lu. Veuillez réessayer.",
                    variant: "destructive",
                });
            };

            reader.readAsArrayBuffer(file);
        }
    };

    const validateFields = () => {
        if (formData.phones.length === 0) {
            toast({
                title: "Validation échouée",
                description: "Veuillez saisir au moins un numéro de téléphone.",
                variant: "destructive",
            });
            return false;
        }

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

            setFormData({ phones: [], body: "" });
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

    const handleLogout = () => {
        try {
            localStorage.removeItem("token");
            router.push("/login");
            toast({
                title: "Déconnexion réussie",
                description: "Vous avez été déconnecté avec succès.",
                className: "bg-green-600 text-white",
            });
        } catch (error) {
            console.error("Erreur lors de la déconnexion :", error);
            toast({
                title: "Erreur",
                description: "Une erreur est survenue lors de la déconnexion.",
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
                            <div className="flex items-center space-x-2">
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button size="icon" variant="outline" aria-label="Déconnexion">
                                            <LogOut size={18}/>
                                        </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>Etes-vous sûr de vouloir vous déconnecter
                                                ?</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                Cette action est irréversible.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>Annuler</AlertDialogCancel>
                                            <AlertDialogAction
                                                className="bg-red-600 hover:bg-red-700"
                                                onClick={handleLogout}
                                            >
                                                Déconnexion
                                            </AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
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
                                            className="hidden py-1"
                                            onChange={handleFileChange}
                                        />
                                        <Label
                                            htmlFor="file-upload"
                                            className="bg-gray-500 border px-3 py-1.5 rounded-md text-gray-700 font-medium hover:bg-gray-600 cursor-pointer transition-colors"
                                        >
                                            <div className="flex items-center text-white space-x-2">
                                                <Download size={18} className="mr-1" />
                                                <span>
                                                    {selectedFile
                                                        ? selectedFile.name
                                                        : "Importer Contacts"}
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
                                        <Label className="font-normal" htmlFor="phones">Téléphones</Label>
                                        <div className="space-y-2">
                                            <Input
                                                id="phones"
                                                placeholder="Ex: 0750000000, 0750000001, 0750000002"
                                                value={phoneInput}
                                                onChange={(e) => setPhoneInput(e.target.value)}
                                                onKeyDown={handlePhoneInput}
                                                className="h-10"
                                            />
                                            {formData.phones.length > 0 && (
                                                <div className="flex flex-wrap gap-2">
                                                    {formData.phones.map((phone) => (
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