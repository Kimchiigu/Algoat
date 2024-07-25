import React, { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/firebase";
import ReactLoading from "react-loading";
import Particles from "react-tsparticles";
import type { Engine } from "tsparticles-engine";
import { loadStarsPreset } from "tsparticles-preset-stars";

const withAuth = (
  WrappedComponent: React.ComponentType,
  isProtected: boolean
) => {
  const AuthWrapper: React.FC<any> = (props) => {
    const [loading, setLoading] = useState(true);
    const [authenticated, setAuthenticated] = useState(false);
    const router = useRouter();

    const particlesInit = useCallback(async (engine: Engine) => {
      await loadStarsPreset(engine);
    }, []);

    const particlesOptions = {
      preset: "stars",
      background: {
        color: {
          value: "#000",
        },
      },
      particles: {
        move: {
          speed: 1,
        },
      },
    };

    useEffect(() => {
      const unsubscribe = auth.onAuthStateChanged((user) => {
        if (user) {
          setAuthenticated(true);
          if (!isProtected) {
            router.push("/home");
          }
        } else {
          setAuthenticated(false);
          if (isProtected) {
            router.push("/login");
          }
        }
        setLoading(false);
      });

      return () => unsubscribe();
    }, [router, isProtected]);

    if (loading) {
      return (
        <div>
          <Particles
            id="tsparticles"
            init={particlesInit}
            options={particlesOptions}
          />
        </div>
      );
    }

    return authenticated === isProtected ? (
      <WrappedComponent {...props} />
    ) : null;
  };

  return AuthWrapper;
};

export default withAuth;
