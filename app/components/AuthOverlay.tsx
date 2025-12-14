"use client";
import { useState } from "react";
import Image from "next/image";
import { Account } from "../model";
// import { mockAccounts, mockDevices, mockUsers } from "../store/mockData"; // Dữ liệu mock không cần thiết
import { useUserStore } from "../store/useUserStore";
import { toast } from "sonner";
import { authAPI } from "@/lib/api";

// Cập nhật type AuthMode
type AuthMode = "login" | "signup" | "forgot-password";

interface AuthOverlayProps {
  initialMode?: AuthMode; // Sử dụng AuthMode
  onClose?: () => void;
}

interface AuthTemplateProps {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  onClose?: () => void;
}

function AuthTemplate({
  title,
  subtitle,
  children,
  onClose,
}: AuthTemplateProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center caret-transparent select-none">
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/50 backdrop-blur-[2px] items-center"
      />
      <div className="relative flex flex-col w-full max-w-sm sm:max-w-md bg-white rounded-2xl items-start justify-center mx-2 px-2 py-6 sm:p-6">
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-xl font-bold cursor-pointer"
          >
            ✕
          </button>
        )}
        <div className="w-full text-center">
          <h2 className="text-[#262626] font-semibold text-3xl md:text-4xl">
            {title}
          </h2>
          <p className="text-[#4d4d4d] text-sm sm:text-base mt-2">{subtitle}</p>
        </div>
        {children}
      </div>
    </div>
  );
}

type FormErrors = {
  [key: string]: string;
};

// Cập nhật interface AuthToggleType
interface AuthToggleType {
  setAuthMode: React.Dispatch<React.SetStateAction<AuthMode>>;
  onClose?: () => void;
}


// #region SignIn
function SignInOverlay({ setAuthMode, onClose }: AuthToggleType) {
  const { setUser, setUserDevices } = useUserStore();
  const baseData: Account = { email: "", password: "" };

  const [formData, setFormData] = useState<Account>(baseData);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    setErrors({});

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const result = await authAPI.login({
        email: formData.email,
        password: formData.password,
      });

      if (result.success) {
        localStorage.setItem("token", result.token);
        setUser(result.user);
        toast.success("Login successful!");
        setIsLoading(false);
        if (onClose) onClose();
      } else {
        setIsLoading(false);
        setErrors({
          general: result.message || "Login failed. Please try again.",
        });
      }
    } catch (error) {
      console.error(error);
      setIsLoading(false);
      setErrors({
        general: "An error occurred during login. Please try again.",
      });
    }
  };

  return (
    <AuthTemplate
      title="Login"
      subtitle="Welcome back! Please login to access your account."
      onClose={onClose}
    >
      <div className="flex flex-col w-full items-start my-2 px-2 md:px-0">
        <div className="w-full flex flex-col gap-y-1 my-2">
          <label className="text-[#262626] text-sm sm:text-base font-medium">
            Email
          </label>
          <div className="w-full bg-gray-100 border-xl border-gray-400 rounded-md my-2">
            <input
              className="w-full p-2 sm:p-4 placeholder:text-[#666666] bg-transparent border-none outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 rounded-md"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              type="email"
              placeholder="Enter your Email"
            />
          </div>
          {errors.email && (
            <div className="text-red-500 text-sm">{errors.email}</div>
          )}
        </div>
        <div className="w-full my-2">
          <div className="w-full flex flex-col gap-y-1">
            <label className="text-[#262626] text-sm sm:text-base font-medium">
              Password
            </label>
            <div className="w-full bg-gray-100 border-xl border-gray-400 rounded-md my-2">
              <input
                className="w-full p-2 sm:p-4 placeholder:text-[#666666] bg-transparent border-none outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 rounded-md"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                type="password"
                placeholder="Enter your Password"
              />
            </div>
            {errors.password && (
              <div className="text-red-500 text-sm">{errors.password}</div>
            )}
          </div>
          {/* Cập nhật liên kết Quên mật khẩu */}
          <div className="text-end w-full">
            <p
              onClick={() => setAuthMode("forgot-password")}
              className="text-[#4d4d4d] text-sm sm:text-base font-medium cursor-pointer hover:text-blue-500 ml-1 transition-colors"
            >
              Forgot your password?
            </p>
          </div>
          {errors.general && (
            <div className="text-red-500 text-sm">{errors.general}</div>
          )}
          <button
            type="submit"
            disabled={isLoading}
            className="block w-full bg-[#4E7EF9] rounded-md text-center p-2 my-4 text-white text-sm sm:text-base font-medium hover:bg-blue-600 transition-colors cursor-pointer disabled:opacity-50"
            onClick={handleLogin}
          >
            Login
          </button>
          <div className="flex items-center w-full my-2 sm:my-4 caret-transparent">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="mx-2 sm:mx-3 text-[#666666] text-sm sm:text-base font-medium">
              OR
            </span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>
          <a
            href="./"
            className="flex items-center justify-center w-full bg-gray-200 rounded-md text-center p-2 my-4 text-[#262626] text-sm sm:text-base font-medium hover:bg-gray-300 transition-colors"
          >
            <Image
              src="/icons/google-icon.svg"
              alt="Google Icon"
              width={24}
              height={24}
            />
            <span className="px-4">Login with Google</span>
          </a>
          <div className="flex flex-row justify-center w-full my-4 text-[#262626] text-sm sm:text-base font-medium">
            <p>Don&apos;t have an account?</p>
            <p
              onClick={() => {
                setAuthMode("signup");
              }}
              className="underline cursor-pointer hover:text-blue-500 ml-1 transition-colors"
            >
              Sign Up
            </p>
          </div>
        </div>
      </div>
    </AuthTemplate>
  );
}
// #endregion


