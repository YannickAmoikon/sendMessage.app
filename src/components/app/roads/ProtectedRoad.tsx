import { useRouter } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";

const getAuthToken = () => {
    return localStorage.getItem("token");
};

const ProtectedRoad = ({ children }: { children: ReactNode }) => {
    const router = useRouter();
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        const token = getAuthToken();

        if (!token) {
            router.push("/login"); // Redirige si besoin
        } else {
            setIsMounted(true); // Passe l'état à monté uniquement si token existe
        }
    }, [router]);

    if (!isMounted) {
        return null;
    }

    return <>{children}</>;
};

export default ProtectedRoad;