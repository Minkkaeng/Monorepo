import React, { useState, useEffect, useCallback } from "react";
import { User, Lock, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { cn, debounce } from "@framework/utils";
import { Button } from "./Button";
import { Input } from "./Input";

interface SignupFormProps {
  title?: string;
  subtitle?: string;
  onSignup?: (data: any) => void;
  withIdCheck?: boolean;      // 아이디 중복 확인 기능 활성화
  withPasswordMatch?: boolean; // 비밀번호 일치 확인 활성화
  className?: string;
}

export const SignupForm: React.FC<SignupFormProps> = ({
  title = "Create Account",
  subtitle = "Join our premium community today.",
  onSignup,
  withIdCheck = true,
  withPasswordMatch = true,
  className,
}) => {
  // 폼 상태 관리
  const [formData, setFormData] = useState({
    username: "",
    name: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({
    username: "",
    password: "",
    confirmPassword: "",
  });

  const [isCheckingId, setIsCheckingId] = useState(false);
  const [isIdAvailable, setIsIdAvailable] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // 아이디 중복 확인 (Mock API)
  const checkUsernameAvailability = useCallback(
    debounce(async (value: string) => {
      if (!value || value.length < 4) {
        setIsIdAvailable(null);
        return;
      }

      setIsCheckingId(true);
      // 데모를 위한 지연 및 랜덤 결과
      await new Promise((resolve) => setTimeout(resolve, 800));
      const isAvailable = Math.random() > 0.3; // 70% 확률로 사용 가능
      
      setIsIdAvailable(isAvailable);
      setIsCheckingId(false);
      
      if (!isAvailable) {
        setErrors((prev) => ({ ...prev, username: "이미 사용 중인 아이디입니다." }));
      } else {
        setErrors((prev) => ({ ...prev, username: "" }));
      }
    }, 500),
    []
  );

  // 입력 핸들러
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // 실시간 검증 로직
    if (name === "username" && withIdCheck) {
      checkUsernameAvailability(value);
    }

    if (name === "password" || name === "confirmPassword") {
      if (name === "password" && value.length < 8) {
        setErrors((prev) => ({ ...prev, password: "비밀번호는 8자 이상이어야 합니다." }));
      } else {
        setErrors((prev) => ({ ...prev, password: "" }));
      }
    }
  };

  // 비밀번호 일치 여부 실시간 감시
  useEffect(() => {
    if (withPasswordMatch && formData.confirmPassword) {
      if (formData.password !== formData.confirmPassword) {
        setErrors((prev) => ({ ...prev, confirmPassword: "비밀번호가 일치하지 않습니다." }));
      } else {
        setErrors((prev) => ({ ...prev, confirmPassword: "" }));
      }
    }
  }, [formData.password, formData.confirmPassword, withPasswordMatch]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 최종 유효성 검사
    if (errors.username || errors.password || errors.confirmPassword) return;
    if (!formData.username || !formData.password) return;

    setIsLoading(true);
    // API 호출 시뮬레이션
    await new Promise((resolve) => setTimeout(resolve, 1500));
    onSignup?.(formData);
    setIsLoading(false);
  };

  return (
    <div className={cn("w-full max-w-md mx-auto space-y-10 py-10", className)}>
      <div className="text-center space-y-4">
        <h2 className="text-4xl font-black text-gray-900 tracking-tighter">
          {title}
        </h2>
        <p className="text-gray-400 font-medium">
          {subtitle}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="relative">
          <Input
            label="Username"
            name="username"
            placeholder="Choose a unique ID"
            value={formData.username}
            onChange={handleChange}
            error={errors.username}
            className="pr-12"
          />
          <div className="absolute right-4 top-[45px]">
            {isCheckingId ? (
              <Loader2 className="animate-spin text-indigo-500" size={20} />
            ) : isIdAvailable === true ? (
              <CheckCircle2 className="text-green-500" size={20} />
            ) : isIdAvailable === false ? (
              <AlertCircle className="text-red-500" size={20} />
            ) : null}
          </div>
        </div>

        <Input
          label="Full Name"
          name="name"
          placeholder="Your name"
          value={formData.name}
          onChange={handleChange}
        />

        <Input
          label="Password"
          name="password"
          type="password"
          placeholder="At least 8 characters"
          value={formData.password}
          onChange={handleChange}
          error={errors.password}
        />

        {withPasswordMatch && (
          <Input
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            placeholder="Repeat your password"
            value={formData.confirmPassword}
            onChange={handleChange}
            error={errors.confirmPassword}
          />
        )}

        <div className="pt-6">
          <Button
            type="submit"
            className="w-full py-6 rounded-2xl shadow-2xl shadow-indigo-200 text-lg"
            isLoading={isLoading}
            disabled={!!(errors.username || errors.password || errors.confirmPassword) || !formData.username}
          >
            Create Account
          </Button>
        </div>
      </form>
      
      <p className="text-center text-sm text-gray-400 font-medium">
        Already have an account? <span className="text-indigo-600 font-bold cursor-pointer hover:underline">Sign In</span>
      </p>
    </div>
  );
};