// #region SignUp
function SignUpOverlay({ setAuthMode, onClose }: AuthToggleType) {
  const baseData: Account = { email: "", password: "" };
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [formData, setFormData] = useState<Account>(baseData);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
    }
    if (!(formData.password.length >= 6)) {
      newErrors.password = "Password must be at least 6 characters";
    }
    if (formData.password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignUp = async () => {
    setErrors({});
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      const result = await authAPI.signup({
        email: formData.email,
        password: formData.password,
      });

      if (result.success) {
        toast.success("Sign up successful! Please verify your email in your inbox.");
        setAuthMode("login"); // Chuyển về Login sau khi đăng ký thành công
        setIsLoading(false);
      } else {
        setIsLoading(false);
        toast.error(result.message || "Sign up failed. Please try again.");
      }
    } catch (error) {
      console.error(error);
      setIsLoading(false);
      toast.error("An account with this email already exists");
    }
  };

  return (
    <AuthTemplate
      title="Sign Up"
      subtitle="Create an account to unlock exclusive features."
      onClose={onClose}
    >
      <div className="flex flex-col w-full items-start my-2">
        <div className="w-full my-2">
          <label className="text-[#262626] text-sm sm:text-base font-medium">
            Email
          </label>
          <div className="w-full bg-gray-100 border-xl border-gray-400 rounded-md my-2">
            <input
              className="w-full p-2 sm:p-4 placeholder:text-[#666666] bg-transparent border-none outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 rounded-md"
              type="email"
              placeholder="Enter your Email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
          </div>
          {errors.email && (
            <div className="text-red-500 text-sm">{errors.email}</div>
          )}
        </div>
        <div className="w-full my-2">
          <div className="w-full mb-2">
            <label className="text-[#262626] text-sm sm:text-base font-medium">
              Password
            </label>
            <div className="w-full bg-gray-100 border-xl border-gray-400 rounded-md my-2">
              <input
                className="w-full p-2 sm:p-4 placeholder:text-[#666666] bg-transparent border-none outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 rounded-md"
                type="password"
                placeholder="Enter your Password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
              />
            </div>
            {errors.password && (
              <div className="text-red-500 text-sm">{errors.password}</div>
            )}
          </div>
          <div className="w-full mt-2">
            <label className="text-[#262626] text-sm sm:text-base font-medium">
              Confirm Password
            </label>
            <div className="w-full bg-gray-100 border-xl border-gray-400 rounded-md my-2">
              <input
                className="w-full p-2 sm:p-4 placeholder:text-[#666666] bg-transparent border-none outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 rounded-md"
                type="password"
                placeholder="Confirm your Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            {errors.confirmPassword && (
              <div className="text-red-500 text-sm">
                {errors.confirmPassword}
              </div>
            )}
          </div>
          {errors.general && (
            <div className="text-red-500 text-sm">{errors.general}</div>
          )}
          <button
            type="submit"
            className="block w-full bg-[#4E7EF9] rounded-md text-center p-2 my-4 text-white text-sm sm:text-base font-medium hover:bg-blue-600 transition-colors cursor-pointer disabled:opacity-50"
            disabled={isLoading}
            onClick={handleSignUp}
          >
            Sign Up
          </button>
          <div className="flex items-center w-full my-2 sm:my-4 caret-transparent">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="mx-2 sm:mx-3 text-[#666666] text-sm sm:text-base font-medium">
              OR
            </span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>
          <a
            href="./"
            className="flex items-center justify-center w-full bg-gray-200 rounded-md text-center p-2 my-4 text-[#262626] text-sm sm:text-base font-medium hover:bg-gray-300 transition-colors"
          >
            <Image
              src="/icons/google-icon.svg"
              alt="Google Icon"
              width={24}
              height={24}
            />
            <span className="px-4">Login with Google</span>
          </a>
          <div className="flex flex-row justify-center w-full my-4 text-[#262626] text-sm sm:text-base font-medium">
            <p>Already have an account? </p>
            <p
              onClick={() => {
                setAuthMode("login");
              }}
              className="underline cursor-pointer hover:text-blue-500 ml-1 transition-colors"
            >
              Login
            </p>
          </div>
        </div>
      </div>
    </AuthTemplate>
  );
}
// #endregion


