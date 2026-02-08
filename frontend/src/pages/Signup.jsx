// src/pages/Signup.jsx
import React, { useState, useEffect } from "react";
import { Eye, EyeOff, AlertCircle } from "lucide-react";
import { NavLink, useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { registerUser, resetRegisterSuccess } from "../features/authSlice";
import { useDispatch, useSelector } from "react-redux";

/* ---------------- ZOD SCHEMA ---------------- */
const signupSchema = z
  .object({
    firstName: z.string().min(3, "Username must be at least 3 characters"),
    emailId: z.string().email("Invalid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).+$/,
        "Password must include uppercase, lowercase, number & symbol"
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

/* ---------------- ANIMATION ---------------- */
const container = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, staggerChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0 },
};

const Signup = () => {
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error, registerSuccess } = useSelector(
    (state) => state.auth
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(signupSchema),
  });

  useEffect(() => {
    if (registerSuccess) {
      setShowSuccess(true);
      reset();
      dispatch(resetRegisterSuccess());

      const timer = setTimeout(() => {
        setShowSuccess(false);
        navigate("/login");
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, [registerSuccess, dispatch, navigate, reset]);

  const onSubmit = (data) => {
    dispatch(registerUser(data));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <motion.form
        onSubmit={handleSubmit(onSubmit)}
        variants={container}
        initial="hidden"
        animate="visible"
        className="w-full max-w-md bg-zinc-950 border border-zinc-800 p-8 rounded-xl text-white"
      >
        <h1 className="text-2xl font-semibold mb-2">
          Create Account
        </h1>
        <p className="text-sm text-zinc-400 mb-6">
          Sign up to continue
        </p>

        {/* Success */}
        {showSuccess && (
          <div className="mb-4 text-white flex items-center gap-2 text-sm">
            <AlertCircle size={16} /> Account created successfully
          </div>
        )}

        {/* API Error */}
        {error && (
          <div className="mb-4 text-red-500 flex items-center gap-2 text-sm">
            <AlertCircle size={16} /> {error}
          </div>
        )}

        {/* Username */}
        <motion.div variants={item} className="mb-3">
          <input
            {...register("firstName")}
            placeholder="Username"
            className="w-full px-4 py-3 rounded-lg bg-black border border-zinc-700 outline-none focus:border-white"
          />
          {errors.firstName && (
            <p className="text-xs text-red-500 mt-1">
              {errors.firstName.message}
            </p>
          )}
        </motion.div>

        {/* Email */}
        <motion.div variants={item} className="mb-3">
          <input
            type="email"
            {...register("emailId")}
            placeholder="Email"
            className="w-full px-4 py-3 rounded-lg bg-black border border-zinc-700 outline-none focus:border-white"
          />
          {errors.emailId && (
            <p className="text-xs text-red-500 mt-1">
              {errors.emailId.message}
            </p>
          )}
        </motion.div>

        {/* Password */}
        <motion.div variants={item} className="relative mb-3">
          <input
            type={showPass ? "text" : "password"}
            {...register("password")}
            placeholder="Password"
            className="w-full px-4 py-3 rounded-lg bg-black border border-zinc-700 outline-none focus:border-white"
          />
          <button
            type="button"
            onClick={() => setShowPass(!showPass)}
            className="absolute right-3 top-3 text-zinc-400 cursor-pointer"
          >
            {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
          {errors.password && (
            <p className="text-xs text-red-500 mt-1">
              {errors.password.message}
            </p>
          )}
        </motion.div>

        {/* Confirm Password */}
        <motion.div variants={item} className="relative mb-5">
          <input
            type={showConfirm ? "text" : "password"}
            {...register("confirmPassword")}
            placeholder="Confirm Password"
            className="w-full px-4 py-3 rounded-lg bg-black border border-zinc-700 outline-none focus:border-white"
          />
          <button
            type="button"
            onClick={() => setShowConfirm(!showConfirm)}
            className="absolute right-3 top-3 text-zinc-400 cursor-pointer"
          >
            {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
          {errors.confirmPassword && (
            <p className="text-xs text-red-500 mt-1">
              {errors.confirmPassword.message}
            </p>
          )}
        </motion.div>

        {/* Submit */}
        <motion.button
          whileTap={{ scale: 0.97 }}
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-white text-black rounded-lg font-medium cursor-pointer disabled:opacity-50"
        >
          {loading ? "Creating..." : "Create Account"}
        </motion.button>

        <p className="text-center text-sm mt-4 text-zinc-400">
          Already have an account?{" "}
          <NavLink to="/login" className="text-white cursor-pointer">
            Login
          </NavLink>
        </p>
      </motion.form>
    </div>
  );
};

export default Signup;
