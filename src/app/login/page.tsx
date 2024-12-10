import LoginForm from "@/components/app/forms/LoginForm";
import RedirectIfAuthenticated from "@/components/app/verifeds/Verifed";

export default function LoginPage() {
    return (
        <RedirectIfAuthenticated>
            <LoginForm/>
        </RedirectIfAuthenticated>
    )
}