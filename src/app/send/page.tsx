"use client"

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Toaster } from "@/components/ui/toaster";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {Download, FileUp, SendHorizontal} from "lucide-react";
import {ChangeEvent, useState} from "react";
import {Label} from "@/components/ui/label";

const formSchema = z.object({
    contacts: z.string().min(2, {
        message: "Veuillez fournir au moins un contact.",
    }),
    message: z.string().min(1, {
        message: "Le message ne peut pas être vide.",
    }),
});

export default function SendPage() {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) {
            setSelectedFile(e.target.files[0]);
            console.log(e.target.files[0]); // Temporairement log le fichier sélectionné
        }
    }

        const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            contacts: "",
            message: "",
        },
    });

    function onSubmit(values: z.infer<typeof formSchema>) {
        console.log(values);
    }

    return (
        <main className="flex flex-1 h-full">
            <Toaster />
            <Card className="flex-1 rounded-none px-4 md:px-10 shadow-none border-0 flex flex-col">
                <CardHeader className="border-b-2">
                    <CardTitle className="uppercase">Messagerie</CardTitle>
                    <CardDescription>{"Gérer l'envoi de vos messages"}</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="py-8 md:py-16 mx-auto flex flex-col md:h-auto w-full md:max-w-4xl">
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
                                        className=" bg-gray-500 border px-3 py-1.5 rounded-md text-gray-700 font-medium hover:bg-gray-600 cursor-pointer transition-colors"
                                    >
                                        <div className="flex items-center text-white space-x-2">
                                            <Download size={18} className="mr-1"/>
                                            <span className="text-sm ">{selectedFile ? selectedFile.name : "Importer contacts"}</span>
                                        </div>
                                    </Label>
                                </div>
                            </div>
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 md:space-y-8">
                                    <FormField
                                        control={form.control}
                                        name="contacts"
                                        render={({field}) => (
                                            <FormItem>
                                                <FormLabel>Contacts</FormLabel>
                                                <FormControl>
                                                <Input className="h-10" placeholder="Entrez les numéros de contact..." {...field} />
                                                </FormControl>
                                                <FormDescription>
                                                    Séparez les numéros par des virgules.
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="message"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Message</FormLabel>
                                                <FormControl>
                                                    <Textarea className="h-32 md:h-48" placeholder="Tapez votre message ici..." {...field} />
                                                </FormControl>
                                                <FormDescription>
                                                    Ce message sera envoyé aux contacts.
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <Button size="sm" className="bg-green-600 hover:scale-105 hover:bg-green-700 hover:duration-500 duration-500 hover:shadow-md" type="submit"><SendHorizontal className="mr-1" />Envoyer</Button>
                                </form>
                            </Form>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </main>
    );
}