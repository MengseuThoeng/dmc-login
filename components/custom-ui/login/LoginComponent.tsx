'use client'
import { useState, useEffect } from "react";
import { z } from "zod";
import "./main.css";
import NetworkGlobeComponent from "@/components/custom-ui/NetworkGlobe";
import Image from "next/image";

const loginSchema = z.object({
    username: z.string().min(1, "Username is required"),
    password: z.string().min(1, "Password is required")
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginComponent() {
    const [isLoginButtonDisabled, setIsLoginButtonDisabled] = useState(false);
    const [validationErrors, setValidationErrors] = useState<Partial<Record<keyof LoginFormData, string>>>({});

    // Set metadata using vanilla JavaScript
    useEffect(() => {
        // Set page title
        document.title = "ACLEDA MIS - Login";

        // Set or update meta tags
        const setMetaTag = (name: string, content: string, property?: boolean) => {
            const attribute = property ? "property" : "name";
            let meta = document.querySelector(`meta[${attribute}="${name}"]`) as HTMLMetaElement;

            if (!meta) {
                meta = document.createElement("meta");
                meta.setAttribute(attribute, name);
                document.head.appendChild(meta);
            }
            meta.content = content;
        };

        // Set favicon
        const setFavicon = (href: string) => {
            let link = document.querySelector("link[rel='icon']") as HTMLLinkElement;
            if (!link) {
                link = document.createElement("link");
                link.rel = "icon";
                link.type = "image/png";
                document.head.appendChild(link);
            }
            link.href = href;
        };

        // Basic meta tags
        setMetaTag(
            "description",
            "Login to ACLEDA Management Information System (MIS). Secure access for ACLEDA Bank employees and authorized users."
        );
        setMetaTag("viewport", "width=device-width, initial-scale=1.0");
        setMetaTag("theme-color", "#1e40af");

        // Open Graph tags
        setMetaTag("og:type", "website", true);
        setMetaTag("og:title", "ACLEDA MIS - Login", true);
        setMetaTag(
            "og:description",
            "Login to ACLEDA Management Information System (MIS). Secure access for ACLEDA Bank employees and authorized users.",
            true
        );
        setMetaTag(
            "og:image",
            "/images/logo-dmc.jpg",
            true
        );

        // Twitter tags
        setMetaTag("twitter:card", "summary");
        setMetaTag("twitter:title", "ACLEDA MIS - Login");
        setMetaTag(
            "twitter:description",
            "Login to ACLEDA Management Information System (MIS). Secure access for ACLEDA Bank employees and authorized users."
        );
        setMetaTag(
            "twitter:image",
            "/images/logo-dmc.jpg"
        );

        // Set favicon
        setFavicon("/images/logo-dmc.jpg");
    }, []);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        // This is now a standalone form, so there's no server action to post to.
        e.preventDefault();

        // Clear previous validation errors
        setValidationErrors({});

        const formData = new FormData(e.currentTarget);
        const data = {
            username: formData.get("username") as string,
            password: formData.get("password") as string
        };

        // Validate with Zod
        const result = loginSchema.safeParse(data);

        if (!result.success) {
            // Extract errors - use 'issues' instead of 'errors'
            const errors: Partial<Record<keyof LoginFormData, string>> = {};
            result.error.issues.forEach((issue: z.ZodIssue) => {
                const field = issue.path[0] as keyof LoginFormData;
                if (!errors[field]) {
                    errors[field] = issue.message;
                }
            });

            setValidationErrors(errors);
            return;
        }

        // If validation passes, hook up your own submit logic here
        // (e.g. call an API, or invoke a callback passed in via props).
        setIsLoginButtonDisabled(true);
    };

    const handleForgetPassword = () => {
        const forgetPasswordUrl = process.env.NEXT_PUBLIC_FORGET_PASSWORD_URL || "/account/forget-password";
        window.location.href = forgetPasswordUrl;
    };

    return (
        <div className="login-container">
            {/* Diagonal Fade Grid Background - Top Right */}
            <div className="login-grid-background" />

            {/* Gradient overlay */}
            <div className="login-gradient-overlay" />

            {/* 3D Geometric floating elements */}
            <div className="floating-elements">
                {/* Curved tube shapes */}
                <div className="tube-1 animate-float md-hidden"></div>
                <div className="tube-2 animate-float-delayed lg-hidden"></div>
                <div className="tube-3 animate-float md-hidden"></div>

                {/* Ring shapes */}
                <div className="ring-1 animate-float-delayed lg-hidden"></div>
                <div className="ring-2 animate-float md-hidden"></div>

                {/* Wave-like forms */}
                <div className="wave-1 animate-float lg-hidden"></div>
                <div className="wave-2 animate-float-delayed md-hidden"></div>
            </div>

            <div className="login-content">
                {/* <Image
                    src="/images/logo-dmc.jpg"
                    width={1000000}
                    height={110}
                    alt="Company Logo"
                    className="logo-top"
                /> */}

                <div className="login-card-wrapper">
                    <div className="login-card">
                        <div className="login-flex-container">
                            {/* Left side - Image */}
                            <div className="login-image-side ">
                                <div style={{ width: "100%", height: "100%" }}>
                                    <NetworkGlobeComponent />
                                </div>
                            </div>

                            {/* Right side - Login Form */}
                            <div className="login-form-side">
                                {/* Header */}
                                <div className="login-header">
                                    <div className="login-header-logo-wrapper ">
                                        <Image
                                            src="/images/logo-dmc.jpg"
                                            width={150}
                                            height={150}
                                            alt="Company Logo"
                                            className="login-header-logo"
                                        />
                                    </div>

                                    <h1 className="login-title">DMC TEAM</h1>
                                    <p className="login-subtitle">Welcome Back login to your account!</p>
                                </div>

                                {/* Form */}
                                <form id="kc-form-login" className="login-form" onSubmit={handleSubmit}>
                                    {/* Username Field */}
                                    <div className="form-group">
                                        <div className="input-container">
                                            <input
                                                id="username"
                                                name="username"
                                                type="text"
                                                autoComplete="username"
                                                autoFocus
                                                defaultValue=""
                                                placeholder=""
                                                style={{textTransform : "uppercase"}}
                                                className={`form-input helvetica-font ${
                                                    validationErrors.username ? "error" : ""
                                                }`}
                                            />
                                            <label htmlFor="username" className="form-label helvetica-font">
                                                Username
                                            </label>
                                        </div>
                                        {validationErrors.username && (
                                            <div className="error-message">{validationErrors.username}</div>
                                        )}
                                    </div>

                                    {/* Password Field */}
                                    <div className="form-group">
                                        <div className="input-container">
                                            <input
                                                id="password"
                                                name="password"
                                                type="password"
                                                autoComplete="current-password"
                                                placeholder=" "
                                                className={`form-input helvetica-font ${
                                                    validationErrors.password ? "error" : ""
                                                }`}
                                            />
                                            <label htmlFor="password" className="form-label helvetica-font">
                                                Password
                                            </label>
                                        </div>
                                        {validationErrors.password && (
                                            <div className="error-message">{validationErrors.password}</div>
                                        )}
                                    </div>

                                    {/* Login Button */}
                                    <div className="login-button-wrapper w-full">
                                        <button type="submit" disabled={isLoginButtonDisabled} className="login-button ">
                                            Login
                                        </button>
                                    </div>
                                </form>
                                <button onClick={handleForgetPassword} className="forget-password-btn">
                                    Forget Password ?
                                </button>
                                {/* Quote */}
                                <div className="login-quote">
                                    <span className="login-quote-text">
                                        Management&#39;s job is to optimize the whole system.
                                        <br />A good system shortens the road to the goal.
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Version and Copyright Information */}
                    <div className="login-footer">
                        <div className="login-version">
                            <span className="login-version-number">Version 1.0.0</span>
                            <br />
                            <span>Released: January 01, 2025</span>
                        </div>
                        <p className="login-copyright">© Copyright 2025 by ACLEDA Bank Plc. All Rights Reserved.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}