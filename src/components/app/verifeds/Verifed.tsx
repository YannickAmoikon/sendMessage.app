'use client'

import { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader } from "lucide-react";

const getAuthToken = () => {
    // Vérifie si le token est présent dans le localStorage (ou tout autre mécanisme de stockage)
    return localStorage.getItem('token');
};

const RedirectIfAuthenticated = ({ children }: { children: ReactNode }) => {
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null); // État pour l'authentification

    useEffect(() => {
        const token = getAuthToken(); // Vérifie le token dans le localStorage
        if (token) {
            // Si un token est détecté, considère l'utilisateur comme connecté
            setIsAuthenticated(true);
        } else {
            // Si aucun token, indique que l'utilisateur n'est pas connecté
            setIsAuthenticated(false);
        }
    }, []);

    useEffect(() => {
        if (isAuthenticated) {
            // Si l'utilisateur est déjà authentifié, redirige immédiatement vers /send (sans recharger la page)
            router.replace("/send");
        }
    }, [isAuthenticated, router]);

    if (isAuthenticated === null) {
        // État intermédiaire : tant que l'authentification est en cours de vérification, affiche un loader
        return (
            <div className="flex h-screen items-center justify-center">
                <Loader className="animate-spin" size={32} />
            </div>
        );
    }

    if (isAuthenticated) {
        // Si authentifié, ne retourne rien car la navigation est en cours
        return null;
    }

    // Si non authentifié, affiche les enfants (le contenu de la page)
    return <>{children}</>;
};

export default RedirectIfAuthenticated;