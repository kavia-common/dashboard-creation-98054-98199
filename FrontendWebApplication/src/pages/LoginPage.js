import React, { useContext, useState } from 'react';
import { useForm } from 'react-hook-form';
import { AuthContext } from '../context/AuthContext';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import Loader from '../components/Loader';
import ErrorMessage from '../components/ErrorMessage';

const schema = yup.object({
  email: yup.string().email('Enter a valid email').required('Email is required'),
  password: yup.string().min(6, 'Minimum 6 characters').required('Password is required'),
}).required();

// PUBLIC_INTERFACE
export default function LoginPage() {
  /** Login form page: validates and calls backend auth, showing loading and error states. */
  const { login } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: yupResolver(schema) });

  const onSubmit = async (values) => {
    setLoading(true);
    setError('');
    try {
      await login(values.email, values.password);
    } catch (e) {
      setError(e.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="card" style={{ width: 420, maxWidth: '100%' }}>
        <div className="space-between">
          <strong>Welcome back</strong>
          <span className="muted">Log in to your dashboard</span>
        </div>

        <form className="form mt-4" onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="field">
            <label htmlFor="email">Email</label>
            <input id="email" className="input" type="email" placeholder="you@example.com" {...register('email')} autoComplete="username" />
            {errors.email && <span className="error">{errors.email.message}</span>}
          </div>

          <div className="field">
            <label htmlFor="password">Password</label>
            <input id="password" className="input" type="password" placeholder="••••••••" {...register('password')} autoComplete="current-password" />
            {errors.password && <span className="error">{errors.password.message}</span>}
          </div>

          <button className="btn" type="submit" disabled={loading}>Login</button>
          {loading && <Loader text="Authenticating..." />}
          <ErrorMessage error={error} />
        </form>
      </div>
    </div>
  );
}
