'use client'
import { Auth } from "@iot-portal/frontend/lib/auth";
import { createContext } from "react";

export const AuthContext = createContext(new Auth());
