/** @format */

import React, { createContext, useContext, useReducer, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const AuthContext = createContext();

const authReducer = (state, action) => {
  switch (action.type) {
    case "SET_LOADING":
      return {
        ...state,
        loading: action.payload,
      };
    case "LOGIN_SUCCESS":
    case "REGISTER_SUCCESS":
      localStorage.setItem("token", action.payload.token);
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        loading: false,
      };
    case "LOGOUT":
      localStorage.removeItem("token");
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        loading: false,
      };
    case "LOAD_USER":
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        loading: false,
      };
    case "AUTH_ERROR":
      localStorage.removeItem("token");
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        loading: false,
      };
    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    isAuthenticated: false,
    loading: true,
  });

  const setAuthToken = (token) => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common["Authorization"];
    }
  };

  const loadUser = async () => {
    const token = localStorage.getItem("token");

    if (token) {
      setAuthToken(token);
      try {
        const res = await axios.get("/api/users/profile");
        dispatch({
          type: "LOAD_USER",
          payload: { ...res.data.data, token },
        });
      } catch (error) {
        dispatch({ type: "AUTH_ERROR", error });
      }
    } else {
      dispatch({ type: "AUTH_ERROR" });
    }
  };

  const register = async (userData) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      const res = await axios.post("/api/users/register", userData);

      dispatch({
        type: "REGISTER_SUCCESS",
        payload: res.data.data,
      });

      toast.success("Registration successful!");
      return { success: true };
    } catch (error) {
      dispatch({ type: "AUTH_ERROR" });
      const message = error.response?.data?.message || "Registration failed";
      toast.error(message);
      return { success: false, message };
    }
  };

  const login = async (userData) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      const res = await axios.post("/api/users/login", userData);

      dispatch({
        type: "LOGIN_SUCCESS",
        payload: res.data.data,
      });

      toast.success("Login successful!");
      return { success: true };
    } catch (error) {
      dispatch({ type: "AUTH_ERROR" });
      const message = error.response?.data?.message || "Login failed";
      toast.error(message);
      return { success: false, message };
    }
  };

  const logout = () => {
    dispatch({ type: "LOGOUT" });
    toast.success("Logged out successfully!");
  };

  useEffect(() => {
    loadUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        loading: state.loading,
        register,
        login,
        logout,
        loadUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
