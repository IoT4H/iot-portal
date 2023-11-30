'use client'
import { Auth, User } from "@iot-portal/frontend/lib/auth";
import { createContext } from "react";

export const AuthContext = createContext<User | undefined>(undefined);
