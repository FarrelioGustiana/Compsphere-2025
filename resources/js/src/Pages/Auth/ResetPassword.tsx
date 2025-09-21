import React, { useEffect } from 'react';
import { Head, useForm } from '@inertiajs/react';
import { CircleAlert, Lock } from 'lucide-react';
import { motion } from 'framer-motion';
import { route } from 'ziggy-js';
import InputField from '@/src/Components/Auth/InputField';
import AuthLayout from '@/src/Components/Layout/AuthLayout';
import Button from '@/src/Components/UI/Button';

export default function ResetPassword({ token, email }: { token: string, email?: string }) {
  const { data, setData, post, processing, errors, reset } = useForm({
    token: token,
    email: email || '',
    password: '',
    password_confirmation: '',
  });

  useEffect(() => {
    return () => {
      reset('password', 'password_confirmation');
    };
  }, []);

  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    post(route('password.update'));
  };

  return (
    <AuthLayout title="Reset Password">
      <Head title="Reset Password" />

      <form onSubmit={submit}>
        <div className="relative mb-6">
          <InputField
            label="Email"
            name="email"
            type="email"
            value={data.email}
            onChange={(value) => setData('email', value)}
            error={errors.email}
            placeholder="Enter your email address"
            icon={<motion.div whileHover={{ rotate: 15 }}><CircleAlert className="w-5 h-5 text-blue-400" /></motion.div>}
            required
          />
          {errors.email && (
            <motion.div
              className="flex items-center gap-1.5 mt-1 text-xs text-red-400 pl-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <CircleAlert className="w-3.5 h-3.5" />
              <span>{errors.email}</span>
            </motion.div>
          )}
        </div>

        <div className="relative mb-6">
          <InputField
            label="Password"
            name="password"
            type="password"
            value={data.password}
            onChange={(value) => setData('password', value)}
            error={errors.password}
            placeholder="Enter your new password"
            icon={<motion.div whileHover={{ rotate: -15 }}><Lock className="w-5 h-5 text-purple-400" /></motion.div>}
            required
            autoComplete="new-password"
            showPasswordToggle
          />
          {errors.password && (
            <motion.div
              className="flex items-center gap-1.5 mt-1 text-xs text-red-400 pl-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <CircleAlert className="w-3.5 h-3.5" />
              <span>{errors.password}</span>
            </motion.div>
          )}
        </div>

        <div className="relative mb-6">
          <InputField
            label="Confirm Password"
            name="password_confirmation"
            type="password"
            value={data.password_confirmation}
            onChange={(value) => setData('password_confirmation', value)}
            error={errors.password_confirmation}
            placeholder="Confirm your new password"
            icon={<motion.div whileHover={{ rotate: -15 }}><Lock className="w-5 h-5 text-purple-400" /></motion.div>}
            required
            autoComplete="new-password"
            showPasswordToggle
          />
          {errors.password_confirmation && (
            <motion.div
              className="flex items-center gap-1.5 mt-1 text-xs text-red-400 pl-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <CircleAlert className="w-3.5 h-3.5" />
              <span>{errors.password_confirmation}</span>
            </motion.div>
          )}
        </div>

        <div className="flex items-center justify-end mt-6">
          <Button
            type="submit"
            disabled={processing}
            loading={processing}
            variant="gradient"
            className="ml-4"
          >
            Reset Password
          </Button>
        </div>
      </form>
    </AuthLayout>
  );
}
