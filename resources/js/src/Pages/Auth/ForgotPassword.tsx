import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { CircleAlert } from 'lucide-react';
import { motion } from 'framer-motion';
import { route } from 'ziggy-js';
import InputField from '@/src/Components/Auth/InputField';
import AuthLayout from '@/src/Components/Layout/AuthLayout';
import Button from '@/src/Components/UI/Button';

export default function ForgotPassword({ status }: { status?: string }) {
  const { data, setData, post, processing, errors } = useForm({
    email: '',
  });

  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    post(route('password.email'));
  };

  return (
    <AuthLayout title="Forgot Password">
      <Head title="Forgot Password" />

      <div className="mb-4 text-sm text-gray-300">
        Forgot your password? No problem. Just let us know your email address and we will email you a password reset link that will allow you to choose a new one.
      </div>

      {status && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 bg-green-600/20 border border-green-500/50 rounded-lg text-green-400 text-center"
        >
          {status}
        </motion.div>
      )}

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
            autoComplete="email"
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

        <div className="flex items-center justify-between mt-6">
          <Link
            href={route('login')}
            className="text-blue-400 hover:text-blue-300 transition-colors duration-300 text-sm"
          >
            Back to Login
          </Link>

          <Button
            type="submit"
            disabled={processing}
            loading={processing}
            variant="gradient"
            className="ml-4"
          >
            Email Password Reset Link
          </Button>
        </div>
      </form>
    </AuthLayout>
  );
}
