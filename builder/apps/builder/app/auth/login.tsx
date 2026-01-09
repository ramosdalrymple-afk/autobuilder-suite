import { TooltipProvider } from "@radix-ui/react-tooltip";
import {
  Button,
  Flex,
  globalCss,
  rawTheme,
  Text,
  theme,
} from "@webstudio-is/design-system";
import { GithubIcon, GoogleIcon } from "@webstudio-is/icons";
import { Form } from "@remix-run/react";
import { authPath } from "~/shared/router-utils";
import { SecretLogin } from "./secret-login";

// 1. GLOBAL BACKGROUND: Deep, professional gradient
const globalStyles = globalCss({
  body: {
    margin: 0,
    overflow: "hidden",
    // Deep Ocean / Slate gradient
    background: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #172554 100%)",
    backgroundSize: "cover",
    fontFamily: "Inter, sans-serif",
    color: "white",
  },
});

export type LoginProps = {
  errorMessage?: string;
  isGithubEnabled?: boolean;
  isGoogleEnabled?: boolean;
  isSecretLoginEnabled?: boolean;
};

// 2. AUTOBUILDER LOGO (Placeholder)
const AutoBuilderLogo = () => (
  <svg width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Glassy Logo Icon */}
    <rect width="56" height="56" rx="16" fill="url(#paint0_linear)" fillOpacity="0.8"/>
    <path d="M28 14L40 38H16L28 14Z" fill="white"/>
    <rect x="23" y="38" width="10" height="10" rx="2" fill="white" fillOpacity="0.9"/>
    <defs>
      <linearGradient id="paint0_linear" x1="0" y1="0" x2="56" y2="56" gradientUnits="userSpaceOnUse">
        <stop stopColor="#3B82F6"/>
        <stop offset="1" stopColor="#8B5CF6"/>
      </linearGradient>
    </defs>
  </svg>
);

export const Login = ({
  errorMessage,
  isGithubEnabled,
  isGoogleEnabled,
  isSecretLoginEnabled,
}: LoginProps) => {
  globalStyles();
  
  return (
    <Flex
      align="center"
      justify="center"
      css={{
        height: "100vh",
        width: "100vw",
        position: "relative",
      }}
    >
      {/* 3. AMBIENT GLOW ORBS (Behind the glass) */}
      <div style={{
          position: "absolute", top: "20%", left: "30%",
          width: "300px", height: "300px",
          background: "#3B82F6", filter: "blur(120px)", opacity: 0.2, borderRadius: "50%"
      }} />
      <div style={{
          position: "absolute", bottom: "20%", right: "30%",
          width: "300px", height: "300px",
          background: "#8B5CF6", filter: "blur(120px)", opacity: 0.2, borderRadius: "50%"
      }} />

      {/* 4. MAIN GLASS CARD */}
      <Flex
        direction="column"
        align="center"
        gap="6"
        css={{
          width: "100%",
          maxWidth: "420px",
          padding: theme.spacing[13],
          
          // --- THE GLASS EFFECT ---
          background: "rgba(255, 255, 255, 0.03)", // Very subtle fill
          backdropFilter: "blur(16px)",            // Heavy blur
          WebkitBackdropFilter: "blur(16px)",      // Safari support
          border: "1px solid rgba(255, 255, 255, 0.1)", // Frosty border
          boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.3)", // Soft shadow
          borderRadius: "24px",
          zIndex: 10,
        }}
      >
        {/* BRANDING */}
        <Flex direction="column" align="center" gap="3">
            <AutoBuilderLogo />
            <Text 
                variant="brandSectionTitle" 
                as="h1" 
                align="center" 
                css={{ 
                  color: "#ffffff", 
                  fontWeight: 600,
                  letterSpacing: "-0.5px"
                }}
            >
             AutoBuilder Suite
            </Text>
            <Text align="center" css={{ color: "rgba(255,255,255,0.6)", fontSize: "14px" }}>
             Login to your workspace
            </Text>
        </Flex>

        <TooltipProvider>
          <Flex direction="column" gap="3" css={{ width: "100%" }}>
            <Form method="post" style={{ display: "contents" }}>
              
              {/* GOOGLE BUTTON */}
              <Button
                disabled={isGoogleEnabled === false}
                prefix={<GoogleIcon size={20} />}
                css={{ 
                    height: "48px",
                    // White glass button
                    backgroundColor: "rgba(255, 255, 255, 0.95)",
                    color: "#0F172A",
                    border: "none",
                    fontWeight: 500,
                    "&:hover": { backgroundColor: "#ffffff", transform: "translateY(-1px)" },
                    transition: "all 0.2s ease"
                }}
                formAction={authPath({ provider: "google" })}
              >
                Sign in with Google
              </Button>

              {/* GITHUB BUTTON */}
              <Button
                disabled={isGithubEnabled === false}
                prefix={<GithubIcon size={20} fill="currentColor" />}
                css={{
                  height: "48px",
                  // Dark glass button
                  backgroundColor: "rgba(0, 0, 0, 0.2)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  color: "white",
                  "&:hover": { 
                      backgroundColor: "rgba(0, 0, 0, 0.4)",
                      borderColor: "rgba(255, 255, 255, 0.2)"
                  },
                  transition: "all 0.2s ease"
                }}
                formAction={authPath({ provider: "github" })}
              >
                Sign in with GitHub
              </Button>
            </Form>
            
            {/* Divider */}
            {isSecretLoginEnabled && (
                <div style={{ 
                    height: 1, 
                    background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)", 
                    width: "100%", 
                    margin: "12px 0" 
                }} />
            )}

            {/* CENTERED SECRET LOGIN BUTTON */}
            {isSecretLoginEnabled && (
              <Flex justify="center" css={{ width: "100%", opacity: 0.9 }}>
                 <SecretLogin />
              </Flex>
            )}
          </Flex>
        </TooltipProvider>

        {/* ERROR MESSAGE */}
        {errorMessage ? (
          <Flex css={{ 
              padding: "12px", 
              background: "rgba(220, 38, 38, 0.15)", // Red glass
              border: "1px solid rgba(220, 38, 38, 0.2)", 
              borderRadius: "12px",
              width: "100%",
              justifyContent: "center"
          }}>
             <Text align="center" css={{ color: "#FCA5A5", fontSize: "13px" }}>
                {errorMessage}
             </Text>
          </Flex>
        ) : null}
      </Flex>
      
      {/* Footer Credits (Optional) */}
      <div style={{ position: "absolute", bottom: 24, opacity: 0.4, fontSize: "12px" }}>
        AutoBuilder Suite © 2026
      </div>
    </Flex>
  );
};