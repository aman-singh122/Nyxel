import React, { useState, useEffect } from "react";
import { Eye, EyeOff, User, Shield, AlertCircle } from "lucide-react";
import { NavLink, useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { loginUser, clearError } from "../features/authSlice";

/* ---------------- ZOD SCHEMA ---------------- */
const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  role: z.enum(["user", "admin"]),
});

/* ---------------- ANIMATION VARIANTS ---------------- */
const container = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.5, staggerChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0 },
};

const errorAnim = {
  hidden: { x: 0 },
  visible: {
    x: [0, -6, 6, -4, 4, 0],
    transition: { duration: 0.35 },
  },
};

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isAuthenticated, loading, error } = useSelector(
    (state) => state.auth
  );

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { role: "user" },
  });

  const role = watch("role");

  useEffect(() => {
    if (isAuthenticated) navigate("/");
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    return () => dispatch(clearError());
  }, [dispatch]);

  const onSubmit = (data) => {
    dispatch(loginUser(data));
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#020202] relative overflow-hidden px-4">

      {/* SUBTLE WHITE DEPTH (NO COLOR) */}
      <div className="absolute -top-40 -left-40 w-[520px] h-[520px] bg-white/5 blur-[160px]" />
      <div className="absolute bottom-0 right-0 w-[520px] h-[520px] bg-white/5 blur-[160px]" />

      <motion.div
        className="relative z-10 w-full max-w-md"
        variants={container}
        initial="hidden"
        animate="visible"
      >
        {/* CARD */}
        <div className="bg-[#0b0b0b]/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-8 text-white">

          {/* HEADER */}
          <motion.div variants={item} className="mb-8 text-center">
            <h1 className="text-3xl font-bold mb-2">
              Sign in to Nyxel
            </h1>
            <p className="text-white/60 text-sm">
              Access your account and continue solving problems.
            </p>
          </motion.div>

          {/* ERRORS */}
          {(errors.email || errors.password || error) && (
            <motion.div
              variants={errorAnim}
              initial="hidden"
              animate="visible"
              className="mb-4 text-red-400 text-sm flex flex-col gap-1"
            >
              {errors.email && (
                <div className="flex items-center gap-2">
                  <AlertCircle size={14} /> {errors.email.message}
                </div>
              )}
              {errors.password && (
                <div className="flex items-center gap-2">
                  <AlertCircle size={14} /> {errors.password.message}
                </div>
              )}
              {error && (
                <div className="flex items-center gap-2">
                  <AlertCircle size={14} /> {error}
                </div>
              )}
            </motion.div>
          )}

          {/* FORM */}
          <motion.form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-5"
          >
            {/* EMAIL */}
            <motion.div variants={item}>
              <label className="text-xs uppercase tracking-wide text-white/50">
                Email
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                {...register("email")}
                className="w-full mt-1 px-4 py-3 rounded-lg bg-[#121212] border border-white/10 text-white placeholder-white/40 focus:outline-none focus:border-white/30 transition"
              />
            </motion.div>

            {/* ROLE */}
            <motion.div variants={item}>
              <label className="text-xs uppercase tracking-wide text-white/50 mb-2 block">
                Login as
              </label>
              <div className="flex gap-3">
                {["user", "admin"].map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setValue("role", r)}
                    className={`cursor-pointer flex-1 flex items-center justify-center gap-2 py-2 rounded-lg border transition text-sm
                      ${
                        role === r
                          ? "bg-white text-black border-white"
                          : "bg-[#121212] border-white/10 text-white/70 hover:border-white/30"
                      }`}
                  >
                    {r === "user" ? <User size={14} /> : <Shield size={14} />}
                    {r.charAt(0).toUpperCase() + r.slice(1)}
                  </button>
                ))}
              </div>
            </motion.div>

            {/* PASSWORD */}
            <motion.div variants={item}>
              <label className="text-xs uppercase tracking-wide text-white/50">
                Password
              </label>
              <div className="relative mt-1">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  {...register("password")}
                  className="w-full px-4 py-3 rounded-lg bg-[#121212] border border-white/10 text-white placeholder-white/40 focus:outline-none focus:border-white/30 transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="cursor-pointer absolute right-3 top-3 text-white/40 hover:text-white transition"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </motion.div>

            {/* SUBMIT */}
            <motion.button
              variants={item}
              type="submit"
              disabled={loading}
              className="cursor-pointer w-full py-3 rounded-xl bg-white text-black font-semibold hover:bg-white/90 transition flex justify-center items-center gap-2"
            >
              {loading ? "Signing in..." : "Sign in"}
            </motion.button>
          </motion.form>

          {/* FOOTER LINKS */}
          <motion.div
            variants={item}
            className="mt-6 flex flex-col gap-3 text-sm text-white/60"
          >
            <NavLink
              to="/forgot-password"
              className="text-right hover:underline"
            >
              Forgot password?
            </NavLink>

            <p className="text-center">
              New to Nyxel?{" "}
              <NavLink to="/signup" className="text-white hover:underline">
                Create an account
              </NavLink>
            </p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
