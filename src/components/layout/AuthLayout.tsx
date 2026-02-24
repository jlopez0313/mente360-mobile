import logo from "@/assets/images/logo.png";
import React from "react";

interface AuthLayoutProps {
    title: string;
    subtitle: string;
    children: React.ReactNode;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({
    title,
    subtitle,
    children,
}) => {
    return (
        <div className="flex-1 flex flex-col items-center justify-center px-6 pb-12 w-full">
            {/* Logo */}
            <div className="mb-8 text-center">
                <img src={logo} alt="Mente 360" className="w-20 mx-auto mb-4" />
                <h1 className="text-2xl !font-bold text-foreground">{title}</h1>
                <p className="text-muted-foreground mt-2">{subtitle}</p>
            </div>

            {children}
        </div>
    );
};