// #region ForgotPassword
function ForgotPasswordOverlay({ setAuthMode, onClose }: AuthToggleType) {
  const [email, setEmail] = useState<string>("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Email is invalid";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleForgotPassword = async () => {
    setErrors({});
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setIsSuccess(false);

    try {
      // Gọi API yêu cầu đặt lại mật khẩu
      const result = await authAPI.forgotPassword(email); 

      if (result.success) {
        toast.success(result.message);
        setIsSuccess(true); // Hiển thị thông báo thành công trên UI
      } else {
        // API backend đã được thiết lập để luôn trả về success: true (hoặc 200) 
        // để tránh tấn công enumeration, nhưng ta vẫn xử lý lỗi phòng trường hợp lỗi 500.
        toast.error(result.message || "An error occurred. Please try again.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Internal Server Error. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthTemplate
      title="Forgot Password"
      subtitle="Enter your email to receive a password reset link."
      onClose={onClose}
    >
      <div className="flex flex-col w-full items-start my-2 px-2 md:px-0">
        {isSuccess ? (
          <div className="w-full p-4 my-4 bg-green-100 border border-green-400 text-green-700 rounded-md">
            <p className="font-medium">
              Check your email! A password reset link has been sent.
            </p>
            <button
              onClick={() => setAuthMode("login")}
              className="mt-2 text-sm text-green-700 underline hover:text-green-900"
            >
              Back to Login
            </button>
          </div>
        ) : (
          <>
            <div className="w-full flex flex-col gap-y-1 my-2">
              <label className="text-[#262626] text-sm sm:text-base font-medium">
                Email
              </label>
              <div className="w-full bg-gray-100 border-xl border-gray-400 rounded-md my-2">
                <input
                  className="w-full p-2 sm:p-4 placeholder:text-[#666666] bg-transparent border-none outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 rounded-md"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  placeholder="Enter your Email"
                />
              </div>
              {errors.email && (
                <div className="text-red-500 text-sm">{errors.email}</div>
              )}
            </div>
            
            <button
              type="submit"
              disabled={isLoading}
              className="block w-full bg-[#4E7EF9] rounded-md text-center p-2 my-4 text-white text-sm sm:text-base font-medium hover:bg-blue-600 transition-colors cursor-pointer disabled:opacity-50"
              onClick={handleForgotPassword}
            >
              {isLoading ? "Sending..." : "Send Reset Link"}
            </button>
            
            <div className="flex flex-row justify-center w-full mt-2 text-[#262626] text-sm sm:text-base font-medium">
              <p
                onClick={() => setAuthMode("login")}
                className="underline cursor-pointer hover:text-blue-500 transition-colors"
              >
                Back to Login
              </p>
            </div>
          </>
        )}
      </div>
    </AuthTemplate>
  );
}
// #endregion


// #region AuthOverlay
export default function AuthOverlay({
  initialMode = "login",
  onClose,
}: AuthOverlayProps) {
  // Thay đổi `authToggle` boolean thành `authMode` string
  const [authMode, setAuthMode] = useState<AuthMode>(initialMode);

  // Render component tương ứng dựa trên `authMode`
  switch (authMode) {
    case "login":
      return (
        <SignInOverlay
          setAuthMode={setAuthMode}
          onClose={onClose}
        />
      );
    case "signup":
      return (
        <SignUpOverlay
          setAuthMode={setAuthMode}
          onClose={onClose}
        />
      );
    case "forgot-password": // <-- Xử lý chế độ mới
      return (
        <ForgotPasswordOverlay
          setAuthMode={setAuthMode}
          onClose={onClose}
        />
      );
    default:
      return null;
  }
}
// #endregion